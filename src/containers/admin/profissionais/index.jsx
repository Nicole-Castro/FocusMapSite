import { useEffect, useState } from "react";
import {
  RefreshCw, Search, Trash2, Pencil, KeyRound,
  ChevronLeft, ChevronRight, ShieldCheck, PlusCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getProfessionals,
  deleteProfessional,
  resetProfessionalPassword,
  updateProfessionalName,
} from "../../../services/professionalsService";

// ─── Paleta FocusMap ──────────────────────────────────────────────────────────
const FM = {
  orange:       "#ff9e3d",
  orangeDark:   "#f86f26",
  orangeLight:  "#ffce85",
  orangePale:   "#fff4e8",
  orangeBorder: "#ffbc54",
  purple:       "#773dff",
  purpleLight:  "#f0ebff",
  purpleBorder: "#c4adff",
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

function ProfessionalAvatar({ name }) {
  const initial = name?.trim().charAt(0)?.toUpperCase() || "P";
  return (
    <div style={{
      width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
      background: `linear-gradient(135deg, ${FM.purple}, #5a2ecc)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 15, fontWeight: 700, color: "#fff",
      boxShadow: `0 0 0 2px ${FM.purpleLight}`,
    }}>
      {initial}
    </div>
  );
}

export default function ProfissionaisList() {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchFocused, setSearchFocused] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const itemsPerPage = 8;
  const navigate = useNavigate();

  async function loadProfessionals() {
    try {
      setLoading(true);
      setError("");
      const res = await getProfessionals();
      if (!res.success) { setError(res.message || "Erro ao carregar profissionais"); return; }
      setProfessionals(res.data ?? []);
    } catch {
      setError("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadProfessionals(); }, []);

  const filtered = professionals.filter((p) =>
    p?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const current = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handleRename = async (professional) => {
    const novoNome = prompt("Novo nome:", professional.name);
    if (!novoNome || !novoNome.trim() || novoNome.trim() === professional.name) return;

    setBusyId(professional.id);
    const res = await updateProfessionalName(professional.id, novoNome.trim());
    setBusyId(null);

    if (res.success) {
      setProfessionals((prev) =>
        prev.map((p) => (p.id === professional.id ? { ...p, name: novoNome.trim() } : p))
      );
    } else {
      alert(res.message);
    }
  };

  const handleResetPassword = async (professional) => {
    if (!confirm(`Gerar uma nova senha provisória para ${professional.name}? A senha atual deixa de funcionar.`)) return;

    setBusyId(professional.id);
    const res = await resetProfessionalPassword(professional.id);
    setBusyId(null);

    if (res.success) {
      // Só aparece agora — não fica salva em lugar nenhum além do hash no banco.
      alert(`Senha provisória de ${professional.name}:\n\n${res.temporaryPassword}\n\nAnote e repasse agora — ela não pode ser recuperada depois.`);
    } else {
      alert(res.message);
    }
  };

  const handleDelete = async (professional) => {
    if (!confirm(`Excluir ${professional.name}? Os usuários e sessões dela continuam no banco, mas ela não conseguirá mais logar.`)) return;

    setBusyId(professional.id);
    const res = await deleteProfessional(professional.id);
    setBusyId(null);

    if (res.success) {
      setProfessionals((prev) => prev.filter((p) => p.id !== professional.id));
    } else {
      alert(res.message);
    }
  };

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "4px 0 3rem", display: "flex", flexDirection: "column", gap: 16 }}>

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: FM.text, margin: "0 0 3px", display: "flex", alignItems: "center", gap: 8 }}>
            <ShieldCheck size={20} style={{ color: FM.purple }} />
            Profissionais
          </h1>
          <p style={{ fontSize: 13, color: FM.textMuted, margin: 0 }}>
            {filtered.length} profissional(is) encontrado(s) — área restrita a Admin
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={() => navigate("/dashboard/admin/cadastro-profissional")}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              background: `linear-gradient(135deg, ${FM.purple}, #5a2ecc)`,
              border: "none", borderRadius: 8, padding: "9px 16px",
              fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer",
              boxShadow: `0 2px 8px ${FM.purpleLight}`,
            }}
          >
            <PlusCircle size={15} /> Novo Profissional
          </button>

          <button
            onClick={loadProfessionals}
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
        background: FM.bg, border: `1px solid ${searchFocused ? FM.purple : FM.border}`,
        borderRadius: 10, padding: "10px 14px",
        display: "flex", alignItems: "center", gap: 10,
        boxShadow: searchFocused ? `0 0 0 3px ${FM.purpleLight}` : "none",
        transition: "border-color 0.15s, box-shadow 0.15s",
      }}>
        <Search size={16} style={{ color: searchFocused ? FM.purple : FM.textMuted, flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Buscar por nome ou e-mail..."
          value={searchTerm}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          style={{ flex: 1, border: "none", outline: "none", fontSize: 14, background: "transparent", color: FM.text }}
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
          <RefreshCw size={32} style={{ color: FM.purple, animation: "spin 0.8s linear infinite" }} />
          Carregando profissionais...
        </div>
      )}

      {/* ── Error ─────────────────────────────────────────────────────────── */}
      {error && (
        <div style={{ background: FM.redLight, border: `1px solid ${FM.redBorder}`, borderRadius: 8, padding: "12px 16px", fontSize: 13, color: FM.red }}>
          {error}
        </div>
      )}

      {/* ── Empty ─────────────────────────────────────────────────────────── */}
      {!loading && !error && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "64px 0", color: FM.textMuted }}>
          <ShieldCheck size={36} style={{ color: FM.purpleLight, marginBottom: 12 }} />
          <p style={{ fontSize: 15, fontWeight: 600, color: FM.textMid, margin: "0 0 4px" }}>Nenhum profissional encontrado</p>
          <p style={{ fontSize: 13, margin: 0 }}>
            {searchTerm ? "Tente outro termo de busca" : "Cadastre o primeiro profissional"}
          </p>
        </div>
      )}

      {/* ── Tabela ────────────────────────────────────────────────────────── */}
      {!loading && current.length > 0 && (
        <div style={{ background: FM.bg, border: `1px solid ${FM.border}`, borderRadius: 12, overflow: "hidden" }}>

          <div style={{
            display: "grid", gridTemplateColumns: "2fr 2fr 1.4fr",
            padding: "10px 20px",
            background: FM.bgSoft,
            borderBottom: `1px solid ${FM.borderLight}`,
          }}>
            {["Profissional", "E-mail", "Ações"].map((col, i) => (
              <span key={col} style={{
                fontSize: 11, fontWeight: 600, letterSpacing: "0.09em",
                textTransform: "uppercase", color: FM.textMuted,
                textAlign: i === 2 ? "center" : "left",
              }}>
                {col}
              </span>
            ))}
          </div>

          {current.map((professional, idx) => (
            <div
              key={professional.id}
              style={{
                display: "grid", gridTemplateColumns: "2fr 2fr 1.4fr",
                padding: "13px 20px", alignItems: "center",
                borderTop: idx === 0 ? "none" : `1px solid ${FM.borderLight}`,
                background: FM.bg,
                opacity: busyId === professional.id ? 0.6 : 1,
                transition: "background 0.12s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = FM.orangePale}
              onMouseLeave={(e) => e.currentTarget.style.background = FM.bg}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <ProfessionalAvatar name={professional.name} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: FM.text, margin: "0 0 1px" }}>
                    {professional.name}
                  </p>
                  <p style={{ fontSize: 11, color: FM.textMuted, margin: 0, fontFamily: "monospace" }}>
                    #{professional.id?.slice(0, 6)}
                  </p>
                </div>
              </div>

              <p style={{ fontSize: 13, color: FM.textMid, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", paddingRight: 12 }}>
                {professional.email}
              </p>

              <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
                <button
                  onClick={() => handleRename(professional)}
                  disabled={busyId === professional.id}
                  title="Renomear"
                  style={{
                    display: "flex", alignItems: "center", gap: 5,
                    padding: "5px 10px", fontSize: 12, fontWeight: 600,
                    background: FM.blueLight, color: FM.blueDark,
                    border: `1px solid ${FM.blueBorder}`,
                    borderRadius: 6, cursor: busyId === professional.id ? "not-allowed" : "pointer",
                  }}
                >
                  <Pencil size={12} /> Editar
                </button>

                <button
                  onClick={() => handleResetPassword(professional)}
                  disabled={busyId === professional.id}
                  title="Resetar senha"
                  style={{
                    display: "flex", alignItems: "center", gap: 5,
                    padding: "5px 10px", fontSize: 12, fontWeight: 600,
                    background: FM.orangePale, color: FM.orangeDark,
                    border: `1px solid ${FM.orangeBorder}`,
                    borderRadius: 6, cursor: busyId === professional.id ? "not-allowed" : "pointer",
                  }}
                >
                  <KeyRound size={12} /> Senha
                </button>

                <button
                  onClick={() => handleDelete(professional)}
                  disabled={busyId === professional.id}
                  title="Excluir"
                  style={{
                    display: "flex", alignItems: "center", gap: 5,
                    padding: "5px 10px", fontSize: 12, fontWeight: 600,
                    background: FM.redLight, color: FM.red,
                    border: `1px solid ${FM.redBorder}`,
                    borderRadius: 6, cursor: busyId === professional.id ? "not-allowed" : "pointer",
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
            Página {currentPage} de {totalPages} · {filtered.length} profissionais
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
                  color: disabled ? FM.textMuted : FM.purple,
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
