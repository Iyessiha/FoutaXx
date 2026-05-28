import { useState } from "react";
import { useAuth, FOUTAX_THEME as T } from "../context/AuthContext";

const COUNTRIES = [
  { code: "CI", name: "Côte d'Ivoire" }, { code: "SN", name: "Sénégal" },
  { code: "ML", name: "Mali" },          { code: "BF", name: "Burkina Faso" },
  { code: "TG", name: "Togo" },          { code: "BJ", name: "Bénin" },
  { code: "GN", name: "Guinée" },        { code: "NE", name: "Niger" },
  { code: "GW", name: "Guinée-Bissau" }, { code: "OTHER", name: "Autre" },
];

function validate(form, mode) {
  const e = {};
  if (mode === "register") {
    if (!form.name || form.name.trim().length < 2) e.name = "Nom trop court (min. 2 caractères)";
    if (form.password !== form.confirm) e.confirm = "Les mots de passe ne correspondent pas";
  }
  if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email invalide";
  if (!form.password || form.password.length < 8) e.password = "Mot de passe trop court (min. 8 caractères)";
  return e;
}

function Field({ label, type = "text", value, onChange, error, placeholder, children }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: T.gray2, marginBottom: 5, fontFamily: T.fonts.body, textTransform: "uppercase", letterSpacing: "0.5px" }}>
        {label}
      </label>
      {children || (
        <input
          type={type} value={value} onChange={onChange} placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%", padding: "11px 14px", borderRadius: 8, fontSize: 13,
            fontFamily: T.fonts.body, outline: "none", transition: "all .2s",
            background: T.navy, color: T.white,
            border: `1.5px solid ${error ? T.red : focused ? T.gold : "#2A3A55"}`,
          }}
        />
      )}
      {error && <div style={{ fontSize: 11, color: T.red, marginTop: 4, fontFamily: T.fonts.body }}>{error}</div>}
    </div>
  );
}

function RegisterForm({ onSwitch, onSuccess }) {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", country: "CI" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    const errs = validate(form, "register");
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true); setServerError("");
    try { await register(form); onSuccess?.(); }
    catch (e) { setServerError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: T.fonts.display, fontSize: 26, fontWeight: 800, color: T.white, marginBottom: 6, letterSpacing: "-0.5px" }}>
          Créer mon compte
        </div>
        <div style={{ fontSize: 13, color: T.gray2, fontFamily: T.fonts.body }}>
          Rejoignez des milliers d'investisseurs UEMOA
        </div>
      </div>

      {serverError && (
        <div style={{ background: "rgba(240,96,96,0.12)", border: `1px solid ${T.red}`, borderRadius: 8, padding: "10px 14px", fontSize: 12, color: T.red, marginBottom: 16, fontFamily: T.fonts.body }}>
          {serverError}
        </div>
      )}

      <Field label="Nom complet" value={form.name} onChange={set("name")} error={errors.name} placeholder="Ex : Kofi Asante" />
      <Field label="Email" type="email" value={form.email} onChange={set("email")} error={errors.email} placeholder="vous@exemple.com" />

      <Field label="Pays" error={errors.country}>
        <select value={form.country} onChange={set("country")} style={{
          width: "100%", padding: "11px 14px", borderRadius: 8, fontSize: 13,
          fontFamily: T.fonts.body, background: T.navy, color: T.white,
          border: `1.5px solid #2A3A55`, outline: "none",
        }}>
          {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
        </select>
      </Field>

      <Field label="Mot de passe" type="password" value={form.password} onChange={set("password")} error={errors.password} placeholder="Min. 8 caractères" />
      <Field label="Confirmer" type="password" value={form.confirm} onChange={set("confirm")} error={errors.confirm} placeholder="Répéter le mot de passe" />

      <button onClick={submit} disabled={loading} style={{
        width: "100%", padding: "13px", borderRadius: 8,
        background: loading ? T.goldDark : T.gold,
        color: T.night, border: "none", fontSize: 14, fontWeight: 800,
        cursor: loading ? "not-allowed" : "pointer",
        fontFamily: T.fonts.display, letterSpacing: "0.5px", marginBottom: 16,
        transition: "all .2s",
      }}>
        {loading ? "Création en cours…" : "Créer mon compte gratuitement"}
      </button>

      <div style={{ textAlign: "center", fontSize: 13, color: T.gray2, fontFamily: T.fonts.body }}>
        Déjà un compte ?{" "}
        <span onClick={onSwitch} style={{ color: T.gold, cursor: "pointer", fontWeight: 600 }}>Se connecter</span>
      </div>
    </div>
  );
}

function LoginForm({ onSwitch, onSuccess }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    const errs = validate(form, "login");
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true); setServerError("");
    try { await login(form); onSuccess?.(); }
    catch (e) { setServerError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: T.fonts.display, fontSize: 26, fontWeight: 800, color: T.white, marginBottom: 6, letterSpacing: "-0.5px" }}>
          Bon retour 👋
        </div>
        <div style={{ fontSize: 13, color: T.gray2, fontFamily: T.fonts.body }}>
          Connectez-vous à votre espace FoutaX
        </div>
      </div>

      {serverError && (
        <div style={{ background: "rgba(240,96,96,0.12)", border: `1px solid ${T.red}`, borderRadius: 8, padding: "10px 14px", fontSize: 12, color: T.red, marginBottom: 16, fontFamily: T.fonts.body }}>
          {serverError}
        </div>
      )}

      <Field label="Email" type="email" value={form.email} onChange={set("email")} error={errors.email} placeholder="vous@exemple.com" />
      <div onKeyDown={e => e.key === "Enter" && submit()}>
        <Field label="Mot de passe" type="password" value={form.password} onChange={set("password")} error={errors.password} placeholder="Votre mot de passe" />
      </div>

      <div style={{ textAlign: "right", marginBottom: 18, marginTop: -6 }}>
        <span style={{ fontSize: 12, color: T.gold, cursor: "pointer", fontFamily: T.fonts.body }}>Mot de passe oublié ?</span>
      </div>

      <button onClick={submit} disabled={loading} style={{
        width: "100%", padding: "13px", borderRadius: 8,
        background: loading ? T.goldDark : T.gold,
        color: T.night, border: "none", fontSize: 14, fontWeight: 800,
        cursor: loading ? "not-allowed" : "pointer",
        fontFamily: T.fonts.display, letterSpacing: "0.5px", marginBottom: 16,
        transition: "all .2s",
      }}>
        {loading ? "Connexion…" : "Se connecter"}
      </button>

      <div style={{ textAlign: "center", fontSize: 13, color: T.gray2, fontFamily: T.fonts.body }}>
        Pas encore de compte ?{" "}
        <span onClick={onSwitch} style={{ color: T.gold, cursor: "pointer", fontWeight: 600 }}>Créer un compte gratuit</span>
      </div>
    </div>
  );
}

export default function AuthPage({ onSuccess }) {
  const [mode, setMode] = useState("login");

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: T.fonts.body }}>
      {/* Panel gauche — branding */}
      <div style={{
        flex: 1, background: T.night, display: "flex",
        flexDirection: "column", justifyContent: "center",
        padding: "48px 44px", position: "relative", overflow: "hidden",
      }}>
        {/* Déco géométrique */}
        <div style={{ position: "absolute", top: -60, right: -60, width: 240, height: 240, borderRadius: "50%", background: "rgba(232,160,32,0.04)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, left: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(232,160,32,0.03)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, right: 0, width: 4, height: "100%", background: `linear-gradient(to bottom, ${T.gold}, transparent)` }} />

        {/* Logo */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10, background: T.gold,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: T.fonts.display, fontSize: 16, fontWeight: 800, color: T.night,
            }}>FX</div>
            <div style={{ fontFamily: T.fonts.display, fontSize: 28, fontWeight: 800, color: T.white, letterSpacing: "-1px" }}>
              Fouta<span style={{ color: T.gold }}>X</span>
            </div>
          </div>
          <div style={{ fontSize: 10, letterSpacing: "3px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", fontFamily: T.fonts.body }}>
            INVEST · LEARN · GROW
          </div>
        </div>

        <div style={{ fontFamily: T.fonts.display, fontSize: 22, fontWeight: 700, color: T.white, lineHeight: 1.3, marginBottom: 14, letterSpacing: "-0.5px" }}>
          Le terrain fertile<br />de <span style={{ color: T.gold }}>votre richesse</span>
        </div>

        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, marginBottom: 36, fontFamily: T.fonts.body }}>
          La première plateforme fintech éducative<br />dédiée aux marchés boursiers africains.
        </div>

        {[
          { icon: "📈", text: "45 sociétés cotées · données UEMOA" },
          { icon: "🎓", text: "12 modules de formation structurés" },
          { icon: "🎮", text: "Simulateur gamifié · 500 000 FCFA virtuels" },
          { icon: "🤖", text: "Analyse IA sur chaque actif" },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(232,160,32,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>
              {item.icon}
            </div>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontFamily: T.fonts.body }}>{item.text}</span>
          </div>
        ))}

        <div style={{ marginTop: 36, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", gap: 28 }}>
          {[["5 000+", "membres actifs"], ["Gratuit", "pour débuter"], ["8 pays", "UEMOA"]].map(([val, lbl], i) => (
            <div key={i}>
              <div style={{ fontFamily: T.fonts.display, color: T.gold, fontSize: 18, fontWeight: 700 }}>{val}</div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, fontFamily: T.fonts.body }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Panel droit — formulaire */}
      <div style={{
        width: 460, background: T.navy,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px 36px",
      }}>
        <div style={{ width: "100%", maxWidth: 370 }}>
          {mode === "login"
            ? <LoginForm onSwitch={() => setMode("register")} onSuccess={onSuccess} />
            : <RegisterForm onSwitch={() => setMode("login")} onSuccess={onSuccess} />}

          <div style={{ marginTop: 28, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.07)", fontSize: 11, color: "rgba(255,255,255,0.25)", textAlign: "center", lineHeight: 1.7, fontFamily: T.fonts.body }}>
            En continuant, vous acceptez nos Conditions d'utilisation.<br />
            Vos données sont protégées et ne sont jamais revendues.
          </div>
        </div>
      </div>
    </div>
  );
}
