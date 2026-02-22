(function () {
  const $ = (id) => document.getElementById(id);

  const categoryEl = $("ytCategory");
  const subsEl = $("subs");
  const avdMinEl = $("avdMin");
  const avdSecEl = $("avdSec");
  const ctrEl = $("ctr");
  const countryEl = $("country");
  const btnEl = $("consultBtn");

  const statusEl = $("statusBadge");
  const progressEl = $("progressFill");
  const outEl = $("consultOutput");

  if (!btnEl || !outEl) return;

  function setStatus(t){ if (statusEl) statusEl.textContent = t; }
  function setProgress(p){ if (progressEl) progressEl.style.width = Math.max(0, Math.min(100, p)) + "%"; }

  function num(v){ const x = Number(v); return Number.isFinite(x) ? x : 0; }

  function normalizeCountry(raw){
    const s = (raw || "").trim();
    if (!s) return "Global";
    if (/global|world|worldwide|all/i.test(s)) return "Global";
    return s;
  }

  function avdSeconds(min, sec){
    const m = num(min);
    const s = num(sec);
    return Math.max(0, Math.round(m * 60 + s));
  }

  function bucketSubs(subs){
    if (subs < 100) return "0–99";
    if (subs < 1000) return "100–999";
    if (subs < 10000) return "1k–9.9k";
    if (subs < 100000) return "10k–99k";
    if (subs < 1000000) return "100k–999k";
    return "1M+";
  }

  function scoreCTR(ctr){
    if (ctr >= 10) return { level: "Excellent", tip: "Keep packaging style; make small thumbnail iterations only." };
    if (ctr >= 6) return { level: "Good", tip: "Test 2 thumbnail variations within the first 24h." };
    if (ctr >= 4) return { level: "Average", tip: "Tighten title clarity + higher thumbnail contrast + single focal subject." };
    return { level: "Low", tip: "Prioritize thumbnail/title improvements before changing content strategy." };
  }

  function scoreAVD(avdSec){
    if (avdSec >= 360) return { level: "Strong", tip: "Retention is healthy—scale consistency and playlists." };
    if (avdSec >= 180) return { level: "Okay", tip: "Improve the first 15s hook; remove slow intros." };
    if (avdSec >= 90) return { level: "Weak", tip: "Add pattern interrupts every 20–30s; reduce fluff." };
    return { level: "Very weak", tip: "Rebuild structure: promise → proof → steps → recap, faster pacing." };
  }

  function categoryAdvice(cat){
    const map = {
      "Entertainment": [
        "Build a repeatable series format so viewers recognize your content instantly.",
        "Show the best moment within 5–8 seconds to lock attention early."
      ],
      "Education / Knowledge": [
        "Open with the outcome: what the viewer can do/understand by the end.",
        "Use structure: problem → explanation → example → recap."
      ],
      "Tech / How-To": [
        "Show final result early, then steps. Keep titles specific (tool + outcome).",
        "Use pinned comment with steps/links to boost satisfaction signals."
      ],
      "Gaming": [
        "Stick to one core promise per video (build/strat/update/challenge).",
        "Thumbnail: 1 subject + 1 keyword; avoid clutter."
      ],
      "Music": [
        "Use consistent naming: mood + instrument + use-case (study/sleep/drive).",
        "Prioritize playlists and consistent upload cadence."
      ],
      "Lifestyle / Hobby": [
        "Niche down: one audience persona + one outcome per video.",
        "Use before/after framing and concrete takeaways."
      ],
      "Commentary / Opinion": [
        "AdSense-safe tone: facts + structured reasoning, avoid inflammatory wording.",
        "Use curiosity without exaggeration or attacks."
      ]
    };
    return map[cat] || ["Stay consistent and focus on a clear viewer promise."];
  }

  function escapeHTML(s){
    return (s || "").replace(/[&<>"']/g, (c) => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
    }[c]));
  }

  function buildPlan(inputs){
    const { category, subs, avdSec, ctr, country } = inputs;
    const ctrS = scoreCTR(ctr);
    const avdS = scoreAVD(avdSec);

    const priorities = [];
    if (ctr < 4) priorities.push("Fix packaging first (thumbnail + title).");
    if (avdSec < 120) priorities.push("Fix retention next (hook + pacing).");
    if (subs < 1000) priorities.push("Build consistency: 2–3 repeatable formats + stable cadence.");
    if (country !== "Global") priorities.push(`Localize for ${country}: keywords/titles that match local search language.`);
    if (priorities.length === 0) priorities.push("Healthy baseline—run small weekly experiments and keep what works.");

    const plan7 = [
      "Day 1: Define ONE viewer promise (one sentence). Rewrite last 5 titles for clarity.",
      "Day 2: Create 2 thumbnail variants for next upload (contrast, one focal subject).",
      "Day 3: Rewrite first 15s: promise + proof + what’s next (no long intro).",
      "Day 4: Add chapters + pinned comment summary for satisfaction signals.",
      "Day 5: Build a matching playlist; link it in description + end screen.",
      "Day 6: Publish and watch first 6h; if CTR low, swap thumbnail once (no spam).",
      "Day 7: Review CTR/AVD; repeat the best-performing format next upload."
    ];

    const titleRules = [
      "Use specific nouns (topic + outcome).",
      "Keep curiosity but stay truthful—avoid misleading superlatives.",
      "Front-load the keyword; aim ~45–75 characters when possible."
    ];

    return {
      segment: bucketSubs(subs),
      ctrS,
      avdS,
      priorities,
      plan7,
      titleRules,
      categoryTips: categoryAdvice(category)
    };
  }

  function render(data, inputs){
    const { category, subs, avdSec, ctr, country } = inputs;
    const mm = Math.floor(avdSec / 60);
    const ss = avdSec % 60;

    outEl.innerHTML = `
      <div class="result-block">
        <div class="result-head"><div class="result-title">Snapshot</div></div>
        <div class="result-meta">
          <div><b>Category:</b> ${escapeHTML(category)}</div>
          <div><b>Subscribers:</b> ${escapeHTML(String(subs))} <span class="pill">${escapeHTML(data.segment)}</span></div>
          <div><b>Avg View Duration:</b> ${mm}:${String(ss).padStart(2,"0")}</div>
          <div><b>CTR:</b> ${escapeHTML(String(ctr))}%</div>
          <div><b>Country:</b> ${escapeHTML(country)}</div>
        </div>
      </div>

      <div class="result-block">
        <div class="result-head"><div class="result-title">Diagnostics</div></div>
        <div class="result-grid">
          <div class="result-card">
            <div class="result-k">CTR</div>
            <div class="result-v">${escapeHTML(data.ctrS.level)}</div>
            <div class="result-tip">${escapeHTML(data.ctrS.tip)}</div>
          </div>
          <div class="result-card">
            <div class="result-k">Retention (AVD)</div>
            <div class="result-v">${escapeHTML(data.avdS.level)}</div>
            <div class="result-tip">${escapeHTML(data.avdS.tip)}</div>
          </div>
        </div>
      </div>

      <div class="result-block">
        <div class="result-head"><div class="result-title">Top Priorities</div></div>
        <ul class="result-list">${data.priorities.map(x=>`<li>${escapeHTML(x)}</li>`).join("")}</ul>
      </div>

      <div class="result-block">
        <div class="result-head"><div class="result-title">Category-Specific Tips</div></div>
        <ul class="result-list">${data.categoryTips.map(x=>`<li>${escapeHTML(x)}</li>`).join("")}</ul>
      </div>

      <div class="result-block">
        <div class="result-head"><div class="result-title">7-Day Action Plan</div></div>
        <ol class="result-list">${data.plan7.map(x=>`<li>${escapeHTML(x)}</li>`).join("")}</ol>
      </div>

      <div class="result-block">
        <div class="result-head"><div class="result-title">Title Rules (AdSense-safe)</div></div>
        <ul class="result-list">${data.titleRules.map(x=>`<li>${escapeHTML(x)}</li>`).join("")}</ul>
      </div>
    `;
  }

  function run(){
    const category = categoryEl ? categoryEl.value : "Education / Knowledge";
    const subs = subsEl?.value ? num(subsEl.value) : 0;
    const ctr = ctrEl?.value ? num(ctrEl.value) : 0;
    const country = normalizeCountry(countryEl?.value);
    const avdSec = (avdMinEl?.value || avdSecEl?.value) ? avdSeconds(avdMinEl?.value, avdSecEl?.value) : 0;

    setStatus("Analyzing...");
    setProgress(15);

    setTimeout(() => {
      try{
        setProgress(55);
        const data = buildPlan({ category, subs, avdSec, ctr, country });
        setProgress(85);
        render(data, { category, subs, avdSec, ctr, country });
        setProgress(100);
        setStatus("Done");
      }catch(e){
        console.error("[Consultant] error:", e);
        setStatus("Error");
        setProgress(0);
        outEl.innerHTML = `<div class="result-empty">Something went wrong. Refresh and try again.</div>`;
      }
    }, 180);
  }

  btnEl.addEventListener("click", run);

  [subsEl, avdMinEl, avdSecEl, ctrEl, countryEl].forEach((el) => {
    if (!el) return;
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        run();
      }
    });
  });

  setStatus("Ready");
  setProgress(0);
})();
