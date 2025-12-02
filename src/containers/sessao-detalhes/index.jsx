import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Calendar, Clock, User, MapPin } from 'lucide-react';

export default function SessaoDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();

  //Mock de dados da sessão
  const session = {
    id: id,
    patientName: 'João Silva',
    date: '2024-11-28',
    time: '14:30',
    duration: '45 min',
    status: 'Concluída',
    professional: 'Dr. Carlos Silva',
    notes: 'Sessão realizada com sucesso. Paciente apresentou boa resposta aos estímulos.',
    pontosInteresse: ['Português', 'Matemática', 'Música']
  };

  const handleExportData = () => {
    alert('Exportando dados da sessão...');
    //lógica de exportação
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/dashboard/historico-sessoes')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
          >
            <ArrowLeft size={20} />
            <span>Voltar</span>
          </button>
          <h2 className="text-2xl font-bold text-gray-800">
            Detalhes da Sessão
          </h2>
          <div className="w-20"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-6 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <User className="text-primary-500" size={24} />
            <div>
              <p className="text-sm text-gray-600">Paciente</p>
              <p className="font-semibold text-gray-800">{session.patientName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <User className="text-primary-500" size={24} />
            <div>
              <p className="text-sm text-gray-600">Profissional</p>
              <p className="font-semibold text-gray-800">{session.professional}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="text-primary-500" size={24} />
            <div>
              <p className="text-sm text-gray-600">Data</p>
              <p className="font-semibold text-gray-800">
                {new Date(session.date).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="text-primary-500" size={24} />
            <div>
              <p className="text-sm text-gray-600">Horário e Duração</p>
              <p className="font-semibold text-gray-800">{session.time} - {session.duration}</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Visualização EEG</h3>
          
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center">
                <User className="text-gray-400" size={32} />
              </div>
              <div>
                <p className="font-semibold text-gray-800">{session.patientName}</p>
                <p className="text-sm text-gray-600">Sessão #{session.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <svg className="w-full h-16 text-gray-600" viewBox="0 0 400 60">
                  <path
                    d="M 0,30 Q 20,10 40,30 T 80,30 T 120,30 T 160,30 T 200,30 T 240,30 T 280,30 T 320,30 T 360,30 T 400,30"
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M 0,35 Q 20,20 40,35 T 80,35 T 120,35 T 160,35 T 200,35 T 240,35 T 280,35 T 320,35 T 360,35 T 400,35"
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M 0,40 Q 20,25 40,40 T 80,40 T 120,40 T 160,40 T 200,40 T 240,40 T 280,40 T 320,40 T 360,40 T 400,40"
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <svg className="w-full h-16 text-gray-600" viewBox="0 0 400 60">
                  <path
                    d="M 0,30 Q 20,15 40,30 T 80,30 T 120,30 T 160,30 T 200,30 T 240,30 T 280,30 T 320,30 T 360,30 T 400,30"
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M 0,35 Q 20,22 40,35 T 80,35 T 120,35 T 160,35 T 200,35 T 240,35 T 280,35 T 320,35 T 360,35 T 400,35"
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M 0,40 Q 20,28 40,40 T 80,40 T 120,40 T 160,40 T 200,40 T 240,40 T 280,40 T 320,40 T 360,40 T 400,40"
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
            </div>

            <div className="mt-6 border border-gray-200 rounded-lg p-4">
              <svg className="w-full h-20 text-gray-600" viewBox="0 0 800 80">
                <path
                  d="M 0,40 Q 40,20 80,40 T 160,40 T 240,40 T 320,40 T 400,40 T 480,40 T 560,40 T 640,40 T 720,40 T 800,40"
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Pontos de Interesse Monitorados</h3>
          <div className="flex flex-wrap gap-2">
            {session.pontosInteresse.map((ponto, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg"
              >
                <MapPin size={16} />
                <span className="font-medium">{ponto}</span>
              </div>
            ))}
          </div>
        </div>

        {session.notes && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Observações</h3>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-700">{session.notes}</p>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleExportData}
            className="flex items-center gap-2 px-8 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition shadow-md hover:shadow-lg"
          >
            <Download size={20} />
            Exportar dados da Sessão
          </button>
        </div>
      </div>
    </div>
  );
}