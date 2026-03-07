class ToolInfoSection extends HTMLElement {
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

  render() {
    const toolName = this.getAttribute('tool-name') || '';
    const title = toolName ? `About this tool: ${toolName}` : 'About this tool';
    
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          margin: 60px 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .info-card {
          max-width: 900px;
          margin: 0 auto;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          color: #111827;
        }
        h2 { font-size: 1.75rem; font-weight: 800; margin: 0 0 32px 0; letter-spacing: -0.02em; color: #111827; }
        h3 { font-size: 1.1rem; font-weight: 700; margin: 24px 0 12px 0; color: #111827; }
        p { color: #4b5563; line-height: 1.6; font-size: 0.95rem; margin: 0 0 16px 0; }
        .faq-list { margin-top: 20px; }
        .faq-item { margin-bottom: 20px; }
        .faq-item strong { display: block; margin-bottom: 4px; color: #111827; font-weight: 700; }
        .disclaimer {
          margin-top: 40px;
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
        }
        .disclaimer h3 { font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; }
        .disclaimer p { font-size: 0.85rem; color: #6b7280; }
        @media (max-width: 640px) {
          .info-card { padding: 24px; }
          h2 { font-size: 1.5rem; }
        }
      </style>
      <div class="info-card">
        <h2>${title}</h2>
        
        <div class="section">
          <h3>What this tool does</h3>
          <p>This tool helps YouTube creators quickly generate ideas or outputs (names, titles, descriptions, keywords, hashtags, thumbnail phrases) or estimates (earnings) using in-browser processing. All logic runs locally in your browser, ensuring your data stays private and secure without being uploaded to our servers.</p>
        </div>

        <div class="section">
          <h3>Result interpretation</h3>
          <p>Please note that results are suggestions or estimates, not guarantees of success. We encourage testing multiple variants and validating them with your YouTube Analytics (CTR, AVD, and audience retention). Final outcomes depend on your specific niche, competition, timing, packaging, and audience behavior.</p>
        </div>

        <div class="section">
          <h3>Example scenario</h3>
          <p>A creator preparing a new upload uses the generator to draft 5 titles, a description, and hashtags. They then publish 2–3 variants across different uploads or use them as a starting point to compare CTR and AVD, eventually choosing a consistent style that resonates with their audience.</p>
        </div>

        <div class="section">
          <h3>FAQ</h3>
          <div class="faq-list">
            <div class="faq-item">
              <strong>Is my data uploaded?</strong>
              <p>No. Processing runs locally in your browser. Your inputs are not stored on our servers.</p>
            </div>
            <div class="faq-item">
              <strong>Are results guaranteed to rank or go viral?</strong>
              <p>No. YouTube performance depends on many factors including click-through rate (CTR), average view duration (AVD), competition, and audience match.</p>
            </div>
            <div class="faq-item">
              <strong>Can I reuse the generated text?</strong>
              <p>Yes. You are free to use it, but editing is recommended to match your channel's unique voice and brand accuracy.</p>
            </div>
            <div class="faq-item">
              <strong>Why test multiple versions?</strong>
              <p>Because optimization requires experimentation and iteration. Testing different variants helps you find what works best for your viewers.</p>
            </div>
          </div>
        </div>

        <div class="disclaimer">
          <h3>Disclaimer</h3>
          <p>This tool provides informational assistance only. It does not guarantee YouTube ranking, views, monetization approval, revenue, or earnings. You are responsible for final publishing decisions.</p>
        </div>
      </div>
    `;
  }
}

if (!customElements.get('tool-info-section')) {
  customElements.define('tool-info-section', ToolInfoSection);
}
