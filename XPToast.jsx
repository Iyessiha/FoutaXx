import { useEffect, useState } from "react";
import { useAuth, LEVELS, FOUTAX_THEME as T } from "../context/AuthContext";

// ─── Toast notifications XP ───────────────────────────────────────────────────
export function XPToast() {
  const { toast } = useAuth();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (toast) setVisible(true);
    else { const t = setTimeout(() => setVisible(false), 400); return () => clearTimeout(t); }
  }, [toast]);

  if (!visible && !toast) return null;

  const configs = {
    xp:      { bg: "rgba(232,160,32,0.15)", border: T.gold,     text: T.gold,     prefix: "+" },
    streak:  { bg: "rgba(232,160,32,0.12)", border: T.goldDark, text: T.goldDark, prefix: "🔥 +" },
    levelup: { bg: "rgba(61,207,142,0.12)", border: T.green,    text: T.green,    prefix: "🎉 " },
    badge:   { bg: "rgba(127,119,221,0.12)",border: "#7F77DD",  text: "#A89EEE",  prefix: "🏅 " },
    success: { bg: "rgba(61,207,142,0.12)", border: T.green,    text: T.green,    prefix: "✓ " },
  };
  const cfg = configs[toast?.type] || configs.xp;

  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 9999,
      background: T.navy, border: `1px solid ${cfg.border}`,
      borderRadius: 12, padding: "12px 16px",
      display: "flex", alignItems: "center", gap: 12,
      minWidth: 220, maxWidth: 320,
      opacity: toast ? 1 : 0,
      transform: toast ? "translateY(0)" : "translateY(16px)",
      transition: "opacity .3s, transform .3s",
      pointerEvents: "none",
      boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${cfg.border}22`,
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: T.white, lineHeight: 1.3, fontFamily: T.fonts.body }}>
          {toast?.msg}
        </div>
      </div>
      {toast?.xp > 0 && (
        <div style={{
          background: cfg.border, color: T.night, fontSize: 11,
          fontWeight: 800, padding: "4px 10px", borderRadius: 20,
          whiteSpace: "nowrap", flexShrink: 0, fontFamily: T.fonts.display,
        }}>
          {cfg.prefix}{toast.xp} XP
        </div>
      )}
    </div>
  );
}

// ─── Barre XP inline ──────────────────────────────────────────────────────────
export function XPBar({ xp, compact = false }) {
  const { getLevelInfo } = useAuth();
  const { current, next, progress, xpToNext } = getLevelInfo(xp);

  if (compact) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          width: 26, height: 26, borderRadius: "50%",
          background: "rgba(232,160,32,0.15)", border: `1px solid ${T.gold}44`,
          color: T.gold, fontSize: 10, fontWeight: 800,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, fontFamily: T.fonts.display,
        }}>
          N{current.level}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginBottom: 3 }}>
            <span style={{ color: T.white, fontWeight: 600, fontFamily: T.fonts.body }}>
              {current.icon} {current.name}
            </span>
            <span style={{ color: T.gray2, fontFamily: T.fonts.body }}>
              {xp.toLocaleString("fr-FR")} XP
            </span>
          </div>
          <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 4, height: 4 }}>
            <div style={{
              width: `${progress}%`, height: 4, borderRadius: 4,
              background: T.gold, transition: "width .6s ease",
            }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: T.navy, border: `1px solid rgba(255,255,255,0.07)`,
      borderRadius: 12, padding: "16px 18px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 42, height: 42, borderRadius: "50%",
            background: "rgba(232,160,32,0.12)", border: `1.5px solid ${T.gold}44`,
            color: T.gold, fontSize: 14, fontWeight: 800,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: T.fonts.display,
          }}>
            N{current.level}
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: T.white, fontFamily: T.fonts.display }}>
              {current.icon} {current.name}
            </div>
            <div style={{ fontSize: 11, color: T.gray2, fontFamily: T.fonts.body }}>
              Niveau {current.level} / 8
            </div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{ fontFamily: T.fonts.display, fontWeight: 700, color: T.white, fontSize: 18 }}>
            {xp.toLocaleString("fr-FR")}
          </span>
          <span style={{ fontSize: 12, color: T.gray2, fontFamily: T.fonts.body }}>
            {" "}/ {next ? next.xpMin.toLocaleString("fr-FR") : "MAX"} XP
          </span>
        </div>
      </div>
      <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 6, height: 8, marginBottom: 8 }}>
        <div style={{
          width: `${progress}%`, height: 8, borderRadius: 6,
          background: `linear-gradient(90deg, ${T.goldDark}, ${T.gold})`,
          transition: "width .6s ease",
          boxShadow: `0 0 8px ${T.gold}66`,
        }} />
      </div>
      {next && (
        <div style={{ fontSize: 11, color: T.gray2, fontFamily: T.fonts.body }}>
          {xpToNext.toLocaleString("fr-FR")} XP → {next.icon}{" "}
          <strong style={{ color: T.gold }}>{next.name}</strong>
        </div>
      )}
    </div>
  );
}

// ─── Badge niveau pill ────────────────────────────────────────────────────────
export function LevelBadge({ xp }) {
  const { getLevelInfo } = useAuth();
  const { current } = getLevelInfo(xp);
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: "rgba(232,160,32,0.12)", color: T.gold,
      border: `1px solid ${T.gold}44`,
      borderRadius: 20, padding: "3px 10px",
      fontSize: 11, fontWeight: 700, fontFamily: T.fonts.body,
    }}>
      {current.icon} {current.name}
    </span>
  );
}
