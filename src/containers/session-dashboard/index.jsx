import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Brain,
  Mic,
  Clock,
  Calendar,
  User,
  Activity,
  Zap,
  ChevronDown,
  ChevronUp,
  PieChart as PieIcon,
  BarChart3,
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  ReferenceLine,
  AreaChart,
  Area,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { getSessionDashboard } from "../../services/sessionService";

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
  // Ondas cerebrais
  delta: "#773dff",
  theta: "#09acde",
  alpha: "#e8bb25",
  beta: "#ff663d",
  gamma: "#3dff55",
  // Base
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

const formatDuration = (start, end) => {
  if (!start || !end) return "—";
  const s = Math.round((new Date(end) - new Date(start)) / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  return h > 0 ? `${h}h ${pad(m % 60)}m` : `${m}m ${pad(s % 60)}s`;
};

const formatTimestamp = (t) => {
  if (!t) return "";
  const d = new Date(t);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

const formatDateFull = (t) => {
  if (!t) return "—";
  return new Date(t).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const avg = (arr, key) => {
  const vals = arr.map((d) => Number(d[key])).filter((v) => !isNaN(v));
  return vals.length
    ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
    : null;
};
const maxVal = (arr, key) => {
  const vals = arr.map((d) => d[key]).filter((v) => v != null && !isNaN(v));
  return vals.length ? Math.round(Math.max(...vals)) : null;
};
const minVal = (arr, key) => {
  const vals = arr.map((d) => d[key]).filter((v) => v != null && !isNaN(v));
  return vals.length ? Math.round(Math.min(...vals)) : null;
};

// Classifica nível de atenção
const attLabel = (v) => {
  if (v == null)
    return { text: "—", bg: FM.bgSoft, border: FM.border, fg: FM.textMuted };
  if (v >= 75)
    return {
      text: "Alto",
      bg: FM.greenLight,
      border: FM.greenBorder,
      fg: FM.greenDark,
    };
  if (v >= 50)
    return {
      text: "Médio",
      bg: FM.yellowLight,
      border: FM.yellowBorder,
      fg: FM.yellow,
    };
  return { text: "Baixo", bg: FM.redLight, border: FM.redBorder, fg: FM.red };
};

// Heatmap
const buildHeatmapData = (eeg, bucketSizeSeconds = 10) => {
  if (!eeg.length) return [];
  const start = new Date(eeg[0].timestamp).getTime();
  const buckets = {};
  eeg.forEach((e) => {
    const diffSec = Math.floor(
      (new Date(e.timestamp).getTime() - start) / 1000,
    );
    const bucket = Math.floor(diffSec / bucketSizeSeconds);
    if (!buckets[bucket])
      buckets[bucket] = { values: [], time: new Date(e.timestamp).getTime() };
    buckets[bucket].values.push(e.attention_value);
  });
  return Object.keys(buckets).map((k) => {
    const b = buckets[k];
    const a = b.values.reduce((s, v) => s + v, 0) / b.values.length;
    return { time: new Date(b.time).toISOString(), attention: Math.round(a) };
  });
};

const heatColor = (v) => {
  if (v == null) return FM.border;
  if (v >= 75) return FM.greenDark;
  if (v >= 50) return FM.yellow;
  if (v >= 25) return FM.orange;
  return FM.red;
};

// Calcula "zonas de foco" — períodos de alta atenção contíguos
const buildFocusZones = (eeg, threshold = 60, minLen = 3) => {
  const zones = [];
  let start = null;
  eeg.forEach((e, i) => {
    const high = e.attention_value >= threshold;
    if (high && start === null) start = i;
    if (!high && start !== null) {
      if (i - start >= minLen)
        zones.push({
          from: eeg[start].timestamp,
          to: eeg[i - 1].timestamp,
          len: i - start,
        });
      start = null;
    }
  });
  if (start !== null && eeg.length - start >= minLen)
    zones.push({
      from: eeg[start].timestamp,
      to: eeg[eeg.length - 1].timestamp,
      len: eeg.length - start,
    });
  return zones;
};

// ─── Tooltip customizado ──────────────────────────────────────────────────────
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
      <p style={{ color: FM.textMuted, marginBottom: 6, fontWeight: 500 }}>
        {label}
      </p>
      {payload.map((p, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 2,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: p.color || p.fill,
              flexShrink: 0,
            }}
          />
          <span style={{ color: FM.textMid }}>{p.name}:</span>
          <span style={{ fontWeight: 700, color: FM.text }}>
            {Math.round(p.value ?? 0)}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Subcomponentes ───────────────────────────────────────────────────────────
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
      <span
        style={{
          width: 3,
          height: 14,
          background: FM.orange,
          borderRadius: 2,
          flexShrink: 0,
        }}
      />
      {Icon && <Icon size={13} style={{ color: FM.orange }} />}
      {children}
    </h3>
  );
}

function InfoCard({ icon: Icon, label, value, accentColor }) {
  const c = accentColor || FM.orange;
  return (
    <div
      style={{
        background: FM.bg,
        border: `1px solid ${FM.border}`,
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
          background: c + "18",
          border: `1px solid ${c}40`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={17} style={{ color: c }} />
      </div>
      <div style={{ minWidth: 0 }}>
        <p
          style={{
            fontSize: 10,
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

function StatPill({ label, value, color, icon: Icon }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        padding: "12px 16px",
        background: color + "15",
        border: `1px solid ${color}40`,
        borderRadius: 10,
        minWidth: 80,
        flex: 1,
      }}
    >
      {Icon && <Icon size={14} style={{ color }} />}
      <span
        style={{
          fontSize: 22,
          fontWeight: 700,
          color,
          fontVariantNumeric: "tabular-nums",
          lineHeight: 1,
        }}
      >
        {value ?? "—"}
      </span>
      <span
        style={{
          fontSize: 10,
          color: FM.textMuted,
          textAlign: "center",
          lineHeight: 1.3,
        }}
      >
        {label}
      </span>
    </div>
  );
}

// Gauge circular de atenção
function AttentionGauge({ value }) {
  if (value == null) return null;
  const pct = Math.min(Math.max(value, 0), 100);
  const r = 52;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ * 0.75; // 270° sweep
  const ac = attLabel(value);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
      }}
    >
      <svg width={130} height={110} viewBox="0 0 130 110">
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={FM.red} />
            <stop offset="50%" stopColor={FM.yellow} />
            <stop offset="100%" stopColor={FM.greenDark} />
          </linearGradient>
        </defs>
        {/* trilha */}
        <circle
          cx={65}
          cy={70}
          r={r}
          fill="none"
          stroke={FM.borderLight}
          strokeWidth={12}
          strokeDasharray={`${circ * 0.75} ${circ * 0.25}`}
          strokeLinecap="round"
          style={{ transform: "rotate(135deg)", transformOrigin: "65px 70px" }}
        />
        {/* progresso */}
        <circle
          cx={65}
          cy={70}
          r={r}
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth={12}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{
            transform: "rotate(135deg)",
            transformOrigin: "65px 70px",
            transition: "stroke-dasharray 0.5s ease",
          }}
        />
        <text
          x={65}
          y={68}
          textAnchor="middle"
          fontSize={22}
          fontWeight={700}
          fill={ac.fg}
        >
          {value}
        </text>
        <text
          x={65}
          y={84}
          textAnchor="middle"
          fontSize={11}
          fill={FM.textMuted}
        >
          de 100
        </text>
      </svg>
      <span
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: ac.fg,
          background: ac.bg,
          border: `1px solid ${ac.border}`,
          borderRadius: 99,
          padding: "3px 12px",
        }}
      >
        {ac.text}
      </span>
    </div>
  );
}

// Heatmap timeline
function HeatmapTimeline({ data }) {
  if (!data.length)
    return (
      <p style={{ color: FM.textMuted, fontSize: 13, textAlign: "center" }}>
        Sem dados
      </p>
    );
  return (
    <div>
      <div
        style={{ display: "flex", gap: 2, overflowX: "auto", paddingBottom: 4 }}
      >
        {data.map((d, i) => (
          <div
            key={i}
            title={`${formatTimestamp(d.time)} · Atenção: ${d.attention}%`}
            style={{
              width: 10,
              minWidth: 10,
              height: 44,
              background: heatColor(d.attention),
              borderRadius: 3,
              flexShrink: 0,
              cursor: "help",
            }}
          />
        ))}
      </div>
      <div
        style={{
          display: "flex",
          gap: 12,
          marginTop: 8,
          fontSize: 11,
          color: FM.textMuted,
          flexWrap: "wrap",
        }}
      >
        {[
          { c: FM.red, l: "< 25 — Baixo" },
          { c: FM.orange, l: "25-49 — Médio-baixo" },
          { c: FM.yellow, l: "50-74 — Médio" },
          { c: FM.greenDark, l: "≥ 75 — Alto" },
        ].map(({ c, l }) => (
          <span
            key={l}
            style={{ display: "flex", alignItems: "center", gap: 4 }}
          >
            <span
              style={{ width: 10, height: 10, background: c, borderRadius: 2 }}
            />{" "}
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

// TopicRow expansível
function TopicRow({ topic, index, eeg, isExpanded, onToggle }) {
  const start = new Date(topic.startOfAudio).getTime();
  const end = new Date(topic.endOfAudio).getTime();
  const slice = eeg.filter((e) => {
    const t = new Date(e.timestamp).getTime();
    return t >= start && t <= end;
  });
  const avgAtt = avg(slice, "attention_value");
  const avgMed = avg(slice, "meditation_value");
  const ac = attLabel(avgAtt);

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
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 16px",
          background: isExpanded ? FM.orangePale : "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span
          style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            flexShrink: 0,
            background: FM.orangePale,
            border: `1px solid ${FM.orangeBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 700,
            color: FM.orangeDark,
          }}
        >
          {index + 1}
        </span>
        <Mic size={13} style={{ color: FM.textMuted, flexShrink: 0 }} />
        <span
          style={{
            flex: 1,
            fontSize: 13,
            color: FM.text,
            fontWeight: 500,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {topic.description}
        </span>
        {avgAtt != null && (
          <span
            style={{
              fontSize: 11,
              padding: "2px 8px",
              borderRadius: 6,
              background: ac.bg,
              color: ac.fg,
              fontWeight: 700,
              border: `1px solid ${ac.border}`,
              flexShrink: 0,
            }}
          >
            Atenção: {avgAtt}
          </span>
        )}
        <span style={{ fontSize: 11, color: FM.textMuted, flexShrink: 0 }}>
          {formatTimestamp(topic.startOfAudio)} →{" "}
          {formatTimestamp(topic.endOfAudio)}
        </span>
        {isExpanded ? (
          <ChevronUp size={14} style={{ color: FM.textMuted }} />
        ) : (
          <ChevronDown size={14} style={{ color: FM.textMuted }} />
        )}
      </button>

      {isExpanded && (
        <div
          style={{
            padding: "0 16px 16px",
            borderTop: `1px solid ${FM.borderLight}`,
          }}
        >
          {slice.length > 1 ? (
            <>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginTop: 10,
                  marginBottom: 10,
                  flexWrap: "wrap",
                }}
              >
                <span style={{ fontSize: 11, color: FM.textMuted }}>
                  {slice.length} pontos EEG
                </span>
                {avgMed != null && (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: FM.purple,
                      background: FM.purpleLight,
                      border: `1px solid ${FM.purpleBorder}`,
                      borderRadius: 99,
                      padding: "1px 8px",
                    }}
                  >
                    Meditação média: {avgMed}
                  </span>
                )}
              </div>
              <div style={{ height: 90 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={slice}
                    margin={{ top: 4, right: 4, left: -30, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id={`grad-${index}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={FM.blue}
                          stopOpacity={0.25}
                        />
                        <stop
                          offset="95%"
                          stopColor={FM.blue}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="timestamp" hide />
                    <YAxis domain={[0, 100]} hide />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine
                      y={50}
                      stroke={FM.borderLight}
                      strokeDasharray="3 3"
                    />
                    <Area
                      type="monotone"
                      dataKey="attention_value"
                      stroke={FM.blue}
                      strokeWidth={2}
                      fill={`url(#grad-${index})`}
                      dot={false}
                      name="Atenção"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <p style={{ fontSize: 12, color: FM.textMuted, marginTop: 10 }}>
              Dados insuficientes para este intervalo.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function DashboardSessao() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [eeg, setEeg] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [visible, setVisible] = useState({
    attention_value: true,
    meditation_value: true,
    delta_power: false,
    low_alpha_power: true,
    high_beta_power: false,
  });

  const toggleLine = (key) => setVisible((v) => ({ ...v, [key]: !v[key] }));

  useEffect(() => {
    async function load() {
      try {
        const res = await getSessionDashboard(id);
        if (!res) return;
        setSession(res.session);

        const eegNorm = (res.eeg || []).map((e) => ({
          timestamp: new Date(e.timestamp ?? e.Timestamp).toISOString(),
          attention_value: Number(e.attentionValue ?? e.AttentionValue),
          meditation_value: Number(e.meditationValue ?? e.MeditationValue),
          delta_power: Number(e.deltaPower ?? e.DeltaPower),
          low_alpha_power: Number(e.lowAlphaPower ?? e.LowAlphaPower),
          high_alpha_power: Number(e.highAlphaPower ?? e.HighAlphaPower),
          low_beta_power: Number(e.lowBetaPower ?? e.LowBetaPower),
          high_beta_power: Number(e.highBetaPower ?? e.HighBetaPower),
          low_gamma_power: Number(e.lowGammaPower ?? e.LowGammaPower),
        }));

        const ensureUTC = (s) => (s && !s.endsWith("Z") ? s + "Z" : s);
        const topicsNorm = (res.audioTopics || []).map((t) => ({
          id: t.id ?? t.Id,
          description: t.description ?? t.Description,
          startOfAudio: new Date(
            ensureUTC(t.startOfAudio ?? t.StartOfAudio),
          ).toISOString(),
          endOfAudio: new Date(
            ensureUTC(t.endOfAudio ?? t.EndOfAudio),
          ).toISOString(),
        }));

        setEeg(eegNorm);
        setTopics(topicsNorm);
      } catch (err) {
        console.error("ERRO AO CARREGAR:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  // ── Dados computados ───────────────────────────────────────────────────────
  const stats = useMemo(
    () => ({
      avgAtt: avg(eeg, "attention_value"),
      maxAtt: maxVal(eeg, "attention_value"),
      minAtt: minVal(eeg, "attention_value"),
      avgMed: avg(eeg, "meditation_value"),
      points: eeg.length,
    }),
    [eeg],
  );

  const heatmapData = useMemo(() => buildHeatmapData(eeg, 10), [eeg]);

  const focusZones = useMemo(() => buildFocusZones(eeg, 60, 3), [eeg]);

  // Tendência: compara primeira e segunda metade da sessão
  const trend = useMemo(() => {
    if (eeg.length < 10) return null;
    const half = Math.floor(eeg.length / 2);
    const first = avg(eeg.slice(0, half), "attention_value");
    const second = avg(eeg.slice(half), "attention_value");
    if (first == null || second == null) return null;
    const diff = second - first;
    return { first, second, diff };
  }, [eeg]);

  // Distribuição por faixas de atenção (para histograma)
  const attDistribution = useMemo(() => {
    const bands = [
      { label: "0-24", min: 0, max: 25 },
      { label: "25-49", min: 25, max: 50 },
      { label: "50-74", min: 50, max: 75 },
      { label: "75-100", min: 75, max: 101 },
    ];
    return bands.map((b) => ({
      label: b.label,
      count: eeg.filter(
        (e) => e.attention_value >= b.min && e.attention_value < b.max,
      ).length,
      color:
        b.min >= 75
          ? FM.greenDark
          : b.min >= 50
            ? FM.yellow
            : b.min >= 25
              ? FM.orange
              : FM.red,
    }));
  }, [eeg]);

  // Radar cerebral
  const radarData = useMemo(
    () =>
      eeg.length
        ? [
            { subject: "Delta", A: avg(eeg, "delta_power") },
            { subject: "α Low", A: avg(eeg, "low_alpha_power") },
            { subject: "α High", A: avg(eeg, "high_alpha_power") },
            { subject: "β Low", A: avg(eeg, "low_beta_power") },
            { subject: "β High", A: avg(eeg, "high_beta_power") },
            { subject: "γ", A: avg(eeg, "low_gamma_power") },
          ]
        : [],
    [eeg],
  );

  // Pizza dominância de ondas
  const pieData = useMemo(() => {
    if (!eeg.length) return [];
    return [
      { name: "Delta", value: avg(eeg, "delta_power"), color: FM.delta },
      {
        name: "Alpha",
        value: Math.round(
          (avg(eeg, "low_alpha_power") + avg(eeg, "high_alpha_power")) / 2,
        ),
        color: FM.alpha,
      },
      {
        name: "Beta",
        value: Math.round(
          (avg(eeg, "low_beta_power") + avg(eeg, "high_beta_power")) / 2,
        ),
        color: FM.beta,
      },
      { name: "Gamma", value: avg(eeg, "low_gamma_power"), color: FM.gamma },
    ].filter((d) => d.value > 0);
  }, [eeg]);

  // Comparação de tópicos (bar)
  const normalize = (str) =>
    str
      ?.trim()
      .toLowerCase()
      .normalize("NFD") // remove acentos
      .replace(/[\u0300-\u036f]/g, "");

  const topicsComparisonData = useMemo(() => {
    const grouped = {};

    topics.forEach((t) => {
      const key = normalize(t.description); // ← chave normalizada

      const s = new Date(t.startOfAudio).getTime();
      const e = new Date(t.endOfAudio).getTime();

      const slice = eeg.filter((x) => {
        const ts = new Date(x.timestamp).getTime();
        return ts >= s && ts <= e;
      });

      const att = avg(slice, "attention_value");
      const med = avg(slice, "meditation_value");

      if (!grouped[key]) {
        grouped[key] = {
          name: t.description.trim(), // ← mantém nome original bonito
          atts: [],
          meds: [],
        };
      }

      if (att != null) grouped[key].atts.push(att);
      if (med != null) grouped[key].meds.push(med);
    });

    return Object.values(grouped).map((g) => ({
      name: g.name,
      Atenção: g.atts.length
        ? Math.round(g.atts.reduce((a, b) => a + b, 0) / g.atts.length)
        : 0,
      Meditação: g.meds.length
        ? Math.round(g.meds.reduce((a, b) => a + b, 0) / g.meds.length)
        : 0,
    }));
  }, [topics, eeg]);
  // Amostrado para performance
  const eegSampled = useMemo(() => {
    if (eeg.length <= 500) return eeg;
    const step = Math.ceil(eeg.length / 500);
    return eeg.filter((_, i) => i % step === 0);
  }, [eeg]);

  const lines = [
    {
      key: "attention_value",
      label: "Atenção",
      color: FM.blue,
      strokeWidth: 2.5,
    },
    {
      key: "meditation_value",
      label: "Meditação",
      color: FM.purple,
      strokeWidth: 2,
    },
    { key: "delta_power", label: "Delta", color: FM.delta, strokeWidth: 1.5 },
    {
      key: "low_alpha_power",
      label: "Alpha (low)",
      color: FM.alpha,
      strokeWidth: 1.5,
    },
    {
      key: "high_beta_power",
      label: "Beta (high)",
      color: FM.beta,
      strokeWidth: 1.5,
    },
  ];

  // ── Loading / not found ────────────────────────────────────────────────────
  if (loading)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: 280,
          gap: 12,
          color: FM.textMuted,
          fontSize: 14,
        }}
      >
        <RefreshCw
          size={32}
          style={{ color: FM.orange, animation: "spin 0.8s linear infinite" }}
        />
        Carregando dashboard…
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );

  if (!session)
    return (
      <div
        style={{ textAlign: "center", padding: "4rem", color: FM.textMuted }}
      >
        <Brain size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
        <p style={{ fontSize: 15 }}>Sessão não encontrada.</p>
      </div>
    );

  const ac = attLabel(stats.avgAtt);
  const duration = formatDuration(
    session.session_start_time,
    session.session_end_time,
  );

  return (
    <div
      style={{
        maxWidth: 1000,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        paddingBottom: "3rem",
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

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: `linear-gradient(135deg, ${FM.orange}, ${FM.orangeDark})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Brain size={17} style={{ color: "#fff" }} />
          </div>
          <h1
            style={{ fontSize: 18, fontWeight: 700, color: FM.text, margin: 0 }}
          >
            Dashboard da Sessão
          </h1>
        </div>

        {stats.avgAtt != null && (
          <div
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              background: ac.bg,
              color: ac.fg,
              fontSize: 13,
              fontWeight: 700,
              border: `1px solid ${ac.border}`,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Brain size={13} style={{ color: ac.fg }} />
            Atenção média: {stats.avgAtt}% · {ac.text}
          </div>
        )}
      </div>

      {/* ── Info cards ──────────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <InfoCard
          icon={User}
          label="Paciente"
          value={session.patient_name}
          accentColor={FM.blue}
        />
        <InfoCard
          icon={Calendar}
          label="Início"
          value={formatDateFull(session.session_start_time)}
          accentColor={FM.orange}
        />
        <InfoCard
          icon={Calendar}
          label="Fim"
          value={
            session.session_end_time
              ? formatDateFull(session.session_end_time)
              : "Em andamento"
          }
          accentColor={FM.orange}
        />
        <InfoCard
          icon={Clock}
          label="Duração"
          value={duration}
          accentColor={FM.purple}
        />
      </div>

      {/* ── Gauge + estatísticas rápidas + tendência ─────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <SectionCard>
          <SectionTitle icon={Activity}>Estatísticas da Sessão</SectionTitle>
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: 14,
            }}
          >
            <StatPill
              label="Máx. Atenção"
              value={stats.maxAtt}
              color={FM.greenDark}
              icon={TrendingUp}
            />
            <StatPill
              label="Mín. Atenção"
              value={stats.minAtt}
              color={FM.red}
              icon={TrendingDown}
            />
            <StatPill
              label="Méd. Meditação"
              value={stats.avgMed}
              color={FM.purple}
              icon={Brain}
            />
            <StatPill
              label="Registros EEG"
              value={stats.points}
              color={FM.blue}
              icon={Zap}
            />
            <StatPill
              label="Zonas de Foco"
              value={focusZones.length}
              color={FM.orange}
              icon={Target}
            />
          </div>

          {/* Tendência 1ª vs 2ª metade */}
          {trend && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 14px",
                background:
                  trend.diff >= 5
                    ? FM.greenLight
                    : trend.diff <= -5
                      ? FM.redLight
                      : FM.yellowLight,
                border: `1px solid ${trend.diff >= 5 ? FM.greenBorder : trend.diff <= -5 ? FM.redBorder : FM.yellowBorder}`,
                borderRadius: 8,
                fontSize: 13,
              }}
            >
              {trend.diff >= 5 ? (
                <TrendingUp size={16} style={{ color: FM.greenDark }} />
              ) : trend.diff <= -5 ? (
                <TrendingDown size={16} style={{ color: FM.red }} />
              ) : (
                <Minus size={16} style={{ color: FM.yellow }} />
              )}
              <span
                style={{
                  fontWeight: 600,
                  color:
                    trend.diff >= 5
                      ? FM.greenDark
                      : trend.diff <= -5
                        ? FM.red
                        : FM.yellow,
                }}
              >
                {trend.diff >= 5
                  ? "Atenção crescente"
                  : trend.diff <= -5
                    ? "Atenção decrescente"
                    : "Atenção estável"}
              </span>
              <span style={{ color: FM.textMuted, fontSize: 12 }}>
                1ª metade: {trend.first} → 2ª metade: {trend.second} (
                {trend.diff >= 0 ? "+" : ""}
                {trend.diff} pts)
              </span>
            </div>
          )}
        </SectionCard>
      </div>
      {/* ── Engajamento por Tópico (Bar) ─────────────────────────────── */}
      {topics.length > 0 && topicsComparisonData.length > 0 && (
        <SectionCard>
          <SectionTitle icon={BarChart3}>Engajamento por Tópico</SectionTitle>
          <p
            style={{
              fontSize: 12,
              color: FM.textMuted,
              margin: "-10px 0 12px",
            }}
          >
            Comparação de atenção e meditação média em cada assunto detectado
            pela IA
          </p>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topicsComparisonData}
                margin={{ top: 10, right: 20, left: -20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={FM.borderLight}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: FM.textMuted }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: FM.textMuted }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Bar
                  dataKey="Atenção"
                  fill={FM.blue}
                  radius={[5, 5, 0, 0]}
                  barSize={28}
                />
                <Bar
                  dataKey="Meditação"
                  fill={FM.purple}
                  radius={[5, 5, 0, 0]}
                  barSize={28}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      )}
      {/* ── Histograma de distribuição da atenção ────────────────────── */}
      <SectionCard>
        <SectionTitle icon={BarChart3}>
          Distribuição do Nível de Atenção
        </SectionTitle>
        <p
          style={{ fontSize: 12, color: FM.textMuted, margin: "-10px 0 12px" }}
        >
          Quantos registros EEG caíram em cada faixa de atenção — útil para
          identificar padrões dominantes
        </p>
        <div style={{ height: 180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={attDistribution}
              margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={FM.borderLight}
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: FM.textMuted }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: FM.textMuted }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="count"
                name="Registros"
                radius={[5, 5, 0, 0]}
                barSize={40}
              >
                {attDistribution.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      {/* ── Gráfico principal EEG ────────────────────────────────────── */}
      <SectionCard>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 12,
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <SectionTitle icon={Activity}>
            Atividade Cerebral Temporal
          </SectionTitle>
          <p style={{ fontSize: 11, color: FM.textMuted, margin: 0 }}>
            Áreas sombreadas = tópicos detectados pela IA
          </p>
        </div>

        {/* Toggles */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            marginBottom: 14,
          }}
        >
          {lines.map((l) => (
            <button
              key={l.key}
              onClick={() => toggleLine(l.key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "4px 10px",
                borderRadius: 20,
                border: `1.5px solid ${visible[l.key] ? l.color : FM.border}`,
                background: visible[l.key] ? l.color + "15" : "transparent",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 600,
                color: visible[l.key] ? l.color : FM.textMuted,
                transition: "all .15s",
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: visible[l.key] ? l.color : FM.border,
                }}
              />
              {l.label}
            </button>
          ))}
        </div>

        {eeg.length === 0 ? (
          <div
            style={{
              height: 260,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <Activity size={32} style={{ color: FM.border }} />
            <p style={{ fontSize: 13, color: FM.textMuted }}>
              Nenhum dado EEG registrado.
            </p>
          </div>
        ) : (
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={eegSampled}
                margin={{ top: 4, right: 16, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={FM.borderLight}
                  vertical={false}
                />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={formatTimestamp}
                  stroke={FM.border}
                  tick={{ fontSize: 10, fill: FM.textMuted }}
                  tickLine={false}
                />
                <YAxis
                  stroke={FM.border}
                  tick={{ fontSize: 10, fill: FM.textMuted }}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 100]}
                />
                <Tooltip content={<CustomTooltip />} />

                {topics.map((t, i) => (
                  <ReferenceArea
                    key={i}
                    x1={t.startOfAudio}
                    x2={t.endOfAudio}
                    fill={FM.yellowLight}
                    fillOpacity={0.6}
                    stroke={FM.yellowBorder}
                    strokeOpacity={0.5}
                  />
                ))}

                {/* Zonas de foco — highlight verde */}
                {focusZones.slice(0, 5).map((z, i) => (
                  <ReferenceArea
                    key={`fz-${i}`}
                    x1={z.from}
                    x2={z.to}
                    fill={FM.greenLight}
                    fillOpacity={0.3}
                    stroke={FM.greenBorder}
                    strokeOpacity={0.4}
                  />
                ))}

                <ReferenceLine
                  y={50}
                  stroke={FM.border}
                  strokeDasharray="4 4"
                  label={{
                    value: "50",
                    position: "insideLeft",
                    fontSize: 9,
                    fill: FM.textMuted,
                  }}
                />
                <ReferenceLine
                  y={75}
                  stroke={FM.greenBorder}
                  strokeDasharray="3 3"
                  label={{
                    value: "75",
                    position: "insideLeft",
                    fontSize: 9,
                    fill: FM.greenDark,
                  }}
                />

                {lines.map(
                  (l) =>
                    visible[l.key] && (
                      <Line
                        key={l.key}
                        type="monotone"
                        dataKey={l.key}
                        stroke={l.color}
                        strokeWidth={l.strokeWidth}
                        dot={false}
                        isAnimationActive={false}
                        name={l.label}
                      />
                    ),
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </SectionCard>

      {/* ── Heatmap ──────────────────────────────────────────────────── */}
      <SectionCard>
        <SectionTitle>Heatmap de Atenção ao Longo do Tempo</SectionTitle>
        <p
          style={{ fontSize: 12, color: FM.textMuted, margin: "-10px 0 12px" }}
        >
          Cada barra = 10 segundos. Passe o cursor para ver o timestamp exato.
        </p>
        <HeatmapTimeline data={heatmapData} />
      </SectionCard>

      {/* ── Radar + Pizza ────────────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 12,
        }}
      >
        <SectionCard>
          <SectionTitle icon={Target}>Perfil de Ondas Cerebrais</SectionTitle>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke={FM.borderLight} />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fontSize: 10, fill: FM.textMuted }}
                />
                <Radar
                  name="Sessão"
                  dataKey="A"
                  stroke={FM.orange}
                  fill={FM.orange}
                  fillOpacity={0.35}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard>
          <SectionTitle icon={PieIcon}>Dominância de Ondas</SectionTitle>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      {/* ── Zonas de Foco ────────────────────────────────────────────── */}
      {focusZones.length > 0 && (
        <SectionCard>
          <SectionTitle icon={CheckCircle}>
            Zonas de Foco Identificadas
          </SectionTitle>
          <p
            style={{
              fontSize: 12,
              color: FM.textMuted,
              margin: "-10px 0 12px",
            }}
          >
            Períodos contínuos com atenção ≥ 60 — momentos de maior engajamento
            do paciente
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {focusZones.map((z, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 14px",
                  background: FM.greenLight,
                  border: `1px solid ${FM.greenBorder}`,
                  borderRadius: 8,
                }}
              >
                <CheckCircle
                  size={14}
                  style={{ color: FM.greenDark, flexShrink: 0 }}
                />
                <span
                  style={{ fontSize: 13, fontWeight: 600, color: FM.greenDark }}
                >
                  Zona {i + 1}
                </span>
                <span style={{ fontSize: 12, color: FM.textMid }}>
                  {formatTimestamp(z.from)} → {formatTimestamp(z.to)}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: FM.textMuted,
                    marginLeft: "auto",
                  }}
                >
                  {z.len} pontos
                </span>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* ── Tópicos detectados pela IA ───────────────────────────────── */}
      <SectionCard>
        <SectionTitle icon={Mic}>
          Tópicos Detectados pela IA ({topics.length})
        </SectionTitle>
        {topics.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
            <Mic size={28} style={{ color: FM.border, marginBottom: 8 }} />
            <p style={{ fontSize: 13, color: FM.textMuted }}>
              Nenhum tópico de áudio detectado.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {topics.map((t, i) => (
              <TopicRow
                key={t.id ?? i}
                topic={t}
                index={i}
                eeg={eeg}
                isExpanded={expanded === i}
                onToggle={() => setExpanded(expanded === i ? null : i)}
              />
            ))}
          </div>
        )}
      </SectionCard>

      {/* Alerta se atenção baixa */}
      {stats.avgAtt != null && stats.avgAtt < 40 && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            padding: "14px 16px",
            background: FM.redLight,
            border: `1px solid ${FM.redBorder}`,
            borderRadius: 10,
          }}
        >
          <AlertTriangle
            size={18}
            style={{ color: FM.red, flexShrink: 0, marginTop: 1 }}
          />
          <div>
            <p
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: FM.red,
                margin: "0 0 2px",
              }}
            >
              Atenção média abaixo de 40%
            </p>
            <p style={{ fontSize: 12, color: FM.textMid, margin: 0 }}>
              Este nível de engajamento pode indicar dificuldade de
              concentração, cansaço ou necessidade de adaptação da atividade.
              Considere revisar o contexto da sessão e comparar com sessões
              anteriores.
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: ${FM.bgSoft}; }
        ::-webkit-scrollbar-thumb { background: ${FM.orangeLight}; border-radius: 99px; }
      `}</style>
    </div>
  );
}
