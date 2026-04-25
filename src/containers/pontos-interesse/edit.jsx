import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, MapPin, AlertCircle, RefreshCw } from "lucide-react";
import InterestPointsService from "../../services/interestPointsService";

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
  red: "#ff663d",
  redLight: "#fff0ed",
  redBorder: "#ffb5a3",
  text: "#2a1a08",
  textMid: "#6f451b",
  textMuted: "#aa8661",
  bg: "#ffffff",
  bgSoft: "#faf7f4",
  border: "#ede0d0",
  borderLight: "#f5ece0",
};

export default function PointsEdit() {
  const navigate = useNavigate();
  const { patientId, id } = useParams();

  const [name, setName] = useState("");
  const [original, setOriginal] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState(false);

  const goBack = () => navigate(`/dashboard/patient/${patientId}/points`);
  const isDirty = name.trim() !== original.trim();

  // ── Carregar ponto ─────────────────────────────────────────────────────────
  useEffect(() => {
    async function loadPoint() {
      try {
        setLoading(true);
        setError("");
        if (!id) {
          setError("ID do ponto não informado.");
          return;
        }

        const res = await InterestPointsService.getById(id);
        const data = res.data ?? res.data?.data;

        if (!data) {
          setError("Ponto não encontrado.");
          return;
        }

        setName(data.name ?? "");
        setOriginal(data.name ?? "");
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar ponto de interesse.");
      } finally {
        setLoading(false);
      }
    }
    loadPoint();
  }, [id]);

  // ── Salvar ─────────────────────────────────────────────────────────────────
  async function handleSave() {
    if (!name.trim() || !isDirty) return;
    try {
      setSaving(true);
      setError("");
      await InterestPointsService.update(id, { name: name.trim(), patientId });
      goBack();
    } catch (err) {
      console.error(err);
      setError("Erro ao salvar alterações. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  // ── Loading state ──────────────────────────────────────────────────────────
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
        Carregando ponto...
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 560,
        margin: "0 auto",
        padding: "4px 0 3rem",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {/* Breadcrumb */}
      <button
        onClick={goBack}
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
          width: "fit-content",
        }}
      >
        <ArrowLeft size={13} /> Voltar para Pontos de Interesse
      </button>

      {/* Título */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            flexShrink: 0,
            background: FM.yellowLight,
            border: `1px solid ${FM.yellowBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MapPin size={20} style={{ color: FM.yellow }} />
        </div>
        <div>
          <h1
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: FM.text,
              margin: "0 0 2px",
            }}
          >
            Editar Ponto de Interesse
          </h1>
          <p style={{ fontSize: 13, color: FM.textMuted, margin: 0 }}>
            Atualize o nome do local ou contexto de monitoramento
          </p>
        </div>
      </div>

      {/* Card */}
      <div
        style={{
          background: FM.bg,
          border: `1px solid ${FM.border}`,
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        {/* faixa — amarelo para diferenciar de criação */}
        <div
          style={{
            height: 4,
            background: `linear-gradient(90deg, ${FM.yellow}, ${FM.orangeLight})`,
          }}
        />

        <div
          style={{
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {/* Erro */}
          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: FM.redLight,
                border: `1px solid ${FM.redBorder}`,
                borderRadius: 8,
                padding: "10px 14px",
                fontSize: 13,
                color: FM.red,
              }}
            >
              <AlertCircle size={14} /> {error}
            </div>
          )}

          {/* Badge "editando" com nome original */}
          {original && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                background: FM.yellowLight,
                border: `1px solid ${FM.yellowBorder}`,
                borderRadius: 8,
              }}
            >
              <MapPin size={13} style={{ color: FM.yellow, flexShrink: 0 }} />
              <p style={{ fontSize: 12, color: FM.textMid, margin: 0 }}>
                Editando: <strong>{original}</strong>
              </p>
            </div>
          )}

          {/* Input */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.09em",
                textTransform: "uppercase",
                color: FM.textMuted,
                marginBottom: 6,
              }}
            >
              Novo nome
            </label>
            <div style={{ position: "relative" }}>
              <MapPin
                size={15}
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: focused ? FM.orange : FM.textMuted,
                  pointerEvents: "none",
                  transition: "color 0.15s",
                }}
              />
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Ex: Sala de Aula, Consultório, Casa..."
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  paddingLeft: 38,
                  paddingRight: 14,
                  paddingTop: 11,
                  paddingBottom: 11,
                  fontSize: 14,
                  background: FM.bgSoft,
                  border: `1px solid ${focused ? FM.orange : FM.border}`,
                  borderRadius: 8,
                  color: FM.text,
                  outline: "none",
                  transition: "border-color 0.15s, box-shadow 0.15s",
                  boxShadow: focused ? `0 0 0 3px ${FM.orangePale}` : "none",
                }}
              />
            </div>
          </div>

          {/* Preview da alteração — só mostra se mudou */}
          {isDirty && name.trim() && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 14px",
                background: FM.orangePale,
                border: `1px solid ${FM.orangeBorder}`,
                borderRadius: 8,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: FM.orange,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <MapPin size={14} style={{ color: "#fff" }} />
              </div>
              <div>
                <p
                  style={{
                    fontSize: 11,
                    color: FM.textMuted,
                    margin: "0 0 1px",
                    fontWeight: 600,
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                  }}
                >
                  Novo nome
                </p>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: FM.orangeDeep,
                    margin: 0,
                  }}
                >
                  {name}
                </p>
              </div>
            </div>
          )}

          {/* Ações */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
              paddingTop: 4,
            }}
          >
            <button
              type="button"
              onClick={goBack}
              style={{
                padding: "9px 16px",
                fontSize: 13,
                background: "none",
                border: `1px solid ${FM.border}`,
                borderRadius: 8,
                color: FM.textMid,
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>

            <button
              onClick={handleSave}
              disabled={saving || !name.trim() || !isDirty}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "9px 20px",
                fontSize: 13,
                fontWeight: 600,
                background:
                  saving || !name.trim() || !isDirty
                    ? FM.orangeLight
                    : `linear-gradient(135deg, ${FM.orange}, ${FM.orangeDark})`,
                border: "none",
                borderRadius: 8,
                color:
                  saving || !name.trim() || !isDirty ? FM.orangeDeep : "#fff",
                cursor:
                  saving || !name.trim() || !isDirty
                    ? "not-allowed"
                    : "pointer",
                boxShadow:
                  !saving && name.trim() && isDirty
                    ? `0 2px 8px ${FM.orangeLight}`
                    : "none",
                transition: "all 0.15s",
              }}
            >
              {saving ? (
                <>
                  <div
                    style={{
                      width: 13,
                      height: 13,
                      border: `2px solid ${FM.orangeDeep}`,
                      borderTopColor: "transparent",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />{" "}
                  Salvando...
                </>
              ) : (
                <>
                  <Save size={14} /> Salvar alterações
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: ${FM.textMuted}; opacity: 0.7; }
      `}</style>
    </div>
  );
}
