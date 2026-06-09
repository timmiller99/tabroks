/**
 * TabRoks — Popup Controller
 * by DigitalRoks (digitalroks.com)
 */

/* ── DOM References ──────────────────────────────────────── */
const tabCountEl  = document.getElementById("tabCount");
const statsPanelEl = document.getElementById("statsPanel");
const btnGroup    = document.getElementById("btnGroup");
const btnUngroup  = document.getElementById("btnUngroup");
const resultMsgEl = document.getElementById("resultMsg");
const legendGrid  = document.getElementById("legendGrid");

/* ── Color dot map (Chrome tabGroups colors) ─────────────── */
const COLOR_DOT = {
  purple: "dot-purple",
  orange: "dot-orange",
  blue:   "dot-blue",
  green:  "dot-green",
  pink:   "dot-pink",
  cyan:   "dot-cyan",
  yellow: "dot-yellow",
  red:    "dot-red",
  grey:   "dot-grey"
};

/* ── Utility: show result message ────────────────────────── */
function showResult(msg, type = "success") {
  resultMsgEl.textContent = msg;
  resultMsgEl.className = `result-msg show ${type}`;
  setTimeout(() => {
    resultMsgEl.className = "result-msg";
  }, 4000);
}

/* ── Utility: set buttons disabled state ─────────────────── */
function setButtonsDisabled(disabled) {
  btnGroup.disabled = disabled;
  btnUngroup.disabled = disabled;
}

/* ── Build category legend ───────────────────────────────── */
function buildLegend() {
  legendGrid.innerHTML = "";
  CATEGORIES.forEach(cat => {
    const item = document.createElement("div");
    item.className = "legend-item";
    item.innerHTML = `
      <span class="legend-dot ${COLOR_DOT[cat.color] || "dot-grey"}"></span>
      <span>${cat.name}</span>
    `;
    legendGrid.appendChild(item);
  });
}

/* ── Render stats panel ──────────────────────────────────── */
function renderStats(stats) {
  tabCountEl.textContent = `${stats.total} tab${stats.total !== 1 ? "s" : ""}`;

  const categories = Object.entries(stats.byCategory);

  if (categories.length === 0 && stats.uncategorized === stats.total) {
    statsPanelEl.innerHTML = `<div class="stats-loading">No categorized tabs found yet — click Auto-Group!</div>`;
    return;
  }

  let html = `<div class="stats-grid">`;

  categories
    .sort((a, b) => b[1] - a[1])
    .forEach(([name, count]) => {
      html += `
        <div class="stat-chip">
          <span>${name.split(" ")[0]}</span>
          <span class="count">${count}</span>
        </div>`;
    });

  if (stats.uncategorized > 0) {
    html += `
      <div class="stat-chip">
        <span>🔘 Other</span>
        <span class="count">${stats.uncategorized}</span>
      </div>`;
  }

  html += `</div>`;
  statsPanelEl.innerHTML = html;
}

/* ── Load initial stats ──────────────────────────────────── */
function loadStats() {
  chrome.runtime.sendMessage({ action: "getStats" }, (stats) => {
    if (chrome.runtime.lastError || stats?.error) {
      statsPanelEl.innerHTML = `<div class="stats-loading" style="color:#ef4444">Could not load tab data.</div>`;
      return;
    }
    renderStats(stats);
  });
}

/* ── Group button handler ────────────────────────────────── */
btnGroup.addEventListener("click", () => {
  setButtonsDisabled(true);
  btnGroup.innerHTML = `<span class="btn-icon loading">⚡</span><span>Grouping...</span>`;

  chrome.runtime.sendMessage({ action: "groupTabs" }, (result) => {
    setButtonsDisabled(false);
    btnGroup.innerHTML = `<span class="btn-icon">⚡</span><span>Auto-Group All Tabs</span>`;

    if (chrome.runtime.lastError || result?.error) {
      showResult(`Error: ${result?.error || chrome.runtime.lastError?.message}`, "error");
      return;
    }

    const groupCount = Object.keys(result.groups || {}).length;
    showResult(`✓ Grouped ${result.grouped} tabs into ${groupCount} categories. ${result.ungrouped} left ungrouped.`, "success");
    loadStats();
  });
});

/* ── Ungroup button handler ──────────────────────────────── */
btnUngroup.addEventListener("click", () => {
  setButtonsDisabled(true);
  btnUngroup.innerHTML = `<span class="btn-icon">✕</span><span>Ungrouping...</span>`;

  chrome.runtime.sendMessage({ action: "ungroupTabs" }, (result) => {
    setButtonsDisabled(false);
    btnUngroup.innerHTML = `<span class="btn-icon">✕</span><span>Ungroup All</span>`;

    if (chrome.runtime.lastError || result?.error) {
      showResult(`Error: ${result?.error || chrome.runtime.lastError?.message}`, "error");
      return;
    }

    showResult(`✓ Removed all groups. ${result.ungrouped} tabs are now flat.`, "success");
    loadStats();
  });
});

/* ── Init ────────────────────────────────────────────────── */
buildLegend();
loadStats();
