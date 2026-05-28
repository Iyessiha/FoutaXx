import { createContext, useContext, useEffect, useState, useCallback } from "react";

// ─── Thème FoutaX ─────────────────────────────────────────────────────────────
export const FOUTAX_THEME = {
  night:    "#0A1628",
  navy:     "#0F1F38",
  navy2:    "#162840",
  gold:     "#E8A020",
  goldDark: "#C88A10",
  goldPale: "#FBF0DC",
  green:    "#3DCF8E",
  red:      "#F06060",
  ivory:    "#F5F2EC",
  gray1:    "#E8E4DC",
  gray2:    "#9CA3AF",
  gray3:    "#6B7280",
  white:    "#FFFFFF",
  fonts: {
    display: "'Syne', sans-serif",
    body:    "'DM Sans', sans-serif",
  },
};

// ─── Niveaux ──────────────────────────────────────────────────────────────────
export const LEVELS = [
  { level: 1, name: "Épargnant",         xpMin: 0,     icon: "🌱", color: "#9CA3AF" },
  { level: 2, name: "Initié UEMOA",      xpMin: 500,   icon: "📖", color: "#6B7280" },
  { level: 3, name: "Analyste Junior",   xpMin: 1000,  icon: "🔍", color: "#3DCF8E" },
  { level: 4, name: "Analyste Confirmé", xpMin: 1500,  icon: "📊", color: "#3DCF8E" },
  { level: 5, name: "Trader",            xpMin: 2500,  icon: "⚡", color: "#E8A020" },
  { level: 6, name: "Gérant",            xpMin: 4000,  icon: "💼", color: "#E8A020" },
  { level: 7, name: "Expert FoutaX",     xpMin: 6000,  icon: "🏅", color: "#C88A10" },
  { level: 8, name: "Légende",           xpMin: 10000, icon: "👑", color: "#E8A020" },
];

export const XP_REWARDS = {
  LOGIN_DAILY:      50,
  COURSE_COMPLETE:  200,
  QUIZ_PASS:        100,
  ASSET_ANALYZE:    30,
  PORTFOLIO_BUY:    20,
  CHALLENGE_WIN:    500,
  CHALLENGE_SUBMIT: 80,
  PROFILE_COMPLETE: 150,
  REFERRAL:         300,
  STREAK_BONUS:     25,
};

export function getLevelInfo(xp) {
  let current = LEVELS[0], next = LEVELS[1];
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xpMin) {
      current = LEVELS[i];
      next = LEVELS[i + 1] || null;
      break;
    }
  }
  const progress = next
    ? Math.round(((xp - current.xpMin) / (next.xpMin - current.xpMin)) * 100)
    : 100;
  return { current, next, progress, xpToNext: next ? next.xpMin - xp : 0 };
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast]     = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("foutax_user");
    if (stored) { try { setUser(JSON.parse(stored)); } catch {} }
    setLoading(false);
  }, []);

  const persist = useCallback((u) => {
    setUser(u);
    localStorage.setItem("foutax_user", JSON.stringify(u));
  }, []);

  const showToast = (msg, xp, type = "xp") => {
    setToast({ msg, xp, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Auth ──────────────────────────────────────────────────────────────────
  const register = useCallback(async ({ name, email, password, country = "CI" }) => {
    const newUser = {
      id: crypto.randomUUID(), name, email, country,
      avatar: name.slice(0, 2).toUpperCase(),
      plan: "free", xp: 0, badges: [], streak: 0,
      lastLogin: new Date().toISOString(),
      joinedAt: new Date().toISOString(),
      portfolio: { cash: 500000, positions: [] },
      completedCourses: [], completedQuizzes: [],
      analyzedAssets: [], weeklyChallenge: null,
    };
    persist(newUser);
    showToast("Bienvenue sur FoutaX !", XP_REWARDS.PROFILE_COMPLETE, "success");
    return newUser;
  }, [persist]);

  const login = useCallback(async ({ email, password }) => {
    const stored = localStorage.getItem("foutax_user");
    if (!stored) throw new Error("Aucun compte trouvé. Veuillez vous inscrire.");
    const u = JSON.parse(stored);
    if (u.email !== email) throw new Error("Email ou mot de passe incorrect.");
    const today = new Date();
    const diff = Math.floor((today - new Date(u.lastLogin)) / 86400000);
    let streak = diff === 1 ? (u.streak || 0) + 1 : diff > 1 ? 1 : u.streak;
    const updated = { ...u, lastLogin: today.toISOString(), streak };
    persist(updated);
    if (diff === 1) showToast(`Streak ${streak}j 🔥`, XP_REWARDS.STREAK_BONUS * Math.min(streak, 7), "streak");
    return addXP(updated, XP_REWARDS.LOGIN_DAILY);
  }, [persist]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("foutax_user");
  }, []);

  // ── XP ────────────────────────────────────────────────────────────────────
  const addXP = useCallback(async (base, amount, reason = "") => {
    const u = base || user;
    if (!u) return;
    const oldLevel = getLevelInfo(u.xp).current.level;
    const newXP = (u.xp || 0) + amount;
    const newLevel = getLevelInfo(newXP).current;
    const updated = { ...u, xp: newXP };
    persist(updated);
    if (newLevel.level > oldLevel)
      showToast(`Niveau ${newLevel.level} débloqué ! ${newLevel.icon} ${newLevel.name}`, amount, "levelup");
    else if (reason)
      showToast(reason, amount, "xp");
    return updated;
  }, [user, persist]);

  const earnBadge = useCallback((id, name) => {
    if (!user || user.badges.includes(id)) return;
    const updated = { ...user, badges: [...user.badges, id] };
    persist(updated);
    showToast(`Badge débloqué : ${name} !`, 0, "badge");
  }, [user, persist]);

  const trackAction = useCallback(async (action, payload = {}) => {
    if (!user) return;
    let updated = { ...user };
    let xp = 0;
    switch (action) {
      case "ASSET_ANALYZE":
        if (!updated.analyzedAssets.includes(payload.ticker)) {
          updated.analyzedAssets = [...updated.analyzedAssets, payload.ticker];
          xp = XP_REWARDS.ASSET_ANALYZE;
          if (updated.analyzedAssets.length >= 5) earnBadge("analyste", "Analyste");
        }
        break;
      case "COURSE_COMPLETE":
        if (!updated.completedCourses.includes(payload.courseId)) {
          updated.completedCourses = [...updated.completedCourses, payload.courseId];
          xp = XP_REWARDS.COURSE_COMPLETE;
          if (updated.completedCourses.length === 1) earnBadge("studieux", "Studieux");
          if (updated.completedCourses.length >= 4) earnBadge("certifie", "Certifié FoutaX");
        }
        break;
      case "PORTFOLIO_BUY":
        xp = XP_REWARDS.PORTFOLIO_BUY;
        if (!updated.portfolio.positions?.length) earnBadge("premier_achat", "Premier achat");
        updated.portfolio = payload.portfolio;
        break;
      case "CHALLENGE_SUBMIT":
        xp = XP_REWARDS.CHALLENGE_SUBMIT;
        updated.weeklyChallenge = payload.prediction;
        break;
    }
    if (xp > 0) { persist(updated); await addXP(updated, xp); }
    else persist(updated);
  }, [user, persist, addXP, earnBadge]);

  const upgradePlan = useCallback((plan) => {
    if (!user) return;
    persist({ ...user, plan });
    showToast(`Plan ${plan.toUpperCase()} activé 🎉`, 500, "success");
  }, [user, persist]);

  return (
    <AuthContext.Provider value={{
      user, loading, toast,
      register, login, logout,
      addXP, earnBadge, trackAction, upgradePlan,
      getLevelInfo,
      isAuthenticated: !!user,
      isPremium: user?.plan === "gold" || user?.plan === "pro",
      isPro: user?.plan === "pro",
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être dans AuthProvider");
  return ctx;
}
