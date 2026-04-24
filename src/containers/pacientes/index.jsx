import { useEffect, useState } from "react";
import {
  RefreshCw,
  Search,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Users,
} from "lucide-react";
import { getPatients } from "../../services/getPatient";
import { useNavigate } from "react-router-dom";

export default function PacientesList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;
  const navigate = useNavigate();

  const handlePointsOfInterest = (patient) => {
    navigate(`/dashboard/patient/${patient.id}/points`);
  };

  async function loadPatients() {
    try {
      setLoading(true);
      setError("");

      const res = await getPatients();
      if (!res.success) {
        setError(res.message || "Erro ao carregar pacientes");
        return;
      }

      setPatients(res.data ?? []);
    } catch {
      setError("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPatients();
  }, []);

  const filteredPatients = patients.filter(
    (p) =>
      p?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p?.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPatients = filteredPatients.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleDelete = (patient) => {
    if (confirm(`Excluir ${patient.name}?`)) {
      alert("Implementar delete real aqui");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Users size={22} className="text-primary-500" />
            Pacientes
          </h1>
          <p className="text-sm text-gray-500">
            {filteredPatients.length} paciente(s) encontrado(s)
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* CTA PRINCIPAL */}
          <button
            onClick={() => navigate("/dashboard/cadastro-paciente")}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold shadow-md hover:scale-105 hover:shadow-lg transition"
          >
            ➕ Novo Paciente
          </button>

          {/* REFRESH MENOR */}
          <button
            onClick={loadPatients}
            className="p-2.5 border rounded-lg hover:bg-gray-100 transition"
            title="Atualizar lista"
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
            placeholder="Buscar paciente..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-primary-400 outline-none transition"
          />
        </div>
      </div>

      {/* LOADING / ERROR */}
      {loading && (
        <div className="text-center py-16 text-gray-500">
          <RefreshCw className="animate-spin mx-auto mb-4" size={36} />
          Carregando pacientes...
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* EMPTY */}
      {!loading && filteredPatients.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          Nenhum paciente encontrado
        </div>
      )}

      {/* LISTA */}
      {!loading && currentPatients.length > 0 && (
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
          {/* HEADER TABELA */}
          <div className="grid grid-cols-3 px-6 py-3 bg-gray-50 text-xs font-semibold text-gray-600 uppercase">
            <span>Paciente</span>
            <span>Email</span>
            <span className="text-center">Ações</span>
          </div>

          {/* LINHAS */}
          {currentPatients.map((patient) => (
            <div
              key={patient.id}
              className="grid grid-cols-3 px-6 py-4 items-center border-t hover:bg-gray-50 transition group"
            >
              {/* PACIENTE */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white flex items-center justify-center font-semibold">
                  {patient.name?.charAt(0) || "P"}
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {patient.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    ID: {patient.id?.slice(0, 6)}
                  </p>
                </div>
              </div>

              {/* EMAIL */}
              <div className="text-sm text-gray-600">{patient.email}</div>

              {/* AÇÕES */}
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => handlePointsOfInterest(patient)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition"
                >
                  <MapPin size={14} />
                  POIs
                </button>

                <button
                  onClick={() => handleDelete(patient)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                >
                  <Trash2 size={14} />
                  Excluir
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
