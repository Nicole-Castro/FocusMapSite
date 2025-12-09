import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { ArrowLeft, Calendar, Clock, User, Mic, Brain } from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";

import { getSessionDashboard } from "../../services/sessionService";

export default function DashboardSessao() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [eeg, setEeg] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await getSessionDashboard(id);

        if (!res) {
          setLoading(false);
          return;
        }

        setSession(res.session);

        // Normalização EEG
        const eegNormalized = (res.eeg || []).map((e) => ({
          timestamp: e.timestamp || e.Timestamp,
          attention_value: e.attentionValue ?? e.AttentionValue,
          meditation_value: e.meditationValue ?? e.MeditationValue,
          delta_power: e.deltaPower ?? e.DeltaPower,
          low_alpha_power: e.lowAlphaPower ?? e.LowAlphaPower,
          high_alpha_power: e.highAlphaPower ?? e.HighAlphaPower,
          low_beta_power: e.lowBetaPower ?? e.LowBetaPower,
          high_beta_power: e.highBetaPower ?? e.HighBetaPower,
          low_gamma_power: e.lowGammaPower ?? e.LowGammaPower,
          middle_gamma_power: e.middleGammaPower ?? e.MiddleGammaPower,
          raw_eeg_value: e.rawEegValue ?? e.RawEegValue,
          latitude: e.latitude ?? e.Latitude,
          longitude: e.longitude ?? e.Longitude,
        }));

        // Normalização tópicos
        const topicsNormalized = (res.audioTopics || []).map((t) => ({
          id: t.id ?? t.Id,
          description: t.description ?? t.Description,
          startOfAudio: t.startOfAudio ?? t.StartOfAudio,
          endOfAudio: t.endOfAudio ?? t.EndOfAudio,
          pointOfInterestId: t.pointOfInterestId ?? t.PointOfInterestId,
        }));

        setEeg(eegNormalized);
        setTopics(topicsNormalized);
      } catch (err) {
        console.error("Erro ao carregar dashboard:", err);
      }

      setLoading(false);
    }

    load();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-10 text-center text-gray-600 text-lg">
        Carregando dashboard da sessão...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-6xl mx-auto p-10 text-center">
        <p className="text-red-600 text-lg">Sessão não encontrada.</p>
      </div>
    );
  }

  const formatTime = (t) => new Date(t).toLocaleTimeString("pt-BR");

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-10">
        <button
          onClick={() => navigate("/dashboard/historico-sessoes")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
        >
          <ArrowLeft size={20} />
          <span>Voltar ao histórico</span>
        </button>

        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Brain size={30} className="text-primary-600" />
          Dashboard da Sessão
        </h2>

        <div className="w-24"></div>
      </div>

      {/* Cards principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-white border rounded-xl shadow p-6 flex items-center gap-4">
          <User size={32} className="text-primary-600" />
          <div>
            <p className="text-sm text-gray-500">Paciente</p>
            <p className="text-xl font-semibold">{session.patient_name}</p>
          </div>
        </div>

        <div className="bg-white border rounded-xl shadow p-6 flex items-center gap-4">
          <Calendar size={32} className="text-primary-600" />
          <div>
            <p className="text-sm text-gray-500">Início da Sessão</p>
            <p className="text-lg font-semibold">
              {new Date(session.session_start_time).toLocaleString("pt-BR")}
            </p>
          </div>
        </div>

        <div className="bg-white border rounded-xl shadow p-6 flex items-center gap-4">
          <Calendar size={32} className="text-primary-600" />
          <div>
            <p className="text-sm text-gray-500">Fim da Sessão</p>
            <p className="text-lg font-semibold">
              {new Date(session.session_end_time).toLocaleString("pt-BR")}
            </p>
          </div>
        </div>

        
      </div>

      {/* Gráfico EEG */}
      <div className="bg-white border rounded-xl shadow p-8 mb-14">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Atividade EEG durante a Sessão
        </h3>

        {eeg.length === 0 ? (
          <p className="text-gray-600 text-center py-6">
            Nenhum dado EEG registrado nesta sessão.
          </p>
        ) : (
          <div style={{ height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={eeg}>
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={formatTime}
                  stroke="#777"
                />
                <YAxis stroke="#777" />
                <Tooltip labelFormatter={formatTime} />

                <Line
                  type="monotone"
                  dataKey="attention_value"
                  stroke="#2563eb"
                  dot={false}
                  strokeWidth={2}
                />

                <Line
                  type="monotone"
                  dataKey="meditation_value"
                  stroke="#16a34a"
                  dot={false}
                  strokeWidth={2}
                />

                <Line
                  type="monotone"
                  dataKey="delta_power"
                  stroke="#dc2626"
                  dot={false}
                  opacity={0.6}
                  strokeWidth={1.5}
                />

                {topics.map((t, index) => (
                  <ReferenceArea
                    key={index}
                    x1={t.startOfAudio}
                    x2={t.endOfAudio}
                    fill="#fde047"
                    fillOpacity={0.25}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        <p className="text-sm text-gray-500 mt-3">
          As áreas amarelas representam trechos onde a IA detectou tópicos de áudio.
        </p>
      </div>

      {/* Lista de tópicos */}
      <div className="bg-white border rounded-xl shadow p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-5">
          Assuntos detectados pela IA
        </h3>

        {topics.length === 0 && (
          <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
            Nenhum tópico de áudio detectado nesta sessão.
          </p>
        )}

        <div className="space-y-4">
          {topics.map((t, i) => (
            <div
              key={i}
              className="p-5 bg-gray-50 border rounded-lg flex items-start gap-4"
            >
              <Mic className="text-primary-600 mt-1" />

              <div>
                <p className="font-semibold text-gray-900">{t.description}</p>
                <p className="text-sm text-gray-600">
                  Início: {formatTime(t.startOfAudio)} — Fim:{" "}
                  {formatTime(t.endOfAudio)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
