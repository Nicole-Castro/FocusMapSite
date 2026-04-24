import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  CheckCircle,
  Hourglass,
  Filter,
} from "lucide-react";
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

        const patientList = [
          ...new Map(
            data.map((s) => [
              s.patient_id,
              { id: s.patient_id, name: s.patient_name ?? "Paciente" },
            ]),
          ).values(),
        ];

        setPatients(patientList);
        setFiltered(data);
      } catch (err) {
        console.error("Erro ao carregar sessões:", err);
      }
      setLoading(false);
    }

    load();
  }, []);

  useEffect(() => {
    if (!selectedPatientId) return setFiltered(sessions);

    setFiltered(sessions.filter((s) => s.patient_id === selectedPatientId));
  }, [selectedPatientId, sessions]);

  const handleViewDetails = (sessionId) => {
    navigate(`/dashboard/sessao-detalhes/${sessionId}`);
  };

  const formatDate = (iso) => new Date(iso).toLocaleDateString("pt-BR");

  const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const calculateDuration = (start, end) => {
    if (!end) return null;
    const ms = new Date(end) - new Date(start);
    return `${Math.floor(ms / 60000)} min`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Carregando sessões...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Histórico de Sessões
          </h1>
          <p className="text-sm text-gray-500">
            Visualize e acompanhe as sessões realizadas
          </p>
        </div>

        <div className="text-sm text-gray-400">{filtered.length} sessões</div>
      </div>

      {/* FILTRO */}
      <div className="bg-white border rounded-xl p-4 shadow-sm flex items-center gap-4 flex-wrap">
        <Filter size={18} className="text-gray-400" />

        <select
          className="flex-1 min-w-[220px] p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
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

      {/* LISTA */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Calendar size={48} className="mx-auto mb-4 opacity-40" />
          <p className="text-lg font-medium">Nenhuma sessão encontrada</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((session) => {
            const duration = calculateDuration(
              session.session_start_time,
              session.session_end_time,
            );

            const isFinished = !!session.session_end_time;

            return (
              <div
                key={session.id}
                className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition group"
              >
                <div className="flex items-center justify-between flex-wrap gap-4">
                  {/* ESQUERDA */}
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow">
                      {session.patient_name?.charAt(0) || "P"}
                    </div>

                    {/* Infos */}
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-gray-900 text-lg">
                        {session.patient_name}
                      </span>

                      <div className="flex gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {formatDate(session.session_start_time)}
                        </span>

                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {formatTime(session.session_start_time)}
                        </span>
                      </div>

                      {/* STATUS */}
                      <div>
                        {isFinished ? (
                          <span className="inline-flex items-center gap-2 text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                            <CheckCircle size={12} />
                            Finalizada ({duration})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 font-medium">
                            <Hourglass size={12} />
                            Em andamento
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* DIREITA */}
                  <button
                    onClick={() => handleViewDetails(session.id)}
                    className="px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-black transition shadow group-hover:scale-[1.03]"
                  >
                    Ver detalhes →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
