import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, MapPin } from "lucide-react";
import InterestPointsService from "../../services/interestPointsService";

export default function PointsEdit() {
  const navigate = useNavigate();
  const { patientId, id } = useParams();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // -----------------------------
  // Carregar ponto
  // -----------------------------
  const loadPoint = async () => {
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
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar ponto.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPoint();
  }, [id]);

  // -----------------------------
  // Salvar
  // -----------------------------
  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      await InterestPointsService.update(id, {
        name,
        patientId,
      });

      navigate(`/dashboard/patient/${patientId}/points`);
    } catch (err) {
      console.error(err);
      setError("Erro ao salvar alterações.");
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------
  // Loading
  // -----------------------------
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <div className="w-10 h-10 border-4 border-primary-300 border-t-primary-600 rounded-full animate-spin mb-4"></div>
        Carregando ponto...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(`/dashboard/patient/${patientId}/points`)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition"
        >
          <ArrowLeft size={18} />
          Voltar
        </button>

        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <MapPin className="text-primary-500" size={20} />
          Editar Ponto
        </h1>

        <div className="w-16" />
      </div>

      {/* CARD */}
      <div className="bg-white rounded-2xl shadow-md border p-6 space-y-6">
        {/* ERRO */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* INPUT */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome do ponto de interesse
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Sala de Aula, Escritório, Biblioteca..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl 
              focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400
              transition"
          />
        </div>

        {/* AÇÕES */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={() => navigate(`/dashboard/patient/${patientId}/points`)}
            className="px-5 py-2.5 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
          >
            Cancelar
          </button>

          <button
            onClick={handleSave}
            disabled={saving || !name.trim()}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary-500 text-white text-sm font-semibold rounded-lg 
              hover:bg-primary-600 transition shadow-md disabled:opacity-50"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save size={16} />
            )}
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
