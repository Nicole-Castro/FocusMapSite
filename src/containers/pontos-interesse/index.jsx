import { useEffect, useState } from "react";
import {
  RefreshCw,
  Search,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import InterestPointsService from "../../services/interestPointsService";
import { getPatientById } from "../../services/getPatient"; // named import (verifique seu service)

export default function PointsOfInterest() {
  const navigate = useNavigate();
  const { patientId } = useParams(); // pegar da rota

  const [points, setPoints] = useState([]);
  const [patientName, setPatientName] = useState("Paciente");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  async function loadPoints() {
    try {
      setError("");
      const res = await InterestPointsService.getByPatient(patientId);

      // Tenta suportar vários formatos de resposta
      const pointsData = res?.data?.data ?? res?.data ?? res ?? [];
      // Se pointsData for um objeto com propriedade "points", usa-a
      const finalPoints = Array.isArray(pointsData)
        ? pointsData
        : pointsData.points ?? [];

      setPoints(finalPoints);
    } catch (err) {
      console.error("Erro ao carregar pontos:", err);
      setError("Erro ao carregar pontos.");
    }
  }

  // -----------------------------
  // Carregar pontos e nome do paciente
  // -----------------------------
  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!patientId) {
        navigate("/dashboard/pacientes");
        return;
      }

      try {
        setLoading(true);
        // 1. Carrega pontos
        await loadPoints();

        // 2. Carrega nome do paciente (verifica formatos)
        try {
          const resPatient = await getPatientById(patientId);
          console.log("resPatient (raw):", resPatient);

          // Suporta vários formatos:
          const patientFromRes = resPatient?.data?.data;

          if (patientFromRes) {
            setPatientName(patientFromRes);
          }
        } catch (err) {
          console.error("Erro ao buscar paciente:", err);
          setPatientName("Paciente");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [patientId, navigate]);

  // -----------------------------
  // Filtragem + Paginação
  // -----------------------------
  const filteredPoints = points.filter((p) =>
    (p.name ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPoints.length / itemsPerPage)
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPoints = filteredPoints.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // -----------------------------
  // Ações
  // -----------------------------
  const handleEdit = (point) => {
    navigate(`/dashboard/patient/${patientId}/points/edit/${point.id}`);
  };

  const handleDelete = async (point) => {
    if (!confirm(`Excluir o ponto "${point.name}"?`)) return;

    try {
      await InterestPointsService.delete(point.id);
      await loadPoints();
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir o ponto.");
    }
  };

  const handleCreatePoint = () => {
    navigate(`/dashboard/patient/${patientId}/points/create`);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Pontos de Interesse — {patientName}
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Total: {filteredPoints.length} ponto(s)
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCreatePoint}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md"
              >
                <PlusCircle size={18} />
                Novo Ponto
              </button>

              <button
                onClick={loadPoints}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50 shadow-md"
              >
                <RefreshCw
                  size={18}
                  className={loading ? "animate-spin" : ""}
                />
                Atualizar
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Buscar ponto..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
            />
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6">
          {loading && (
            <div className="text-center py-12">
              <RefreshCw
                className="animate-spin mx-auto text-primary-500 mb-4"
                size={40}
              />
              <p className="text-gray-600">Carregando pontos...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              <p className="font-semibold">Erro:</p>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && filteredPoints.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg font-medium">
                {searchTerm
                  ? "Nenhum ponto encontrado"
                  : "Nenhum ponto cadastrado"}
              </p>
            </div>
          )}

          {!loading && !error && currentPoints.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Nome
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentPoints.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {p.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEdit(p)}
                              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                              title="Editar"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(p)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Excluir"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Mostrando {startIndex + 1} a{" "}
                    {Math.min(startIndex + itemsPerPage, filteredPoints.length)}{" "}
                    de {filteredPoints.length} pontos
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg disabled:opacity-50"
                    >
                      <ChevronLeft size={16} /> Anterior
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-2 text-sm rounded-lg ${
                          currentPage === i + 1
                            ? "bg-primary-500 text-white"
                            : "bg-white text-gray-700 border border-gray-300"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg disabled:opacity-50"
                    >
                      Próxima <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
