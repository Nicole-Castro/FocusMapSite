import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  CheckCircle,
  Hourglass,
  Filter,
  ArrowRight,
  RefreshCw,
  Users,
} from "lucide-react";
import { getSessionsByProfessional } from "../../services/sessionService";

// ─── Paleta FocusMap ──────────────────────────────────────────────────────────
const FM = {
  orange: "#ff9e3d",
  orangeDark: "#f86f26",
  orangeDeep: "#b36f2b",
  orangeLight: "#ffce85",
  orangePale: "#fff4e8",
  orangeBorder: "#ffbc54",
  yellow: "#e8bb25",
  yellowLight: "#fffbe6",
  yellowBorder: "#f5da7a",
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

const formatDate = (iso) => new Date(iso).toLocaleDateString("pt-BR");
const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
const calcDuration = (start, end) => {
  if (!end) return null;
  const ms = new Date(end) - new Date(start);
  const min = Math.floor(ms / 60000);
  return min < 60 ? `${min} min` : `${Math.floor(min / 60)}h ${min % 60}min`;
};

function PatientAvatar({ name }) {
  const initial = name?.trim().charAt(0)?.toUpperCase() || "P";
  return (
    <div
      style={{
        width: 46,
        height: 46,
        borderRadius: "50%",
        flexShrink: 0,
        background: `linear-gradient(135deg, ${FM.orange}, ${FM.orangeDark})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
        fontWeight: 700,
        color: "#fff",
        boxShadow: `0 0 0 3px ${FM.orangePale}`,
      }}
    >
      {initial}
    </div>
  );
}

export default function HistoricoSessoes() {
  const [sessions, setSessions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [selectFocused, setSelectFocused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const data = await getSessionsByProfessional();
        setSessions(data || []);
        const patientList = [
          ...new Map(
            data.map((s) => [
              s.patient_id,
              { id: s.patient_id, name: s.patient_name ?? "Paciente" },
            ]),
          ).values(),
        ];
        setPatients(patientList);
        setFiltered(data);
      } catch (err) {
        console.error("Erro ao carregar sessões:", err);
      }
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    if (!selectedPatientId) return setFiltered(sessions);
    setFiltered(sessions.filter((s) => s.patient_id === selectedPatientId));
  }, [selectedPatientId, sessions]);

  const finished = filtered.filter((s) => !!s.session_end_time).length;
  const inProgress = filtered.length - finished;

  if (loading) {
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
        Carregando sessões...
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 860,
        margin: "0 auto",
        padding: "4px 0 3rem",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: FM.text,
              margin: "0 0 3px",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Calendar size={20} style={{ color: FM.orange }} />
            Histórico de Sessões
          </h1>
          <p style={{ fontSize: 13, color: FM.textMuted, margin: 0 }}>
            Visualize e acompanhe as sessões realizadas
          </p>
        </div>

        {/* Mini-stats */}
        {filtered.length > 0 && (
          <div style={{ display: "flex", gap: 8 }}>
            <div
              style={{
                padding: "6px 12px",
                background: FM.greenLight,
                border: `1px solid ${FM.greenBorder}`,
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                color: FM.greenDark,
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <CheckCircle size={12} /> {finished} finalizada(s)
            </div>
            {inProgress > 0 && (
              <div
                style={{
                  padding: "6px 12px",
                  background: FM.yellowLight,
                  border: `1px solid ${FM.yellowBorder}`,
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  color: FM.yellow,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <Hourglass size={12} /> {inProgress} em andamento
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Filtro ────────────────────────────────────────────────────────── */}
      <div
        style={{
          background: FM.bg,
          border: `1px solid ${selectFocused ? FM.orange : FM.border}`,
          borderRadius: 10,
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          boxShadow: selectFocused ? `0 0 0 3px ${FM.orangePale}` : "none",
          transition: "border-color 0.15s, box-shadow 0.15s",
        }}
      >
        <Filter
          size={15}
          style={{
            color: selectFocused ? FM.orange : FM.textMuted,
            flexShrink: 0,
          }}
        />
        <select
          value={selectedPatientId}
          onChange={(e) => setSelectedPatientId(e.target.value)}
          onFocus={() => setSelectFocused(true)}
          onBlur={() => setSelectFocused(false)}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            fontSize: 14,
            background: "transparent",
            color: selectedPatientId ? FM.text : FM.textMuted,
            cursor: "pointer",
          }}
        >
          <option value="">Todos os pacientes</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        {selectedPatientId && (
          <button
            onClick={() => setSelectedPatientId("")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: FM.textMuted,
              fontSize: 16,
              padding: 0,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        )}
      </div>

      {/* ── Empty ─────────────────────────────────────────────────────────── */}
      {filtered.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "64px 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: FM.orangePale,
              border: `1px solid ${FM.orangeBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Calendar size={24} style={{ color: FM.orange }} />
          </div>
          <p
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: FM.textMid,
              margin: 0,
            }}
          >
            Nenhuma sessão encontrada
          </p>
          <p style={{ fontSize: 13, color: FM.textMuted, margin: 0 }}>
            {selectedPatientId
              ? "Esse paciente não possui sessões registradas"
              : "Ainda não há sessões registradas"}
          </p>
        </div>
      )}

      {/* ── Lista ─────────────────────────────────────────────────────────── */}
      {filtered.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((session) => {
            const isFinished = !!session.session_end_time;
            const duration = calcDuration(
              session.session_start_time,
              session.session_end_time,
            );

            return (
              <div
                key={session.id}
                style={{
                  background: FM.bg,
                  border: `1px solid ${FM.border}`,
                  borderRadius: 12,
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                  flexWrap: "wrap",
                  transition: "border-color 0.15s, box-shadow 0.15s",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = FM.orangeBorder;
                  e.currentTarget.style.boxShadow = `0 2px 12px ${FM.orangePale}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = FM.border;
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* indicador lateral de status */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 3,
                    background: isFinished
                      ? `linear-gradient(180deg, ${FM.greenDark}, ${FM.green})`
                      : `linear-gradient(180deg, ${FM.yellow}, ${FM.orangeLight})`,
                    borderRadius: "12px 0 0 12px",
                  }}
                />

                {/* Esquerda — avatar + info */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    paddingLeft: 8,
                  }}
                >
                  <PatientAvatar name={session.patient_name} />

                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 4 }}
                  >
                    <span
                      style={{ fontSize: 15, fontWeight: 600, color: FM.text }}
                    >
                      {session.patient_name}
                    </span>

                    <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: 12,
                          color: FM.textMuted,
                        }}
                      >
                        <Calendar size={12} style={{ color: FM.orange }} />
                        {formatDate(session.session_start_time)}
                      </span>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: 12,
                          color: FM.textMuted,
                        }}
                      >
                        <Clock size={12} style={{ color: FM.orange }} />
                        {formatTime(session.session_start_time)}
                      </span>
                    </div>

                    {/* Status badge */}
                    {isFinished ? (
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
                          width: "fit-content",
                        }}
                      >
                        <CheckCircle size={11} /> Finalizada{" "}
                        {duration && `· ${duration}`}
                      </span>
                    ) : (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          fontSize: 11,
                          fontWeight: 600,
                          background: FM.yellowLight,
                          color: FM.yellow,
                          border: `1px solid ${FM.yellowBorder}`,
                          borderRadius: 99,
                          padding: "3px 10px",
                          width: "fit-content",
                        }}
                      >
                        <Hourglass size={11} /> Em andamento
                      </span>
                    )}
                  </div>
                </div>

                {/* Direita — botão detalhes */}
                <button
                  onClick={() =>
                    navigate(`/dashboard/sessao-detalhes/${session.id}`)
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "9px 16px",
                    fontSize: 12,
                    fontWeight: 600,
                    background: `linear-gradient(135deg, ${FM.orange}, ${FM.orangeDark})`,
                    border: "none",
                    borderRadius: 8,
                    color: "#fff",
                    cursor: "pointer",
                    boxShadow: `0 2px 6px ${FM.orangeLight}`,
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  Ver detalhes <ArrowRight size={13} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Total rodapé */}
      {filtered.length > 0 && (
        <p
          style={{
            fontSize: 12,
            color: FM.textMuted,
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
            margin: 0,
          }}
        >
          <Users size={11} /> {filtered.length} sessão(ões) exibida(s)
        </p>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        select option { color: ${FM.text}; }
      `}</style>
    </div>
  );
}
