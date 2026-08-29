import React, { useState } from "react";
import { createUser } from "../../services/createUser";
import { User, Mail, Lock, AlertCircle, Brain } from "lucide-react";

// ─── Paleta FocusMap ──────────────────────────────────────────────────────────
const FM = {
  orange:       "#ff9e3d",
  orangeDark:   "#f86f26",
  orangeDeep:   "#b36f2b",
  orangeLight:  "#ffce85",
  orangePale:   "#fff4e8",
  orangeBorder: "#ffbc54",
  blue:         "#09acde",
  blueDark:     "#0a7da3",
  blueLight:    "#e6f7fd",
  blueBorder:   "#7dd6ef",
  red:          "#ff663d",
  redLight:     "#fff0ed",
  redBorder:    "#ffb5a3",
  yellow:       "#e8bb25",
  yellowLight:  "#fffbe6",
  yellowBorder: "#f5da7a",
  green:        "#3dff55",
  greenDark:    "#1a9e2a",
  greenLight:   "#edfff0",
  greenBorder:  "#a3ffad",
  text:         "#2a1a08",
  textMid:      "#6f451b",
  textMuted:    "#aa8661",
  bg:           "#ffffff",
  bgSoft:       "#faf7f4",
  border:       "#ede0d0",
  borderLight:  "#f5ece0",
};

// ─── Input ────────────────────────────────────────────────────────────────────
function Input({ icon: Icon, label, error, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{
        display: "block", fontSize: 11, fontWeight: 600,
        letterSpacing: "0.09em", textTransform: "uppercase",
        color: FM.textMuted, marginBottom: 6,
      }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <Icon size={15} style={{
          position: "absolute", left: 12, top: "50%",
          transform: "translateY(-50%)",
          color: error ? FM.red : focused ? FM.orange : FM.textMuted,
          pointerEvents: "none",
          transition: "color 0.15s",
        }} />
        <input
          {...props}
          onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
          style={{
            width: "100%", boxSizing: "border-box",
            paddingLeft: 38, paddingRight: 14,
            paddingTop: 10, paddingBottom: 10,
            fontSize: 14,
            background: error ? FM.redLight : FM.bgSoft,
            border: `1px solid ${error ? FM.red : focused ? FM.orange : FM.border}`,
            borderRadius: 8,
            color: FM.text,
            outline: "none",
            transition: "border-color 0.15s, box-shadow 0.15s",
            boxShadow: focused && !error ? `0 0 0 3px ${FM.orangePale}` : "none",
          }}
        />
      </div>
      {error && (
        <p style={{ fontSize: 11, color: FM.red, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function CadastroUsuario() {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({ nome: "", email: "", senha: "" });

  // Força da senha
  const getPasswordStrength = (password) => {
    if (!password) return null;
    let score = 0;
    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*]/.test(password)) score++;
    if (score <= 1) return { label: "Fraca", color: FM.red, bg: FM.redLight, width: "33%" };
    if (score === 2) return { label: "Média", color: FM.yellow, bg: FM.yellowLight, width: "66%" };
    return { label: "Forte", color: FM.greenDark, bg: FM.greenLight, width: "100%" };
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nome.trim()) newErrors.nome = "Nome obrigatório";
    if (!formData.email.trim()) newErrors.email = "Email obrigatório";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Email inválido";
    const p = formData.senha;
    if (!p) newErrors.senha = "Senha obrigatória";
    else if (p.length < 6 || !/[A-Z]/.test(p) || !/[a-z]/.test(p) || !/[0-9]/.test(p) || !/[!@#$%^&*]/.test(p))
      newErrors.senha = "Senha não atende aos requisitos";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setSuccess(false);
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    const res = await createUser({ name: formData.nome, email: formData.email, password: formData.senha });
    setLoading(false);
    if (res.success) {
      setFormData({ nome: "", email: "", senha: "" });
      setErrors({});
      setSuccess(true);
    } else {
      setErrors((prev) => ({ ...prev, form: res.message || "Erro ao cadastrar" }));
    }
  };

  const strength = getPasswordStrength(formData.senha);
  const previewInitial = formData.nome?.trim().charAt(0)?.toUpperCase() || "U";

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "4px 0 3rem" }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: FM.text, margin: "0 0 4px" }}>
          Cadastro de Usuário
        </h1>
        <p style={{ fontSize: 13, color: FM.textMuted, margin: 0 }}>
          Crie um novo usuário no sistema FocusMap
        </p>
      </div>

      {/* Banner de erro global */}
      {errors.form && (
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: FM.redLight, border: `1px solid ${FM.redBorder}`,
          borderRadius: 8, padding: "10px 14px", marginBottom: 16,
          fontSize: 13, color: FM.red,
        }}>
          <AlertCircle size={15} /> {errors.form}
        </div>
      )}

      {/* Banner de sucesso */}
      {success && (
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: FM.greenLight, border: `1px solid ${FM.greenBorder}`,
          borderRadius: 8, padding: "10px 14px", marginBottom: 16,
          fontSize: 13, color: FM.greenDark,
        }}>
          ✓ Usuário cadastrado com sucesso!
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>

        {/* ── Formulário ───────────────────────────────────────────────────── */}
        <div style={{
          background: FM.bg,
          border: `1px solid ${FM.border}`,
          borderRadius: 14, padding: "24px",
          display: "flex", flexDirection: "column", gap: 20,
        }}>
          <Input
            icon={User} label="Nome" name="nome" type="text"
            value={formData.nome} onChange={handleInputChange}
            error={errors.nome} placeholder="Nome completo"
          />

          <Input
            icon={Mail} label="E-mail" name="email" type="email"
            value={formData.email} onChange={handleInputChange}
            error={errors.email} placeholder="email@exemplo.com"
          />

          <div>
            <Input
              icon={Lock} label="Senha" name="senha" type="password"
              value={formData.senha} onChange={handleInputChange}
              error={errors.senha} placeholder="••••••••"
            />

            {/* Barra de força da senha */}
            {strength && (
              <div style={{ marginTop: 8 }}>
                <div style={{ height: 4, background: FM.borderLight, borderRadius: 99, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: strength.width,
                    background: strength.color,
                    borderRadius: 99,
                    transition: "width 0.3s ease",
                  }} />
                </div>
                <p style={{ fontSize: 11, color: strength.color, marginTop: 4, fontWeight: 600 }}>
                  Força da senha: {strength.label}
                </p>
              </div>
            )}

            {/* Requisitos */}
            {formData.senha && (
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 3 }}>
                {[
                  ["Mínimo 6 caracteres", formData.senha.length >= 6],
                  ["Letra maiúscula", /[A-Z]/.test(formData.senha)],
                  ["Letra minúscula", /[a-z]/.test(formData.senha)],
                  ["Número", /[0-9]/.test(formData.senha)],
                  ["Caractere especial (!@#$%)", /[!@#$%^&*]/.test(formData.senha)],
                ].map(([req, ok]) => (
                  <p key={req} style={{ fontSize: 11, margin: 0, color: ok ? FM.greenDark : FM.textMuted, display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ fontSize: 13 }}>{ok ? "✓" : "○"}</span> {req}
                  </p>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%", padding: "11px 0",
              background: loading
                ? FM.orangeLight
                : `linear-gradient(135deg, ${FM.orange}, ${FM.orangeDark})`,
              border: "none", borderRadius: 8,
              fontSize: 14, fontWeight: 700,
              color: loading ? FM.orangeDeep : "#fff",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : `0 2px 10px ${FM.orangeLight}`,
              transition: "opacity 0.15s",
            }}
          >
            {loading ? "Cadastrando..." : "Cadastrar Usuário"}
          </button>
        </div>

        {/* ── Preview ──────────────────────────────────────────────────────── */}
        <div style={{
          borderRadius: 14, padding: "28px 24px",
          background: `linear-gradient(145deg, ${FM.orangeDark} 0%, ${FM.orange} 55%, ${FM.orangeLight} 100%)`,
          display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 24,
          position: "relative", overflow: "hidden",
          minHeight: 280,
        }}>
          {/* círculos decorativos */}
          <div style={{ position: "absolute", top: -30, right: -30, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.09)" }} />
          <div style={{ position: "absolute", bottom: -20, left: 20, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />

          <div>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", margin: "0 0 14px" }}>
              Preview do usuário
            </p>

            {/* Avatar + info */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                border: "2px solid rgba(255,255,255,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, fontWeight: 700, color: "#fff",
                flexShrink: 0,
              }}>
                {previewInitial}
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {formData.nome || "Nome do usuário"}
                </p>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {formData.email || "email@exemplo.com"}
                </p>
              </div>
            </div>

            {/* Badge monitoramento */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: 99, padding: "5px 12px",
              fontSize: 11, fontWeight: 600, color: "#fff",
            }}>
              <Brain size={11} /> Monitoramento EEG habilitado
            </div>
          </div>

          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", margin: 0, lineHeight: 1.5 }}>
            Este usuário poderá ser monitorado pelo FocusMap com dados EEG em tempo real.
          </p>
        </div>
      </div>

      <style>{`
        input::placeholder { color: ${FM.textMuted}; opacity: 0.7; }
      `}</style>
    </div>
  );
}
