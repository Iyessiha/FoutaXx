import { useState } from "react";
import { AuthProvider, useAuth, FOUTAX_THEME as T } from "./context/AuthContext";
import { XPToast, XPBar } from "./components/XPToast";
import AuthPage from "./pages/AuthPage";
import UserProfile from "./pages/UserProfile";

// ─── Navbar FoutaX ────────────────────────────────────────────────────────────
function Navbar({ active, setActive }) {
  const { user, trackAction } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  const navItems = [
    { id: "dashboard",  label: "Marché",      icon: "📈" },
    { id: "cours",      label: "Apprendre",   icon: "🎓" },
    { id: "simulateur", label: "Simulateur",  icon: "💼" },
    { id: "premium",    label: "Premium",     icon: "👑" },
  ];

  return (
    <>
      <nav style={{
        background: T.night, height: 58, display: "flex",
        alignItems: "center", justifyContent: "space-between",
        padding: "0 24px", position: "sticky", top: 0, zIndex: 100,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 2px 20px rgba(0,0,0,0.3)",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 7, background: T.gold,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 800, color: T.night, fontFamily: T.fonts.display,
          }}>FX</div>
          <div style={{
            fontFamily: T.fonts.display, fontSize: 18, fontWeight: 800,
            color: T.white, letterSpacing: "-0.5px",
          }}>
            Fouta<span style={{ color: T.gold }}>X</span>
          </div>
        </div>

        {/* Nav items */}
        <div style={{ display: "flex", gap: 2 }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActive(item.id)} style={{
              background: active === item.id ? "rgba(232,160,32,0.12)" : "transparent",
              border: active === item.id ? `1px solid ${T.gold}33` : "1px solid transparent",
              color: active === item.id ? T.gold : "rgba(255,255,255,0.5)",
              fontSize: 12, fontWeight: active === item.id ? 700 : 400,
              padding: "6px 14px", borderRadius: 8,
              cursor: "pointer", fontFamily: T.fonts.body,
              transition: "all .2s", letterSpacing: "0.2px",
            }}>
              <span style={{ marginRight: 5 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        {/* Droite — XP + avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 150 }}>
            <XPBar xp={user?.xp || 0} compact />
          </div>
          <button
            onClick={() => setShowProfile(true)}
            aria-label="Ouvrir le profil"
            style={{
              width: 34, height: 34, borderRadius: "50%",
              background: T.gold, color: T.night, border: "none",
              fontSize: 12, fontWeight: 800, cursor: "pointer",
              fontFamily: T.fonts.display, flexShrink: 0,
              boxShadow: `0 0 0 2px rgba(232,160,32,0.3)`,
              transition: "all .2s",
            }}
          >
            {user?.avatar}
          </button>
        </div>
      </nav>

      {/* Overlay profil */}
      {showProfile && (
        <div onClick={() => setShowProfile(false)} style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.6)", zIndex: 200,
          display: "flex", justifyContent: "flex-end",
          alignItems: "flex-start", paddingTop: 66, paddingRight: 16,
        }}>
          <div onClick={e => e.stopPropagation()} style={{ width: 380 }}>
            <UserProfile onClose={() => setShowProfile(false)} />
          </div>
        </div>
      )}
    </>
  );
}

// ─── Page Dashboard ────────────────────────────────────────────────────────────
function DashboardPage({ setActive }) {
  const { user, trackAction } = useAuth();

  const metrics = [
    { label: "FoutaX Composite", val: "420.33", chg: "▲ +0.84%", up: true },
    { label: "FoutaX 10",        val: "197.33", chg: "▲ +0.72%", up: true },
    { label: "Volume",            val: "2.4 Mrd", chg: "FCFA",  up: null },
    { label: "Sociétés cotées",   val: "45",      chg: "UEMOA", up: null },
  ];

  const stocks = [
    { ticker: "SONATEL",  name: "Sonatel SA",       price: "29 000", chg: "+2.84%", up: true },
    { ticker: "PALM-CI",  name: "Palmci",            price: "4 800",  chg: "+1.50%", up: true },
    { ticker: "BOA-CI",   name: "Bank of Africa CI", price: "6 200",  chg: "-0.80%", up: false },
    { ticker: "SOLIBRA",  name: "Solibra",           price: "95 000", chg: "+0.40%", up: true },
    { ticker: "NESTLE-CI",name: "Nestlé CI",         price: "7 300",  chg: "-1.20%", up: false },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* Hero */}
      <div style={{
        background: T.navy, borderRadius: 14, padding: "28px 32px",
        marginBottom: 20, position: "relative", overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ position: "absolute", right: -30, top: -30, width: 200, height: 200, borderRadius: "50%", background: "rgba(232,160,32,0.04)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: `linear-gradient(to bottom, ${T.gold}, transparent)`, borderRadius: "14px 0 0 14px" }} />
        <div style={{
          background: "rgba(232,160,32,0.12)", color: T.gold,
          fontSize: 9, fontWeight: 700, padding: "3px 10px",
          borderRadius: 20, display: "inline-block", marginBottom: 10,
          letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: T.fonts.body,
        }}>
          🏦 Bourse Régionale · UEMOA
        </div>
        <h1 style={{
          fontFamily: T.fonts.display, color: T.white,
          fontSize: 26, fontWeight: 800, marginBottom: 8, letterSpacing: "-0.5px",
        }}>
          Bonjour, <span style={{ color: T.gold }}>{user?.name?.split(" ")[0]}</span> 👋
        </h1>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, lineHeight: 1.7, marginBottom: 20, fontFamily: T.fonts.body }}>
          Bienvenue sur FoutaX — le terrain fertile de votre richesse.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={() => setActive("simulateur")} style={{
            background: T.gold, color: T.night, border: "none",
            padding: "10px 20px", borderRadius: 8, fontSize: 12,
            fontWeight: 800, cursor: "pointer", fontFamily: T.fonts.display,
            letterSpacing: "0.3px",
          }}>
            Ouvrir le simulateur
          </button>
          <button onClick={() => setActive("cours")} style={{
            background: "transparent", color: "rgba(255,255,255,0.7)",
            border: "1px solid rgba(255,255,255,0.15)",
            padding: "10px 20px", borderRadius: 8, fontSize: 12,
            cursor: "pointer", fontFamily: T.fonts.body,
          }}>
            Commencer à apprendre
          </button>
        </div>
      </div>

      {/* Métriques */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 10, marginBottom: 20 }}>
        {metrics.map((m, i) => (
          <div key={i} style={{
            background: T.navy, border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 10, padding: "14px 16px",
          }}>
            <div style={{ fontSize: 10, color: T.gray2, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: T.fonts.body }}>{m.label}</div>
            <div style={{ fontFamily: T.fonts.display, fontSize: 20, fontWeight: 800, color: T.white }}>{m.val}</div>
            <div style={{ fontSize: 11, marginTop: 4, fontWeight: 600, fontFamily: T.fonts.body, color: m.up === true ? T.green : m.up === false ? T.red : T.gray2 }}>
              {m.chg}
            </div>
          </div>
        ))}
      </div>

      {/* Alerte premium */}
      <div onClick={() => setActive("premium")} style={{
        background: "rgba(232,160,32,0.06)", border: `1px solid ${T.gold}33`,
        borderRadius: 10, padding: "12px 16px", marginBottom: 20,
        display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
      }}>
        <span style={{ fontSize: 20 }}>🔔</span>
        <div style={{ flex: 1, fontSize: 13, color: T.gray2, fontFamily: T.fonts.body }}>
          <strong style={{ color: T.white }}>Alertes cours en temps réel</strong> — Ne manquez aucune opportunité.{" "}
          <span style={{ color: T.gold, fontWeight: 700 }}>Passer Premium →</span>
        </div>
      </div>

      {/* Tableau actifs */}
      <div style={{
        background: T.navy, border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 12, overflow: "hidden",
      }}>
        <div style={{
          padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.white, fontFamily: T.fonts.display }}>
            Actifs en vedette
          </div>
          <div style={{
            fontSize: 11, color: T.gold, fontWeight: 600,
            cursor: "pointer", fontFamily: T.fonts.body,
            display: "flex", alignItems: "center", gap: 4,
          }}
            onClick={() => setActive("premium")}
          >
            🔒 Données complètes Premium
          </div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.03)" }}>
              {["Ticker", "Société", "Cours (FCFA)", "Variation", "Analyser"].map((h, i) => (
                <th key={i} style={{
                  padding: "8px 20px", textAlign: "left", fontSize: 10,
                  fontWeight: 600, color: T.gray2, textTransform: "uppercase",
                  letterSpacing: "0.5px", fontFamily: T.fonts.body,
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stocks.map((s, i) => (
              <tr key={i} style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <td style={{ padding: "12px 20px", fontFamily: T.fonts.display, fontWeight: 800, fontSize: 13, color: T.white }}>{s.ticker}</td>
                <td style={{ padding: "12px 20px", fontSize: 12, color: T.gray2, fontFamily: T.fonts.body }}>{s.name}</td>
                <td style={{ padding: "12px 20px", fontSize: 13, fontWeight: 600, color: T.white, fontFamily: T.fonts.body, filter: i >= 3 ? "blur(5px)" : "none" }}>
                  {s.price} FCFA
                </td>
                <td style={{ padding: "12px 20px" }}>
                  <span style={{
                    background: s.up ? "rgba(61,207,142,0.12)" : "rgba(240,96,96,0.12)",
                    color: s.up ? T.green : T.red,
                    fontSize: 11, fontWeight: 700, padding: "3px 9px",
                    borderRadius: 20, fontFamily: T.fonts.body,
                  }}>
                    {s.up ? "▲" : "▼"} {s.chg}
                  </span>
                </td>
                <td style={{ padding: "12px 20px" }}>
                  <button
                    onClick={() => trackAction("ASSET_ANALYZE", { ticker: s.ticker })}
                    style={{
                      background: "rgba(232,160,32,0.1)", color: T.gold,
                      border: `1px solid ${T.gold}33`, padding: "5px 12px",
                      borderRadius: 6, fontSize: 11, fontWeight: 700,
                      cursor: "pointer", fontFamily: T.fonts.body,
                    }}
                  >
                    Analyser ↗
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Page Cours ───────────────────────────────────────────────────────────────
function CoursPage() {
  const { trackAction } = useAuth();
  const courses = [
    { id: "bases",    icon: "📈", level: "Débutant",      title: "Les bases des marchés africains", lessons: 5, free: true  },
    { id: "rapports", icon: "💰", level: "Débutant",      title: "Lire un rapport financier",       lessons: 4, free: true  },
    { id: "analyse",  icon: "🏦", level: "Intermédiaire", title: "Analyse fondamentale UEMOA",      lessons: 6, free: false },
    { id: "portfolio",icon: "📊", level: "Avancé",        title: "Stratégies de portefeuille",      lessons: 8, free: false },
  ];
  return (
    <div style={{ padding: 24 }}>
      <div style={{ fontFamily: T.fonts.display, fontSize: 22, fontWeight: 800, color: T.white, marginBottom: 4, letterSpacing: "-0.5px" }}>Académie FoutaX</div>
      <div style={{ fontSize: 13, color: T.gray2, fontFamily: T.fonts.body, marginBottom: 24 }}>Formations structurées pour maîtriser les marchés africains</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
        {courses.map(c => (
          <div key={c.id} style={{
            background: T.navy, border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, overflow: "hidden", cursor: "pointer",
            transition: "all .2s",
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = T.gold + "44"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"}
          >
            <div style={{
              height: 80, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 32, background: "rgba(255,255,255,0.03)", position: "relative",
            }}>
              {c.icon}
              {!c.free && <div style={{ position: "absolute", top: 8, right: 8, fontSize: 14 }}>🔒</div>}
            </div>
            <div style={{ padding: "14px 16px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4, color: c.level === "Débutant" ? T.green : c.level === "Intermédiaire" ? T.gold : T.red, fontFamily: T.fonts.body }}>
                {c.level}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.white, marginBottom: 8, lineHeight: 1.3, fontFamily: T.fonts.display }}>
                {c.title}
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, color: T.gray2, fontFamily: T.fonts.body }}>{c.lessons} leçons</span>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10, fontFamily: T.fonts.body,
                  background: c.free ? "rgba(61,207,142,0.12)" : "rgba(232,160,32,0.12)",
                  color: c.free ? T.green : T.gold,
                }}>
                  {c.free ? "Gratuit" : "Premium"}
                </span>
              </div>
              <button
                onClick={() => c.free && trackAction("COURSE_COMPLETE", { courseId: c.id })}
                style={{
                  width: "100%", marginTop: 12, padding: "8px",
                  background: c.free ? T.gold : "rgba(232,160,32,0.1)",
                  color: c.free ? T.night : T.gold,
                  border: c.free ? "none" : `1px solid ${T.gold}33`,
                  borderRadius: 7, fontSize: 12, fontWeight: 700,
                  cursor: "pointer", fontFamily: T.fonts.display,
                }}
              >
                {c.free ? "Commencer" : "Débloquer avec Premium"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page Simulateur ──────────────────────────────────────────────────────────
function SimulateurPage() {
  const { user, trackAction } = useAuth();
  const [qty, setQty] = useState(5);
  const [ticker, setTicker] = useState("SONATEL");
  const [msg, setMsg] = useState("");

  const prices = { SONATEL: 29000, "BOA-CI": 6200, "PALM-CI": 4800, SOLIBRA: 95000, "NESTLE-CI": 7300 };
  const cash = user?.portfolio?.cash ?? 500000;
  const total = (prices[ticker] || 0) * qty;

  const buy = () => {
    if (total > cash) { setMsg("❌ Liquidités insuffisantes"); return; }
    trackAction("PORTFOLIO_BUY", {
      portfolio: { cash: cash - total, positions: [...(user?.portfolio?.positions || []), { ticker, qty, price: prices[ticker] }] }
    });
    setMsg(`✓ Acheté ${qty} × ${ticker}`);
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontFamily: T.fonts.display, fontSize: 22, fontWeight: 800, color: T.white, letterSpacing: "-0.5px" }}>Simulateur</div>
        <div style={{
          background: "rgba(232,160,32,0.1)", border: `1px solid ${T.gold}33`,
          borderRadius: 8, padding: "7px 16px",
          fontSize: 12, color: T.gold, fontFamily: T.fonts.body, fontWeight: 600,
        }}>
          💰 Capital : <span style={{ fontFamily: T.fonts.display, fontSize: 15, fontWeight: 800 }}>500 000 FCFA</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        {/* Ordre */}
        <div style={{ background: T.navy, border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.white, marginBottom: 16, fontFamily: T.fonts.display }}>
            ➕ Passer un ordre
          </div>
          {[
            { label: "Action", children: (
              <select value={ticker} onChange={e => setTicker(e.target.value)} style={{ width: "100%", padding: "10px 12px", background: T.night, color: T.white, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 13, fontFamily: T.fonts.body, outline: "none" }}>
                {Object.entries(prices).map(([k, v]) => <option key={k} value={k}>{k} — {v.toLocaleString("fr-FR")} FCFA</option>)}
              </select>
            )},
            { label: "Quantité", children: (
              <input type="number" value={qty} min={1} max={100} onChange={e => setQty(+e.target.value)} style={{ width: "100%", padding: "10px 12px", background: T.night, color: T.white, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 13, fontFamily: T.fonts.body, outline: "none" }} />
            )},
          ].map((f, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 10, color: T.gray2, textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 5, fontFamily: T.fonts.body }}>{f.label}</label>
              {f.children}
            </div>
          ))}
          <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "10px 12px", marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: T.gray2, marginBottom: 4, fontFamily: T.fonts.body }}>
              <span>Prix unitaire</span><span>{(prices[ticker] || 0).toLocaleString("fr-FR")} FCFA</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 700, color: T.white, fontFamily: T.fonts.display }}>
              <span>Total estimé</span><span>{total.toLocaleString("fr-FR")} FCFA</span>
            </div>
          </div>
          <button onClick={buy} style={{
            width: "100%", padding: 11, background: T.green, color: T.night,
            border: "none", borderRadius: 8, fontSize: 13, fontWeight: 800,
            cursor: "pointer", fontFamily: T.fonts.display,
          }}>
            Acheter
          </button>
          {msg && <div style={{ fontSize: 12, textAlign: "center", marginTop: 8, color: msg.includes("❌") ? T.red : T.green, fontFamily: T.fonts.body }}>{msg}</div>}
        </div>

        {/* Portefeuille */}
        <div style={{ background: T.navy, border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.white, marginBottom: 16, fontFamily: T.fonts.display }}>
            💼 Mon portefeuille
          </div>
          {!user?.portfolio?.positions?.length ? (
            <div style={{ textAlign: "center", padding: "28px 0", color: T.gray2, fontSize: 13, fontFamily: T.fonts.body }}>
              Aucune position ouverte.<br />Achetez votre première action !
            </div>
          ) : user.portfolio.positions.map((p, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div>
                <div style={{ fontFamily: T.fonts.display, fontWeight: 700, color: T.white, fontSize: 13 }}>{p.ticker}</div>
                <div style={{ fontSize: 11, color: T.gray2, fontFamily: T.fonts.body }}>{p.qty} actions</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.white, fontFamily: T.fonts.body }}>{(p.qty * (prices[p.ticker] || p.price)).toLocaleString("fr-FR")} FCFA</div>
              </div>
            </div>
          ))}
          <div style={{ background: "rgba(232,160,32,0.08)", border: `1px solid ${T.gold}22`, borderRadius: 8, padding: "10px 14px", marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 12, color: T.gray2, fontFamily: T.fonts.body }}>Liquidités</div>
            <div style={{ fontFamily: T.fonts.display, fontSize: 16, fontWeight: 800, color: T.gold }}>{cash.toLocaleString("fr-FR")} FCFA</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page Premium ─────────────────────────────────────────────────────────────
function PremiumPage() {
  const { upgradePlan } = useAuth();
  const plans = [
    { name: "Gratuit", price: "0", per: "", cta: "Plan actuel", disabled: true, features: ["4 modules de base", "Données différées 15min", "Simulateur 500k FCFA", "❌ Alertes cours", "❌ Analyses IA", "❌ Certification"] },
    { name: "Gold", price: "4 990", per: "/mois", cta: "Choisir Gold", featured: true, features: ["12 modules complets", "Données quasi temps réel", "Simulateur illimité", "10 alertes/mois", "Analyses IA quotidiennes", "Certification FoutaX"] },
    { name: "Pro", price: "9 990", per: "/mois", cta: "Choisir Pro", features: ["Tout Gold inclus", "Données live temps réel", "API données UEMOA", "Alertes illimitées", "Signaux de trading IA", "Support dédié 1-to-1"] },
  ];
  return (
    <div style={{ padding: 24 }}>
      <div style={{ textAlign: "center", background: T.navy, borderRadius: 14, padding: "36px 24px", marginBottom: 24, border: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontSize: 36, marginBottom: 10 }}>👑</div>
        <div style={{ fontFamily: T.fonts.display, fontSize: 24, fontWeight: 800, color: T.white, marginBottom: 8, letterSpacing: "-0.5px" }}>
          Débloquez tout FoutaX
        </div>
        <div style={{ fontSize: 13, color: T.gray2, fontFamily: T.fonts.body, marginBottom: 28, maxWidth: 400, margin: "0 auto 28px" }}>
          Accédez aux données avancées, analyses IA et formations certifiantes.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 12, maxWidth: 560, margin: "0 auto" }}>
          {plans.map(p => (
            <div key={p.name} style={{
              background: p.featured ? "rgba(232,160,32,0.08)" : T.night,
              border: p.featured ? `2px solid ${T.gold}44` : "1px solid rgba(255,255,255,0.08)",
              borderRadius: 12, padding: "20px 16px", textAlign: "center", position: "relative",
            }}>
              {p.featured && (
                <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: T.gold, color: T.night, fontSize: 10, fontWeight: 800, padding: "3px 12px", borderRadius: 20, whiteSpace: "nowrap", fontFamily: T.fonts.display }}>
                  ⭐ Plus populaire
                </div>
              )}
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: T.gray2, marginBottom: 8, fontFamily: T.fonts.body }}>{p.name}</div>
              <div style={{ fontFamily: T.fonts.display, fontSize: 26, fontWeight: 800, color: T.white }}>
                {p.price}<span style={{ fontSize: 12, fontWeight: 400, color: T.gray2, fontFamily: T.fonts.body }}> FCFA{p.per}</span>
              </div>
              <ul style={{ listStyle: "none", textAlign: "left", margin: "14px 0", padding: 0 }}>
                {p.features.map((f, i) => (
                  <li key={i} style={{ fontSize: 11, color: f.startsWith("❌") ? T.gray2 : T.gray2, padding: "3px 0", fontFamily: T.fonts.body, display: "flex", gap: 6 }}>
                    <span style={{ color: f.startsWith("❌") ? T.gray3 : T.green }}>{f.startsWith("❌") ? "✕" : "✓"}</span>
                    {f.replace("❌ ", "")}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => !p.disabled && upgradePlan(p.name.toLowerCase())}
                disabled={p.disabled}
                style={{
                  width: "100%", padding: "10px", borderRadius: 8,
                  background: p.disabled ? "rgba(255,255,255,0.05)" : p.featured ? T.gold : "rgba(232,160,32,0.1)",
                  color: p.disabled ? T.gray2 : p.featured ? T.night : T.gold,
                  border: "none", fontSize: 12, fontWeight: 800,
                  cursor: p.disabled ? "not-allowed" : "pointer",
                  fontFamily: T.fonts.display,
                }}
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Loading screen ────────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: T.night }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 52, height: 52, borderRadius: 12, background: T.gold,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: T.fonts.display, fontSize: 20, fontWeight: 800, color: T.night,
          margin: "0 auto 16px",
        }}>FX</div>
        <div style={{ fontFamily: T.fonts.display, color: T.white, fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 6 }}>
          Fouta<span style={{ color: T.gold }}>X</span>
        </div>
        <div style={{ fontSize: 12, color: T.gray2, fontFamily: T.fonts.body }}>Chargement…</div>
      </div>
    </div>
  );
}

// ─── Dashboard principal ───────────────────────────────────────────────────────
function Dashboard() {
  const [active, setActive] = useState("dashboard");
  const pages = {
    dashboard:  <DashboardPage setActive={setActive} />,
    cours:      <CoursPage />,
    simulateur: <SimulateurPage />,
    premium:    <PremiumPage />,
  };
  return (
    <div style={{ minHeight: "100vh", background: T.night }}>
      <Navbar active={active} setActive={setActive} />
      {pages[active]}
    </div>
  );
}

// ─── App Root ──────────────────────────────────────────────────────────────────
function AppInner() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return (
    <>
      {isAuthenticated ? <Dashboard /> : <AuthPage />}
      <XPToast />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0A1628; color: #FFFFFF; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0A1628; }
        ::-webkit-scrollbar-thumb { background: #2A3A55; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #E8A020; }
        input::placeholder { color: rgba(255,255,255,0.2); }
        select option { background: #0F1F38; }
      `}</style>
      <AppInner />
    </AuthProvider>
  );
}
