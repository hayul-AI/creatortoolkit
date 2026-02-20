# CreatorToolkit

All-in-one toolkit for YouTube creators. Boost your channel with our thumbnail, title, and keyword tools.

## AI Thumbnail Image Generator

This feature allows users to generate backgrounds or overlays using AI (OpenAI DALL-E 3).

### Deployment Instructions

1. **Set OpenAI API Key:**
   You must set your OpenAI API key in Firebase Functions environment configuration for the backend to work:
   ```bash
   firebase functions:config:set openai.key="YOUR_OPENAI_API_KEY"
   ```

2. **Deploy Functions and Hosting:**
   The current GitHub Action may only deploy Hosting. To ensure the AI Generator works, deploy both using the Firebase CLI:
   ```bash
   firebase deploy --only functions,hosting
   ```

3. **Verify API Endpoint:**
   After deployment, ensure `https://your-app.web.app/api/generate-thumbnail-image` returns a JSON error (Method Not Allowed) instead of HTML.

### Safety & Policies

- **Input Limits:** Prompt (max 400 chars), Negative Prompt (max 200 chars).
- **Rate Limiting:** 5 requests per 10 minutes per IP address.
- **Content Filtering:** Automatic refusal of prohibited content (sexual, hate, violence, etc.).
- **AdSense Note:** Do not generate copyrighted logos or brand assets. Users are responsible for ensuring they have the rights to the generated content.

### Example Prompts

- **Clean Studio Photo:** "A professional high-tech studio with a desk and computer setup, soft lighting"
- **3D Render:** "A 3D isometric room for a gamer, cyberpunk style, purple and teal colors"
- **Minimal Vector:** "Simple vector illustration of a mountain landscape, flat design"

## Tech Stack

- **Frontend:** Vanilla HTML, CSS, JS
- **Backend:** Firebase Cloud Functions (Node.js)
- **Hosting:** Firebase Hosting
- **AI:** OpenAI Images API (DALL-E 3)
