document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    setupMobileMenu();
    registerWebComponents();
    injectBottomNav();
    detectHomePage();
    loadMetaScore();
    
    // Initialize Tool-Specific logic if on those pages
    if (document.getElementById('countryList')) {
        initCountrySuggestions();
    }
    if (document.getElementById('calculateBtn')) {
        initEarningsCalculator();
    }
});

// Shared Country List
window.MONETIZATION_COUNTRIES = [
    "Global", "Algeria", "American Samoa", "Argentina", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahrain", "Bangladesh", "Belarus", "Belgium", "Bermuda", "Bolivia", "Bosnia and Herzegovina", "Brazil", "Bulgaria", "Cambodia", "Canada", "Cayman Islands", "Chile", "Colombia", "Costa Rica", "Croatia", "Cyprus", "Czechia", "Denmark", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Estonia", "Finland", "France", "French Guiana", "French Polynesia", "Georgia", "Germany", "Ghana", "Greece", "Guadeloupe", "Guam", "Guatemala", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Laos", "Latvia", "Lebanon", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Malaysia", "Malta", "Martinique", "Mayotte", "Mexico", "Montenegro", "Morocco", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Nigeria", "North Macedonia", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russia", "Saudi Arabia", "Senegal", "Serbia", "Singapore", "Slovakia", "Slovenia", "South Africa", "South Korea", "Spain", "Sri Lanka", "Sweden", "Switzerland", "Taiwan", "Tanzania", "Thailand", "Tunisia", "Turkey", "Turks and Caicos Islands", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "United States Virgin Islands", "Uruguay", "Venezuela", "Vietnam", "Yemen", "Zimbabwe"
];

function initCountrySuggestions() {
    const listEl = document.getElementById('countryList');
    if (!listEl) return;
    listEl.innerHTML = '';
    window.MONETIZATION_COUNTRIES.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        listEl.appendChild(option);
    });
}

// Earnings Calculator Logic
function initEarningsCalculator() {
    const calcBtn = document.getElementById('calculateBtn');
    if (calcBtn) {
        calcBtn.onclick = calculateEarnings;
    }
}

const RPM_TABLE = {
    "Global": 2.50,
    "United States": 6.80,
    "United Kingdom": 5.80,
    "Canada": 5.20,
    "Australia": 5.20,
    "Germany": 4.80,
    "France": 4.20,
    "Japan": 4.20,
    "South Korea": 3.80,
    "India": 1.40,
    "Brazil": 2.10,
    "Mexico": 1.70,
    "Pakistan": 0.80,
    "Switzerland": 6.50,
    "Netherlands": 4.80,
    "Sweden": 4.80,
    "Norway": 5.50,
    "United Arab Emirates": 4.50,
    "Saudi Arabia": 3.50,
    "South Africa": 1.80,
    "Nigeria": 0.70,
    "Vietnam": 0.90,
    "Philippines": 1.20,
    "Indonesia": 1.10
};

function calculateEarnings() {
    const errorEl = document.getElementById('calc-error');
    if (errorEl) errorEl.style.display = 'none';

    const type = document.querySelector('input[name="video-type"]:checked').value;
    const country = document.getElementById('country-input').value.trim();
    const views = Number(document.getElementById('views-input').value);
    const avdM = Number(document.getElementById('avdMinutes').value);
    const avdS = Number(document.getElementById('avdSeconds').value);
    const retention = Number(document.getElementById('retention-input').value);
    const niche = document.getElementById('adSuitability').value;
    
    if (!country) {
        showCalcError("Please select or enter a viewer country.");
        return;
    }
    if (!views || views <= 0) {
        showCalcError("Please enter a valid number of views.");
        return;
    }

    let baseRpm = RPM_TABLE[country] || RPM_TABLE["Global"];
    let isFallback = !RPM_TABLE[country] && country.toLowerCase() !== "global";

    if (type === 'shorts') {
        baseRpm = 0.045; // Fixed range for Shorts
    } else {
        const nicheMulti = {
            "Tech / How-To": 1.35,
            "Education / Knowledge": 1.25,
            "Entertainment": 1.0,
            "Gaming": 0.85,
            "Music": 0.9,
            "Lifestyle / Hobby": 1.15,
            "Commentary / Opinion": 1.0
        };
        baseRpm *= (nicheMulti[niche] || 1.0);

        if (retention > 50) baseRpm *= 1.12;
        if (retention < 30) baseRpm *= 0.88;

        const totalAvd = avdM * 60 + avdS;
        if (totalAvd >= 480) baseRpm *= 1.25; // Mid-roll bonus
    }

    const typical = (views / 1000) * baseRpm;
    const low = typical * 0.72;
    const high = typical * 1.38;

    document.getElementById('typical-total').textContent = '$' + typical.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
    document.getElementById('low-total').textContent = '$' + Math.round(low).toLocaleString();
    document.getElementById('mid-total').textContent = '$' + Math.round(typical).toLocaleString();
    document.getElementById('high-total').textContent = '$' + Math.round(high).toLocaleString();

    document.getElementById('low-rpm').textContent = 'RPM: $' + (baseRpm * 0.72).toFixed(2);
    document.getElementById('mid-rpm').textContent = 'RPM: $' + baseRpm.toFixed(2);
    document.getElementById('high-rpm').textContent = 'RPM: $' + (baseRpm * 1.38).toFixed(2);

    const rangeNote = document.getElementById('video-range');
    rangeNote.textContent = isFallback ? `Estimate for "${country}" (Global Average used)` : `Revenue estimate based on ${country} trends`;
    
    const resultArea = document.getElementById('result-area');
    resultArea.style.display = 'block';
    setTimeout(() => resultArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
}

function showCalcError(msg) {
    const err = document.getElementById('calc-error');
    if (err) {
        err.textContent = '⚠️ ' + msg;
        err.style.display = 'block';
    }
}

window.toggleAccordion = function() {
    const content = document.getElementById('acc-content');
    if (content) {
        const isHidden = content.style.display === 'none' || content.style.display === '';
        content.style.display = isHidden ? 'block' : 'none';
    }
};

window.calculateEarnings = calculateEarnings;

// Segmented Control Global Toggle
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.cta-toggle-btn');
    if (btn) {
        const group = btn.closest('.cta-toggle-group');
        if (group) {
            // UI Toggle
            group.querySelectorAll('.cta-toggle-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Logic Sync: If the group contains hidden radio inputs, check them
            const radio = btn.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
                // Dispatch change event manually since setting .checked doesn't trigger it
                radio.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }
    }
});

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    // Ensure UI is updated after web components might have rendered
    setTimeout(() => updateThemeToggleUI(savedTheme), 0);
}

function loadMetaScore() {
    // Pages to EXCLUDE
    const EXCLUDE = ["guides", "about", "privacy", "terms", "contact"];
    const p = (location.pathname || "").toLowerCase();
    if (EXCLUDE.some(x => p.includes(x))) return;

    if (window._metascoreScriptLoaded) return;
    window._metascoreScriptLoaded = true;

    // Inject CSS
    if (!document.querySelector('link[href*="upload-panel.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/assets/upload-panel.css?v=' + Date.now();
        document.head.appendChild(link);
    }

    // Inject Panel Logic
    if (!document.querySelector('script[src*="upload-panel.js"]')) {
        const script = document.createElement('script');
        script.src = '/assets/upload-panel.js?v=' + Date.now();
        script.defer = true;
        document.body.appendChild(script);
    }
}

function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    const newTheme = isDark ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    updateThemeToggleUI(newTheme);
}

function updateThemeToggleUI(theme) {
    const toggles = document.querySelectorAll('.theme-toggle');
    toggles.forEach(btn => {
        const icon = theme === 'dark' ? '☀️' : '🌙';
        const text = theme === 'dark' ? 'Light' : 'Dark';
        btn.innerHTML = `<span class="theme-icon">${icon}</span><span class="theme-label">${text}</span>`;
    });
}

window.toggleTheme = toggleTheme;

function setupMobileMenu() {
    const btn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav-links');
    if(btn && nav) {
        btn.onclick = (e) => {
            e.stopPropagation();
            nav.classList.toggle('active');
        };
    }
}

function injectBottomNav() {
    if (document.querySelector('.bottom-nav')) return;
    
    const main = document.querySelector('main');
    if (!main) return;

    const nav = document.createElement('div');
    nav.className = 'bottom-nav';
    nav.setAttribute('role', 'navigation');
    nav.innerHTML = `
        <div class="container">
            <div class="bottom-nav__inner">
                <button class="bottom-nav__btn bottom-nav__btn--ghost" id="btnBack" type="button">← Back</button>
                <a class="bottom-nav__btn bottom-nav__btn--primary" id="btnHome" href="/">Home</a>
            </div>
        </div>
    `;
    main.appendChild(nav);

    // Logic for Back button
    const backBtn = document.getElementById('btnBack');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            if (window.history.length > 1) window.history.back();
            else window.location.href = "/";
        });
    }
}

function detectHomePage() {
    const path = window.location.pathname.replace(/\/+$/, "");
    if (path === "" || path === "/" || path.endsWith("/index.html")) {
        document.body.classList.add("is-home");
    }
}

function registerWebComponents() {
    class CreatorHeader extends HTMLElement {
        connectedCallback() {
            const activePath = window.location.pathname;
            const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
            const icon = currentTheme === 'dark' ? '☀️' : '🌙';
            const text = currentTheme === 'dark' ? 'Light' : 'Dark';

            this.innerHTML = `
            <header class="site-header">
                <div class="nav-inner">
                    <div class="nav-left">
                        <a href="/index.html" class="logo">CreatorToolkit<span class="text-red">.</span></a>
                    </div>
                    
                    <nav class="nav-center">
                        <ul class="nav-links-list">
                            <li><a href="/tools.html" class="${activePath.includes('tools') ? 'active-nav' : ''}">Tools</a></li>
                            <li><a href="/guides.html" class="${activePath.includes('guides') ? 'active-nav' : ''}">Guides</a></li>
                            <li><a href="/about.html" class="${activePath === '/about.html' ? 'active-nav' : ''}">About</a></li>
                            <li><a href="/privacy.html" class="${activePath === '/privacy.html' ? 'active-nav' : ''}">Privacy</a></li>
                            <li><a href="/terms.html" class="${activePath === '/terms.html' ? 'active-nav' : ''}">Terms</a></li>
                            <li><a href="/contact.html" class="${activePath === '/contact.html' ? 'active-nav' : ''}">Contact</a></li>
                        </ul>
                    </nav>

                    <div class="nav-right">
                        <button class="theme-toggle" onclick="toggleTheme()">
                            <span class="theme-icon">${icon}</span><span class="theme-label">${text}</span>
                        </button>
                        <a href="/tools.html" class="btn-primary start-btn">Start Creating</a>
                        <button class="mobile-menu-btn">☰</button>
                    </div>
                </div>
            </header>
            <style>
                .site-header { 
                    height: 72px; background: var(--bg-primary); border-bottom: 1px solid var(--border-color); 
                    position: sticky; top: 0; z-index: 1000; display: flex; align-items: center;
                }
                .nav-inner {
                    display: grid;
                    grid-template-columns: 1fr auto 1fr; /* 3구역 완벽 대칭 */
                    align-items: center;
                    height: 72px;
                    width: 100%;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 20px;
                }
                
                .nav-left { justify-self: start; }
                .nav-center { justify-self: center; }
                .nav-right { 
                    justify-self: end; 
                    display: flex; 
                    align-items: center; 
                    gap: 12px; 
                }

                .logo { font-size: 1.4rem; font-weight: 800; color: var(--text-primary); text-decoration: none; }
                .text-red { color: var(--brand-red); }
                
                .nav-links-list { display: flex; align-items: center; gap: 28px; list-style: none; padding: 0; margin: 0; }
                .nav-links-list a { 
                    font-weight: 600; 
                    font-size: 15.5px; 
                    color: var(--text-primary); 
                    text-decoration: none; 
                    transition: color .15s ease; 
                }
                .nav-links-list a:hover, .nav-links-list a.active { color: var(--brand-red); }
                .nav-links-list a.active { font-weight: 700; }
                
                .theme-toggle { 
                    display: inline-flex; align-items: center; gap: 8px;
                    background: var(--bg-secondary); border: 1px solid var(--border-color); 
                    height: 40px; padding: 0 14px; border-radius: 999px; cursor: pointer; 
                    transition: all 0.2s; color: var(--text-primary); font-weight: 600; font-size: 13px;
                }
                .theme-toggle:hover { background: var(--border-color); }
                .theme-icon { font-size: 16px; }

                .start-btn { height: 40px; font-size: 13px; padding: 0 16px; border-radius: 12px; }

                .mobile-menu-btn { display: none; background: none; border: none; font-size: 1.5rem; color: var(--text-primary); cursor: pointer; }

                @media (max-width: 900px) {
                    .nav-center { display: none; }
                    .mobile-menu-btn { display: block; }
                    .nav-inner { grid-template-columns: auto 1fr; }
                    .nav-right { gap: 8px; }
                }

                @media (max-width: 480px) {
                    .theme-label, .start-btn { display: none; }
                    .theme-toggle { padding: 0 10px; width: 40px; justify-content: center; }
                }
            </style>
            `;
        }
    }

    class CreatorFooter extends HTMLElement {
        connectedCallback() {
            this.innerHTML = `
            <footer class="footer-main">
                <div class="container">
                    <div class="footer-grid">
                        <div>
                            <a href="/index.html" class="logo">CreatorToolkit<span class="text-red">.</span></a>
                            <p style="margin-top:1rem; color:var(--text-secondary);">Master the algorithm with AI tools.</p>
                        </div>
                        <div class="footer-links">
                            <a href="/privacy.html">Privacy</a>
                            <a href="/terms.html">Terms</a>
                            <a href="/about.html">About</a>
                            <a href="/guides.html">Guides</a>
                        </div>
                    </div>
                </div>
            </footer>
            <style>
                .footer-main { padding: 4rem 0 2rem; background: var(--bg-secondary); border-top: 1px solid var(--border-color); margin-top: 5rem; }
                .footer-grid { display: flex; justify-content: space-between; align-items: flex-start; }
                .footer-links { display: flex; gap: 2rem; }
                .footer-links a { color: var(--text-secondary); font-size: 0.9rem; }
            </style>
            `;
        }
    }

    if (!customElements.get('creator-header')) customElements.define('creator-header', CreatorHeader);
    if (!customElements.get('creator-footer')) customElements.define('creator-footer', CreatorFooter);
}
