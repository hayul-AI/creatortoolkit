const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });
const { OpenAI } = require('openai');

admin.initializeApp();

const rateLimitMap = new Map();
const SAFETY_KEYWORDS = ['sexual', 'minor', 'hate', 'illegal', 'violence', 'gore', 'nude', 'explicit'];

exports.generateThumbnailImage = functions.https.onRequest((req, res) => {
    return cors(req, res, async () => {
        // Set JSON header explicitly
        res.setHeader('Content-Type', 'application/json');

        if (req.method !== 'POST') {
            return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
        }

        const { prompt, stylePreset, negativePrompt } = req.body;
        const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        // 1. Rate Limiting
        const now = Date.now();
        const userStats = rateLimitMap.get(ip) || { count: 0, firstRequest: now };
        if (now - userStats.firstRequest > 600000) {
            userStats.count = 1;
            userStats.firstRequest = now;
        } else {
            userStats.count++;
        }
        rateLimitMap.set(ip, userStats);

        if (userStats.count > 5) {
            return res.status(429).json({ ok: false, error: 'Rate limit exceeded. Try again in 10 minutes.' });
        }

        // 2. Validation
        if (!prompt || prompt.length > 400) {
            return res.status(400).json({ ok: false, error: 'Prompt required (max 400 chars).' });
        }

        // 3. Safety
        if (SAFETY_KEYWORDS.some(k => prompt.toLowerCase().includes(k))) {
            return res.status(400).json({ ok: false, error: 'Prompt contains prohibited content.' });
        }

        try {
            const apiKey = process.env.OPENAI_API_KEY || functions.config().openai?.key;
            if (!apiKey) {
                return res.status(500).json({ ok: false, error: 'AI API key not configured.' });
            }

            const openai = new OpenAI({ apiKey });
            const enhancedPrompt = `${prompt}, ${stylePreset || 'professional'}, high quality, no text, no watermark`;
            
            const response = await openai.images.generate({
                model: "dall-e-3",
                prompt: enhancedPrompt,
                n: 1,
                size: "1024x1024",
                response_format: "b64_json",
            });

            return res.status(200).json({
                ok: true,
                imageBase64: response.data[0].b64_json,
                mimeType: 'image/png',
                width: 1024,
                height: 1024
            });

        } catch (error) {
            console.error('AI Error:', error);
            return res.status(500).json({ ok: false, error: error.message || 'Generation failed' });
        }
    });
});
