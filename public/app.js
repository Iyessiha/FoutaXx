const currency = new Intl.NumberFormat("fr-FR");

const state = {
  dashboard: null,
  budget: null,
  courses: [],
  markets: [],
  portfolio: null,
  plans: [],
};

function money(value, suffix = "FCFA") {
  return `${currency.format(value)} ${suffix}`;
}

async function getJSON(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Erreur API: ${url}`);
  }
  return response.json();
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value;
  }
}

function switchPanel(name) {
  document.querySelectorAll(".tab-content").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.panel === name);
  });
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.tab === name);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderDashboard() {
  const { user, dashboard } = state.dashboard;
  setText("userName", user.name);
  setText("levelName", `N${user.level} · ${user.levelName}`);
  setText("xp", `${user.xp} XP`);
  setText("planName", user.plan);
  setText("dailyInsight", dashboard.dailyInsight);
  setText("score", `${dashboard.score}/100`);
  setText("budgetRemaining", money(dashboard.budgetRemaining, dashboard.currency));
  setText("portfolioValue", money(dashboard.portfolio.value, dashboard.currency));
  setText("portfolioRisk", `Risque ${dashboard.portfolio.risk.toLowerCase()}`);
  setText("nextLessonTitle", dashboard.nextLesson.title);
  setText(
    "nextLessonMeta",
    `${dashboard.nextLesson.duration} · ${dashboard.nextLesson.premium ? "premium" : "gratuit"}`,
  );
  setText("goalName", dashboard.primaryGoal.name);
  setText(
    "goalText",
    `${money(dashboard.primaryGoal.saved, dashboard.currency)} sur ${money(
      dashboard.primaryGoal.target,
      dashboard.currency,
    )}`,
  );
  setText("goalPercent", `${dashboard.primaryGoal.progress}%`);
  document.getElementById("goalBar").style.width = `${dashboard.primaryGoal.progress}%`;
}

function renderPlans() {
  const preview = document.getElementById("plansPreview");
  preview.innerHTML = state.plans
    .slice(0, 2)
    .map(
      (plan) => `
        <article class="plan-pill">
          <strong>${plan.name}</strong>
          <span>${plan.price}</span>
        </article>
      `,
    )
    .join("");

  document.getElementById("planList").innerHTML = state.plans
    .map(
      (plan) => `
        <article class="plan-card">
          <div class="row-top">
            <strong>${plan.name}</strong>
            <span>${plan.price}</span>
          </div>
          <p>${plan.summary}</p>
          <div class="market-meta">
            ${plan.features.map((feature) => `<span>${feature}</span>`).join("")}
          </div>
        </article>
      `,
    )
    .join("");
}

function renderBudget() {
  document.getElementById("budgetList").innerHTML = state.budget.categories
    .map((item) => {
      const width = Math.min(100, Math.round((item.spent / item.limit) * 100));
      return `
        <article class="budget-row">
          <div class="row-top">
            <strong>${item.name}</strong>
            <span>${money(item.spent)} / ${money(item.limit)}</span>
          </div>
          <div class="bar"><span class="tone-${item.tone}" style="width:${width}%"></span></div>
        </article>
      `;
    })
    .join("");

  document.getElementById("recentExpenses").innerHTML = state.budget.recent
    .map(
      (item) => `
        <div class="activity-item">
          <div>
            <strong>${item.label}</strong>
            <span>${item.category} · ${item.date}</span>
          </div>
          <strong>${money(item.amount)}</strong>
        </div>
      `,
    )
    .join("");
}

function renderCourses() {
  document.getElementById("courseList").innerHTML = state.courses
    .map(
      (course) => `
        <article class="course-card">
          <div class="row-top">
            <strong>${course.title}</strong>
            <span class="badge ${course.premium ? "premium" : "free"}">
              ${course.premium ? "Premium" : "Gratuit"}
            </span>
          </div>
          <p>${course.level} · ${course.duration} · Badge ${course.badge}</p>
          <div class="bar"><span class="tone-ok" style="width:${course.progress}%"></span></div>
        </article>
      `,
    )
    .join("");
}

function renderMarkets(list = state.markets) {
  document.getElementById("marketList").innerHTML = list
    .map(
      (market) => `
        <article class="market-card">
          <div class="row-top">
            <strong>${market.name}</strong>
            <span class="badge ${market.premium ? "premium" : "free"}">
              ${market.status}
            </span>
          </div>
          <p>${market.focus}</p>
          <div class="market-meta">
            <span>${market.region}</span>
            <span>${market.country}</span>
            <span>${market.currency}</span>
            <span>${market.index}</span>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderPortfolio() {
  setText(
    "riskScore",
    `${state.portfolio.riskScore}/100 · plus le score monte, plus il faut comprendre le risque.`,
  );
  document.getElementById("assetList").innerHTML = state.portfolio.assets
    .map(
      (asset) => `
        <article class="asset-card">
          <div class="asset-grid">
            <div>
              <strong>${asset.name}</strong>
              <p>${asset.type}</p>
            </div>
            <strong>${asset.weight}%</strong>
          </div>
          <div class="bar"><span class="tone-ok" style="width:${asset.weight}%"></span></div>
        </article>
      `,
    )
    .join("");
}

async function runSimulation() {
  const payload = {
    monthly: Number(document.getElementById("simMonthly").value),
    months: Number(document.getElementById("simMonths").value),
    annualRate: Number(document.getElementById("simRate").value),
  };
  const response = await fetch("/api/simulations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const result = await response.json();
  setText(
    "simulationResult",
    `Estimation: ${money(result.estimated)} apres ${result.months} mois. ${result.message}`,
  );
}

function bindEvents() {
  document.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", () => switchPanel(button.dataset.tab));
  });

  document.querySelectorAll("[data-open-panel]").forEach((button) => {
    button.addEventListener("click", () => switchPanel(button.dataset.openPanel));
  });

  document.getElementById("marketSearch").addEventListener("input", (event) => {
    const term = event.target.value.trim().toLowerCase();
    const filtered = state.markets.filter((market) =>
      [market.name, market.region, market.country, market.currency, market.index]
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
    renderMarkets(filtered);
  });

  document.getElementById("simulateButton").addEventListener("click", () => {
    document.getElementById("simulationModal").showModal();
  });

  document.getElementById("runSimulation").addEventListener("click", runSimulation);
}

async function init() {
  bindEvents();
  const [dashboard, budget, courses, markets, portfolio, subscriptions] = await Promise.all([
    getJSON("/api/dashboard"),
    getJSON("/api/budget"),
    getJSON("/api/courses"),
    getJSON("/api/markets"),
    getJSON("/api/portfolio"),
    getJSON("/api/subscriptions"),
  ]);

  state.dashboard = dashboard;
  state.budget = budget;
  state.courses = courses.courses;
  state.markets = markets.markets;
  state.portfolio = portfolio;
  state.plans = subscriptions.plans;

  renderDashboard();
  renderPlans();
  renderBudget();
  renderCourses();
  renderMarkets();
  renderPortfolio();
}

init().catch((error) => {
  console.error(error);
  document.body.insertAdjacentHTML(
    "afterbegin",
    `<div style="padding:12px;background:#e85d5d;color:white">Impossible de charger l'application.</div>`,
  );
});
