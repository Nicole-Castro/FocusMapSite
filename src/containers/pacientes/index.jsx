import { useEffect, useState } from "react";
import {
  RefreshCw, Search, Trash2,
  ChevronLeft, ChevronRight, MapPin, Users, PlusCircle,
  TrendingUp
} from "lucide-react";
import { getPatients } from "../../services/getPatient";
import { useNavigate } from "react-router-dom";

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
  text:         "#2a1a08",
  textMid:      "#6f451b",
  textMuted:    "#aa8661",
  bg:           "#ffffff",
  bgSoft:       "#faf7f4",
  border:       "#ede0d0",
  borderLight:  "#f5ece0",
};

function PatientAvatar({ name }) {
  const initial = name?.trim().charAt(0)?.toUpperCase() || "P";
  return (
    <div style={{
      width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
      background: `linear-gradient(135deg, ${FM.orange}, ${FM.orangeDark})`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 15, fontWeight: 700, color: "#fff",
      boxShadow: `0 0 0 2px ${FM.orangePale}`,
    }}>
      {initial}
    </div>
  );
}

export default function PacientesList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchFocused, setSearchFocused] = useState(false);

  const itemsPerPage = 8;
  const navigate = useNavigate();

  async function loadPatients() {
    try {
      setLoading(true);
      setError("");
      const res = await getPatients();
      if (!res.success) { setError(res.message || "Erro ao carregar pacientes"); return; }
      setPatients(res.data ?? []);
    } catch {
      setError("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadPatients(); }, []);

  const filteredPatients = patients.filter((p) =>
    p?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPatients = filteredPatients.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = (patient) => {
    if (confirm(`Excluir ${patient.name}?`)) alert("Implementar delete real aqui");
  };

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "4px 0 3rem", display: "flex", flexDirection: "column", gap: 16 }}>

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: FM.text, margin: "0 0 3px", display: "flex", alignItems: "center", gap: 8 }}>
            <Users size={20} style={{ color: FM.orange }} />
            Pacientes
          </h1>
          <p style={{ fontSize: 13, color: FM.textMuted, margin: 0 }}>
            {filteredPatients.length} paciente(s) encontrado(s)
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={() => navigate("/dashboard/cadastro-paciente")}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              background: `linear-gradient(135deg, ${FM.orange}, ${FM.orangeDark})`,
              border: "none", borderRadius: 8, padding: "9px 16px",
              fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer",
              boxShadow: `0 2px 8px ${FM.orangeLight}`,
            }}
          >
            <PlusCircle size={15} /> Novo Paciente
          </button>

          <button
            onClick={loadPatients}
            title="Atualizar lista"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 38, height: 38,
              background: FM.bg, border: `1px solid ${FM.border}`,
              borderRadius: 8, cursor: "pointer", color: FM.textMuted,
            }}
          >
            <RefreshCw size={16} style={{ animation: loading ? "spin 0.8s linear infinite" : "none" }} />
          </button>
        </div>
      </div>

      {/* ── Search ────────────────────────────────────────────────────────── */}
      <div style={{
        background: FM.bg, border: `1px solid ${searchFocused ? FM.orange : FM.border}`,
        borderRadius: 10, padding: "10px 14px",
        display: "flex", alignItems: "center", gap: 10,
        boxShadow: searchFocused ? `0 0 0 3px ${FM.orangePale}` : "none",
        transition: "border-color 0.15s, box-shadow 0.15s",
      }}>
        <Search size={16} style={{ color: searchFocused ? FM.orange : FM.textMuted, flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Buscar por nome ou e-mail..."
          value={searchTerm}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          style={{
            flex: 1, border: "none", outline: "none", fontSize: 14,
            background: "transparent", color: FM.text,
          }}
        />
        {searchTerm && (
          <button
            onClick={() => { setSearchTerm(""); setCurrentPage(1); }}
            style={{ background: "none", border: "none", cursor: "pointer", color: FM.textMuted, fontSize: 16, lineHeight: 1, padding: 0 }}
          >
            ×
          </button>
        )}
      </div>

      {/* ── Loading ───────────────────────────────────────────────────────── */}
      {loading && (
        <div style={{ textAlign: "center", padding: "64px 0", color: FM.textMuted, fontSize: 14, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <RefreshCw size={32} style={{ color: FM.orange, animation: "spin 0.8s linear infinite" }} />
          Carregando pacientes...
        </div>
      )}

      {/* ── Error ─────────────────────────────────────────────────────────── */}
      {error && (
        <div style={{ background: FM.redLight, border: `1px solid ${FM.redBorder}`, borderRadius: 8, padding: "12px 16px", fontSize: 13, color: FM.red }}>
          {error}
        </div>
      )}

      {/* ── Empty ─────────────────────────────────────────────────────────── */}
      {!loading && !error && filteredPatients.length === 0 && (
        <div style={{ textAlign: "center", padding: "64px 0", color: FM.textMuted }}>
          <Users size={36} style={{ color: FM.orangeLight, marginBottom: 12 }} />
          <p style={{ fontSize: 15, fontWeight: 600, color: FM.textMid, margin: "0 0 4px" }}>Nenhum paciente encontrado</p>
          <p style={{ fontSize: 13, margin: 0 }}>
            {searchTerm ? "Tente outro termo de busca" : "Adicione o primeiro paciente"}
          </p>
        </div>
      )}

      {/* ── Tabela ────────────────────────────────────────────────────────── */}
      {!loading && currentPatients.length > 0 && (
        <div style={{ background: FM.bg, border: `1px solid ${FM.border}`, borderRadius: 12, overflow: "hidden" }}>

          {/* Cabeçalho */}
          <div style={{
            display: "grid", gridTemplateColumns: "2fr 2fr 1fr",
            padding: "10px 20px",
            background: FM.bgSoft,
            borderBottom: `1px solid ${FM.borderLight}`,
          }}>
            {["Paciente", "E-mail", "Ações"].map((col, i) => (
              <span key={col} style={{
                fontSize: 11, fontWeight: 600, letterSpacing: "0.09em",
                textTransform: "uppercase", color: FM.textMuted,
                textAlign: i === 2 ? "center" : "left",
              }}>
                {col}
              </span>
            ))}
          </div>

          {/* Linhas */}
          {currentPatients.map((patient, idx) => (
            <div
              key={patient.id}
              style={{
                display: "grid", gridTemplateColumns: "2fr 2fr 1fr",
                padding: "13px 20px", alignItems: "center",
                borderTop: idx === 0 ? "none" : `1px solid ${FM.borderLight}`,
                background: FM.bg,
                transition: "background 0.12s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = FM.orangePale}
              onMouseLeave={(e) => e.currentTarget.style.background = FM.bg}
            >
              {/* Paciente */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <PatientAvatar name={patient.name} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: FM.text, margin: "0 0 1px" }}>
                    {patient.name}
                  </p>
                  <p style={{ fontSize: 11, color: FM.textMuted, margin: 0, fontFamily: "monospace" }}>
                    #{patient.id?.slice(0, 6)}
                  </p>
                </div>
              </div>

              {/* Email */}
              <p style={{ fontSize: 13, color: FM.textMid, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", paddingRight: 12 }}>
                {patient.email}
              </p>

            
{/* Ações */}
<div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
  <button
    onClick={() => navigate(`/dashboard/patient/${patient.id}/points`)}
    style={{
      display: "flex", alignItems: "center", gap: 5,
      padding: "5px 10px", fontSize: 12, fontWeight: 600,
      background: FM.blueLight, color: FM.blueDark,
      border: `1px solid ${FM.blueBorder}`,
      borderRadius: 6, cursor: "pointer",
    }}
  >
    <MapPin size={12} /> POIs
  </button>

  {/* NOVO BOTÃO */}
  <button
    onClick={() => navigate(`/dashboard/patient-progress/${patient.id}`)}
    style={{
      display: "flex", alignItems: "center", gap: 5,
      padding: "5px 10px", fontSize: 12, fontWeight: 600,
      background: FM.orangePale, color: FM.orangeDark,
      border: `1px solid ${FM.orangeBorder}`,
      borderRadius: 6, cursor: "pointer",
    }}
  >
    <TrendingUp size={12} /> Progresso
  </button>

  <button
    onClick={() => handleDelete(patient)}
    style={{
      display: "flex", alignItems: "center", gap: 5,
      padding: "5px 10px", fontSize: 12, fontWeight: 600,
      background: FM.redLight, color: FM.red,
      border: `1px solid ${FM.redBorder}`,
      borderRadius: 6, cursor: "pointer",
    }}
  >
    <Trash2 size={12} /> Excluir
  </button>
</div>

            </div>  
          ))}
        </div>
      )}

      {/* ── Paginação ─────────────────────────────────────────────────────── */}
      {totalPages > 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, color: FM.textMuted }}>
            Página {currentPage} de {totalPages} · {filteredPatients.length} pacientes
          </span>
          <div style={{ display: "flex", gap: 6 }}>
            {[
              { icon: ChevronLeft, action: () => setCurrentPage((p) => Math.max(p - 1, 1)), disabled: currentPage === 1 },
              { icon: ChevronRight, action: () => setCurrentPage((p) => Math.min(p + 1, totalPages)), disabled: currentPage === totalPages },
            ].map(({ icon: Icon, action, disabled }, i) => (
              <button
                key={i}
                onClick={action}
                disabled={disabled}
                style={{
                  width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
                  background: disabled ? FM.bgSoft : FM.bg,
                  border: `1px solid ${disabled ? FM.borderLight : FM.border}`,
                  borderRadius: 6, cursor: disabled ? "not-allowed" : "pointer",
                  color: disabled ? FM.textMuted : FM.orangeDark,
                  opacity: disabled ? 0.5 : 1,
                }}
              >
                <Icon size={15} />
              </button>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: ${FM.textMuted}; opacity: 0.7; }
      `}</style>
    </div>
  );
}