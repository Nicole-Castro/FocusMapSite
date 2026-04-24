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
  Wind,
  ChevronDown,
  ChevronUp,
  PieChart as PieIcon,
  BarChart3,
  Target,
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

// ─── paleta ──────────────────────────────────────────────────────────────────

const C = {
  orange: "#f86f26",
  orangeL: "#ff9e3d",
  attention: "#3b82f6",
  meditation: "#10b981",
  delta: "#8b5cf6",
  alpha: "#f59e0b",
  beta: "#ef4444",
  gamma: "#06b6d4",
  audio: "#fde68a",
  audioBorder: "#f59e0b",
  gray: "#9ca3af",
};

// ─── helpers ─────────────────────────────────────────────────────────────────

function pad(n) {
  return String(n).padStart(2, "0");
}

function formatDuration(start, end) {
  if (!start || !end) return "—";
  const s = Math.round((new Date(end) - new Date(start)) / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${pad(m % 60)}m`;
  return `${m}m ${pad(s % 60)}s`;
}

function formatTimestamp(t) {
  if (!t) return "";
  const d = new Date(t);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function formatDateFull(t) {
  if (!t) return "—";
  return new Date(t).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function avg(arr, key) {
  const vals = arr.map((d) => Number(d[key])).filter((v) => !isNaN(v));
  if (!vals.length) return null;
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

function maxVal(arr, key) {
  const vals = arr.map((d) => d[key]).filter((v) => v != null && !isNaN(v));
  return vals.length ? Math.round(Math.max(...vals)) : null;
}

function minVal(arr, key) {
  const vals = arr.map((d) => d[key]).filter((v) => v != null && !isNaN(v));
  return vals.length ? Math.round(Math.min(...vals)) : null;
}

function attLabel(v) {
  if (v == null) return { text: "—", bg: "#f3f4f6", fg: "#6b7280" };
  if (v >= 75) return { text: "Alto", bg: "#d1fae5", fg: "#065f46" };
  if (v >= 50) return { text: "Médio", bg: "#fef3c7", fg: "#92400e" };
  return { text: "Baixo", bg: "#fee2e2", fg: "#991b1b" };
}

// ─── tooltip customizado ──────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.97)",
        border: "0.5px solid #e5e7eb",
        borderRadius: 8,
        padding: "8px 12px",
        fontSize: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        minWidth: 160,
        zIndex: 100,
      }}
    >
      <p style={{ color: "#6b7280", marginBottom: 6, fontWeight: 500 }}>
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
          <span style={{ color: "#374151" }}>{p.name}:</span>
          <span style={{ fontWeight: 600, color: "#111827" }}>
            {Math.round(p.value ?? 0)}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── sub-componentes ─────────────────────────────────────────────────────────

function InfoCard({ icon: Icon, label, value, sub, accent = C.orange }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "0.5px solid #e5e7eb",
        borderRadius: 12,
        padding: "1rem 1.25rem",
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          background: accent + "18",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={18} color={accent} />
      </div>
      <div style={{ minWidth: 0 }}>
        <p
          style={{
            margin: 0,
            fontSize: 11,
            color: "#9ca3af",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {label}
        </p>
        <p
          style={{
            margin: "3px 0 0",
            fontSize: 15,
            fontWeight: 600,
            color: "#111827",
          }}
        >
          {value ?? "—"}
        </p>
        {sub && (
          <p style={{ margin: "2px 0 0", fontSize: 11, color: "#6b7280" }}>
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

function StatPill({ label, value, color }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        padding: "10px 16px",
        background: color + "12",
        border: `0.5px solid ${color}40`,
        borderRadius: 10,
        minWidth: 80,
      }}
    >
      <span
        style={{
          fontSize: 20,
          fontWeight: 700,
          color,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value ?? "—"}
      </span>
      <span
        style={{
          fontSize: 10,
          color: "#6b7280",
          textAlign: "center",
          lineHeight: 1.2,
        }}
      >
        {label}
      </span>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h3
      style={{
        fontSize: 13,
        fontWeight: 600,
        color: "#374151",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        margin: "0 0 1rem",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span
        style={{
          width: 3,
          height: 16,
          background: C.orange,
          borderRadius: 2,
          flexShrink: 0,
        }}
      />
      {children}
    </h3>
  );
}
function buildHeatmapData(eeg, bucketSizeSeconds = 10) {
  if (!eeg.length) return [];

  const start = new Date(eeg[0].timestamp).getTime();

  const buckets = {};

  eeg.forEach((e) => {
    const t = new Date(e.timestamp).getTime();
    const diffSec = Math.floor((t - start) / 1000);

    const bucket = Math.floor(diffSec / bucketSizeSeconds);

    if (!buckets[bucket]) {
      buckets[bucket] = {
        values: [],
        time: t,
      };
    }

    buckets[bucket].values.push(e.attention_value);
  });

  return Object.keys(buckets).map((k) => {
    const b = buckets[k];
    const avg = b.values.reduce((a, v) => a + v, 0) / b.values.length;

    return {
      time: new Date(b.time).toISOString(),
      attention: Math.round(avg),
    };
  });
}
function getHeatColor(value) {
  if (value == null) return "#e5e7eb";

  if (value >= 75) return "#16a34a"; // verde
  if (value >= 50) return "#eab308"; // amarelo
  if (value >= 25) return "#f97316"; // laranja
  return "#dc2626"; // vermelho
}

function TopicRow({ topic, index, eeg, isExpanded, onToggle }) {
  const start = new Date(topic.startOfAudio);
  const end = new Date(topic.endOfAudio);

  const slice = eeg.filter((e) => {
    const t = new Date(e.timestamp).getTime();
    return t >= start && t <= end;
  });
  const avgAtt = avg(slice, "attention_value");
  const { text: attText, bg: attBg, fg: attFg } = attLabel(avgAtt);

  return (
    <div
      style={{
        border: "0.5px solid #e5e7eb",
        borderRadius: 10,
        overflow: "hidden",
        background: "#fff",
        transition: "box-shadow .15s",
      }}
    >
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 16px",
          background: "none",
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
            background: C.orange + "18",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 700,
            color: C.orange,
          }}
        >
          {index + 1}
        </span>

        <Mic size={14} color="#9ca3af" style={{ flexShrink: 0 }} />

        <span
          style={{
            flex: 1,
            fontSize: 13,
            color: "#1f2937",
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
              background: attBg,
              color: attFg,
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {avgAtt}% · {attText}
          </span>
        )}

        <span style={{ fontSize: 11, color: "#9ca3af", flexShrink: 0 }}>
          {formatTimestamp(topic.startOfAudio)} →{" "}
          {formatTimestamp(topic.endOfAudio)}
        </span>

        {isExpanded ? (
          <ChevronUp size={14} color="#9ca3af" />
        ) : (
          <ChevronDown size={14} color="#9ca3af" />
        )}
      </button>

      {isExpanded && slice.length > 1 && (
        <div
          style={{ padding: "0 16px 16px", borderTop: "0.5px solid #f3f4f6" }}
        >
          <p style={{ fontSize: 11, color: "#9ca3af", margin: "10px 0 8px" }}>
            Atenção durante este tópico ({slice.length} pontos)
          </p>
          <div style={{ height: 80 }}>
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
                      stopColor={C.attention}
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="95%"
                      stopColor={C.attention}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <XAxis dataKey="timestamp" hide />
                <YAxis domain={[0, 100]} hide />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="attention_value"
                  stroke={C.attention}
                  strokeWidth={2}
                  fill={`url(#grad-${index})`}
                  dot={false}
                  name="Atenção"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      {isExpanded && slice.length <= 1 && (
        <p style={{ padding: "8px 16px 14px", fontSize: 12, color: "#9ca3af" }}>
          Dados insuficientes para este intervalo.
        </p>
      )}
    </div>
  );
}

// ─── main ─────────────────────────────────────────────────────────────────────

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
    delta_power: true,
    low_alpha_power: true,
    high_alpha_power: true,
    low_beta_power: true,
    high_beta_power: true,
  });

  const toggleLine = (key) => setVisible((v) => ({ ...v, [key]: !v[key] }));
  useEffect(() => {
    async function load() {
      try {
        const res = await getSessionDashboard(id);

        console.log("RES COMPLETO:", res);

        if (!res) {
          setLoading(false);
          return;
        }

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

        function ensureUTC(dateStr) {
          if (!dateStr) return null;
          return dateStr.endsWith("Z") ? dateStr : dateStr + "Z";
        }

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

    load(); // 🔥 ESSENCIAL
  }, [id]);
  // ── estatísticas e transformações de dados ──────────────────────────────────

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
  const heatmapData = useMemo(() => {
    return buildHeatmapData(eeg, 10); // blocos de 10s
  }, [eeg]);

  // Dados para o Gráfico Radar (Perfil Cerebral)
  const radarData = useMemo(() => {
    if (!eeg.length) return [];
    return [
      { subject: "Delta", A: avg(eeg, "delta_power"), fullMark: 100 },
      { subject: "Alpha Low", A: avg(eeg, "low_alpha_power"), fullMark: 100 },
      { subject: "Alpha High", A: avg(eeg, "high_alpha_power"), fullMark: 100 },
      { subject: "Beta Low", A: avg(eeg, "low_beta_power"), fullMark: 100 },
      { subject: "Beta High", A: avg(eeg, "high_beta_power"), fullMark: 100 },
      { subject: "Gamma", A: avg(eeg, "low_gamma_power"), fullMark: 100 },
    ];
  }, [eeg]);

  // Dados para o Gráfico de Pizza (Distribuição de Ondas)
  const pieData = useMemo(() => {
    if (!eeg.length) return [];
    return [
      { name: "Delta", value: avg(eeg, "delta_power"), color: C.delta },
      {
        name: "Alpha",
        value: (avg(eeg, "low_alpha_power") + avg(eeg, "high_alpha_power")) / 2,
        color: C.alpha,
      },
      {
        name: "Beta",
        value: (avg(eeg, "low_beta_power") + avg(eeg, "high_beta_power")) / 2,
        color: C.beta,
      },
      { name: "Gamma", value: avg(eeg, "low_gamma_power"), color: C.gamma },
    ].filter((d) => d.value > 0);
  }, [eeg]);

  // Dados para Comparação de Atenção por Tópico (Bar Chart)
  const topicsComparisonData = useMemo(() => {
    return topics.map((topic, i) => {
      const start = new Date(topic.startOfAudio).getTime();
      const end = new Date(topic.endOfAudio).getTime();

      const slice = eeg.filter((e) => {
        const t = new Date(e.timestamp);
        return t >= start && t <= end;
      });

      const att = avg(slice, "attention_value");
      const med = avg(slice, "meditation_value");
      console.log({
        topic,
        start,
        end,
        eegFirst: eeg[0],
        sliceSize: slice.length,
      });
      return {
        name: `T${i + 1}`,
        fullName: topic.description,
        Atenção: att ?? 0,
        Meditação: med ?? 0,
      };
    });
  }, [topics, eeg]);

  const eegSampled = useMemo(() => {
    if (eeg.length <= 500) return eeg;
    const step = Math.ceil(eeg.length / 500);
    return eeg.filter((_, i) => i % step === 0);
  }, [eeg]);

  const lines = [
    {
      key: "attention_value",
      label: "Atenção",
      color: C.attention,
      strokeWidth: 2.5,
    },
    {
      key: "meditation_value",
      label: "Meditação",
      color: C.meditation,
      strokeWidth: 2,
    },
    { key: "delta_power", label: "Delta", color: C.delta, strokeWidth: 1.5 },
    {
      key: "low_alpha_power",
      label: "Alpha (low)",
      color: C.alpha,
      strokeWidth: 1.5,
    },
    {
      key: "high_beta_power",
      label: "Beta (high)",
      color: C.beta,
      strokeWidth: 1.5,
    },
  ];

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 300,
          gap: 12,
          flexDirection: "column",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: `3px solid ${C.orange}22`,
            borderTop: `3px solid ${C.orange}`,
            animation: "spin 0.8s linear infinite",
          }}
        />
        <span style={{ fontSize: 13, color: "#6b7280" }}>
          Carregando sessão…
        </span>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!session) {
    return (
      <div style={{ textAlign: "center", padding: "4rem", color: "#6b7280" }}>
        <Brain size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
        <p style={{ fontSize: 15 }}>Sessão não encontrada.</p>
      </div>
    );
  }

  const {
    text: avgAttText,
    bg: avgAttBg,
    fg: avgAttFg,
  } = attLabel(stats.avgAtt);
  const duration = formatDuration(
    session.session_start_time,
    session.session_end_time,
  );
  function HeatmapTimeline({ data }) {
    if (!data.length) {
      return (
        <div style={{ textAlign: "center", padding: "1rem", color: "#9ca3af" }}>
          Sem dados para heatmap
        </div>
      );
    }

    return (
      <div
        style={{
          display: "flex",
          gap: 2,
          overflowX: "auto",
          paddingBottom: 6,
        }}
      >
        {data.map((d, i) => (
          <div
            key={i}
            title={`${formatTimestamp(d.time)} - ${d.attention}%`}
            style={{
              width: 10,
              height: 40,
              background: getHeatColor(d.attention),
              borderRadius: 2,
              flexShrink: 0,
              transition: "all .2s",
            }}
          />
        ))}
      </div>
    );
  }
  return (
    <div
      style={{
        maxWidth: 1000,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        paddingBottom: "3rem",
      }}
    >
      {/* ── cabeçalho ─────────────────────────────────────────────────────── */}
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
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            color: "#6b7280",
            padding: 0,
          }}
        >
          <ArrowLeft size={16} />
          Voltar ao histórico
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: `linear-gradient(135deg, ${C.orangeL}, ${C.orange})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Brain size={18} color="#fff" />
          </div>
          <div>
            <h1
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#111827",
                margin: 0,
              }}
            >
              Dashboard da Sessão
            </h1>
          </div>
        </div>

        {stats.avgAtt != null && (
          <div
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              background: avgAttBg,
              color: avgAttFg,
              fontSize: 13,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Brain size={14} color={avgAttFg} />
            Atenção média: {stats.avgAtt}% · {avgAttText}
          </div>
        )}
      </div>

      {/* ── cards de info ─────────────────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))",
          gap: 12,
        }}
      >
        <InfoCard
          icon={User}
          label="Paciente"
          value={session.patient_name}
          accent={C.attention}
        />
        <InfoCard
          icon={Calendar}
          label="Início"
          value={formatDateFull(session.session_start_time)}
          accent={C.orange}
        />
        <InfoCard
          icon={Calendar}
          label="Fim"
          value={formatDateFull(session.session_end_time)}
          accent={C.orange}
        />
        <InfoCard
          icon={Clock}
          label="Duração total"
          value={duration}
          accent={C.meditation}
        />
      </div>

      {/* ── SEÇÃO: Insights Profundos ────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 12,
        }}
      >
        {/* Radar Chart: Perfil de Ondas */}
        <div
          style={{
            background: "#fff",
            border: "0.5px solid #e5e7eb",
            borderRadius: 12,
            padding: "1.25rem",
          }}
        >
          <SectionTitle>
            <Target size={14} /> Perfil Cerebral Médio
          </SectionTitle>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fontSize: 10, fill: "#6b7280" }}
                />
                <Radar
                  name="Média da Sessão"
                  dataKey="A"
                  stroke={C.orange}
                  fill={C.orange}
                  fillOpacity={0.5}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Distribuição de Frequência */}
        <div
          style={{
            background: "#fff",
            border: "0.5px solid #e5e7eb",
            borderRadius: 12,
            padding: "1.25rem",
          }}
        >
          <SectionTitle>
            <PieIcon size={14} /> Dominância de Ondas
          </SectionTitle>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── gráfico principal EEG ─────────────────────────────────────────── */}
      <div
        style={{
          background: "#fff",
          border: "0.5px solid #e5e7eb",
          borderRadius: 12,
          padding: "1.25rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "1rem",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <SectionTitle>
            <Activity size={14} /> Atividade cerebral temporal
          </SectionTitle>
          <p
            style={{
              fontSize: 11,
              color: "#9ca3af",
              margin: 0,
              alignSelf: "flex-end",
            }}
          >
            Áreas amarelas = tópicos detectados pela IA
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            marginBottom: "1rem",
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
                border: `1.5px solid ${visible[l.key] ? l.color : "#e5e7eb"}`,
                background: visible[l.key] ? l.color + "15" : "transparent",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 500,
                color: visible[l.key] ? l.color : "#9ca3af",
                transition: "all .15s",
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: visible[l.key] ? l.color : "#d1d5db",
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
            <Activity size={32} style={{ color: "#d1d5db" }} />
            <p style={{ fontSize: 13, color: "#9ca3af" }}>
              Nenhum dado EEG registrado nesta sessão.
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
                  stroke="#f3f4f6"
                  vertical={false}
                />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={formatTimestamp}
                  stroke="#d1d5db"
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  tickLine={false}
                />
                <YAxis
                  stroke="#d1d5db"
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
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
                    fill={C.audio}
                    fillOpacity={0.4}
                    stroke={C.audioBorder}
                    strokeOpacity={0.3}
                  />
                ))}

                <ReferenceLine y={50} stroke="#e5e7eb" strokeDasharray="4 4" />

                {lines.map((l) =>
                  visible[l.key] ? (
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
                  ) : null,
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      {/* ── heatmap de atenção ao longo do tempo ─────────────────────────────── */}
      <div
        style={{
          background: "#fff",
          border: "0.5px solid #e5e7eb",
          borderRadius: 12,
          padding: "1.25rem",
        }}
      >
        <SectionTitle>Heatmap de Atenção ao Longo do Tempo</SectionTitle>

        <HeatmapTimeline data={heatmapData} />

        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 10,
            fontSize: 11,
            color: "#6b7280",
          }}
        >
          <span>🔴 Baixo</span>
          <span>🟠 Médio-baixo</span>
          <span>🟡 Médio</span>
          <span>🟢 Alto</span>
        </div>
      </div>
      {/* ── Comparação de Tópicos (Bar Chart) ──────────────────────────────── */}
      {topics.length > 0 && (
        <div
          style={{
            background: "#fff",
            border: "0.5px solid #e5e7eb",
            borderRadius: 12,
            padding: "1.25rem",
          }}
        >
          <SectionTitle>
            <BarChart3 size={14} /> Engajamento por Tópico
          </SectionTitle>
          <div style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topicsComparisonData}
                margin={{ top: 20, right: 30, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Bar
                  dataKey="Atenção"
                  fill={C.attention}
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                />
                <Bar
                  dataKey="Meditação"
                  fill={C.meditation}
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── tópicos detectados ────────────────────────────────────────────── */}
      <div
        style={{
          background: "#fff",
          border: "0.5px solid #e5e7eb",
          borderRadius: 12,
          padding: "1.25rem",
        }}
      >
        <SectionTitle>
          Assuntos detectados pela IA ({topics.length})
        </SectionTitle>

        {topics.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
            <Mic size={28} style={{ color: "#d1d5db", marginBottom: 8 }} />
            <p style={{ fontSize: 13, color: "#9ca3af" }}>
              Nenhum tópico de áudio detectado nesta sessão.
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
      </div>
    </div>
  );
}
