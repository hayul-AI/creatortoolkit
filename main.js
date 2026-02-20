document.addEventListener('DOMContentLoaded', () => {
    ensureBaseStyles();
    initTheme();
    setupGlobalDragAndDrop();
    setupMobileMenu();
    registerWebComponents();
});

function ensureBaseStyles() {
    if (!document.querySelector('link[href*="base.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/assets/styles/base.css';
        document.head.prepend(link);
    }
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const theme = savedTheme || systemTheme;
    
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeToggleUI(theme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeToggleUI(newTheme);
}

function updateThemeToggleUI(theme) {
    const toggles = document.querySelectorAll('.theme-toggle');
    toggles.forEach(btn => {
        btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
        btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    });
}

// Ensure theme toggle works globally
window.toggleTheme = toggleTheme;

function setupGlobalDragAndDrop() {
    const dropZones = document.querySelectorAll('.file-drop-zone');
    
    dropZones.forEach(zone => {
        const input = zone.querySelector('input[type="file"]');
        if (!input) return;

        // Click to open file dialog
        zone.addEventListener('click', (e) => {
            if(e.target !== input) {
                input.click();
            }
        });

        // Drag Visuals
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.classList.add('dragover');
        });

        zone.addEventListener('dragleave', () => {
            zone.classList.remove('dragover');
        });

        // Drop Handler
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('dragover');
            
            if (e.dataTransfer.files.length) {
                input.files = e.dataTransfer.files;
                const event = new Event('change', { bubbles: true });
                input.dispatchEvent(event);
            }
        });
    });
}

function setupMobileMenu() {
    const btn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav-links');
    
    if(btn && nav) {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            nav.classList.toggle('active');
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (nav.classList.contains('active') && !nav.contains(e.target) && !btn.contains(e.target)) {
                nav.classList.remove('active');
            }
        });
    }
}

/**
 * WEB COMPONENTS
 */
function registerWebComponents() {
    // Import and register Upload Assistant
    const script = document.createElement('script');
    script.src = '/assets/js/upload-assistant.js';
    script.onload = () => {
        if (!document.querySelector('upload-assistant')) {
            const assistant = document.createElement('upload-assistant');
            document.body.appendChild(assistant);
        }
    };
    document.head.appendChild(script);

    // Shared Header
    class CreatorHeader extends HTMLElement {
        connectedCallback() {
            const activePath = window.location.pathname;
            this.innerHTML = `
            <header class="header-main">
                <div class="container header-container">
                    <nav class="nav-main">
                        <a href="/index.html" class="logo">
                            CreatorToolkit<span class="text-red">.</span>
                        </a>
                        <ul class="nav-links">
                            <li><a href="/index.html#tools" class="${activePath.includes('tools') ? 'active' : ''}">Tools</a></li>
                            <li><a href="/index.html#guides" class="${activePath.includes('guides') ? 'active' : ''}">Guides</a></li>
                            <li><a href="/about.html" class="${activePath === '/about.html' ? 'active' : ''}">About</a></li>
                        </ul>
                        <div class="nav-actions">
                            <button class="theme-toggle" onclick="toggleTheme()" aria-label="Toggle Theme">🌙</button>
                            <a href="/index.html#tools" class="btn-primary" style="height: 40px; padding: 0 1.25rem; font-size: 0.85rem; margin:0;">Start Creating</a>
                            <button class="mobile-menu-btn" aria-label="Menu">☰</button>
                        </div>
                    </nav>
                </div>
            </header>
            <style>
                .header-main { 
                    height: 80px; background: rgba(255,255,255,0.85); backdrop-filter: blur(16px); 
                    border-bottom: 1px solid var(--slate-200); position: sticky; top: 0; z-index: 1000;
                    display: flex; align-items: center;
                }
                .header-container { width: 100%; }
                .nav-main { display: flex; align-items: center; justify-content: space-between; }
                .logo { font-size: 1.5rem; font-weight: 800; color: var(--slate-900); text-decoration: none; letter-spacing: -0.03em; }
                .text-red { color: var(--brand-red); }
                .nav-links { display: flex; list-style: none; gap: 2.5rem; }
                .nav-links a { text-decoration: none; color: var(--slate-600); font-weight: 600; font-size: 0.95rem; transition: var(--trans-fast); }
                .nav-links a:hover, .nav-links a.active { color: var(--brand-red); }
                .nav-actions { display: flex; align-items: center; gap: 1.25rem; }
                .theme-toggle { background: var(--slate-100); border: none; width: 40px; height: 40px; border-radius: 10px; font-size: 1.1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: var(--trans-fast); }
                .theme-toggle:hover { background: var(--slate-200); }
                .mobile-menu-btn { display: none; background: none; border: none; font-size: 1.5rem; cursor: pointer; }
                @media (max-width: 768px) {
                    .nav-links { display: none; }
                    .mobile-menu-btn { display: block; }
                    .nav-links.active { 
                        display: flex; flex-direction: column; position: absolute; top: 80px; left: 0; width: 100%; 
                        background: white; padding: 2rem; border-bottom: 1px solid var(--slate-200); gap: 1.5rem;
                        box-shadow: var(--shadow-lg);
                    }
                }
            </style>
            `;
            setupMobileMenu();
        }
    }

    // Shared Footer
    class CreatorFooter extends HTMLElement {
        connectedCallback() {
            this.innerHTML = `
            <footer class="footer-main">
                <div class="container">
                    <div class="footer-grid">
                        <div class="footer-info">
                            <a href="/index.html" class="logo" style="margin-bottom: 1.25rem; display: block;">CreatorToolkit<span class="text-red">.</span></a>
                            <p style="max-width: 320px; color: var(--slate-600); font-size: 0.95rem;">Professional AI-powered tools for content creators. Master the algorithm and grow your channel with our 2026-ready toolset.</p>
                        </div>
                        <div class="footer-links">
                            <h4>Tools</h4>
                            <a href="/tools/thumbnail-maker.html">Thumbnail Maker</a>
                            <a href="/tools/title-generator.html">Title Generator</a>
                            <a href="/tools/keyword-generator.html">Keyword Tool</a>
                        </div>
                        <div class="footer-links">
                            <h4>Resources</h4>
                            <a href="/guides/youtube-seo-guide.html">SEO Guide</a>
                            <a href="/about.html">About Us</a>
                            <a href="/contact.html">Contact</a>
                        </div>
                        <div class="footer-links">
                            <h4>Legal</h4>
                            <a href="/privacy-policy.html">Privacy Policy</a>
                            <a href="/terms.html">Terms of Service</a>
                            <a href="/disclaimer.html">Disclaimer</a>
                        </div>
                    </div>
                    <div class="footer-bottom">
                        <p>&copy; 2026 CreatorToolkit. Built for Creators.</p>
                    </div>
                </div>
            </footer>
            <style>
                .footer-main { padding: 6rem 0 3rem; background: var(--slate-50); border-top: 1px solid var(--slate-200); margin-top: 8rem; }
                .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 4rem; margin-bottom: 5rem; }
                .footer-links { display: flex; flex-direction: column; gap: 1rem; }
                .footer-links h4 { font-size: 0.8rem; color: var(--slate-900); text-transform: uppercase; letter-spacing: 0.1em; font-weight: 800; margin-bottom: 0.5rem; }
                .footer-links a { color: var(--slate-600); text-decoration: none; font-size: 0.95rem; transition: var(--trans-fast); }
                .footer-links a:hover { color: var(--brand-red); transform: translateX(4px); }
                .footer-bottom { padding-top: 2.5rem; border-top: 1px solid var(--slate-200); text-align: center; font-size: 0.9rem; color: var(--slate-600); }
                @media (max-width: 1024px) { .footer-grid { gap: 2rem; } }
                @media (max-width: 768px) {
                    .footer-grid { grid-template-columns: 1fr 1fr; gap: 3rem; }
                    .footer-info { grid-column: span 2; }
                }
            </style>
            `;
        }
    }

    if (!customElements.get('creator-header')) {
        customElements.define('creator-header', CreatorHeader);
    }
    if (!customElements.get('creator-footer')) {
        customElements.define('creator-footer', CreatorFooter);
    }
}
