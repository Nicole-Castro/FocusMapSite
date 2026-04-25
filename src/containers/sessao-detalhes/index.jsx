import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BarChart2,
  Calendar,
  Clock,
  User,
  Activity,
  Zap,
  Brain,
  RefreshCw,
} from "lucide-react";
import {
  getSessionById,
  getSessionDataById,
} from "../../services/sessionService";

// ─── Paleta FocusMap ──────────────────────────────────────────────────────────
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
  purple: "#773dff",
  purpleLight: "#f0ebff",
  purpleBorder: "#c4adff",
  yellow: "#e8bb25",
  yellowLight: "#fffbe6",
  yellowBorder: "#f5da7a",
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

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (d) =>
  new Date(d).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const formatTime = (d) =>
  new Date(d).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

function attColor(val) {
  if (val >= 75)
    return { bg: FM.greenLight, border: FM.greenBorder, text: FM.greenDark };
  if (val >= 50)
    return { bg: FM.yellowLight, border: FM.yellowBorder, text: FM.yellow };
  return { bg: FM.redLight, border: FM.redBorder, text: FM.red };
}

// ─── Subcomponentes ───────────────────────────────────────────────────────────
function InfoCard({ icon: Icon, label, value, accent }) {
  const bg = accent ? FM.orangePale : FM.bgSoft;
  const border = accent ? FM.orangeBorder : FM.border;
  const ic = accent ? FM.orange : FM.textMuted;
  return (
    <div
      style={{
        background: FM.bg,
        border: `1px solid ${border}`,
        borderRadius: 12,
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        flex: 1,
        minWidth: 160,
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 9,
          background: bg,
          border: `1px solid ${border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={17} style={{ color: ic }} />
      </div>
      <div style={{ minWidth: 0 }}>
        <p
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: FM.textMuted,
            margin: "0 0 2px",
          }}
        >
          {label}
        </p>
        <p
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: FM.text,
            margin: 0,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {value ?? "—"}
        </p>
      </div>
    </div>
  );
}

function WaveChip({ label, value }) {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}
    >
      <span
        style={{
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.07em",
          textTransform: "uppercase",
          color: FM.textMuted,
        }}
      >
        {label}
      </span>
      <span style={{ fontSize: 13, fontWeight: 700, color: FM.text }}>
        {value ?? "—"}
      </span>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function SessaoDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [sessionData, setSessionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [sessionRes, dataRes] = await Promise.all([
          getSessionById(id),
          getSessionDataById(id),
        ]);
        if (!sessionRes) {
          setNotFound(true);
          return;
        }
        setSession(sessionRes);
        setSessionData(dataRes ?? []);
      } catch (err) {
        console.error(err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: 240,
          gap: 12,
          color: FM.textMuted,
          fontSize: 14,
        }}
      >
        <RefreshCw
          size={32}
          style={{ color: FM.orange, animation: "spin 0.8s linear infinite" }}
        />
        Carregando sessão...
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );

  if (notFound)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: 240,
          gap: 8,
          color: FM.red,
          fontSize: 14,
        }}
      >
        <Activity size={32} style={{ color: FM.red }} />
        Sessão não encontrada.
      </div>
    );

  // Métricas agregadas
  const avgAtt = sessionData.length
    ? Math.round(
        sessionData.reduce((s, d) => s + (d.attention_value ?? 0), 0) /
          sessionData.length,
      )
    : null;
  const avgMed = sessionData.length
    ? Math.round(
        sessionData.reduce((s, d) => s + (d.meditation_value ?? 0), 0) /
          sessionData.length,
      )
    : null;

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "4px 0 3rem",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <button
          onClick={() => navigate("/dashboard/historico-sessoes")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 12,
            color: FM.textMuted,
            padding: 0,
          }}
        >
          <ArrowLeft size={13} /> Histórico de Sessões
        </button>

        <h1
          style={{ fontSize: 20, fontWeight: 700, color: FM.text, margin: 0 }}
        >
          Detalhes da Sessão
        </h1>

        <button
          onClick={() => navigate(`/dashboard/sessao/${id}`)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "9px 16px",
            fontSize: 13,
            fontWeight: 600,
            background: `linear-gradient(135deg, ${FM.orange}, ${FM.orangeDark})`,
            border: "none",
            borderRadius: 8,
            color: "#fff",
            cursor: "pointer",
            boxShadow: `0 2px 8px ${FM.orangeLight}`,
          }}
        >
          <BarChart2 size={14} /> Ver Dashboard
        </button>
      </div>

      {/* ── Info cards ──────────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <InfoCard
          icon={User}
          label="Paciente"
          value={session.patient_name}
          accent
        />
        <InfoCard
          icon={Calendar}
          label="Início"
          value={formatDate(session.session_start_time)}
        />
        <InfoCard
          icon={Calendar}
          label="Fim"
          value={
            session.session_end_time
              ? formatDate(session.session_end_time)
              : "Em andamento"
          }
        />
        <InfoCard
          icon={Clock}
          label="Duração"
          value={session.session_duration}
        />
      </div>

      {/* ── Resumo EEG ──────────────────────────────────────────────────── */}
      <div
        style={{
          background: FM.bg,
          border: `1px solid ${FM.border}`,
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: 4,
            background: `linear-gradient(90deg, ${FM.orangeDark}, ${FM.orange}, ${FM.orangeLight})`,
          }}
        />
        <div
          style={{
            padding: "18px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          {/* Registros */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: FM.blueLight,
                border: `1px solid ${FM.blueBorder}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Activity size={22} style={{ color: FM.blueDark }} />
            </div>
            <div>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: FM.textMuted,
                  margin: "0 0 2px",
                }}
              >
                Registros EEG
              </p>
              <p
                style={{
                  fontSize: 30,
                  fontWeight: 700,
                  color: FM.text,
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                {sessionData.length}
              </p>
            </div>
          </div>

          {/* Médias */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {avgAtt !== null && (
              <div
                style={{
                  padding: "8px 16px",
                  borderRadius: 10,
                  background: attColor(avgAtt).bg,
                  border: `1px solid ${attColor(avgAtt).border}`,
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: attColor(avgAtt).text,
                    margin: "0 0 2px",
                  }}
                >
                  Atenção média
                </p>
                <p
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: attColor(avgAtt).text,
                    margin: 0,
                  }}
                >
                  {avgAtt}
                </p>
              </div>
            )}
            {avgMed !== null && (
              <div
                style={{
                  padding: "8px 16px",
                  borderRadius: 10,
                  background: FM.purpleLight,
                  border: `1px solid ${FM.purpleBorder}`,
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: FM.purple,
                    margin: "0 0 2px",
                  }}
                >
                  Meditação média
                </p>
                <p
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: FM.purple,
                    margin: 0,
                  }}
                >
                  {avgMed}
                </p>
              </div>
            )}
            <div
              style={{
                padding: "8px 14px",
                borderRadius: 10,
                background: FM.greenLight,
                border: `1px solid ${FM.greenBorder}`,
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <Brain size={14} style={{ color: FM.greenDark }} />
              <span
                style={{ fontSize: 12, fontWeight: 600, color: FM.greenDark }}
              >
                Sessão válida
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Lista de registros EEG ───────────────────────────────────────── */}
      <div
        style={{
          background: FM.bg,
          border: `1px solid ${FM.border}`,
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {/* Cabeçalho */}
        <div
          style={{
            padding: "11px 20px",
            background: FM.bgSoft,
            borderBottom: `1px solid ${FM.borderLight}`,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Zap size={13} style={{ color: FM.orange }} />
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.09em",
              textTransform: "uppercase",
              color: FM.textMuted,
            }}
          >
            Registros EEG · {sessionData.length} entradas
          </span>
        </div>

        {/* Scroll */}
        <div style={{ maxHeight: 460, overflowY: "auto" }}>
          {sessionData.length === 0 && (
            <div
              style={{
                padding: "48px 20px",
                textAlign: "center",
                color: FM.textMuted,
                fontSize: 13,
              }}
            >
              Nenhum registro EEG encontrado para esta sessão.
            </div>
          )}

          {sessionData.map((d, i) => {
            const att = d.attention_value;
            const med = d.meditation_value;
            const ac = attColor(att);

            return (
              <div
                key={i}
                style={{
                  padding: "14px 20px",
                  borderTop: i === 0 ? "none" : `1px solid ${FM.borderLight}`,
                  background: FM.bg,
                  transition: "background 0.12s",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = FM.orangePale)
                }
                onMouseLeave={(e) => (e.currentTarget.style.background = FM.bg)}
              >
                {/* Linha 1 — timestamp + badges atenção/meditação */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      color: FM.textMuted,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Clock size={11} style={{ color: FM.orange }} />
                    {formatTime(d.timestamp_of_record)}
                  </span>

                  <div style={{ display: "flex", gap: 6 }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 11,
                        fontWeight: 700,
                        background: ac.bg,
                        color: ac.text,
                        border: `1px solid ${ac.border}`,
                        borderRadius: 99,
                        padding: "3px 10px",
                      }}
                    >
                      Atenção: {att}
                    </span>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 11,
                        fontWeight: 700,
                        background: FM.purpleLight,
                        color: FM.purple,
                        border: `1px solid ${FM.purpleBorder}`,
                        borderRadius: 99,
                        padding: "3px 10px",
                      }}
                    >
                      Meditação: {med}
                    </span>
                  </div>
                </div>

                {/* Linha 2 — ondas cerebrais */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))",
                    gap: 10,
                    padding: "10px 14px",
                    background: FM.bgSoft,
                    borderRadius: 8,
                    border: `1px solid ${FM.borderLight}`,
                  }}
                >
                  <WaveChip label="Delta" value={d.delta_power} />
                  <WaveChip label="Theta" value={d.theta_power} />
                  <WaveChip label="α Low" value={d.low_alpha_power} />
                  <WaveChip label="α High" value={d.high_alpha_power} />
                  <WaveChip label="β Low" value={d.low_beta_power} />
                  <WaveChip label="β High" value={d.high_beta_power} />
                  <WaveChip label="γ Low" value={d.low_gamma_power} />
                  <WaveChip label="γ Mid" value={d.middle_gamma_power} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${FM.bgSoft}; }
        ::-webkit-scrollbar-thumb { background: ${FM.orangeLight}; border-radius: 99px; }
      `}</style>
    </div>
  );
}
