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
        : (pointsData.points ?? []);

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
    (p.name ?? "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPoints.length / itemsPerPage),
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPoints = filteredPoints.slice(
    startIndex,
    startIndex + itemsPerPage,
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
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-sm text-gray-400 mb-1">
            Pacientes / Pontos de Interesse
          </p>

          <h1 className="text-2xl font-bold text-gray-800">{patientName}</h1>

          <p className="text-sm text-gray-500">
            {filteredPoints.length} ponto(s) cadastrado(s)
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* BOTÃO PRINCIPAL */}
          <button
            onClick={handleCreatePoint}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold shadow-md hover:from-primary-600 hover:to-primary-700 hover:scale-105 transition"
          >
            <PlusCircle size={18} />
            Novo Ponto
          </button>

          {/* REFRESH */}
          <button
            onClick={loadPoints}
            className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <div className="bg-white border rounded-xl p-4 shadow-sm">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Buscar ponto de interesse..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-primary-400 outline-none transition"
          />
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center py-16 text-gray-500">
          <RefreshCw
            className="animate-spin mx-auto mb-4 text-primary-500"
            size={36}
          />
          Carregando pontos...
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* EMPTY */}
      {!loading && filteredPoints.length === 0 && (
        <div className="text-center py-20">
          <p className="text-lg font-semibold text-gray-700 mb-2">
            Nenhum ponto encontrado
          </p>

          <p className="text-gray-500 mb-6">
            {searchTerm
              ? "Tente outro termo de busca"
              : "Cadastre o primeiro ponto de interesse"}
          </p>

          {!searchTerm && (
            <button
              onClick={handleCreatePoint}
              className="px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition shadow-md"
            >
              ➕ Criar primeiro ponto
            </button>
          )}
        </div>
      )}

      {/* LISTA */}
      {!loading && currentPoints.length > 0 && (
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
          {currentPoints.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between px-6 py-4 border-b hover:bg-gray-50 transition group"
            >
              {/* INFO */}
              <div className="flex items-center gap-4">
                {/* AVATAR */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white flex items-center justify-center font-bold">
                  {p.name?.charAt(0) || "P"}
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {p.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    ID: {p.id?.slice(0, 6)}
                  </p>
                </div>
              </div>

              {/* AÇÕES */}
              <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition">
                <button
                  onClick={() => handleEdit(p)}
                  className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition"
                >
                  <Edit2 size={18} />
                </button>

                <button
                  onClick={() => handleDelete(p)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAGINAÇÃO */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Página {currentPage} de {totalPages}
          </span>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border rounded-lg hover:bg-gray-100 disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 border rounded-lg hover:bg-gray-100 disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
