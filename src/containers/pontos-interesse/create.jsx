import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Target, AlertCircle } from "lucide-react";
import InterestPointsService from "../../services/interestPointsService";

// ─── Paleta FocusMap ──────────────────────────────────────────────────────────
const FM = {
  orange: "#ff9e3d",
  orangeDark: "#f86f26",
  orangeDeep: "#b36f2b",
  orangeLight: "#ffce85",
  orangePale: "#fff4e8",
  orangeBorder: "#ffbc54",
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

const SUGGESTIONS = ["Matemática", "Música", "História", "Esportes"];

export default function CreatePoint() {
  const navigate = useNavigate();
  const { userId } = useParams();

  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState(false);

  const goBack = () => navigate(`/dashboard/usuario/${userId}/points`);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      setSaving(true);
      setError("");
      await InterestPointsService.create(userId, { name: name.trim() });
      goBack();
    } catch (err) {
      console.error(err);
      setError("Erro ao salvar ponto de interesse. Tente novamente.");
    } finally {
      setSaving(false);
    }
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
            background: FM.orangePale,
            border: `1px solid ${FM.orangeBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Target size={20} style={{ color: FM.orange }} />
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
            Novo Ponto de Interesse
          </h1>
          <p style={{ fontSize: 13, color: FM.textMuted, margin: 0 }}>
            Defina um assunto de interresse para monitoramento
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
        <div
          style={{
            height: 4,
            background: `linear-gradient(90deg, ${FM.orangeDark}, ${FM.orange}, ${FM.orangeLight})`,
          }}
        />

        <form
          onSubmit={handleSubmit}
          style={{
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
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
              Nome do ponto
            </label>
            <div style={{ position: "relative" }}>
              <Target
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
                placeholder="Ex: Matemática, Portugues, Música..."
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

          {/* Sugestões rápidas */}
          <div>
            <p
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: FM.textMuted,
                margin: "0 0 8px",
              }}
            >
              Sugestões
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setName(s);
                    setError("");
                  }}
                  style={{
                    padding: "5px 12px",
                    fontSize: 12,
                    fontWeight: 500,
                    background: name === s ? FM.orangePale : FM.bgSoft,
                    border: `1px solid ${name === s ? FM.orangeBorder : FM.borderLight}`,
                    borderRadius: 99,
                    cursor: "pointer",
                    color: name === s ? FM.orangeDark : FM.textMid,
                    transition: "all 0.12s",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          {name.trim() && (
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
                <Target size={14} style={{ color: "#fff" }} />
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
                  Preview
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
              type="submit"
              disabled={saving || !name.trim()}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "9px 20px",
                fontSize: 13,
                fontWeight: 600,
                background:
                  saving || !name.trim()
                    ? FM.orangeLight
                    : `linear-gradient(135deg, ${FM.orange}, ${FM.orangeDark})`,
                border: "none",
                borderRadius: 8,
                color: saving || !name.trim() ? FM.orangeDeep : "#fff",
                cursor: saving || !name.trim() ? "not-allowed" : "pointer",
                boxShadow:
                  !saving && name.trim()
                    ? `0 2px 8px ${FM.orangeLight}`
                    : "none",
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
                  <Save size={14} /> Salvar ponto
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: ${FM.textMuted}; opacity: 0.7; }
      `}</style>
    </div>
  );
}
