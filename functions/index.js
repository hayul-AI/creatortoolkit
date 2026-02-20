const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });
const { OpenAI } = require('openai');

admin.initializeApp();

// Simple in-memory rate limiter (per instance)
const rateLimitMap = new Map();

const SAFETY_KEYWORDS = ['sexual', 'minor', 'hate', 'illegal', 'violence', 'gore', 'nude', 'explicit'];

exports.generateThumbnailImage = functions.https.onRequest((req, res) => {
    return cors(req, res, async () => {
        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method Not Allowed' });
        }

        const { prompt, stylePreset, negativePrompt } = req.body;
        const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        // 1. Rate Limiting
        const now = Date.now();
        const tenMinutes = 10 * 60 * 1000;
        const userStats = rateLimitMap.get(ip) || { count: 0, firstRequest: now };

        if (now - userStats.firstRequest > tenMinutes) {
            userStats.count = 1;
            userStats.firstRequest = now;
        } else {
            userStats.count++;
        }
        rateLimitMap.set(ip, userStats);

        if (userStats.count > 5) {
            return res.status(429).json({ error: 'Too many requests. Please try again in 10 minutes.' });
        }

        // 2. Input Validation
        if (!prompt || typeof prompt !== 'string' || prompt.length > 400) {
            return res.status(400).json({ error: 'Invalid prompt. Max 400 characters.' });
        }
        if (negativePrompt && (typeof negativePrompt !== 'string' || negativePrompt.length > 200)) {
            return res.status(400).json({ error: 'Invalid negative prompt. Max 200 characters.' });
        }

        // 3. Safety Filtering
        const lowerPrompt = prompt.toLowerCase();
        if (SAFETY_KEYWORDS.some(keyword => lowerPrompt.includes(keyword))) {
            return res.status(400).json({ error: 'Prohibited prompt content detected.' });
        }

        // 4. AI Generation
        try {
            const apiKey = process.env.OPENAI_API_KEY || functions.config().openai?.key;
            if (!apiKey) {
                console.error('Missing OPENAI_API_KEY');
                return res.status(500).json({ error: 'AI provider not configured.' });
            }

            const openai = new OpenAI({ apiKey });

            const enhancedPrompt = `${prompt}${stylePreset ? `, in ${stylePreset} style` : ''}. High quality, 4k, professional thumbnail background. No text.`;
            
            const response = await openai.images.generate({
                model: "dall-e-3",
                prompt: enhancedPrompt,
                n: 1,
                size: "1024x1024",
                response_format: "b64_json",
            });

            const imageBase64 = response.data[0].b64_json;

            res.status(200).json({
                imageBase64: imageBase64,
                mimeType: 'image/png',
                width: 1024,
                height: 1024,
                generationTime: Date.now() - now
            });

        } catch (error) {
            console.error('OpenAI Error:', error);
            res.status(500).json({ error: 'Failed to generate image. ' + (error.message || '') });
        }
    });
});
