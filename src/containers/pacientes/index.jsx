import { useEffect, useState } from "react";
// import { getPatients } from "../../services/getPatient"; // Comentado temporariamente
import { RefreshCw, Search, Eye, Edit2, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

export default function PacientesList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  async function loadPatients() {
    try {
      setLoading(true);
      setError("");
      
      // MOCK - dados falsos para visualização
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = [
        { id: 1, name: 'João Silva', email: 'joao.silva@email.com', professional: 'Dr. Carlos', registrationDate: '2024-01-15' },
        { id: 2, name: 'Maria Santos', email: 'maria.santos@email.com', professional: 'Dra. Ana', registrationDate: '2024-01-20' },
        { id: 3, name: 'Pedro Costa', email: 'pedro.costa@email.com', professional: 'Dr. Carlos', registrationDate: '2024-02-05' },
        { id: 4, name: 'Ana Oliveira', email: 'ana.oliveira@email.com', professional: 'Dra. Ana', registrationDate: '2024-02-10' },
        { id: 5, name: 'Carlos Souza', email: 'carlos.souza@email.com', professional: 'Dr. João', registrationDate: '2024-02-15' },
        { id: 6, name: 'Juliana Lima', email: 'juliana.lima@email.com', professional: 'Dra. Ana', registrationDate: '2024-03-01' },
        { id: 7, name: 'Roberto Alves', email: 'roberto.alves@email.com', professional: 'Dr. Carlos', registrationDate: '2024-03-05' },
        { id: 8, name: 'Fernanda Rocha', email: 'fernanda.rocha@email.com', professional: 'Dr. João', registrationDate: '2024-03-10' },
      ];
      
      setPatients(mockData);
      
    } catch (err) {
      console.error("Erro ao carregar pacientes:", err);
      setError("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPatients();
  }, []);

  const filteredPatients = patients.filter(p => 
    p?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p?.professional?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPatients = filteredPatients.slice(startIndex, endIndex);

  const handleView = (patient) => {
    alert(`Visualizar paciente: ${patient.name}`);
    //página de detalhes
  };

  const handleEdit = (patient) => {
    alert(`Editar paciente: ${patient.name}`);
    //página de edição
  };

  const handleDelete = (patient) => {
    if (confirm(`Tem certeza que deseja excluir o paciente ${patient.name}?`)) {
      alert(`Paciente ${patient.name} excluído!`);
      //API de exclusão
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Lista de Pacientes</h2>
              <p className="text-gray-600 text-sm mt-1">
                Total: {filteredPatients.length} paciente(s)
              </p>
            </div>
            <button
              onClick={loadPatients}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition disabled:opacity-50 shadow-md"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              Atualizar
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por nome, email ou profissional..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
            />
          </div>
        </div>

        <div className="p-6">
          {loading && (
            <div className="text-center py-12">
              <RefreshCw className="animate-spin mx-auto text-primary-500 mb-4" size={40} />
              <p className="text-gray-600">Carregando pacientes...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              <p className="font-semibold">Erro:</p>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && filteredPatients.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg font-medium">
                {searchTerm ? 'Nenhum paciente encontrado' : 'Nenhum paciente cadastrado'}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                {searchTerm ? 'Tente buscar com outros termos' : 'Cadastre seu primeiro paciente'}
              </p>
            </div>
          )}

          {!loading && !error && currentPatients.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Nome
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Profissional
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Data de Registro
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentPatients.map((patient) => (
                      <tr key={patient.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{patient.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{patient.professional}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{formatDate(patient.registrationDate)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleView(patient)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Visualizar"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => handleEdit(patient)}
                              className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition"
                              title="Editar"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(patient)}
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

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Mostrando {startIndex + 1} a {Math.min(endIndex, filteredPatients.length)} de {filteredPatients.length} pacientes
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <ChevronLeft size={16} />
                      Anterior
                    </button>

                    <div className="flex gap-1">
                      {[...Array(totalPages)].map((_, index) => (
                        <button
                          key={index + 1}
                          onClick={() => setCurrentPage(index + 1)}
                          className={`px-3 py-2 text-sm rounded-lg transition ${
                            currentPage === index + 1
                              ? 'bg-primary-500 text-white font-semibold'
                              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Próxima
                      <ChevronRight size={16} />
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