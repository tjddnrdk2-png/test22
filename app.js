const BUDGET_LIMIT = 500000; // 단위: 천원 (5억원)
const SHEET_EMBED_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQfrNTv1bh_AFuwbmByMmqmc631_MwbPnLJZEf3cBjxH0A0g6bG7-6v7hSM_f_ygX8rFykhw5dOTLo9/pubhtml?gid=0&single=true&widget=true&headers=false";

const state = { applications: [], filter: "all", query: "" };
const grid = document.querySelector("#cardGrid");
const emptyState = document.querySelector("#emptyState");

const formatNumber = new Intl.NumberFormat("ko-KR");
const verdict = (budget) => budget <= BUDGET_LIMIT ? "approved" : "rejected";

function renderSummary() {
  const approved = state.applications.filter(item => verdict(item.예산) === "approved").length;
  const total = state.applications.reduce((sum, item) => sum + item.예산, 0);
  document.querySelector("#totalCount").textContent = state.applications.length;
  document.querySelector("#approvedCount").textContent = approved;
  document.querySelector("#rejectedCount").textContent = state.applications.length - approved;
  document.querySelector("#totalBudget").textContent = (total / 100000).toFixed(1);
}

function renderCards() {
  const query = state.query.trim().toLowerCase();
  const visible = state.applications.filter(item => {
    const status = verdict(item.예산);
    const matchesFilter = state.filter === "all" || state.filter === status;
    const matchesQuery = !query || `${item.지자체명} ${item.사업명}`.toLowerCase().includes(query);
    return matchesFilter && matchesQuery;
  });

  grid.innerHTML = visible.map(item => {
    const status = verdict(item.예산);
    const approved = status === "approved";
    const difference = Math.abs(BUDGET_LIMIT - item.예산);
    return `
      <article class="application-card" style="--status-color:${approved ? "var(--green)" : "var(--red)"};--status-bg:${approved ? "var(--green-soft)" : "var(--red-soft)"}">
        <div class="card-top">
          <span class="municipality">${item.지자체명}</span>
          <span class="status">${approved ? "승인" : "반려"}</span>
        </div>
        <h3>${item.사업명}</h3>
        <div class="card-bottom">
          <div>
            <span class="budget-label">신청 예산</span>
            <strong class="budget">${formatNumber.format(item.예산)}<small>천원</small></strong>
          </div>
          <span class="difference">한도 ${formatNumber.format(difference)}천원 ${approved ? "이내" : "초과"}</span>
        </div>
      </article>`;
  }).join("");
  emptyState.hidden = visible.length > 0;
}

async function loadApplications() {
  try {
    const response = await fetch("data/applications.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    state.applications = await response.json();
    renderSummary();
    renderCards();
  } catch (error) {
    grid.innerHTML = `<p class="empty-state">신청 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>`;
    console.error("신청목록 로드 실패:", error);
  }
}

document.querySelector("#searchInput").addEventListener("input", event => {
  state.query = event.target.value;
  renderCards();
});

document.querySelectorAll("[data-filter]").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-filter]").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    state.filter = button.dataset.filter;
    renderCards();
  });
});

if (SHEET_EMBED_URL) {
  const frame = document.querySelector("#sheetFrame");
  frame.src = SHEET_EMBED_URL;
  frame.classList.add("ready");
  document.querySelector("#sheetPlaceholder").hidden = true;
}

loadApplications();
