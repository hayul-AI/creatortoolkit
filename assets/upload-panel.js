/**
 * YouTube Upload Assistant Panel - 2026 Enhanced Version
 * Fixed: Upload Strength restoration and real-time animation
 */
(function() {
    const DEFAULTS = {
        isOpen: true,
        position: { top: 100, left: 30 },
        content: { title: '', description: '', tags: [] },
        settings: { includeCTA: true, tone: 'Cozy', purpose: 'Relax' }
    };

    let state = JSON.parse(localStorage.getItem('up_state_v3')) || DEFAULTS;

    function saveState() {
        localStorage.setItem('up_state_v3', JSON.stringify(state));
    }

    function init() {
        if (document.getElementById('upload-assistant-panel')) return;
        createUI();
        setupEventListeners();
        setupDrag();
        
        // Ensure score updates after DOM is fully ready
        setTimeout(() => {
            updateScore();
            restorePanel();
        }, 100);
    }

    function createUI() {
        const panel = document.createElement('div');
        panel.id = 'upload-assistant-panel';
        if (!state.isOpen) panel.classList.add('hidden');

        panel.innerHTML = `
            <div class="up-header" id="up-drag-handle">
                <div class="up-header-title">🚀 UPLOAD ASSISTANT</div>
                <div style="display:flex; gap:8px;">
                    <button class="up-icon-btn" id="up-reset-pos" title="Reset Position">🔄</button>
                    <button class="up-icon-btn" id="up-close-x">✕</button>
                </div>
            </div>
            <div class="up-body">
                <div class="up-score-card">
                    <div class="up-score-top">
                        <span class="up-score-label">Upload Strength</span>
                        <span class="up-score-value"><span id="up-score-val">0</span><small style="font-size:0.5em; opacity:0.6;">/100</small></span>
                    </div>
                    <div class="up-progress"><div class="up-progress-bar" id="up-score-bar"></div></div>
                    <ul class="up-hints" id="up-hints"></ul>
                </div>

                <div class="up-field">
                    <div class="up-label-row"><span>TITLE</span> <span id="up-title-cnt">0/100</span></div>
                    <input type="text" class="up-input" id="up-title-in" maxlength="100" placeholder="Enter video title...">
                </div>

                <div class="up-field">
                    <div class="up-label-row"><span>HASHTAGS (MAX 5)</span> <span id="up-tag-cnt">0/5</span></div>
                    <div class="up-tag-container" id="up-tag-cont">
                        <input type="text" class="up-input" id="up-tag-in" style="border:none; padding:4px; width:auto; flex:1;" placeholder="#tags...">
                    </div>
                </div>

                <div class="up-gen-tools">
                    <div class="up-label-row"><span>AI DESC GENERATOR</span></div>
                    <div class="up-gen-grid">
                        <select class="up-select" id="up-gen-tone">
                            <option>Calm</option><option>Professional</option><option selected>Cozy</option>
                        </select>
                        <select class="up-select" id="up-gen-purpose">
                            <option selected>Relax</option><option>Study</option><option>Work</option>
                        </select>
                    </div>
                    <button class="up-btn up-btn-primary" id="up-btn-gen" style="width:100%; margin-top:10px;">✨ Generate Description</button>
                </div>

                <div class="up-field">
                    <div class="up-label-row"><span>DESCRIPTION</span> <span id="up-desc-cnt">0</span></div>
                    <textarea class="up-input" id="up-desc-in" style="min-height:100px;" placeholder="Detailed description..."></textarea>
                </div>
            </div>
            <div class="up-footer">
                <button class="up-btn" id="up-copy-all">Copy Everything</button>
            </div>
            <div class="up-toast" id="up-toast">Copied!</div>
        `;
        document.body.appendChild(panel);

        const openBtn = document.createElement('button');
        openBtn.id = 'up-global-open';
        openBtn.className = 'up-open-btn';
        openBtn.innerHTML = '🚀';
        if (state.isOpen) openBtn.style.display = 'none';
        document.body.appendChild(openBtn);
    }

    function setupEventListeners() {
        const sr = (id) => document.getElementById(id);
        const titleIn = sr('up-title-in');
        const descIn = sr('up-desc-in');
        const tagIn = sr('up-tag-in');

        titleIn.value = state.content.title;
        descIn.value = state.content.description;
        renderTags();

        titleIn.oninput = (e) => {
            state.content.title = e.target.value;
            sr('up-title-cnt').innerText = `${e.target.value.length}/100`;
            updateScore();
            saveState();
        };

        descIn.oninput = (e) => {
            state.content.description = e.target.value;
            sr('up-desc-cnt').innerText = e.target.value.length;
            updateScore();
            saveState();
        };

        const processTags = () => {
            const val = tagIn.value.trim();
            if (!val) return;
            const newTags = val.split(/[\s,]+/).map(t => t.trim().replace(/^#/, '')).filter(t => t !== '');
            let combined = [...new Set([...state.content.tags, ...newTags])];
            if (combined.length > 5) combined = combined.slice(0, 5);
            state.content.tags = combined;
            tagIn.value = '';
            renderTags();
            updateScore();
            saveState();
        };

        tagIn.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); processTags(); } };
        tagIn.onblur = processTags;

        sr('up-btn-gen').onclick = generateDescription;
        sr('up-copy-all').onclick = () => {
            const tags = state.content.tags.map(t => `#${t}`).join(' ');
            copyText(`${state.content.title}\n\n${state.content.description}\n\n${tags}`);
        };

        sr('up-close-x').onclick = () => togglePanel(false);
        sr('up-global-open').onclick = () => togglePanel(true);
        sr('up-reset-pos').onclick = () => {
            state.position = { top: 100, left: 30 };
            restorePanel();
            saveState();
        };
    }

    function renderTags() {
        const cont = document.getElementById('up-tag-cont');
        const input = document.getElementById('up-tag-in');
        cont.querySelectorAll('.up-tag').forEach(t => t.remove());
        state.content.tags.forEach((tag, i) => {
            const chip = document.createElement('div');
            chip.className = 'up-tag';
            chip.innerHTML = `#${tag} <span style="cursor:pointer;margin-left:4px;" onclick="window.removeUpTag(${i})">×</span>`;
            cont.insertBefore(chip, input);
        });
        document.getElementById('up-tag-cnt').innerText = `${state.content.tags.length}/5`;
    }

    // Global helper for tag removal
    window.removeUpTag = (idx) => {
        state.content.tags.splice(idx, 1);
        renderTags();
        updateScore();
        saveState();
    };

    function updateScore() {
        const c = state.content;
        let score = 0;
        let hints = [];

        // Title Logic
        const tl = c.title.trim().length;
        if (tl >= 45 && tl <= 75) score += 30;
        else if (tl > 0) { score += 15; hints.push("Aim for 45-75 chars in title."); }
        else hints.push("Add a video title to start.");

        // Description Logic
        const dl = c.description.trim().length;
        if (dl >= 250) score += 30;
        else if (dl >= 50) { score += 15; hints.push(`Description is a bit short (${dl} chars).`); }
        else hints.push("Add a detailed description.");

        // Tags Logic
        const tc = c.tags.length;
        if (tc >= 3) score += 20;
        else if (tc > 0) { score += 10; hints.push("Add at least 3 hashtags."); }
        else hints.push("Use hashtags for better reach.");

        // Content Logic
        if (c.description.toLowerCase().includes('subscribe') || c.description.toLowerCase().includes('like')) score += 20;
        else hints.push("Add a Call to Action (Like/Sub).");

        const final = Math.min(100, score);
        const valEl = document.getElementById('up-score-val');
        const barEl = document.getElementById('up-score-bar');
        const hintsEl = document.getElementById('up-hints');

        if (valEl) valEl.innerText = final;
        if (barEl) {
            barEl.style.width = `${final}%`;
            barEl.style.backgroundColor = final > 80 ? "#10b981" : (final > 50 ? "#f59e0b" : "#E11D48");
        }
        if (hintsEl) {
            hintsEl.innerHTML = hints.slice(0, 3).map(h => `<li>${h}</li>`).join('');
        }
    }

    function generateDescription() {
        const title = state.content.title || "this content";
        const tone = document.getElementById('up-gen-tone').value;
        const purpose = document.getElementById('up-gen-purpose').value;
        const kw = state.content.tags[0] || "valuable topics";

        const intro = {
            Calm: `In this video, we'll explore ${title}.`,
            Cozy: `Welcome! ✨ Today we're diving into ${title}.`,
            Professional: `This session covers the core aspects of ${title}.`
        }[tone];

        const body = {
            Relax: `Sit back and enjoy the atmosphere focused on ${kw}.`,
            Study: `Boost your productivity while we focus on ${kw}.`,
            Work: `Enhance your workflow with these insights on ${kw}.`
        }[purpose];

        const fullDesc = `${intro}\n\n${body}\n\nDon't forget to like and subscribe for more!`;
        document.getElementById('up-desc-in').value = fullDesc;
        state.content.description = fullDesc;
        updateScore();
        saveState();
        showToast("Description Generated!");
    }

    function setupDrag() {
        const panel = document.getElementById('upload-assistant-panel');
        const handle = document.getElementById('up-drag-handle');
        let isDragging = false;
        let startX, startY, initialTop, initialLeft;

        const start = (e) => {
            if (e.target.closest('button') || e.target.closest('input')) return;
            isDragging = true;
            const ev = e.touches ? e.touches[0] : e;
            startX = ev.clientX; startY = ev.clientY;
            initialTop = panel.offsetTop; initialLeft = panel.offsetLeft;
            panel.style.transition = 'none';
        };
        const move = (e) => {
            if (!isDragging) return;
            const ev = e.touches ? e.touches[0] : e;
            state.position.top = initialTop + (ev.clientY - startY);
            state.position.left = initialLeft + (ev.clientX - startX);
            panel.style.top = `${state.position.top}px`;
            panel.style.left = `${state.position.left}px`;
        };
        const end = () => { isDragging = false; panel.style.transition = ''; saveState(); };

        handle.onmousedown = start; handle.ontouchstart = start;
        window.onmousemove = move; window.ontouchmove = move;
        window.onmouseup = end; window.ontouchend = end;
    }

    function togglePanel(open) {
        state.isOpen = open;
        document.getElementById('upload-assistant-panel').classList.toggle('hidden', !open);
        document.getElementById('up-global-open').style.display = open ? 'none' : 'block';
        saveState();
    }

    function restorePanel() {
        const p = document.getElementById('upload-assistant-panel');
        p.style.top = `${state.position.top}px`;
        p.style.left = `${state.position.left}px`;
    }

    function copyText(txt) { navigator.clipboard.writeText(txt).then(() => showToast("Copied to Clipboard!")); }
    function showToast(msg) {
        const t = document.getElementById('up-toast');
        t.innerText = msg; t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 2000);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
