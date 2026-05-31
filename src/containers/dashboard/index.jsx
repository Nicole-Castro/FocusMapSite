import React, { useEffect, useState } from "react";
import { Users, Activity, PlusCircle, Calendar, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getTotalPatients } from "../../services/getPatient";
import { getSessionsByProfessional } from "../../services/sessionService";

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
  text:         "#2a1a08",
  textMid:      "#6f451b",
  textMuted:    "#aa8661",
  bg:           "#ffffff",
  bgSoft:       "#faf7f4",
  border:       "#ede0d0",
  borderLight:  "#f5ece0",
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalPatients: "-", sessions: "-" });
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("user");

  async function loadDashboardData() {
    try {
      setLoading(true);
      const patientsRes = await getTotalPatients();
      const totalPatients = patientsRes.total ?? 0;
      const sessionsRes = await getSessionsByProfessional(userId);
      const sessions = sessionsRes ?? [];
      setStats({ totalPatients, sessions: sessions.length });
    } catch (err) {
      console.error("Erro ao carregar dashboard:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  const cards = [
    {
      icon: Users,
      label: "Pacientes cadastrados",
      value: stats.totalPatients,
      accent: FM.blue,
      accentLight: FM.blueLight,
      accentBorder: FM.blueBorder,
      accentDark: FM.blueDark,
      onClick: () => navigate("/dashboard/pacientes"),
    },
    {
      icon: Activity,
      label: "Sessões realizadas",
      value: stats.sessions,
      accent: FM.orange,
      accentLight: FM.orangePale,
      accentBorder: FM.orangeBorder,
      accentDark: FM.orangeDark,
      onClick: () => navigate("/dashboard/historico-sessoes"),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: "4px 0 3rem" }}>

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <div style={{
        borderRadius: 16,
        padding: "32px 32px 28px",
        background: `linear-gradient(135deg, ${FM.orangeDark} 0%, ${FM.orange} 60%, ${FM.orangeLight} 100%)`,
        position: "relative",
        overflow: "hidden",
      }}>
        {/* círculos decorativos */}
        <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
        <div style={{ position: "absolute", bottom: -30, right: 60, width: 110, height: 110, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />

        <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.75)", margin: "0 0 6px" }}>
          FocusMap
        </p>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#fff", margin: "0 0 6px", lineHeight: 1.2 }}>
          Bem-vindo de volta
        </h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.82)", margin: "0 0 24px" }}>
          Acompanhe seus pacientes e sessões em tempo real
        </p>

        {/* Ações rápidas */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <button
            onClick={() => navigate("/dashboard/pacientes")}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              background: "#fff",
              border: "none", borderRadius: 8,
              padding: "9px 16px", fontSize: 13, fontWeight: 600,
              color: FM.orangeDark, cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            }}
          >
            <Users size={14} /> Ver Pacientes
          </button>
          <button
            onClick={() => navigate("/dashboard/historico-sessoes")}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              background: "rgba(255,255,255,0.18)",
              border: "1px solid rgba(255,255,255,0.35)",
              borderRadius: 8, padding: "9px 16px",
              fontSize: 13, fontWeight: 600,
              color: "#fff", cursor: "pointer",
            }}
          >
            <Calendar size={14} /> Sessões
          </button>
        </div>
      </div>

      {/* ── Stat cards ──────────────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
        {cards.map((card, i) => (
          <button
            key={i}
            onClick={card.onClick}
            style={{
              background: FM.bg,
              border: `1px solid ${FM.border}`,
              borderRadius: 14,
              padding: "22px 24px",
              textAlign: "left",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              transition: "border-color 0.15s, box-shadow 0.15s",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = card.accentBorder;
              e.currentTarget.style.boxShadow = `0 4px 16px ${card.accentLight}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = FM.border;
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {/* faixa lateral colorida */}
            <div style={{
              position: "absolute", left: 0, top: 0, bottom: 0, width: 4,
              background: `linear-gradient(180deg, ${card.accent}, ${card.accentDark})`,
              borderRadius: "14px 0 0 14px",
            }} />

            {/* Ícone */}
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: card.accentLight,
              border: `1px solid ${card.accentBorder}`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <card.icon size={20} style={{ color: card.accentDark }} />
            </div>

            {/* Valor + label */}
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: FM.textMuted, margin: "0 0 4px" }}>
                {card.label}
              </p>
              {loading ? (
                <div style={{ height: 36, width: 64, background: FM.borderLight, borderRadius: 6, animation: "pulse 1.4s ease-in-out infinite" }} />
              ) : (
                <p style={{ fontSize: 34, fontWeight: 700, color: FM.text, margin: 0, lineHeight: 1 }}>
                  {card.value}
                </p>
              )}
            </div>

            {/* Link */}
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 500, color: card.accentDark }}>
              Ver detalhes <ArrowRight size={12} />
            </div>
          </button>
        ))}
      </div>

      {/* ── Ação extra ──────────────────────────────────────────────────────── */}
      <div style={{
        background: FM.bg,
        border: `1px solid ${FM.border}`,
        borderRadius: 14,
        padding: "22px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
      }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: FM.text, margin: "0 0 4px" }}>
            Adicionar novo paciente
          </h3>
          <p style={{ fontSize: 13, color: FM.textMuted, margin: 0 }}>
            Cadastre rapidamente um novo paciente no sistema
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard/cadastro-paciente")}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            background: `linear-gradient(135deg, ${FM.orange}, ${FM.orangeDark})`,
            border: "none", borderRadius: 8,
            padding: "10px 20px", fontSize: 13, fontWeight: 600,
            color: "#fff", cursor: "pointer",
            boxShadow: `0 2px 10px ${FM.orangeLight}`,
            whiteSpace: "nowrap",
          }}
        >
          <PlusCircle size={16} /> Novo Paciente
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}