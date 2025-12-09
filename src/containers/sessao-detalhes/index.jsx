import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Calendar, Clock, User, MapPin } from 'lucide-react';

import { getSessionById } from "../../services/sessionService";
import { getSessionDataById } from "../../services/sessionService";

export default function SessaoDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [sessionData, setSessionData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      console.log("Carregando sessão:", id);

      const sessionRes = await getSessionById(id);
      const dataRes = await getSessionDataById(id);

      console.log("Session ->", sessionRes);
      console.log("SessionData ->", dataRes);

      if (sessionRes) setSession(sessionRes);
      if (dataRes) setSessionData(dataRes);

      setLoading(false);
    }

    load();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-10 text-center text-gray-600">
        Carregando sessão...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-6xl mx-auto p-10 text-center text-red-500">
        Nenhuma sessão encontrada.
      </div>
    );
  }

  const handleExportData = () => {
    console.log("Exportando dados:", sessionData);
    alert('Exportando dados da sessão...');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-8">

          {/* Botão para Dashboard */}
<button
      onClick={() => navigate(`/dashboard/sessao/${id}`)}
      className="flex items-center gap-2 px-5 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition shadow"
    >
      📊 Ver Dashboard da Sessão
    </button>

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

        {/* Dados básicos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-6 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <User className="text-primary-500" size={24} />
            <div>
              <p className="text-sm text-gray-600">Paciente</p>
              <p className="font-semibold text-gray-800">{session.patient_name}</p>
            </div>
          </div>

          
          <div className="flex items-center gap-3">
            <Calendar className="text-primary-500" size={24} />
            <div>
              <p className="text-sm text-gray-600">Data Início</p>
              <p className="font-semibold text-gray-800">
                {new Date(session.session_start_time).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="text-primary-500" size={24} />
            <div>
              <p className="text-sm text-gray-600">Data Fim</p>
              <p className="font-semibold text-gray-800">
                {new Date(session.session_end_time).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="text-primary-500" size={24} />
            <div>
              <p className="text-sm text-gray-600">Duração</p>
              <p className="font-semibold text-gray-800">
                 {session.session_duration}
              </p>
            </div>
          </div>
        </div>

        {/* Dados brutos coletados */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Dados da Sessão (EEG)
          </h3>

          <p className="text-gray-600 mb-2">
            Registros capturados: <b>{sessionData.length}</b>
          </p>

          <div className="p-4 bg-gray-50 rounded-lg border max-h-64 overflow-auto text-sm">
            {sessionData.map((d, i) => (
              <div key={i} className="border-b py-2 text-gray-700">
                <p><b>Timestamp:</b> {d.timestamp_of_record}</p>
                <p><b>Delta:</b> {d.delta_power}, <b>Theta:</b> {d.theta_power}</p>
                <p><b>Alpha:</b> {d.low_alpha_power} - {d.high_alpha_power}</p>
                <p><b>Beta:</b> {d.low_beta_power} - {d.high_beta_power}</p>
                <p><b>Gamma:</b> {d.low_gamma_power} - {d.middle_gamma_power}</p>
                <p><b>Atenção:</b> {d.attention_value}, <b>Meditação:</b> {d.meditation_value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Botão exportar */}
        <div className="flex justify-end">
          <button
            onClick={handleExportData}
            className="flex items-center gap-2 px-8 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition shadow-md hover:shadow-lg"
          >
            <Download size={20} />
            Exportar dados
          </button>
        </div>

      </div>
    </div>
  );
}
