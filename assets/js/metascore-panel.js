/**
 * CreatorToolkit MetaScore Global Floating Panel
 * All-in-one logic: UI, Persistence, Draggable, Scoring
 */
(function() {
    const STORAGE_KEY = 'ctk_metascore_state';
    const EXCLUDE_PATHS = ["/guides", "/about", "/privacy", "/terms", "/contact"];

    const DEFAULTS = {
        isOpen: true,
        pos: { x: 20, y: 100 },
        content: {
            title: '',
            cat: '',
            tags: [],
            desc: ''
        }
    };

    let state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEFAULTS;

    function saveState() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    function isAllowedPage() {
        const path = window.location.pathname.toLowerCase();
        if (path === "/" || path === "/index.html" || path.includes("/tools/")) {
            return !EXCLUDE_PATHS.some(p => path.includes(p));
        }
        return false;
    }

    function createUI() {
        if (document.getElementById('ctk-metascore-container')) return;

        // Container
        const container = document.createElement('div');
        container.id = 'ctk-metascore-container';
        container.style.right = state.pos.x + 'px';
        container.style.top = state.pos.y + 'px';
        if (!state.isOpen) container.classList.add('hidden');

        container.innerHTML = `
            <div class="ms-header" id="ms-drag-handle">
                <div class="ms-header-title">🚀 METASCORE PRO</div>
                <button class="ms-close-btn" id="ms-close">×</button>
            </div>
            <div class="ms-body">
                <div class="ms-score-card">
                    <div class="ms-score-val" id="ms-score">0</div>
                    <div class="ms-score-label">Optimization Score</div>
                </div>
                
                <div class="ms-field">
                    <label class="ms-label">VIDEO TITLE</label>
                    <input type="text" id="ms-title" class="ms-input" placeholder="Enter title..." value="${state.content.title.replace(/"/g, '&quot;')}">
                </div>

                <div class="ms-field">
                    <label class="ms-label">CATEGORY</label>
                    <select id="ms-cat" class="ms-input">
                        <option value="">Select Category</option>
                        <option value="edu" ${state.content.cat==='edu'?'selected':''}>Education</option>
                        <option value="tech" ${state.content.cat==='tech'?'selected':''}>Tech / How-To</option>
                        <option value="ent" ${state.content.cat==='ent'?'selected':''}>Entertainment</option>
                        <option value="game" ${state.content.cat==='game'?'selected':''}>Gaming</option>
                        <option value="life" ${state.content.cat==='life'?'selected':''}>Lifestyle</option>
                    </select>
                </div>

                <div class="ms-field">
                    <label class="ms-label">HASHTAGS (MAX 5)</label>
                    <div class="ms-tag-input-wrap" id="ms-tag-area">
                        <input type="text" id="ms-tag-input" placeholder="Add tag...">
                    </div>
                </div>

                <div class="ms-field">
                    <label class="ms-label">DESCRIPTION</label>
                    <textarea id="ms-desc" class="ms-input" style="min-height:80px; resize:vertical;">${state.content.desc}</textarea>
                </div>
            </div>
        `;

        document.body.appendChild(container);

        setupEvents(container);
        renderTags();
        updateScore();
    }

    function setupEvents(container) {
        const titleIn = document.getElementById('ms-title');
        const catIn = document.getElementById('ms-cat');
        const descIn = document.getElementById('ms-desc');
        const tagIn = document.getElementById('ms-tag-input');
        const closeBtn = document.getElementById('ms-close');

        // Input sync
        titleIn.oninput = (e) => { state.content.title = e.target.value; updateScore(); saveState(); };
        catIn.onchange = (e) => { state.content.cat = e.target.value; updateScore(); saveState(); };
        descIn.oninput = (e) => { state.content.desc = e.target.value; updateScore(); saveState(); };

        // Tag event
        tagIn.onkeydown = (e) => {
            if (e.key === 'Enter') {
                const val = e.target.value.trim().replace('#','');
                if (val && state.content.tags.length < 5 && !state.content.tags.includes(val)) {
                    state.content.tags.push(val);
                    e.target.value = '';
                    renderTags();
                    updateScore();
                    saveState();
                }
            }
        };

        // Toggle
        closeBtn.onclick = () => {
            state.isOpen = false;
            container.classList.add('hidden');
            saveState();
        };

        // Drag
        const handle = document.getElementById('ms-drag-handle');
        let isDragging = false;
        let startX, startY, startRect;

        handle.onmousedown = (e) => {
            if (e.target.tagName === 'BUTTON') return;
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startRect = container.getBoundingClientRect();
            document.body.style.cursor = 'move';
        };

        window.onmousemove = (e) => {
            if (!isDragging) return;
            // Calculate relative movement
            const deltaX = startX - e.clientX; // Dragging right reduces right offset
            const deltaY = e.clientY - startY; // Dragging down increases top offset

            let newRight = (window.innerWidth - startRect.right) + deltaX;
            let newTop = startRect.top + deltaY;

            // Clamp
            newRight = Math.max(0, Math.min(window.innerWidth - 340, newRight));
            newTop = Math.max(0, Math.min(window.innerHeight - 100, newTop));

            container.style.right = newRight + 'px';
            container.style.top = newTop + 'px';
            
            // We store right/top for consistency with CSS
            state.pos = { x: newRight, y: newTop };
        };

        window.onmouseup = () => {
            if (isDragging) {
                isDragging = false;
                document.body.style.cursor = 'default';
                saveState();
            }
        };
    }

    function renderTags() {
        const area = document.getElementById('ms-tag-area');
        const input = document.getElementById('ms-tag-input');
        area.querySelectorAll('.ms-tag-chip').forEach(c => c.remove());
        
        state.content.tags.forEach((tag, idx) => {
            const chip = document.createElement('div');
            chip.className = 'ms-tag-chip';
            chip.innerHTML = `#${tag} <span class="ms-tag-del" data-idx="${idx}">×</span>`;
            chip.querySelector('.ms-tag-del').onclick = () => {
                state.content.tags.splice(idx, 1);
                renderTags();
                updateScore();
                saveState();
            };
            area.insertBefore(chip, input);
        });
    }

    function updateScore() {
        const c = state.content;
        let score = 0;

        if (c.cat) score += 10;
        
        const tl = c.title.trim().length;
        if (tl >= 45 && tl <= 75) score += 30;
        else if (tl > 0) score += 15;

        const dl = c.desc.trim().length;
        if (dl >= 250) score += 30;
        else if (dl >= 50) score += 15;

        const tc = c.tags.length;
        if (tc >= 3) score += 20;
        else if (tc > 0) score += 10;

        if (c.desc.toLowerCase().includes('sub') || c.desc.toLowerCase().includes('like')) score += 10;

        const final = Math.min(100, score);
        const scoreEl = document.getElementById('ms-score');
        if (scoreEl) scoreEl.innerText = final;
    }

    if (isAllowedPage()) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createUI);
        } else {
            createUI();
        }
    }
})();
