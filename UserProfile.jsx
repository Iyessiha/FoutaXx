import { useAuth, LEVELS, FOUTAX_THEME as T } from "../context/AuthContext";

export const ALL_BADGES = [
  { id: "early_adopter", icon: "🚀", name: "Early Adopter",  desc: "Parmi les 1000 premiers inscrits" },
  { id: "premier_achat", icon: "📈", name: "Premier achat",  desc: "Première action en simulateur" },
  { id: "studieux",      icon: "📚", name: "Studieux",        desc: "Premier module complété" },
  { id: "analyste",      icon: "🔍", name: "Analyste",        desc: "5 actifs analysés" },
  { id: "predicteur",    icon: "🎯", name: "Prédicteur",      desc: "3 défis hebdo gagnés" },
  { id: "top10",         icon: "🏆", name: "Top 10",          desc: "Top 10 du leaderboard FoutaX" },
  { id: "streak_7",      icon: "🔥", name: "Flamme",          desc: "7 jours consécutifs" },
  { id: "certifie",      icon: "🎓", name: "Certifié FoutaX", desc: "Tous modules gratuits complétés" },
  { id: "rentier",       icon: "💰", name: "Rentier",         desc: "Portefeuille simulateur +20%" },
  { id: "chartiste",     icon: "📊", name: "Chartiste",       desc: "50 graphiques consultés" },
  { id: "uemoa_pro",     icon: "🌍", name: "UEMOA Pro",       desc: "Actifs analysés dans 5 pays" },
  { id: "legend",        icon: "👑", name: "Légende FoutaX",  desc: "Niveau 8 atteint" },
];

const PLAN_CONFIG = {
  free:  { bg: "rgba(255,255,255,0.06)", text: T.gray2,    label: "Gratuit",  border: "rgba(255,255,255,0.1)" },
  gold:  { bg: "rgba(232,160,32,0.15)", text: T.gold,     label: "👑 Gold",   border: T.gold + "44" },
  pro:   { bg: "rgba(61,207,142,0.12)", text: T.green,    label: "⚡ Pro",    border: T.green + "44" },
};

export default function UserProfile({ onClose }) {
  const { user, logout, isPremium, getLevelInfo } = useAuth();
  if (!user) return null;

  const { current, next, progress, xpToNext } = getLevelInfo(user.xp || 0);
  const earned = ALL_BADGES.filter(b => user.badges?.includes(b.id));
  const plan = PLAN_CONFIG[user.plan] || PLAN_CONFIG.free;

  const stats = [
    { label: "Modules",   value: user.completedCourses?.length || 0, total: 12 },
    { label: "Actifs",    value: user.analyzedAssets?.length || 0,   total: 45 },
    { label: "Badges",    value: earned.length,                       total: ALL_BADGES.length },
    { label: "Streak",    value: `${user.streak || 0}j`,             total: null },
  ];

  return (
    <div style={{
      background: T.night, border: `1px solid rgba(255,255,255,0.07)`,
      borderRadius: 16, overflow: "hidden", maxWidth: 420,
      boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
    }}>
      {/* Header */}
      <div style={{ background: T.navy, padding: "20px 20px 16px", position: "relative" }}>
        {/* Barre or décorative top */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${T.gold}, transparent)` }} />
        {onClose && (
          <button onClick={onClose} aria-label="Fermer" style={{
            position: "absolute", top: 14, right: 14,
            background: "rgba(255,255,255,0.07)", border: "none",
            color: T.gray2, width: 28, height: 28, borderRadius: "50%",
            cursor: "pointer", fontSize: 14, display: "flex",
            alignItems: "center", justifyContent: "center",
          }}>✕</button>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 50, height: 50, borderRadius: "50%",
            background: T.gold, color: T.night,
            fontSize: 17, fontWeight: 800, fontFamily: T.fonts.display,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, boxShadow: `0 0 0 3px rgba(232,160,32,0.2)`,
          }}>
            {user.avatar}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: T.white, fontSize: 15, fontWeight: 700, fontFamily: T.fonts.display }}>
              {user.name}
            </div>
            <div style={{ color: T.gray2, fontSize: 12, marginTop: 2, fontFamily: T.fonts.body }}>
              {user.email}
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 7, flexWrap: "wrap" }}>
              <span style={{
                background: plan.bg, color: plan.text, border: `1px solid ${plan.border}`,
                fontSize: 10, fontWeight: 700, padding: "2px 9px", borderRadius: 20, fontFamily: T.fonts.body,
              }}>{plan.label}</span>
              <span style={{
                background: "rgba(232,160,32,0.1)", color: T.gold, border: `1px solid ${T.gold}33`,
                fontSize: 10, padding: "2px 9px", borderRadius: 20, fontFamily: T.fonts.body,
              }}>{current.icon} {current.name}</span>
              {user.country && (
                <span style={{
                  background: "rgba(255,255,255,0.05)", color: T.gray2,
                  fontSize: 10, padding: "2px 9px", borderRadius: 20, fontFamily: T.fonts.body,
                }}>{user.country}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 20px" }}>
        {/* XP Bar */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 7 }}>
            <span style={{ color: T.gray2, fontFamily: T.fonts.body }}>Progression — Niveau {current.level}</span>
            <span style={{ color: T.gold, fontWeight: 700, fontFamily: T.fonts.display }}>
              {(user.xp || 0).toLocaleString("fr-FR")} XP
            </span>
          </div>
          <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 6, height: 7 }}>
            <div style={{
              width: `${progress}%`, height: 7, borderRadius: 6,
              background: `linear-gradient(90deg, ${T.goldDark}, ${T.gold})`,
              boxShadow: `0 0 6px ${T.gold}55`, transition: "width .6s",
            }} />
          </div>
          {next && (
            <div style={{ fontSize: 10, color: T.gray2, marginTop: 5, fontFamily: T.fonts.body }}>
              {xpToNext.toLocaleString("fr-FR")} XP → {next.icon} <strong style={{ color: T.gold }}>{next.name}</strong>
            </div>
          )}
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, marginBottom: 16 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "8px 6px", textAlign: "center" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: T.white, fontFamily: T.fonts.display }}>
                {s.value}{s.total && <span style={{ fontSize: 10, color: T.gray2, fontWeight: 400 }}>/{s.total}</span>}
              </div>
              <div style={{ fontSize: 9, color: T.gray2, marginTop: 2, fontFamily: T.fonts.body }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Parcours niveaux */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: T.gray2, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10, fontFamily: T.fonts.body }}>
            Parcours investisseur
          </div>
          <div style={{ display: "flex", gap: 3, overflowX: "auto", paddingBottom: 4 }}>
            {LEVELS.map(lvl => {
              const done    = (user.xp || 0) >= lvl.xpMin;
              const isCurr  = current.level === lvl.level;
              return (
                <div key={lvl.level} style={{ textAlign: "center", minWidth: 44, flex: 1 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: "50%", margin: "0 auto 4px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: isCurr ? 14 : 11,
                    background: isCurr ? "rgba(61,207,142,0.15)" : done ? "rgba(232,160,32,0.12)" : "rgba(255,255,255,0.04)",
                    border: isCurr ? `2px solid ${T.green}` : done ? `1px solid ${T.gold}44` : "1px solid rgba(255,255,255,0.08)",
                    color: isCurr ? T.green : done ? T.gold : T.gray2,
                    opacity: done || isCurr ? 1 : 0.4,
                  }}>
                    {done || isCurr ? lvl.icon : lvl.level}
                  </div>
                  <div style={{ fontSize: 8, color: T.gray2, lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: T.fonts.body }}>
                    {lvl.name.split(" ")[0]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Badges */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: T.gray2, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10, fontFamily: T.fonts.body }}>
            Badges ({earned.length} / {ALL_BADGES.length})
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {ALL_BADGES.map(badge => {
              const ok = user.badges?.includes(badge.id);
              return (
                <div key={badge.id} title={badge.desc} style={{
                  width: 36, height: 36, borderRadius: 8,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                  background: ok ? "rgba(232,160,32,0.12)" : "rgba(255,255,255,0.04)",
                  border: ok ? `1px solid ${T.gold}44` : "1px solid rgba(255,255,255,0.06)",
                  opacity: ok ? 1 : 0.3, filter: ok ? "none" : "grayscale(1)", cursor: "help",
                }}>
                  {badge.icon}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upsell si pas premium */}
        {!isPremium && (
          <div style={{
            background: "rgba(232,160,32,0.08)", border: `1px solid ${T.gold}33`,
            borderRadius: 10, padding: "12px 14px", marginBottom: 14,
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <span style={{ fontSize: 22 }}>👑</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.gold, fontFamily: T.fonts.display }}>Passer à Gold</div>
              <div style={{ fontSize: 11, color: T.gray2, fontFamily: T.fonts.body }}>12 modules · Alertes IA · Leaderboard complet</div>
            </div>
            <button style={{
              background: T.gold, color: T.night, border: "none",
              padding: "6px 12px", borderRadius: 8, fontSize: 11,
              fontWeight: 800, cursor: "pointer", fontFamily: T.fonts.display,
              whiteSpace: "nowrap",
            }}>
              4 990 FCFA/mois
            </button>
          </div>
        )}

        <button onClick={logout} style={{
          width: "100%", padding: "10px",
          background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 8, fontSize: 13, cursor: "pointer", color: T.gray2,
          fontFamily: T.fonts.body, transition: "all .2s",
        }}>
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
