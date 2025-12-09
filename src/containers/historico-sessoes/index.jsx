import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, User, CheckCircle, Hourglass } from "lucide-react";
import { getSessionsByProfessional } from "../../services/sessionService";

export default function HistoricoSessoes() {
  const [sessions, setSessions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const data = await getSessionsByProfessional();
        setSessions(data || []);

        // montar lista única de pacientes
        const patientList = [
          ...new Map(
            data.map((s) => [s.patient_id, { id: s.patient_id, name: s.patient_name ?? "Paciente" }])
          ).values(),
        ];
        setPatients(patientList);

        setFiltered(data); // inicia com tudo
      } catch (err) {
        console.error("Erro ao carregar sessões:", err);
      }
      setLoading(false);
    }

    load();
  }, []);

  // aplica o filtro quando o paciente mudar
  useEffect(() => {
    if (!selectedPatientId) {
      setFiltered(sessions);
      return;
    }

    setFiltered(
      sessions.filter((s) => s.patient_id === selectedPatientId)
    );
  }, [selectedPatientId, sessions]);

  const handleViewDetails = (sessionId) => {
    navigate(`/dashboard/sessao-detalhes/${sessionId}`);
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const calculateDuration = (start, end) => {
    if (!end) return null;

    const ms = new Date(end) - new Date(start);
    const min = Math.floor(ms / 60000);
    return `${min} min`;
  };

  if (loading) {
    return <div className="p-8 text-center">Carregando sessões...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">

        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Histórico de Sessões
        </h2>

        {/* 🔍 FILTRO POR PACIENTE */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Filtrar por paciente:
          </label>

          <select
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
          >
            <option value="">Todos os pacientes</option>

            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 text-lg font-medium">
              Nenhuma sessão encontrada
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((session) => {
              const duration = calculateDuration(
                session.session_start_time,
                session.session_end_time
              );

              return (
                <div
                  key={session.id}
                  className="border border-gray-200 rounded-lg p-6 hover:border-primary-300 hover:shadow-md transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center">
                        <User className="text-gray-400" size={32} />
                      </div>

                      <div className="flex flex-col gap-1">
                        {/* Nome do paciente */}
                        <span className="font-semibold text-gray-900 text-lg">
                          {session.patient_name}
                        </span>

                        {/* Data e hora */}
                        <div className="flex gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            <span>{formatDate(session.session_start_time)}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Clock size={16} />
                            <span>{formatTime(session.session_start_time)}</span>
                          </div>
                        </div>

                        {/* Status */}
                        {session.session_end_time ? (
                          <div className="flex items-center gap-2 text-green-600 text-sm mt-1">
                            <CheckCircle size={16} />
                            <span>Finalizada ({duration})</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-yellow-600 text-sm mt-1">
                            <Hourglass size={16} />
                            <span>Em andamento</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleViewDetails(session.id)}
                      className="px-6 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-900 transition shadow-md hover:shadow-lg"
                    >
                      Ver detalhes
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
