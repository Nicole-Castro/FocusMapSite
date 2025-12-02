import React, { useState } from 'react';
import { Eye, Calendar, Clock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HistoricoSessoes() {
  const [selectedPatient, setSelectedPatient] = useState('');
  const navigate = useNavigate();

  // Mock de pacientes
  const patients = [
    { id: 1, name: 'João Silva' },
    { id: 2, name: 'Maria Santos' },
    { id: 3, name: 'Pedro Costa' },
    { id: 4, name: 'Ana Oliveira' },
  ];

  // Mock de sessões
  const sessions = [
    {
      id: 1,
      patientId: 1,
      patientName: 'João Silva',
      date: '2024-11-28',
      time: '14:30',
      duration: '45 min',
      status: 'Concluída'
    },
    {
      id: 2,
      patientId: 1,
      patientName: 'João Silva',
      date: '2024-11-25',
      time: '10:15',
      duration: '60 min',
      status: 'Concluída'
    },
    {
      id: 3,
      patientId: 2,
      patientName: 'Maria Santos',
      date: '2024-11-27',
      time: '09:00',
      duration: '30 min',
      status: 'Concluída'
    },
    {
      id: 4,
      patientId: 2,
      patientName: 'Maria Santos',
      date: '2024-11-20',
      time: '15:45',
      duration: '45 min',
      status: 'Concluída'
    },
  ];

  const filteredSessions = selectedPatient
    ? sessions.filter(s => s.patientId === parseInt(selectedPatient))
    : sessions;

  const handleViewDetails = (sessionId) => {
    navigate(`/dashboard/sessao-detalhes/${sessionId}`);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Histórico de Sessões
        </h2>

        <div className="mb-8 max-w-md mx-auto">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filtrar por Paciente
          </label>
          <select
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
          >
            <option value="">Todos os pacientes</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name}
              </option>
            ))}
          </select>
        </div>

        {filteredSessions.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 text-lg font-medium">
              Nenhuma sessão encontrada
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Selecione um paciente ou aguarde novas sessões
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                className="border border-gray-200 rounded-lg p-6 hover:border-primary-300 hover:shadow-md transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center">
                      <User className="text-gray-400" size={32} />
                    </div>

                    <div className="flex gap-6">
                      <svg className="w-24 h-12 text-gray-400" viewBox="0 0 100 50">
                        <path
                          d="M 0,25 Q 10,15 20,25 T 40,25 T 60,25 T 80,25 T 100,25"
                          stroke="currentColor"
                          fill="none"
                          strokeWidth="1.5"
                        />
                      </svg>
                      <svg className="w-24 h-12 text-gray-400" viewBox="0 0 100 50">
                        <path
                          d="M 0,25 Q 10,10 20,25 T 40,25 T 60,25 T 80,25 T 100,25"
                          stroke="currentColor"
                          fill="none"
                          strokeWidth="1.5"
                        />
                      </svg>
                      <svg className="w-24 h-12 text-gray-400" viewBox="0 0 100 50">
                        <path
                          d="M 0,25 Q 10,20 20,25 T 40,25 T 60,25 T 80,25 T 100,25"
                          stroke="currentColor"
                          fill="none"
                          strokeWidth="1.5"
                        />
                      </svg>
                      <svg className="w-24 h-12 text-gray-400" viewBox="0 0 100 50">
                        <path
                          d="M 0,25 Q 10,18 20,25 T 40,25 T 60,25 T 80,25 T 100,25"
                          stroke="currentColor"
                          fill="none"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>
                  </div>

                  <button
                    onClick={() => handleViewDetails(session.id)}
                    className="px-6 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-900 transition shadow-md hover:shadow-lg"
                  >
                    Ver detalhes da Sessão
                  </button>
                </div>

                <div className="mt-4 flex items-center gap-6 text-sm text-gray-600 ml-20">
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    <span className="font-medium">{session.patientName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{new Date(session.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>{session.time} - {session.duration}</span>
                  </div>
                  <div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      {session.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}