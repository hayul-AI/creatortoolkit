// MetaScore floating panel controller (static, local-only)
(function () {
  const STORAGE_KEY = "metascore_open"; // "1" open, "0" closed

  // Pages to EXCLUDE (by path or filename substring)
  const EXCLUDE = ["guides", "about", "privacy", "terms", "contact"];

  function isExcludedPage() {
    const p = (location.pathname || "").toLowerCase();
    return EXCLUDE.some(x => p.includes(x));
  }

  function qs(sel, root=document) { return root.querySelector(sel); }

  // Try to find existing metascore panel (already in DOM somewhere)
  // Adjust selectors to match your current markup if needed:
  // Example: container id: #metascorePanel or .metascore-panel
  function findExistingPanel() {
    return qs("#metascorePanel") || qs(".metascore-panel") || qs("[data-metascore-panel]") || qs("#upload-assistant-panel");
  }

  function wrapAsFloating(panelEl) {
    // If already wrapped, do nothing
    if (panelEl.closest(".metascore-float")) return panelEl.closest(".metascore-float");

    const wrapper = document.createElement("div");
    wrapper.className = "metascore-float";
    wrapper.id = "metascoreFloatWrap";

    const inner = document.createElement("div");
    inner.className = "metascore-inner";

    // Move the panel into inner wrapper
    panelEl.parentNode.insertBefore(wrapper, panelEl);
    inner.appendChild(panelEl);
    wrapper.appendChild(inner);

    return wrapper;
  }

  function setOpenState(isOpen) {
    localStorage.setItem(STORAGE_KEY, isOpen ? "1" : "0");
  }

  function getOpenState() {
    const v = localStorage.getItem(STORAGE_KEY);
    // default open on tool pages
    if (v === null) return true;
    return v === "1";
  }

  function applyVisibility(wrapper, isOpen) {
    if (isOpen) {
      wrapper.classList.remove("is-hidden");
    } else {
      wrapper.classList.add("is-hidden");
    }
  }

  function bindCloseButton(wrapper) {
    // Find close button inside metascore panel (X)
    // Adjust selector to match your close icon button.
    const closeBtn =
      qs("#metascoreClose", wrapper) ||
      qs(".metascore-close", wrapper) ||
      qs("[data-metascore-close]", wrapper) ||
      qs("#up-close-x", wrapper) ||
      qs("button[aria-label='Close']", wrapper);

    if (closeBtn && !closeBtn.__metascoreBound) {
      closeBtn.__metascoreBound = true;
      closeBtn.addEventListener("click", () => {
        setOpenState(false);
        applyVisibility(wrapper, false);
      });
    }
  }

  function init() {
    if (isExcludedPage()) return;

    const panel = findExistingPanel();
    if (!panel) {
        // Retry a few times in case panel is created dynamically
        if (!window._metascoreRetries) window._metascoreRetries = 0;
        if (window._metascoreRetries < 10) {
            window._metascoreRetries++;
            setTimeout(init, 200);
        }
        return;
    }

    const wrapper = wrapAsFloating(panel);

    const open = getOpenState();
    applyVisibility(wrapper, open);
    bindCloseButton(wrapper);
  }

  // DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
