import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import InterestPointsService from "../../services/interestPointsService";

export default function PointsEdit() {
  const navigate = useNavigate();
  const { patientId, id } = useParams(); // <-- precisa estar IGUAL à rota
  console.log("route params:", patientId, id);

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // -------------------------------------------
  // Carregar o ponto pelo ID
  // -------------------------------------------
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
      console.error("Erro ao carregar ponto:", err);
      setError("Erro ao carregar ponto.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPoint();
  }, [id]);

  // -------------------------------------------
  // Salvar edição
  // -------------------------------------------
  const handleSave = async () => {
    try {
      await InterestPointsService.update(id, {
        name,
        patientId,
      });

      navigate(`/dashboard/patient/${patientId}/points`);
    } catch (err) {
      console.error("Erro ao salvar:", err);
      setError("Erro ao salvar alterações.");
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Editar Ponto de Interesse</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>
      )}

      <label className="block mb-2 font-medium text-gray-700">
        Nome do ponto
      </label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border border-gray-300 rounded p-2 mb-4"
      />

      <button
        onClick={handleSave}
        className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
      >
        Salvar
      </button>
    </div>
  );
}
