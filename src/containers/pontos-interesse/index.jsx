import { useEffect, useState } from "react";
import {
  RefreshCw, Search, Edit2, Trash2,
  ChevronLeft, ChevronRight, PlusCircle,
  Target, ArrowLeft, AlertCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import InterestPointsService from "../../services/interestPointsService";
import { getUserById } from "../../services/getUser";

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
  purple:       "#773dff",
  purpleLight:  "#f0ebff",
  purpleBorder: "#c4adff",
  text:         "#2a1a08",
  textMid:      "#6f451b",
  textMuted:    "#aa8661",
  bg:           "#ffffff",
  bgSoft:       "#faf7f4",
  border:       "#ede0d0",
  borderLight:  "#f5ece0",
};

// Gera uma cor de acento para cada ponto, rotacionando as cores da paleta
const POINT_COLORS = [
  { bg: FM.orangePale,  border: FM.orangeBorder, text: FM.orangeDark,  dot: FM.orange  },
  { bg: FM.blueLight,   border: FM.blueBorder,   text: FM.blueDark,    dot: FM.blue    },
  { bg: FM.purpleLight, border: FM.purpleBorder,  text: FM.purple,      dot: FM.purple  },
  { bg: FM.redLight,    border: FM.redBorder,     text: FM.red,         dot: FM.red     },
];

function PointAvatar({ name, colorIdx }) {
  const c = POINT_COLORS[colorIdx % POINT_COLORS.length];
  return (
    <div style={{
      width: 40, height: 40, borderRadius: 10, flexShrink: 0,
      background: c.bg, border: `1px solid ${c.border}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 16, fontWeight: 700, color: c.text,
    }}>
      {name?.trim().charAt(0)?.toUpperCase() || "P"}
    </div>
  );
}

export default function PointsOfInterest() {
  const navigate = useNavigate();
  const { userId } = useParams();

  const [points, setPoints] = useState([]);
  const [userName, setUserName] = useState("Usuário");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);

  const itemsPerPage = 10;

  async function loadPoints() {
    try {
      setError("");
      const res = await InterestPointsService.getByUser(userId);
      const pointsData = res?.data?.data ?? res?.data ?? res ?? [];
      const finalPoints = Array.isArray(pointsData) ? pointsData : (pointsData.points ?? []);
      setPoints(finalPoints);
    } catch (err) {
      console.error("Erro ao carregar pontos:", err);
      setError("Erro ao carregar pontos de interesse.");
    }
  }

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!userId) { navigate("/dashboard/usuarios"); return; }
      try {
        setLoading(true);
        await loadPoints();
        try {
          const resUser = await getUserById(userId);
          const user = resUser?.data?.data;
          if (user && mounted) setUserName(user.name ?? user);
        } catch { setUserName("Usuário"); }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [userId, navigate]);

  const filteredPoints = points.filter((p) =>
    (p.name ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredPoints.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPoints = filteredPoints.slice(startIndex, startIndex + itemsPerPage);

  const handleEdit   = (point) => navigate(`/dashboard/usuario/${userId}/points/edit/${point.id}`);
  const handleCreate = () => navigate(`/dashboard/usuario/${userId}/points/create`);

  const handleDelete = async (point) => {
    if (!confirm(`Excluir o ponto "${point.name}"?`)) return;
    try {
      setDeletingId(point.id);
      await InterestPointsService.delete(point.id);
      await loadPoints();
    } catch {
      alert("Erro ao excluir o ponto.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "4px 0 3rem", display: "flex", flexDirection: "column", gap: 16 }}>

      {/* ── Breadcrumb ────────────────────────────────────────────────────── */}
      <button
        onClick={() => navigate("/dashboard/usuarios")}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "none", border: "none", cursor: "pointer",
          fontSize: 12, color: FM.textMuted, padding: 0,
          width: "fit-content",
        }}
      >
        <ArrowLeft size={13} />
        Usuários / Pontos de Interesse
      </button>

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          {/* nome do usuário com destaque */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: `linear-gradient(135deg, ${FM.orange}, ${FM.orangeDark})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 700, color: "#fff", flexShrink: 0,
            }}>
              {userName?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <h1 style={{ fontSize: 21, fontWeight: 700, color: FM.text, margin: 0 }}>
              {userName}
            </h1>
          </div>
          <p style={{ fontSize: 13, color: FM.textMuted, margin: 0, display: "flex", alignItems: "center", gap: 5 }}>
            <Target size={12} style={{ color: FM.orange }} />
            {filteredPoints.length} ponto(s) de interesse cadastrado(s)
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={handleCreate}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              background: `linear-gradient(135deg, ${FM.orange}, ${FM.orangeDark})`,
              border: "none", borderRadius: 8, padding: "9px 16px",
              fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer",
              boxShadow: `0 2px 8px ${FM.orangeLight}`,
            }}
          >
            <PlusCircle size={15} /> Novo Ponto
          </button>

          <button
            onClick={loadPoints}
            title="Atualizar"
            style={{
              width: 38, height: 38,
              display: "flex", alignItems: "center", justifyContent: "center",
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
        background: FM.bg,
        border: `1px solid ${searchFocused ? FM.orange : FM.border}`,
        borderRadius: 10, padding: "10px 14px",
        display: "flex", alignItems: "center", gap: 10,
        boxShadow: searchFocused ? `0 0 0 3px ${FM.orangePale}` : "none",
        transition: "border-color 0.15s, box-shadow 0.15s",
      }}>
        <Search size={15} style={{ color: searchFocused ? FM.orange : FM.textMuted, flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Buscar ponto de interesse..."
          value={searchTerm}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          style={{ flex: 1, border: "none", outline: "none", fontSize: 14, background: "transparent", color: FM.text }}
        />
        {searchTerm && (
          <button onClick={() => { setSearchTerm(""); setCurrentPage(1); }} style={{ background: "none", border: "none", cursor: "pointer", color: FM.textMuted, fontSize: 16, padding: 0, lineHeight: 1 }}>
            ×
          </button>
        )}
      </div>

      {/* ── Loading ───────────────────────────────────────────────────────── */}
      {loading && (
        <div style={{ textAlign: "center", padding: "64px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, color: FM.textMuted, fontSize: 14 }}>
          <RefreshCw size={32} style={{ color: FM.orange, animation: "spin 0.8s linear infinite" }} />
          Carregando pontos de interesse...
        </div>
      )}

      {/* ── Error ─────────────────────────────────────────────────────────── */}
      {error && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: FM.redLight, border: `1px solid ${FM.redBorder}`, borderRadius: 8, padding: "12px 16px", fontSize: 13, color: FM.red }}>
          <AlertCircle size={15} /> {error}
        </div>
      )}

      {/* ── Empty ─────────────────────────────────────────────────────────── */}
      {!loading && !error && filteredPoints.length === 0 && (
        <div style={{ textAlign: "center", padding: "64px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: FM.orangePale, border: `1px solid ${FM.orangeBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Target size={24} style={{ color: FM.orange }} />
          </div>
          <p style={{ fontSize: 15, fontWeight: 600, color: FM.textMid, margin: 0 }}>
            Nenhum ponto encontrado
          </p>
          <p style={{ fontSize: 13, color: FM.textMuted, margin: 0 }}>
            {searchTerm ? "Tente outro termo de busca" : "Cadastre o primeiro ponto de interesse"}
          </p>
          {!searchTerm && (
            <button
              onClick={handleCreate}
              style={{
                marginTop: 8, display: "flex", alignItems: "center", gap: 7,
                background: `linear-gradient(135deg, ${FM.orange}, ${FM.orangeDark})`,
                border: "none", borderRadius: 8, padding: "10px 20px",
                fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer",
                boxShadow: `0 2px 8px ${FM.orangeLight}`,
              }}
            >
              <PlusCircle size={14} /> Criar primeiro ponto
            </button>
          )}
        </div>
      )}

      {/* ── Lista ─────────────────────────────────────────────────────────── */}
      {!loading && currentPoints.length > 0 && (
        <div style={{ background: FM.bg, border: `1px solid ${FM.border}`, borderRadius: 12, overflow: "hidden" }}>

          {/* Cabeçalho */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr auto",
            padding: "10px 20px",
            background: FM.bgSoft,
            borderBottom: `1px solid ${FM.borderLight}`,
          }}>
            {["Ponto de Interesse", "Ações"].map((col, i) => (
              <span key={col} style={{
                fontSize: 11, fontWeight: 600, letterSpacing: "0.09em",
                textTransform: "uppercase", color: FM.textMuted,
                textAlign: i === 1 ? "right" : "left",
              }}>
                {col}
              </span>
            ))}
          </div>

          {/* Linhas */}
          {currentPoints.map((p, idx) => (
            <div
              key={p.id}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "13px 20px",
                borderTop: idx === 0 ? "none" : `1px solid ${FM.borderLight}`,
                background: FM.bg, transition: "background 0.12s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = FM.orangePale}
              onMouseLeave={(e) => e.currentTarget.style.background = FM.bg}
            >
              {/* Info */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <PointAvatar name={p.name} colorIdx={idx} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: FM.text, margin: "0 0 1px" }}>
                    {p.name}
                  </p>
                  <p style={{ fontSize: 11, color: FM.textMuted, margin: 0, fontFamily: "monospace" }}>
                    #{p.id?.slice(0, 6)}
                  </p>
                </div>
              </div>

              {/* Ações */}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <button
                  onClick={() => handleEdit(p)}
                  title="Editar"
                  style={{
                    display: "flex", alignItems: "center", gap: 5,
                    padding: "6px 12px", fontSize: 12, fontWeight: 600,
                    background: FM.blueLight, color: FM.blueDark,
                    border: `1px solid ${FM.blueBorder}`,
                    borderRadius: 6, cursor: "pointer",
                  }}
                >
                  <Edit2 size={13} /> Editar
                </button>

                <button
                  onClick={() => handleDelete(p)}
                  disabled={deletingId === p.id}
                  title="Excluir"
                  style={{
                    display: "flex", alignItems: "center", gap: 5,
                    padding: "6px 12px", fontSize: 12, fontWeight: 600,
                    background: FM.redLight, color: FM.red,
                    border: `1px solid ${FM.redBorder}`,
                    borderRadius: 6, cursor: deletingId === p.id ? "not-allowed" : "pointer",
                    opacity: deletingId === p.id ? 0.6 : 1,
                  }}
                >
                  <Trash2 size={13} />
                  {deletingId === p.id ? "Excluindo..." : "Excluir"}
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
            Página {currentPage} de {totalPages} · {filteredPoints.length} pontos
          </span>
          <div style={{ display: "flex", gap: 6 }}>
            {[
              { icon: ChevronLeft,  action: () => setCurrentPage((p) => Math.max(p - 1, 1)),           disabled: currentPage === 1         },
              { icon: ChevronRight, action: () => setCurrentPage((p) => Math.min(p + 1, totalPages)),  disabled: currentPage === totalPages },
            ].map(({ icon: Icon, action, disabled }, i) => (
              <button
                key={i} onClick={action} disabled={disabled}
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