import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Brain,
  Clock,
  Calendar,
  User,
  Activity,
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
  MapPin,
  Mic,
  ChevronDown,
  ChevronUp,
  BarChart3,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Layers,
  Hash,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  ReferenceLine,
  Legend,
} from "recharts";


import { getPatientProgress } from "../../services/patientProgressService";

// ─── Paleta FocusMap (idêntica ao DashboardSessao) ───────────────────────────
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
const pad = (n) => String(n).padStart(2, "0");

const formatDateShort = (t) => {
  if (!t) return "—";
  const d = new Date(t);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
};

const formatDateFull = (t) => {
  if (!t) return "—";
  return new Date(t).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const formatDurationSeconds = (s) => {
  if (!s) return "—";
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  return h > 0 ? `${h}h ${pad(m % 60)}m` : `${m}m`;
};

const attLabel = (v) => {
  if (v == null)
    return { text: "—", bg: FM.bgSoft, border: FM.border, fg: FM.textMuted };
  if (v >= 75)
    return { text: "Alto", bg: FM.greenLight, border: FM.greenBorder, fg: FM.greenDark };
  if (v >= 50)
    return { text: "Médio", bg: FM.yellowLight, border: FM.yellowBorder, fg: "#9a7a10" };
  return { text: "Baixo", bg: FM.redLight, border: FM.redBorder, fg: FM.red };
};

const focusColor = (v) => {
  if (v == null) return FM.textMuted;
  if (v >= 75) return FM.greenDark;
  if (v >= 50) return "#9a7a10";
  return FM.red;
};

const focusBg = (v) => {
  if (v == null) return FM.bgSoft;
  if (v >= 75) return FM.greenLight;
  if (v >= 50) return FM.yellowLight;
  return FM.redLight;
};

const focusBorder = (v) => {
  if (v == null) return FM.border;
  if (v >= 75) return FM.greenBorder;
  if (v >= 50) return FM.yellowBorder;
  return FM.redBorder;
};

// ─── Tooltip customizado (igual ao DashboardSessao) ──────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.97)",
        border: `1px solid ${FM.border}`,
        borderRadius: 8,
        padding: "8px 12px",
        fontSize: 12,
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        minWidth: 160,
      }}
    >
      <p style={{ color: FM.textMuted, marginBottom: 6, fontWeight: 500 }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color || p.fill, flexShrink: 0 }} />
          <span style={{ color: FM.textMid }}>{p.name}:</span>
          <span style={{ fontWeight: 700, color: FM.text }}>{Math.round(p.value ?? 0)}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Subcomponentes base ──────────────────────────────────────────────────────
function SectionCard({ children, style = {} }) {
  return (
    <div
      style={{
        background: FM.bg,
        border: `1px solid ${FM.border}`,
        borderRadius: 12,
        padding: "20px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ children, icon: Icon }) {
  return (
    <h3
      style={{
        fontSize: 11,
        fontWeight: 700,
        color: FM.textMuted,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        margin: "0 0 16px",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span style={{ width: 3, height: 14, background: FM.orange, borderRadius: 2, flexShrink: 0 }} />
      {Icon && <Icon size={13} style={{ color: FM.orange }} />}
      {children}
    </h3>
  );
}

function StatPill({ label, value, color, icon: Icon, suffix = "" }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        padding: "12px 16px",
        background: color + "18",
        border: `1px solid ${color}40`,
        borderRadius: 10,
        minWidth: 80,
        flex: 1,
      }}
    >
      {Icon && <Icon size={14} style={{ color }} />}
      <span style={{ fontSize: 22, fontWeight: 700, color, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
        {value ?? "—"}{suffix}
      </span>
      <span style={{ fontSize: 10, color: FM.textMuted, textAlign: "center", lineHeight: 1.3 }}>
        {label}
      </span>
    </div>
  );
}

// ─── Gauge de atenção (igual ao DashboardSessao) ──────────────────────────────
function AttentionGauge({ value, label = "atenção média" }) {
  if (value == null) return null;
  const pct = Math.min(Math.max(value, 0), 100);
  const r = 52;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ * 0.75;
  const ac = attLabel(value);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <svg width={130} height={110} viewBox="0 0 130 110">
        <defs>
          <linearGradient id="gaugeGradProg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={FM.red} />
            <stop offset="50%" stopColor={FM.yellow} />
            <stop offset="100%" stopColor={FM.greenDark} />
          </linearGradient>
        </defs>
        <circle cx={65} cy={70} r={r} fill="none" stroke={FM.borderLight} strokeWidth={12}
          strokeDasharray={`${circ * 0.75} ${circ * 0.25}`} strokeLinecap="round"
          style={{ transform: "rotate(135deg)", transformOrigin: "65px 70px" }} />
        <circle cx={65} cy={70} r={r} fill="none" stroke="url(#gaugeGradProg)" strokeWidth={12}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transform: "rotate(135deg)", transformOrigin: "65px 70px", transition: "stroke-dasharray 0.5s ease" }} />
        <text x={65} y={68} textAnchor="middle" fontSize={22} fontWeight={700} fill={ac.fg}>{value}</text>
        <text x={65} y={84} textAnchor="middle" fontSize={11} fill={FM.textMuted}>de 100</text>
      </svg>
      <span style={{ fontSize: 11, color: FM.textMuted }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: ac.fg, background: ac.bg, border: `1px solid ${ac.border}`, borderRadius: 99, padding: "3px 12px" }}>
        {ac.text}
      </span>
    </div>
  );
}

// ─── Mini barra de atenção inline ─────────────────────────────────────────────
function AttentionBar({ value, showLabel = true }) {
  const color = focusColor(value);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
      <div style={{ flex: 1, height: 6, background: FM.borderLight, borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${value ?? 0}%`, height: "100%", background: color, borderRadius: 3, transition: "width 0.4s ease" }} />
      </div>
      {showLabel && (
        <span style={{ fontSize: 12, fontWeight: 700, color, minWidth: 30, textAlign: "right" }}>
          {value ?? "—"}%
        </span>
      )}
    </div>
  );
}

// ─── Card de sessão expansível ────────────────────────────────────────────────
function SessionCard({ session, isExpanded, onToggle, onNavigate }) {
  const ac = attLabel(session.avg_attention);
  const trendDiff = session.attention_trend_diff;

  return (
    <div
      style={{
        border: `1px solid ${isExpanded ? FM.orangeBorder : FM.border}`,
        borderRadius: 10,
        overflow: "hidden",
        background: FM.bg,
        transition: "border-color 0.15s",
      }}
    >
      {/* ── Cabeçalho clicável ── */}
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "14px 16px",
          background: isExpanded ? FM.orangePale : "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        {/* Índice */}
        <span
          style={{
            width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
            background: focusBg(session.avg_attention),
            border: `1px solid ${focusBorder(session.avg_attention)}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, color: focusColor(session.avg_attention),
          }}
        >
          S{session.session_index}
        </span>

        {/* Info principal */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: FM.text }}>
              {formatDateShort(session.session_start)}
            </span>
            {session.duration_seconds && (
              <span style={{ fontSize: 11, color: FM.textMuted, display: "flex", alignItems: "center", gap: 3 }}>
                <Clock size={11} /> {formatDurationSeconds(session.duration_seconds)}
              </span>
            )}
            {session.location_label && (
              <span style={{ fontSize: 11, color: FM.blue, background: FM.blueLight, border: `1px solid ${FM.blueBorder}`, borderRadius: 99, padding: "1px 8px", display: "flex", alignItems: "center", gap: 3 }}>
                <MapPin size={10} /> {session.location_label}
              </span>
            )}
          </div>
          <AttentionBar value={session.avg_attention} />
        </div>

        {/* Badge atenção */}
        <span
          style={{
            fontSize: 11, padding: "3px 10px", borderRadius: 6, flexShrink: 0,
            background: ac.bg, color: ac.fg, border: `1px solid ${ac.border}`, fontWeight: 700,
          }}
        >
          {session.avg_attention ?? "—"}%
        </span>

        {/* Tendência */}
        {trendDiff != null && (
          <span style={{ flexShrink: 0 }}>
            {trendDiff >= 5 ? <TrendingUp size={16} style={{ color: FM.greenDark }} /> :
             trendDiff <= -5 ? <TrendingDown size={16} style={{ color: FM.red }} /> :
             <Minus size={16} style={{ color: FM.yellow }} />}
          </span>
        )}

        {isExpanded
          ? <ChevronUp size={14} style={{ color: FM.textMuted, flexShrink: 0 }} />
          : <ChevronDown size={14} style={{ color: FM.textMuted, flexShrink: 0 }} />}
      </button>

      {/* ── Detalhe expandido ── */}
      {isExpanded && (
        <div style={{ borderTop: `1px solid ${FM.borderLight}`, padding: "16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 16 }}>

            {/* Stats rápidas */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: FM.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>Estatísticas da sessão</p>
              {[
                { label: "Atenção máx.", value: session.max_attention, color: FM.greenDark },
                { label: "Atenção mín.", value: session.min_attention, color: FM.red },
                { label: "Meditação média", value: session.avg_meditation, color: FM.purple },
                { label: "Registros EEG", value: session.eeg_record_count, color: FM.blue },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: FM.textMuted }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color }}>{value ?? "—"}</span>
                </div>
              ))}

              {/* Tendência 1ª vs 2ª metade */}
              {session.attention_trend_diff != null && (
                <div
                  style={{
                    marginTop: 4, padding: "8px 12px", borderRadius: 8, fontSize: 12,
                    background: trendDiff >= 5 ? FM.greenLight : trendDiff <= -5 ? FM.redLight : FM.yellowLight,
                    border: `1px solid ${trendDiff >= 5 ? FM.greenBorder : trendDiff <= -5 ? FM.redBorder : FM.yellowBorder}`,
                    display: "flex", alignItems: "center", gap: 8,
                  }}
                >
                  {trendDiff >= 5
                    ? <TrendingUp size={13} style={{ color: FM.greenDark }} />
                    : trendDiff <= -5
                    ? <TrendingDown size={13} style={{ color: FM.red }} />
                    : <Minus size={13} style={{ color: "#9a7a10" }} />}
                  <span style={{ color: FM.textMid }}>
                    {session.first_half_avg_attention} → {session.second_half_avg_attention}
                    <strong> ({trendDiff >= 0 ? "+" : ""}{trendDiff} pts)</strong>
                  </span>
                </div>
              )}
            </div>

            {/* Distribuição por faixas */}
            {session.attention_distribution && (
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: FM.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 10px" }}>Distribuição de atenção</p>
                {[
                  { label: "Alto (75-100)", value: session.attention_distribution.high_count, color: FM.greenDark },
                  { label: "Médio (50-74)", value: session.attention_distribution.medium_count, color: "#9a7a10" },
                  { label: "Médio-baixo (25-49)", value: session.attention_distribution.medium_low_count, color: FM.orange },
                  { label: "Baixo (0-24)", value: session.attention_distribution.low_count, color: FM.red },
                ].map(({ label, value, color }) => {
                  const total = session.eeg_record_count || 1;
                  const pct = Math.round((value / total) * 100);
                  return (
                    <div key={label} style={{ marginBottom: 6 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                        <span style={{ fontSize: 11, color: FM.textMuted }}>{label}</span>
                        <span style={{ fontSize: 11, fontWeight: 600, color }}>{pct}%</span>
                      </div>
                      <div style={{ height: 5, background: FM.borderLight, borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 3 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pontos de interesse */}
            {session.points_of_interest?.length > 0 && (
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: FM.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 10px" }}>Pontos de interesse</p>
                {session.points_of_interest.map((poi) => (
                  <div key={poi.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", background: FM.orangePale, border: `1px solid ${FM.orangeBorder}`, borderRadius: 7, marginBottom: 6 }}>
                    <Target size={12} style={{ color: FM.orange, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: FM.text, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{poi.name}</p>
                      {poi.description && <p style={{ fontSize: 11, color: FM.textMuted, margin: 0 }}>{poi.description}</p>}
                    </div>
                    {poi.avg_attention_in_range != null && (
                      <span style={{ fontSize: 11, fontWeight: 700, color: focusColor(poi.avg_attention_in_range), flexShrink: 0 }}>
                        {poi.avg_attention_in_range}%
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tópicos de áudio */}
          {session.audio_topics?.length > 0 && (
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: FM.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 8px" }}>Tópicos de áudio detectados</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {session.audio_topics.map((topic, i) => (
                  <div key={topic.id ?? i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: FM.blueLight, border: `1px solid ${FM.blueBorder}`, borderRadius: 7 }}>
                    <Mic size={12} style={{ color: FM.blue, flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: 12, color: FM.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{topic.description}</span>
                    {topic.avg_attention != null && (
                      <span style={{ fontSize: 11, fontWeight: 700, color: focusColor(topic.avg_attention), flexShrink: 0, background: focusBg(topic.avg_attention), border: `1px solid ${focusBorder(topic.avg_attention)}`, borderRadius: 99, padding: "2px 8px" }}>
                        {topic.avg_attention}%
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botão ver sessão completa */}
          <button
            onClick={() => onNavigate(session.session_id)}
            style={{
              marginTop: 14, padding: "8px 16px", borderRadius: 8, border: `1px solid ${FM.orangeBorder}`,
              background: FM.orangePale, color: FM.orangeDark, fontSize: 12, fontWeight: 600,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
            }}
          >
            <Activity size={13} /> Ver dashboard completo da sessão
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function DashboardProgressoPaciente() {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSession, setExpandedSession] = useState(null);
  const [activeTab, setActiveTab] = useState("sessoes"); // "sessoes" | "evolucao" | "locais" | "horarios"

  useEffect(() => {
    async function load() {
      try {
        const data = await getPatientProgress(patientId);
        setProgress(data);
      } catch (err) {
        console.error("Erro ao carregar progresso:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [patientId]);

  // ── Dados para os gráficos ────────────────────────────────────────────────
  const trendData = useMemo(() => {
    if (!progress?.attention_trend) return [];
    return progress.attention_trend.map((p) => ({
      ...p,
      label: `S${p.session_index}`,
      date: formatDateShort(p.session_date),
    }));
  }, [progress]);

  const hourlyData = useMemo(() => {
    if (!progress?.attention_by_hour) return [];
    return progress.attention_by_hour.map((h) => ({
      ...h,
      fill: focusBg(h.avg_attention),
      stroke: focusColor(h.avg_attention),
    }));
  }, [progress]);

  const locationData = useMemo(() => {
    if (!progress?.attention_by_location) return [];
    return progress.attention_by_location.filter((l) => l.avg_attention != null);
  }, [progress]);

  // Distribuição global acumulada de todas as sessões
  const globalDistribution = useMemo(() => {
    if (!progress?.sessions) return [];
    const totals = { high: 0, medium: 0, medium_low: 0, low: 0, total: 0 };
    progress.sessions.forEach((s) => {
      const d = s.attention_distribution;
      if (!d) return;
      totals.high += d.high_count ?? 0;
      totals.medium += d.medium_count ?? 0;
      totals.medium_low += d.medium_low_count ?? 0;
      totals.low += d.low_count ?? 0;
      totals.total += s.eeg_record_count ?? 0;
    });
    const t = totals.total || 1;
    return [
      { label: "Alto (75-100)", value: Math.round((totals.high / t) * 100), count: totals.high, color: FM.greenDark },
      { label: "Médio (50-74)", value: Math.round((totals.medium / t) * 100), count: totals.medium, color: "#9a7a10" },
      { label: "Médio-baixo (25-49)", value: Math.round((totals.medium_low / t) * 100), count: totals.medium_low, color: FM.orange },
      { label: "Baixo (0-24)", value: Math.round((totals.low / t) * 100), count: totals.low, color: FM.red },
    ];
  }, [progress]);

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 280, gap: 12, color: FM.textMuted, fontSize: 14 }}>
        <RefreshCw size={32} style={{ color: FM.orange, animation: "spin 0.8s linear infinite" }} />
        Carregando progresso do paciente…
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!progress) {
    return (
      <div style={{ textAlign: "center", padding: "4rem", color: FM.textMuted }}>
        <Brain size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
        <p style={{ fontSize: 15 }}>Paciente não encontrado.</p>
      </div>
    );
  }

  const globalAc = attLabel(progress.overall_avg_attention);

  const TABS = [
    { id: "sessoes", label: "Sessões", icon: Layers },
    { id: "evolucao", label: "Evolução", icon: TrendingUp },
    { id: "locais", label: "Locais", icon: MapPin },
    { id: "horarios", label: "Horários", icon: Clock },
  ];

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16, paddingBottom: "3rem" }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <button
          onClick={() => navigate(-1)}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", fontSize: 12, color: FM.textMuted, padding: 0 }}
        >
          <ArrowLeft size={13} /> Voltar
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${FM.orange}, ${FM.orangeDark})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Brain size={17} style={{ color: "#fff" }} />
          </div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: FM.text, margin: 0 }}>
            Progresso do Paciente
          </h1>
        </div>

        {progress.overall_avg_attention != null && (
          <div style={{ padding: "6px 14px", borderRadius: 8, background: globalAc.bg, color: globalAc.fg, fontSize: 13, fontWeight: 700, border: `1px solid ${globalAc.border}`, display: "flex", alignItems: "center", gap: 6 }}>
            <Brain size={13} />
            Atenção geral: {progress.overall_avg_attention}% · {globalAc.text}
          </div>
        )}
      </div>

      {/* ── Info do paciente ─────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {[
          { icon: User, label: "Paciente", value: progress.patient_name, color: FM.blue },
          { icon: Calendar, label: "Primeira sessão", value: formatDateFull(progress.first_session_date), color: FM.orange },
          { icon: Calendar, label: "Última sessão", value: formatDateFull(progress.last_session_date), color: FM.orange },
          { icon: Hash, label: "Total de sessões", value: `${progress.total_sessions} sessões`, color: FM.purple },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} style={{ background: FM.bg, border: `1px solid ${FM.border}`, borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 160 }}>
            <div style={{ width: 38, height: 38, borderRadius: 9, background: color + "18", border: `1px solid ${color}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon size={17} style={{ color }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: FM.textMuted, margin: "0 0 2px" }}>{label}</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: FM.text, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{value ?? "—"}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Métricas globais + Gauge ─────────────────────────────────────── */}
      <SectionCard>
        <SectionTitle icon={Activity}>Visão Geral do Progresso</SectionTitle>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "flex-start" }}>

          <AttentionGauge value={progress.overall_avg_attention} label="atenção geral" />

          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
              <StatPill label="Máx. geral" value={progress.overall_max_attention} color={FM.greenDark} icon={TrendingUp} suffix="%" />
              <StatPill label="Mín. geral" value={progress.overall_min_attention} color={FM.red} icon={TrendingDown} suffix="%" />
              <StatPill label="Meditação média" value={progress.overall_avg_meditation} color={FM.purple} icon={Brain} suffix="" />
              <StatPill label="Sessões" value={progress.total_sessions} color={FM.blue} icon={Layers} />
            </div>

            {/* Distribuição global acumulada */}
            <p style={{ fontSize: 11, fontWeight: 700, color: FM.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 10px" }}>
              Distribuição acumulada de atenção (todas as sessões)
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {globalDistribution.map(({ label, value, color }) => (
                <div key={label}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                    <span style={{ fontSize: 11, color: FM.textMuted }}>{label}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color }}>{value}%</span>
                  </div>
                  <div style={{ height: 6, background: FM.borderLight, borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: 3, transition: "width 0.5s ease" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ── Tabs de navegação ────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 4, background: FM.bgSoft, borderRadius: 10, padding: 4, border: `1px solid ${FM.border}` }}>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              padding: "9px 12px", borderRadius: 7, border: "none", cursor: "pointer",
              fontSize: 12, fontWeight: activeTab === id ? 700 : 500,
              color: activeTab === id ? FM.orangeDark : FM.textMuted,
              background: activeTab === id ? FM.bg : "transparent",
              boxShadow: activeTab === id ? `0 1px 4px rgba(0,0,0,0.06)` : "none",
              transition: "all 0.15s",
            }}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* ── Tab: Sessões ─────────────────────────────────────────────────── */}
      {activeTab === "sessoes" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {progress.sessions.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: FM.textMuted }}>
              <Activity size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
              <p style={{ fontSize: 13 }}>Nenhuma sessão registrada.</p>
            </div>
          ) : (
            progress.sessions.map((session) => (
              <SessionCard
                key={session.session_id}
                session={session}
                isExpanded={expandedSession === session.session_id}
                onToggle={() =>
                  setExpandedSession(
                    expandedSession === session.session_id ? null : session.session_id
                  )
                }
                onNavigate={(sid) => navigate(`/dashboard/sessao/${sid}`)}
              />
            ))
          )}
        </div>
      )}

      {/* ── Tab: Evolução ────────────────────────────────────────────────── */}
      {activeTab === "evolucao" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Linha de tendência */}
          <SectionCard>
            <SectionTitle icon={TrendingUp}>Evolução da Atenção por Sessão</SectionTitle>
            <p style={{ fontSize: 12, color: FM.textMuted, margin: "-10px 0 14px" }}>
              Cada ponto representa a atenção média de uma sessão — tendência de longo prazo visível na linha tracejada
            </p>
            <div style={{ display: "flex", gap: 16, marginBottom: 10, flexWrap: "wrap" }}>
              {[
                { color: FM.blue, label: "Atenção média" },
                { color: FM.purple, label: "Meditação média" },
              ].map(({ color, label }) => (
                <span key={label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: FM.textMuted }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
                  {label}
                </span>
              ))}
            </div>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 4, right: 16, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={FM.borderLight} />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: FM.textMuted }} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: FM.textMuted }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={75} stroke={FM.greenBorder} strokeDasharray="3 3" label={{ value: "75%", position: "insideLeft", fontSize: 9, fill: FM.greenDark }} />
                  <ReferenceLine y={50} stroke={FM.border} strokeDasharray="4 4" label={{ value: "50%", position: "insideLeft", fontSize: 9, fill: FM.textMuted }} />
                  <Line type="monotone" dataKey="avg_attention" stroke={FM.blue} strokeWidth={2.5} dot={{ r: 5, fill: FM.blue }} activeDot={{ r: 7 }} name="Atenção" isAnimationActive={false} />
                  <Line type="monotone" dataKey="avg_meditation" stroke={FM.purple} strokeWidth={2} dot={{ r: 4, fill: FM.purple }} strokeDasharray="4 2" name="Meditação" isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>

          {/* Distribuição global como barras */}
          <SectionCard>
            <SectionTitle icon={BarChart3}>Distribuição Global de Atenção</SectionTitle>
            <p style={{ fontSize: 12, color: FM.textMuted, margin: "-10px 0 14px" }}>
              Percentual acumulado de registros EEG em cada faixa — soma de todas as sessões
            </p>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={globalDistribution} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={FM.borderLight} />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: FM.textMuted }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: FM.textMuted }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="%" radius={[5, 5, 0, 0]} barSize={48}>
                    {globalDistribution.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        </div>
      )}

      {/* ── Tab: Locais ──────────────────────────────────────────────────── */}
      {activeTab === "locais" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {locationData.length === 0 ? (
            <SectionCard>
              <div style={{ textAlign: "center", padding: "2rem", color: FM.textMuted }}>
                <MapPin size={28} style={{ opacity: 0.3, marginBottom: 8 }} />
                <p style={{ fontSize: 13 }}>Nenhuma localização registrada nas sessões.</p>
              </div>
            </SectionCard>
          ) : (
            <>
              {/* Cards de local */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
                {locationData.map((loc) => {
                  const ac = attLabel(loc.avg_attention);
                  return (
                    <div key={loc.location_label} style={{ background: FM.bg, border: `1px solid ${FM.border}`, borderRadius: 12, padding: "16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 9, background: FM.blueLight, border: `1px solid ${FM.blueBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <MapPin size={16} style={{ color: FM.blue }} />
                        </div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 700, color: FM.text, margin: 0 }}>{loc.location_label}</p>
                          <p style={{ fontSize: 11, color: FM.textMuted, margin: 0 }}>{loc.session_count} sessão{loc.session_count !== 1 ? "ões" : ""}</p>
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: 11, color: FM.textMuted }}>Atenção média</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: ac.fg, background: ac.bg, border: `1px solid ${ac.border}`, borderRadius: 99, padding: "1px 8px" }}>
                            {loc.avg_attention}%
                          </span>
                        </div>
                        {loc.avg_meditation != null && (
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ fontSize: 11, color: FM.textMuted }}>Meditação média</span>
                            <span style={{ fontSize: 12, fontWeight: 700, color: FM.purple }}>{loc.avg_meditation}%</span>
                          </div>
                        )}
                        <AttentionBar value={loc.avg_attention} showLabel={false} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Gráfico comparativo de locais */}
              <SectionCard>
                <SectionTitle icon={MapPin}>Comparativo de Atenção por Local</SectionTitle>
                <div style={{ height: 220 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={locationData} margin={{ top: 4, right: 16, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={FM.borderLight} />
                      <XAxis dataKey="location_label" tick={{ fontSize: 11, fill: FM.textMuted }} tickLine={false} axisLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: FM.textMuted }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                      <Tooltip content={<CustomTooltip />} />
                      <ReferenceLine y={50} stroke={FM.border} strokeDasharray="4 4" />
                      <Bar dataKey="avg_attention" name="Atenção" radius={[5, 5, 0, 0]} barSize={36}>
                        {locationData.map((d, i) => <Cell key={i} fill={focusColor(d.avg_attention)} opacity={0.85} />)}
                      </Bar>
                      <Bar dataKey="avg_meditation" name="Meditação" fill={FM.purple} radius={[5, 5, 0, 0]} barSize={36} fillOpacity={0.7} />
                      <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </SectionCard>

              {/* Coordenadas registradas */}
              <SectionCard>
                <SectionTitle icon={MapPin}>Coordenadas dos Locais</SectionTitle>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {locationData.map((loc) => (
                    <div key={loc.location_label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: FM.bgSoft, borderRadius: 8, border: `1px solid ${FM.borderLight}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <MapPin size={13} style={{ color: FM.blue }} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: FM.text }}>{loc.location_label}</span>
                      </div>
                      <span style={{ fontSize: 11, color: FM.textMuted, fontVariantNumeric: "tabular-nums" }}>
                        {loc.representative_latitude.toFixed(5)}, {loc.representative_longitude.toFixed(5)}
                      </span>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </>
          )}
        </div>
      )}

      {/* ── Tab: Horários ────────────────────────────────────────────────── */}
      {activeTab === "horarios" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {hourlyData.length === 0 ? (
            <SectionCard>
              <div style={{ textAlign: "center", padding: "2rem", color: FM.textMuted }}>
                <Clock size={28} style={{ opacity: 0.3, marginBottom: 8 }} />
                <p style={{ fontSize: 13 }}>Nenhum dado horário disponível.</p>
              </div>
            </SectionCard>
          ) : (
            <>
              <SectionCard>
                <SectionTitle icon={Clock}>Atenção Média por Faixa de Horário</SectionTitle>
                <p style={{ fontSize: 12, color: FM.textMuted, margin: "-10px 0 14px" }}>
                  Agregação de todos os registros EEG agrupados pela hora do dia — identifica os melhores e piores horários para foco
                </p>
                <div style={{ height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={hourlyData} margin={{ top: 4, right: 16, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={FM.borderLight} />
                      <XAxis dataKey="hour_range" tick={{ fontSize: 10, fill: FM.textMuted }} tickLine={false} axisLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: FM.textMuted }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                      <Tooltip content={<CustomTooltip />} />
                      <ReferenceLine y={75} stroke={FM.greenBorder} strokeDasharray="3 3" label={{ value: "75%", position: "insideTopLeft", fontSize: 9, fill: FM.greenDark }} />
                      <ReferenceLine y={50} stroke={FM.border} strokeDasharray="4 4" />
                      <Bar dataKey="avg_attention" name="Atenção média" radius={[5, 5, 0, 0]} barSize={32}>
                        {hourlyData.map((d, i) => <Cell key={i} fill={focusColor(d.avg_attention)} opacity={0.85} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </SectionCard>

              {/* Melhor e pior horário */}
              {hourlyData.length >= 2 && (() => {
                const sorted = [...hourlyData].sort((a, b) => (b.avg_attention ?? 0) - (a.avg_attention ?? 0));
                const best = sorted[0];
                const worst = sorted[sorted.length - 1];
                return (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div style={{ padding: "16px", background: FM.greenLight, border: `1px solid ${FM.greenBorder}`, borderRadius: 10, display: "flex", alignItems: "center", gap: 12 }}>
                      <CheckCircle size={20} style={{ color: FM.greenDark, flexShrink: 0 }} />
                      <div>
                        <p style={{ fontSize: 11, color: FM.greenDark, fontWeight: 700, margin: "0 0 2px", textTransform: "uppercase" }}>Melhor horário</p>
                        <p style={{ fontSize: 16, fontWeight: 700, color: FM.greenDark, margin: 0 }}>{best.hour_range}</p>
                        <p style={{ fontSize: 12, color: FM.greenDark, margin: 0 }}>Atenção média: {best.avg_attention}%</p>
                      </div>
                    </div>
                    <div style={{ padding: "16px", background: FM.redLight, border: `1px solid ${FM.redBorder}`, borderRadius: 10, display: "flex", alignItems: "center", gap: 12 }}>
                      <AlertTriangle size={20} style={{ color: FM.red, flexShrink: 0 }} />
                      <div>
                        <p style={{ fontSize: 11, color: FM.red, fontWeight: 700, margin: "0 0 2px", textTransform: "uppercase" }}>Pior horário</p>
                        <p style={{ fontSize: 16, fontWeight: 700, color: FM.red, margin: 0 }}>{worst.hour_range}</p>
                        <p style={{ fontSize: 12, color: FM.red, margin: 0 }}>Atenção média: {worst.avg_attention}%</p>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Tabela de referência */}
              <SectionCard>
                <SectionTitle icon={Clock}>Referência Detalhada por Horário</SectionTitle>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {[...hourlyData].sort((a, b) => (b.avg_attention ?? 0) - (a.avg_attention ?? 0)).map((h) => {
                    const ac = attLabel(h.avg_attention);
                    return (
                      <div key={h.hour_range} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: FM.bgSoft, borderRadius: 8, border: `1px solid ${FM.borderLight}` }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: FM.text, minWidth: 80 }}>{h.hour_range}</span>
                        <div style={{ flex: 1 }}>
                          <AttentionBar value={h.avg_attention} showLabel={false} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: ac.fg, background: ac.bg, border: `1px solid ${ac.border}`, borderRadius: 99, padding: "2px 10px", flexShrink: 0 }}>
                          {h.avg_attention}%
                        </span>
                        <span style={{ fontSize: 11, color: FM.textMuted, flexShrink: 0 }}>
                          {h.record_count.toLocaleString("pt-BR")} registros
                        </span>
                      </div>
                    );
                  })}
                </div>
              </SectionCard>
            </>
          )}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}