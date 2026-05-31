import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar, Clock, CheckCircle, Hourglass, Filter,
  ArrowRight, RefreshCw, Users, ChevronLeft, ChevronRight,
  X, Search,
} from "lucide-react";
import { getSessionsByProfessional } from "../../services/sessionService";
import { getPatients } from "../../services/getPatient";

// ─── Paleta FocusMap ──────────────────────────────────────────────────────────
const FM = {
  orange: "#ff9e3d", orangeDark: "#f86f26", orangeDeep: "#b36f2b",
  orangeLight: "#ffce85", orangePale: "#fff4e8", orangeBorder: "#ffbc54",
  yellow: "#e8bb25", yellowLight: "#fffbe6", yellowBorder: "#f5da7a",
  green: "#3dff55", greenDark: "#1a9e2a", greenLight: "#edfff0", greenBorder: "#a3ffad",
  text: "#2a1a08", textMid: "#6f451b", textMuted: "#aa8661",
  bg: "#ffffff", bgSoft: "#faf7f4", border: "#ede0d0", borderLight: "#f5ece0",
};

const PAGE_SIZE = 10;

const formatDate = (iso) => new Date(iso).toLocaleDateString("pt-BR");
const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
const calcDuration = (start, end) => {
  if (!end) return null;
  const ms = new Date(end) - new Date(start);
  const min = Math.floor(ms / 60000);
  return min < 60 ? `${min} min` : `${Math.floor(min / 60)}h ${min % 60}min`;
};

function PatientAvatar({ name }) {
  const initial = name?.trim().charAt(0)?.toUpperCase() || "P";
  return (
    <div style={{
      width: 46, height: 46, borderRadius: "50%", flexShrink: 0,
      background: `linear-gradient(135deg, ${FM.orange}, ${FM.orangeDark})`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 18, fontWeight: 700, color: "#fff",
      boxShadow: `0 0 0 3px ${FM.orangePale}`,
    }}>
      {initial}
    </div>
  );
}

function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 14px", fontSize: 12, fontWeight: 600,
        borderRadius: 99, cursor: "pointer", transition: "all 0.15s",
        background: active ? FM.orangeDark : FM.bg,
        color: active ? "#fff" : FM.textMid,
        border: `1px solid ${active ? FM.orangeDark : FM.border}`,
        boxShadow: active ? `0 2px 6px ${FM.orangeLight}` : "none",
      }}
    >
      {label}
    </button>
  );
}

export default function HistoricoSessoes() {
  const navigate = useNavigate();

  // ── dados
  const [data, setData]       = useState({ items: [], totalCount: 0, totalFinished: 0, totalInProgress: 0, totalPages: 1 });
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── filtros
  const [page, setPage]               = useState(1);
  const [status, setStatus]           = useState("all");      // all | finished | in_progress
  const [patientId, setPatientId]     = useState("");
  const [dateFrom, setDateFrom]       = useState("");
  const [dateTo, setDateTo]           = useState("");

  // ── carregar lista de pacientes (para o select)
  useEffect(() => {
    getPatients().then((res) => {
      if (res.success) setPatients(res.data || []);
    });
  }, []);

  // ── busca paginada (re-executa quando qualquer filtro ou página muda)
  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        pageSize: PAGE_SIZE,
        status: status === "all" ? undefined : status,
        patientId: patientId || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      };
      const raw = await getSessionsByProfessional(params);
      // normaliza tanto camelCase quanto PascalCase do .NET
      const res = raw ? {
        items:          raw.items          ?? raw.Items          ?? [],
        totalCount:     raw.totalCount     ?? raw.TotalCount     ?? 0,
        totalFinished:  raw.totalFinished  ?? raw.TotalFinished  ?? 0,
        totalInProgress:raw.totalInProgress?? raw.TotalInProgress?? 0,
        totalPages:     raw.totalPages     ?? raw.TotalPages     ?? 1,
        page:           raw.page           ?? raw.Page           ?? 1,
      } : { items: [], totalCount: 0, totalFinished: 0, totalInProgress: 0, totalPages: 1, page: 1 };
      setData(res);
    } catch (err) {
      console.error("Erro ao carregar sessões:", err);
    } finally {
      setLoading(false);
    }
  }, [page, status, patientId, dateFrom, dateTo]);

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  // ao mudar filtro, voltar para página 1
  const applyFilter = (fn) => { fn(); setPage(1); };

  const hasActiveFilters = status !== "all" || patientId || dateFrom || dateTo;
  const clearFilters = () => {
    setStatus("all"); setPatientId(""); setDateFrom(""); setDateTo(""); setPage(1);
  };

  const finished   = data.totalFinished;
  const inProgress = data.totalInProgress;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "4px 0 3rem", display: "flex", flexDirection: "column", gap: 16 }}>

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: FM.text, margin: "0 0 3px", display: "flex", alignItems: "center", gap: 8 }}>
            <Calendar size={20} style={{ color: FM.orange }} />
            Histórico de Sessões
          </h1>
          <p style={{ fontSize: 13, color: FM.textMuted, margin: 0 }}>
            {data.totalCount > 0 ? `${data.totalCount} sessão(ões) no total` : "Visualize e acompanhe as sessões realizadas"}
          </p>
        </div>

      </div>

      {/* ── Painel de filtros ──────────────────────────────────────────────── */}
      <div style={{ background: FM.bg, border: `1px solid ${FM.border}`, borderRadius: 12, padding: "16px 20px", display: "flex", flexDirection: "column", gap: 14 }}>

        {/* linha 1 — chips de status */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <Filter size={14} style={{ color: FM.textMuted, flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: FM.textMuted, marginRight: 4 }}>Status:</span>
          <FilterChip label="Todas"        active={status === "all"}         onClick={() => applyFilter(() => setStatus("all"))} />
          <FilterChip label="Finalizadas"  active={status === "finished"}    onClick={() => applyFilter(() => setStatus("finished"))} />
          <FilterChip label="Em andamento" active={status === "in_progress"} onClick={() => applyFilter(() => setStatus("in_progress"))} />
        </div>

        {/* linha 2 — paciente + datas */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>

          {/* Paciente */}
          <div style={{ flex: "1 1 180px", position: "relative" }}>
            <Users size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: FM.textMuted, pointerEvents: "none" }} />
            <select
              value={patientId}
              onChange={(e) => applyFilter(() => setPatientId(e.target.value))}
              style={{ width: "100%", paddingLeft: 30, paddingRight: 12, paddingTop: 8, paddingBottom: 8, fontSize: 13, border: `1px solid ${FM.border}`, borderRadius: 8, background: FM.bg, color: patientId ? FM.text : FM.textMuted, outline: "none", cursor: "pointer" }}
            >
              <option value="">Todos os pacientes</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Data de */}
          <div style={{ flex: "1 1 140px", position: "relative" }}>
            <Calendar size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: FM.textMuted, pointerEvents: "none" }} />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => applyFilter(() => setDateFrom(e.target.value))}
              style={{ width: "100%", boxSizing: "border-box", paddingLeft: 30, paddingRight: 10, paddingTop: 8, paddingBottom: 8, fontSize: 13, border: `1px solid ${FM.border}`, borderRadius: 8, background: FM.bg, color: dateFrom ? FM.text : FM.textMuted, outline: "none" }}
            />
          </div>

          {/* Data até */}
          <div style={{ flex: "1 1 140px", position: "relative" }}>
            <Calendar size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: FM.textMuted, pointerEvents: "none" }} />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => applyFilter(() => setDateTo(e.target.value))}
              style={{ width: "100%", boxSizing: "border-box", paddingLeft: 30, paddingRight: 10, paddingTop: 8, paddingBottom: 8, fontSize: 13, border: `1px solid ${FM.border}`, borderRadius: 8, background: FM.bg, color: dateTo ? FM.text : FM.textMuted, outline: "none" }}
            />
          </div>

          {/* Limpar filtros */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              style={{ display: "flex", alignItems: "center", gap: 5, padding: "8px 14px", fontSize: 12, fontWeight: 600, borderRadius: 8, border: `1px solid ${FM.border}`, background: FM.bgSoft, color: FM.textMid, cursor: "pointer" }}
            >
              <X size={13} /> Limpar
            </button>
          )}
        </div>
      </div>

      {/* ── Loading ───────────────────────────────────────────────────────── */}
      {loading && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200, gap: 10, color: FM.textMuted, fontSize: 14 }}>
          <RefreshCw size={22} style={{ color: FM.orange, animation: "spin 0.8s linear infinite" }} />
          Carregando sessões...
        </div>
      )}

      {/* ── Empty ─────────────────────────────────────────────────────────── */}
      {!loading && data.items.length === 0 && (
        <div style={{ textAlign: "center", padding: "64px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: FM.orangePale, border: `1px solid ${FM.orangeBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Search size={24} style={{ color: FM.orange }} />
          </div>
          <p style={{ fontSize: 15, fontWeight: 600, color: FM.textMid, margin: 0 }}>Nenhuma sessão encontrada</p>
          <p style={{ fontSize: 13, color: FM.textMuted, margin: 0 }}>
            {hasActiveFilters ? "Tente ajustar os filtros para ver mais resultados" : "Ainda não há sessões registradas"}
          </p>
          {hasActiveFilters && (
            <button onClick={clearFilters} style={{ marginTop: 4, padding: "7px 16px", fontSize: 12, fontWeight: 600, borderRadius: 8, border: `1px solid ${FM.border}`, background: FM.bg, color: FM.textMid, cursor: "pointer" }}>
              Limpar filtros
            </button>
          )}
        </div>
      )}

      {/* ── Lista ─────────────────────────────────────────────────────────── */}
      {!loading && data.items.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {data.items.map((session) => {
            const isFinished = !!session.session_end_time;
            const duration   = calcDuration(session.session_start_time, session.session_end_time);
            return (
              <div
                key={session.id}
                style={{
                  background: FM.bg, border: `1px solid ${FM.border}`, borderRadius: 12,
                  padding: "16px 20px", display: "flex", alignItems: "center",
                  justifyContent: "space-between", gap: 16, flexWrap: "wrap",
                  transition: "border-color 0.15s, box-shadow 0.15s",
                  position: "relative", overflow: "hidden",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = FM.orangeBorder; e.currentTarget.style.boxShadow = `0 2px 12px ${FM.orangePale}`; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = FM.border; e.currentTarget.style.boxShadow = "none"; }}
              >
                {/* barra lateral de status */}
                <div style={{
                  position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
                  background: isFinished
                    ? `linear-gradient(180deg, ${FM.greenDark}, ${FM.green})`
                    : `linear-gradient(180deg, ${FM.yellow}, ${FM.orangeLight})`,
                  borderRadius: "12px 0 0 12px",
                }} />

                {/* esquerda */}
                <div style={{ display: "flex", alignItems: "center", gap: 14, paddingLeft: 8 }}>
                  <PatientAvatar name={session.patient_name} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: FM.text }}>{session.patient_name}</span>
                    <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: FM.textMuted }}>
                        <Calendar size={12} style={{ color: FM.orange }} />
                        {formatDate(session.session_start_time)}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: FM.textMuted }}>
                        <Clock size={12} style={{ color: FM.orange }} />
                        {formatTime(session.session_start_time)}
                      </span>
                    </div>
                    {isFinished ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, background: FM.greenLight, color: FM.greenDark, border: `1px solid ${FM.greenBorder}`, borderRadius: 99, padding: "3px 10px", width: "fit-content" }}>
                        <CheckCircle size={11} /> Finalizada {duration && `· ${duration}`}
                      </span>
                    ) : (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, background: FM.yellowLight, color: FM.yellow, border: `1px solid ${FM.yellowBorder}`, borderRadius: 99, padding: "3px 10px", width: "fit-content" }}>
                        <Hourglass size={11} /> Em andamento
                      </span>
                    )}
                  </div>
                </div>

                {/* direita */}
                <button
                  onClick={() => navigate(`/dashboard/sessao-detalhes/${session.id}`)}
                  style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", fontSize: 12, fontWeight: 600, background: `linear-gradient(135deg, ${FM.orange}, ${FM.orangeDark})`, border: "none", borderRadius: 8, color: "#fff", cursor: "pointer", boxShadow: `0 2px 6px ${FM.orangeLight}`, whiteSpace: "nowrap", flexShrink: 0 }}
                >
                  Ver detalhes <ArrowRight size={13} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Paginação ─────────────────────────────────────────────────────── */}
      {!loading && data.totalPages > 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 4 }}>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{ display: "flex", alignItems: "center", gap: 4, padding: "7px 12px", fontSize: 13, fontWeight: 500, borderRadius: 8, border: `1px solid ${FM.border}`, background: FM.bg, color: page === 1 ? FM.textMuted : FM.text, cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.5 : 1 }}
          >
            <ChevronLeft size={15} /> Anterior
          </button>

          {/* números de página */}
          {Array.from({ length: data.totalPages }, (_, i) => i + 1)
            .filter((n) => n === 1 || n === data.totalPages || Math.abs(n - page) <= 1)
            .reduce((acc, n, idx, arr) => {
              if (idx > 0 && n - arr[idx - 1] > 1) acc.push("...");
              acc.push(n);
              return acc;
            }, [])
            .map((item, idx) =>
              item === "..." ? (
                <span key={`ellipsis-${idx}`} style={{ fontSize: 13, color: FM.textMuted, padding: "0 4px" }}>…</span>
              ) : (
                <button
                  key={item}
                  onClick={() => setPage(item)}
                  style={{ width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: item === page ? 700 : 400, borderRadius: 8, border: `1px solid ${item === page ? FM.orangeDark : FM.border}`, background: item === page ? FM.orangeDark : FM.bg, color: item === page ? "#fff" : FM.text, cursor: "pointer" }}
                >
                  {item}
                </button>
              )
            )}

          <button
            onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
            disabled={page === data.totalPages}
            style={{ display: "flex", alignItems: "center", gap: 4, padding: "7px 12px", fontSize: 13, fontWeight: 500, borderRadius: 8, border: `1px solid ${FM.border}`, background: FM.bg, color: page === data.totalPages ? FM.textMuted : FM.text, cursor: page === data.totalPages ? "not-allowed" : "pointer", opacity: page === data.totalPages ? 0.5 : 1 }}
          >
            Próxima <ChevronRight size={15} />
          </button>
        </div>
      )}

      {/* rodapé com total */}
      {!loading && data.totalCount > 0 && (
        <p style={{ fontSize: 12, color: FM.textMuted, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, margin: 0 }}>
          <Users size={11} />
          Página {page} de {data.totalPages} · {data.totalCount} sessão(ões) no total
        </p>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        select option { color: ${FM.text}; }
        input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0.5; cursor: pointer; }
      `}</style>
    </div>
  );
}
