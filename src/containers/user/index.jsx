import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Lock,
  Save,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Stethoscope,
  Shield,
  Clock,
  Pencil,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getCurrentUser } from "../../services/authService";

// ─── Paleta FocusMap ──────────────────────────────────────────────────────────
// Laranja principal: #ff9e3d  |  Logo: #f86f26  |  Sombra: #b36f2b
// Complementar azul: #09acde  |  Composto: #3d6bff / #ff663d
// Fundo suave laranja: #fff4e8  |  Borda: #ffce85

const FM = {
  orange: "#ff9e3d",
  orangeDark: "#f86f26",
  orangeDeep: "#b36f2b",
  orangeLight: "#ffce85",
  orangePale: "#fff4e8",
  orangeBorder: "#ffbc54",
  blue: "#09acde",
  blueDark: "#0a7da3",
  blueLight: "#e6f7fd",
  blueBorder: "#7dd6ef",
  red: "#ff663d",
  redLight: "#fff0ed",
  redBorder: "#ffb5a3",
  green: "#3dff55",
  greenDark: "#1a9e2a",
  greenLight: "#edfff0",
  greenBorder: "#a3ffad",
  text: "#2a1a08",
  textMid: "#6f451b",
  textMuted: "#aa8661",
  bg: "#ffffff",
  bgSoft: "#faf7f4",
  border: "#ede0d0",
  borderLight: "#f5ece0",
};

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Subcomponentes ───────────────────────────────────────────────────────────

function Avatar({ name, size = 80 }) {
  const initials = name
    ? name
        .trim()
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${FM.orange} 0%, ${FM.orangeDark} 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.33,
        fontWeight: 700,
        color: "#fff",
        letterSpacing: "0.04em",
        flexShrink: 0,
        boxShadow: `0 0 0 4px ${FM.orangePale}, 0 0 0 6px ${FM.orangeBorder}`,
      }}
    >
      {initials}
    </div>
  );
}

function InputField({
  label,
  icon: Icon,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled,
  hint,
  rightElement,
}) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: FM.textMuted,
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      <div style={{ position: "relative" }}>
        {Icon && (
          <Icon
            size={15}
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: disabled ? FM.textMuted : FM.orange,
              pointerEvents: "none",
            }}
          />
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          style={{
            width: "100%",
            boxSizing: "border-box",
            paddingLeft: Icon ? 38 : 14,
            paddingRight: rightElement ? 44 : 14,
            paddingTop: 10,
            paddingBottom: 10,
            fontSize: 14,
            background: disabled ? FM.bgSoft : FM.bg,
            border: `1px solid ${disabled ? FM.borderLight : FM.border}`,
            borderRadius: 8,
            color: disabled ? FM.textMuted : FM.text,
            outline: "none",
            transition: "border-color 0.15s, box-shadow 0.15s",
            cursor: disabled ? "not-allowed" : "text",
          }}
          onFocus={(e) => {
            if (!disabled) {
              e.target.style.borderColor = FM.orange;
              e.target.style.boxShadow = `0 0 0 3px ${FM.orangePale}`;
            }
          }}
          onBlur={(e) => {
            e.target.style.borderColor = FM.border;
            e.target.style.boxShadow = "none";
          }}
        />
        {rightElement && (
          <div
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            {rightElement}
          </div>
        )}
      </div>
      {hint && (
        <p style={{ fontSize: 11, color: FM.textMuted, marginTop: 4 }}>
          {hint}
        </p>
      )}
    </div>
  );
}

function StatusBanner({ type, message, onDismiss }) {
  if (!message) return null;
  const ok = type === "success";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 14px",
        borderRadius: 8,
        background: ok ? FM.greenLight : FM.redLight,
        border: `1px solid ${ok ? FM.greenBorder : FM.redBorder}`,
        fontSize: 13,
        color: ok ? FM.greenDark : FM.red,
      }}
    >
      {ok ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
      <span style={{ flex: 1 }}>{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "inherit",
            padding: 0,
            lineHeight: 1,
            fontSize: 16,
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}

function SectionCard({ title, icon: Icon, children, accent }) {
  return (
    <div
      style={{
        background: FM.bg,
        border: `1px solid ${accent ? FM.orangeBorder : FM.border}`,
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "12px 20px",
          borderBottom: `1px solid ${accent ? FM.orangeBorder : FM.borderLight}`,
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: accent ? FM.orangePale : FM.bgSoft,
        }}
      >
        {Icon && (
          <Icon
            size={14}
            style={{ color: accent ? FM.orangeDark : FM.textMuted }}
          />
        )}
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: accent ? FM.orangeDeep : FM.textMuted,
          }}
        >
          {title}
        </span>
      </div>
      <div style={{ padding: "20px" }}>{children}</div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await getCurrentUser();
        if (data) {
          setUser(data);
          setForm({
            name: data.name || "",
            email: data.email || "",
            password: "",
          });
        } else {
          const cached = JSON.parse(localStorage.getItem("userData") || "null");
          if (cached) {
            setUser(cached);
            setForm({
              name: cached.name || "",
              email: cached.email || "",
              password: "",
            });
          }
        }
      } catch (err) {
        console.error("Erro ao buscar usuário:", err);
      } finally {
        setLoadingUser(false);
      }
    }
    fetchUser();
  }, []);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (status.message) setStatus({ type: "", message: "" });
  }

  async function handleSave() {
    if (!form.name.trim()) {
      setStatus({ type: "error", message: "O nome não pode estar vazio." });
      return;
    }
    try {
      setSaving(true);
      setStatus({ type: "", message: "" });

      const payload = { name: form.name };
      if (form.password.trim()) payload.password = form.password;

      await API.patch(`/User/UpdateUser/${user.id}`, payload);

      const updated = { ...user, name: form.name };
      setUser(updated);
      localStorage.setItem("userData", JSON.stringify(updated));
      setForm((prev) => ({ ...prev, password: "" }));
      setStatus({ type: "success", message: "Perfil atualizado com sucesso!" });
      setEditMode(false);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Erro ao atualizar perfil. Tente novamente.";
      setStatus({ type: "error", message: msg });
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setForm({ name: user?.name || "", email: user?.email || "", password: "" });
    setStatus({ type: "", message: "" });
    setEditMode(false);
  }

  if (loadingUser) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 240,
          gap: 10,
          color: FM.textMuted,
          fontSize: 14,
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            border: `2px solid ${FM.borderLight}`,
            borderTopColor: FM.orange,
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        Carregando perfil...
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 0 3rem" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 28,
          paddingTop: 4,
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "none",
            border: `1px solid ${FM.border}`,
            borderRadius: 8,
            padding: "7px 12px",
            fontSize: 13,
            color: FM.textMid,
            cursor: "pointer",
          }}
        >
          <ArrowLeft size={14} /> Voltar
        </button>
        <div style={{ flex: 1 }} />

        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: `linear-gradient(135deg, ${FM.orange}, ${FM.orangeDark})`,
              border: "none",
              borderRadius: 8,
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 600,
              color: "#fff",
              cursor: "pointer",
              boxShadow: `0 2px 8px ${FM.orangeLight}`,
            }}
          >
            <Pencil size={13} /> Editar perfil
          </button>
        ) : (
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={handleCancel}
              style={{
                background: "none",
                border: `1px solid ${FM.border}`,
                borderRadius: 8,
                padding: "7px 14px",
                fontSize: 13,
                color: FM.textMid,
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: saving
                  ? FM.orangeLight
                  : `linear-gradient(135deg, ${FM.orange}, ${FM.orangeDark})`,
                border: "none",
                borderRadius: 8,
                padding: "7px 16px",
                fontSize: 13,
                fontWeight: 600,
                color: saving ? FM.orangeDeep : "#fff",
                cursor: saving ? "not-allowed" : "pointer",
                boxShadow: saving ? "none" : `0 2px 8px ${FM.orangeLight}`,
              }}
            >
              <Save size={13} /> {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        )}
      </div>

      {/* Hero card */}
      <div
        style={{
          background: FM.bg,
          border: `1px solid ${FM.border}`,
          borderRadius: 16,
          padding: "28px 28px 24px",
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          gap: 24,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* faixa decorativa laranja no topo */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, ${FM.orangeDark}, ${FM.orange}, ${FM.orangeLight})`,
          }}
        />

        <Avatar name={user?.name} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <h1
            style={{
              fontSize: 21,
              fontWeight: 700,
              margin: "0 0 2px",
              color: FM.text,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {user?.name || "—"}
          </h1>
          <p style={{ fontSize: 13, color: FM.textMuted, margin: "0 0 12px" }}>
            {user?.email || "—"}
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {/* Badge tipo — azul complementar */}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                fontSize: 11,
                fontWeight: 600,
                background: FM.blueLight,
                color: FM.blueDark,
                border: `1px solid ${FM.blueBorder}`,
                borderRadius: 99,
                padding: "3px 10px",
              }}
            >
              <Stethoscope size={11} /> {user?.type || "Profissional"}
            </span>
            {/* Badge status — verde */}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                fontSize: 11,
                fontWeight: 600,
                background: FM.greenLight,
                color: FM.greenDark,
                border: `1px solid ${FM.greenBorder}`,
                borderRadius: 99,
                padding: "3px 10px",
              }}
            >
              <Shield size={11} /> Conta ativa
            </span>
          </div>
        </div>
      </div>

      {/* Banner de status */}
      {status.message && (
        <div style={{ marginBottom: 16 }}>
          <StatusBanner
            type={status.type}
            message={status.message}
            onDismiss={() => setStatus({ type: "", message: "" })}
          />
        </div>
      )}

      {/* Informações da conta */}
      <SectionCard title="Informações da conta" icon={User} accent>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <InputField
            label="Nome"
            icon={User}
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Seu nome completo"
            disabled={!editMode}
          />
          <InputField
            label="E-mail"
            icon={Mail}
            name="email"
            value={form.email}
            disabled
            hint="O e-mail não pode ser alterado."
          />
        </div>
      </SectionCard>

      {/* Alterar senha — só em modo edição */}
      {editMode && (
        <div style={{ marginTop: 16 }}>
          <SectionCard title="Alterar senha" icon={Lock} accent>
            <InputField
              label="Nova senha"
              icon={Lock}
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              placeholder="Deixe em branco para não alterar"
              hint="Mínimo de 8 caracteres recomendado."
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: FM.textMuted,
                    padding: 0,
                    display: "flex",
                  }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              }
            />
          </SectionCard>
        </div>
      )}

      {/* Segurança — somente leitura */}
      {!editMode && (
        <div style={{ marginTop: 16 }}>
          <SectionCard title="Segurança" icon={Shield}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: FM.text,
                    margin: "0 0 2px",
                  }}
                >
                  Senha
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: FM.textMuted,
                    margin: 0,
                    letterSpacing: "0.15em",
                  }}
                >
                  ••••••••••••
                </p>
              </div>
              <button
                onClick={() => setEditMode(true)}
                style={{
                  background: FM.orangePale,
                  border: `1px solid ${FM.orangeBorder}`,
                  borderRadius: 8,
                  padding: "6px 14px",
                  fontSize: 12,
                  fontWeight: 600,
                  color: FM.orangeDark,
                  cursor: "pointer",
                }}
              >
                Alterar
              </button>
            </div>
          </SectionCard>
        </div>
      )}

      {/* Rodapé */}
      <p
        style={{
          fontSize: 11,
          color: FM.textMuted,
          textAlign: "center",
          marginTop: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
        }}
      >
        <Clock size={11} />
        {user?.id ? `ID: ${user.id}` : "FocusMap · dados protegidos por LGPD"}
      </p>
    </div>
  );
}
