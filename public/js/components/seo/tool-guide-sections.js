class ToolGuideSections extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['tool-name'];
  }

  attributeChangedCallback() {
    this.render();
  }

  getContent(toolName) {
    const isKeyword = toolName === 'Keyword Generator';
    const isThumbnail = toolName === 'Thumbnail Maker';
    const isPhrase = toolName === 'Thumbnail Phrase Generator';
    const isCalculator = toolName === 'YouTube Video Earnings Calculator';
    const isChannelGen = toolName === 'YouTube Channel Name Generator';
    const isTitleGen = toolName === 'Video Title Generator';
    const isDescGen = toolName === 'Video Description Generator';
    const isConsultant = toolName === 'YouTube Consultant';

    const data = {
      interpretation: "",
      whatItDoes: "",
      scenario: "",
      faq: []
    };

    if (isKeyword) {
      data.interpretation = `<p>The generated keywords are categorized by relevance and estimated competition. They may help you identify search terms that your target audience is currently using on YouTube. Use these results as a starting point for your video titles and tags.</p>
                             <p>It is important to note that these outputs do not guarantee ranking, views, or channel growth. Successful SEO depends on high audience retention and overall content quality.</p>`;
      data.whatItDoes = `<p>This tool analyzes seed keywords to suggest long-tail variants and related terms. It is typically used by creators during the planning phase to find low-competition niches or to optimize metadata for existing videos.</p>`;
      data.scenario = `<p><strong>Scenario:</strong> A creator is uploading a "lo-fi jazz study" video. They enter "lofi jazz" into the generator and discover several long-tail keywords like "lofi jazz for deep work" or "aesthetic lofi jazz 2026". They select the best options to use in their tags and description to reach a more specific audience.</p>`;
    } else if (isThumbnail) {
      data.interpretation = `<p>The output from this editor is a high-resolution image designed for YouTube's standard dimensions. Using a clean, readable thumbnail can improve your click-through rate (CTR) by making your content stand out in a crowded feed.</p>
                             <p>However, a great thumbnail may help but does not guarantee views or high performance. Final results depend on how well your content delivers on the promise made by the thumbnail and title.</p>`;
      data.whatItDoes = `<p>This tool provides a layer-based canvas for creators to design professional thumbnails without complex software. It allows you to combine background images with viral-style typography and filters optimized for mobile visibility.</p>`;
      data.scenario = `<p><strong>Scenario:</strong> A creator has a great video title but needs a clean, readable thumbnail that looks good on mobile. They upload their background, add a bold "Anton" font text layer with a high-contrast stroke, and apply a "Punchy" filter to make the colors pop before exporting the final 1280x720 image.</p>`;
    } else if (isPhrase) {
      data.interpretation = `<p>The phrases generated are designed to be short, punchy, and psychologically engaging. They are intended to complement your video title, not repeat it. Phrases that spark curiosity or promise a specific benefit can improve your Click-Through Rate (CTR).</p>
                             <p>While these suggestions are based on viral trends, they do not guarantee success. The effectiveness of a phrase depends heavily on the visual context of the thumbnail image.</p>`;
      data.whatItDoes = `<p>This tool generates short text overlays optimized for thumbnail readability. It helps creators find the "hook" that will grab a viewer's attention in the split second they spend scrolling past a video.</p>`;
      data.scenario = `<p><strong>Scenario:</strong> A creator has a video titled "How I Built a House in 30 Days." Instead of putting the whole title on the thumbnail, they use this tool to generate a shorter phrase. They choose "I FAILED?" or "30 DAY CHALLENGE" to create a stronger visual hook for mobile users.</p>`;
    } else if (isCalculator) {
      data.interpretation = `<p>The results provided are estimates based on typical RPM (Revenue Per Mille) ranges across various niches and countries. These numbers reflect what a video <em>could</em> earn based on current market trends and are not a reflection of your actual AdSense balance.</p>
                             <p>Actual earnings are determined by YouTube and depend on factors like advertiser demand, viewer behavior, and whether your content is cleared for monetization. This tool does not guarantee any specific payout.</p>`;
      data.whatItDoes = `<p>This tool estimates potential YouTube revenue by analyzing view counts, audience location, and content niche. Creators use it to project income for future projects or to understand the financial impact of different audience demographics.</p>`;
      data.scenario = `<p><strong>Scenario:</strong> A tech reviewer is planning a video targeting a US-based audience. They use the calculator to see the difference between 100,000 views in the "Tech" niche versus the "Gaming" niche. This helps them understand the potential ROI of their content and decide which topics to prioritize.</p>`;
    } else if (isChannelGen) {
      data.interpretation = `<p>The generated names and brand assets are intended to provide creative inspiration for your channel's identity. A strong, memorable name combined with a clear description can help you attract and retain subscribers.</p>
                             <p>Please verify the availability of your chosen name on YouTube and other social media platforms before finalizing your branding. A unique and searchable name is key to long-term growth.</p>`;
      data.whatItDoes = `<p>This tool generates professional YouTube channel names, descriptions, keywords, and hashtags based on your niche and concept. It helps new creators establish a cohesive brand identity from day one.</p>`;
      data.scenario = `<p><strong>Scenario:</strong> A creator wants to start a cooking channel focused on quick meals. They enter "fast cooking" and get name suggestions like "QuickCuisine" or "SnapChef" along with a ready-to-use channel description and SEO tags.</p>`;
    } else if (isTitleGen) {
      data.interpretation = `<p>The generated titles use proven psychological triggers and curiosity hooks designed to maximize Click-Through Rate (CTR). Each title is scored based on its potential to stop a viewer from scrolling.</p>
                             <p>While high-scoring titles are effective, always ensure that your video content delivers on the promise of the title. Maintaining audience trust is essential for high retention and long-term channel health.</p>`;
      data.whatItDoes = `<p>This tool creates viral-style YouTube titles based on your video topic and preferred intensity. It helps creators find the perfect "hook" to make their videos stand out in search and recommendations.</p>`;
      data.scenario = `<p><strong>Scenario:</strong> A creator has a video about "saving money." Instead of a plain title, they use the generator to get "How I Saved $10k in 30 Days (Step-by-Step)" which creates immediate curiosity and value for the viewer.</p>`;
    } else if (isDescGen) {
      data.interpretation = `<p>The generated descriptions are structured to satisfy both the YouTube algorithm and your viewers. They include a strong hook, relevant keywords for SEO, and clear Calls to Action (CTAs) to drive engagement.</p>
                             <p>Using a well-optimized description can improve your video's search ranking and help you convert more viewers into subscribers. We recommend customizing the output to match your personal voice.</p>`;
      data.whatItDoes = `<p>This tool instantly creates SEO-friendly YouTube descriptions and hashtags based on your video title and type. It streamlines the upload process while ensuring your metadata is optimized for growth.</p>`;
      data.scenario = `<p><strong>Scenario:</strong> A creator is ready to upload their video but wants to save time on the description. They paste their title, select their niche, and get a professionally formatted 500-character description with relevant hashtags in one click.</p>`;
    } else if (isConsultant) {
      data.interpretation = `<p>The consulting plan is generated by analyzing your specific channel metrics against industry benchmarks. It identifies the "bottleneck" in your current growth funnel (CTR, AVD, or Reach) and provides targeted advice.</p>
                             <p>Growth is an iterative process. We recommend implementing the suggested changes and monitoring your YouTube Analytics over 30-60 days to see how your audience responds.</p>`;
      data.whatItDoes = `<p>This tool provides a personalized YouTube growth strategy based on your subscribers, Average View Duration (AVD), and Click-Through Rate (CTR). It offers actionable steps to improve your channel's performance.</p>`;
      data.scenario = `<p><strong>Scenario:</strong> A creator has many views but few subscribers. The consultant analyzes their data and suggests adding a more compelling "Subscribe" call-to-action in the middle of their videos where retention is highest.</p>`;
    }

    // FAQ logic
    if (isKeyword || isPhrase) {
      data.faq = [
        { q: "Does this guarantee SEO ranking or views?", a: "No. SEO tools provide data-driven suggestions, but YouTube ranking is primarily driven by audience behavior, watch time, and competition." },
        { q: "Are these official YouTube keywords or data?", a: "No. This tool uses local processing and general search patterns to provide insights. It is not an official YouTube product." },
        { q: "How many keywords should I use?", a: "For YouTube tags, it is best to focus on 5–10 highly relevant keywords. Quality and relevance are more important than quantity." },
        { q: "Can I use these phrases on any video?", a: "Yes, but ensure the phrase matches the actual content of your video to maintain audience trust and retention." }
      ];
    } else if (isThumbnail) {
      data.faq = [
        { q: "Does this guarantee views?", a: "No. A thumbnail increases the chance of a click, but audience retention and content quality determine overall video performance." },
        { q: "What is the best font for thumbnails?", a: "Bold, sans-serif fonts like Anton, Bebas Neue, or Impact are popular because they remain readable even on small mobile screens." },
        { q: "How many words should be on a thumbnail?", a: "Ideally 3–4 words. Too much text makes the thumbnail cluttered and hard to read on mobile devices." },
        { q: "What makes a thumbnail effective?", a: "High contrast, large readable text, and a clear focal point that accurately reflects the video's value proposition." }
      ];
    } else if (isCalculator) {
      data.faq = [
        { q: "Are these exact YouTube payouts?", a: "No. These are estimates based on average RPM data. Actual payouts vary based on many factors including ad-blocker usage and seasonal trends." },
        { q: "What is RPM?", a: "RPM stands for Revenue Per Mille (thousand). It represents how much you earn for every 1,000 views after YouTube takes its share." },
        { q: "Why do different niches pay more?", a: "Advertisers pay more to show ads to audiences with higher purchasing power or intent, such as in Finance or Business niches." },
        { q: "Does this include taxes or fees?", a: "No. This tool provides a gross estimate before any taxes, platform fees, or MCN cuts are applied." }
      ];
    } else if (isChannelGen || isTitleGen || isDescGen) {
      data.faq = [
        { q: "Are the results generated by AI?", a: "The results are generated using our proprietary local templates and keyword logic, designed to mimic high-performing viral trends." },
        { q: "Can I use the output commercially?", a: "Yes. All generated text, names, and descriptions are yours to use for your YouTube channel and other platforms." },
        { q: "Why should I optimize my titles and descriptions?", a: "YouTube uses metadata to understand and rank your content. Better optimization leads to higher visibility in search and 'Suggested' feeds." },
        { q: "How often should I change my channel name?", a: "Ideally, never. Frequent name changes can confuse your existing audience and hurt your brand recognition." }
      ];
    } else if (isConsultant) {
      data.faq = [
        { q: "Is my private data uploaded to a server?", a: "No. All calculations and strategy generation are performed locally in your browser. Your channel stats remain private." },
        { q: "How accurate is the consulting advice?", a: "The advice is based on general YouTube growth principles and benchmarks. Every channel is unique, so use the suggestions as a guide for experimentation." },
        { q: "What is the most important metric to focus on?", a: "For most channels, Average View Duration (AVD) and Click-Through Rate (CTR) are the two primary drivers of the algorithm." },
        { q: "Can I get consulting if I have 0 subscribers?", a: "Yes! The tool will provide foundational advice on how to get your first 100 subscribers and set up your channel for success." }
      ];
    }

    return data;
  }

  render() {
    const toolName = this.getAttribute('tool-name') || '';
    const content = this.getContent(toolName);
    
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          margin: 60px 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .guide-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 20px;
        }
        .guide-card {
          background: var(--bg-primary, #ffffff);
          border: 1px solid var(--border-color, #e5e7eb);
          border-radius: 18px;
          padding: 40px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          color: var(--text-primary, #111827);
        }
        h2 { font-size: 1.75rem; font-weight: 800; margin: 0 0 32px 0; letter-spacing: -0.02em; }
        h3 { font-size: 1.1rem; font-weight: 700; margin: 24px 0 12px 0; }
        p { color: var(--text-secondary, #4b5563); line-height: 1.6; font-size: 0.95rem; margin: 0 0 16px 0; }
        .faq-list { margin-top: 24px; }
        .faq-item { margin-bottom: 24px; }
        .faq-item strong { display: block; margin-bottom: 6px; font-weight: 700; color: var(--text-primary); }
        .disclaimer {
          margin-top: 40px;
          padding-top: 24px;
          border-top: 1px solid var(--border-color, #e5e7eb);
          font-size: 0.85rem;
          color: var(--text-secondary);
          opacity: 0.8;
        }
        @media (max-width: 640px) {
          .guide-card { padding: 24px; }
          h2 { font-size: 1.5rem; }
        }
      </style>
      <div class="guide-container">
        <div class="guide-card">
          <h2>About the ${toolName}</h2>
          
          <div class="section">
            <h3>Result Interpretation</h3>
            ${content.interpretation || '<p>Detailed interpretation for this tool is coming soon.</p>'}
          </div>

          <div class="section">
            <h3>What This Tool Does</h3>
            ${content.whatItDoes || '<p>This tool helps creators optimize their YouTube workflow.</p>'}
          </div>

          <div class="section">
            <h3>Example Scenario</h3>
            ${content.scenario || '<p>Example usage scenario is being prepared.</p>'}
          </div>

          <div class="section">
            <h3>FAQ</h3>
            <div class="faq-list">
              ${content.faq.length > 0 ? content.faq.map(f => `
                <div class="faq-item">
                  <strong>${f.q}</strong>
                  <p>${f.a}</p>
                </div>
              `).join('') : '<p>FAQ section is being updated.</p>'}
            </div>
          </div>

          <div class="disclaimer">
            <p>This tool provides general content assistance and educational insights for creators. It is not affiliated with or endorsed by YouTube or Google. Results do not guarantee video performance, ranking, monetization, or audience growth.</p>
          </div>
        </div>
      </div>
    `;
  }
}

if (!customElements.get('tool-guide-sections')) {
  customElements.define('tool-guide-sections', ToolGuideSections);
}
