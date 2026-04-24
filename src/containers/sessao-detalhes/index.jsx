import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Calendar,
  Clock,
  User,
  Activity,
} from "lucide-react";

import {
  getSessionById,
  getSessionDataById,
} from "../../services/sessionService";

export default function SessaoDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const C = {
    primary: "#f86f26",
    attention: "#3b82f6",
    meditation: "#10b981",
  };
  const [session, setSession] = useState(null);
  const [sessionData, setSessionData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const sessionRes = await getSessionById(id);
      const dataRes = await getSessionDataById(id);

      if (sessionRes) setSession(sessionRes);
      if (dataRes) setSessionData(dataRes);

      setLoading(false);
    }

    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Carregando sessão...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        Sessão não encontrada.
      </div>
    );
  }

  const formatDate = (d) =>
    new Date(d).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleExportData = () => {
    console.log("Exportando:", sessionData);
    alert("Exportando dados...");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => navigate("/dashboard/historico-sessoes")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition"
        >
          <ArrowLeft size={16} />
          Voltar
        </button>

        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-gray-800">
            Detalhes da Sessão
          </h1>
        </div>

        <button
          onClick={() => navigate(`/dashboard/sessao/${id}`)}
          className="px-4 py-2 text-white text-sm font-semibold rounded-lg shadow transition"
          style={{
            background: "linear-gradient(135deg, #ff9e3d, #f86f26)",
          }}
        >
          📊 Ver Dashboard
        </button>
      </div>

      {/* INFO CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card icon={User} label="Paciente" value={session.patient_name} />
        <Card
          icon={Calendar}
          label="Início"
          value={formatDate(session.session_start_time)}
        />
        <Card
          icon={Calendar}
          label="Fim"
          value={formatDate(session.session_end_time)}
        />
        <Card icon={Clock} label="Duração" value={session.session_duration} />
      </div>

      {/* RESUMO */}
      <div className="bg-white border rounded-xl p-6 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Total de registros EEG</p>
          <p className="text-3xl font-bold text-gray-800">
            {sessionData.length}
          </p>

          {/* insight rápido */}
          <p className="text-xs text-gray-400 mt-1">
            Dados coletados durante a sessão
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <Activity className="text-blue-500" />
          </div>

          <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 font-medium">
            Sessão válida
          </span>
        </div>
      </div>

      {/* LISTA EEG */}
      <div className="max-h-96 overflow-auto divide-y text-sm">
        {sessionData.map((d, i) => {
          const att = d.attention_value;
          const med = d.meditation_value;

          const attColor =
            att >= 75
              ? "bg-green-100 text-green-700"
              : att >= 50
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700";

          return (
            <div
              key={i}
              className="p-4 hover:bg-gray-50 transition flex flex-col gap-3"
            >
              {/* timestamp */}
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">
                  {new Date(d.timestamp_of_record).toLocaleTimeString()}
                </span>

                {/* chips */}
                <div className="flex gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded font-semibold ${attColor}`}
                  >
                    Atenção: {att}
                  </span>

                  <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 font-semibold">
                    Meditação: {med}
                  </span>
                </div>
              </div>

              {/* métricas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Metric label="Delta" value={d.delta_power} />
                <Metric label="Theta" value={d.theta_power} />
                <Metric
                  label="Alpha"
                  value={`${d.low_alpha_power}-${d.high_alpha_power}`}
                />
                <Metric
                  label="Beta"
                  value={`${d.low_beta_power}-${d.high_beta_power}`}
                />
                <Metric
                  label="Gamma"
                  value={`${d.low_gamma_power}-${d.middle_gamma_power}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* COMPONENTES AUXILIARES */
function Card({ icon: Icon, label, value }) {
  return (
    <div className="bg-white border rounded-xl p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #ffedd5, #fed7aa)",
        }}
      >
        <Icon className="text-orange-500" size={18} />
      </div>

      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="flex flex-col text-xs">
      <span className="text-gray-400">{label}</span>
      <span className="font-semibold text-gray-800">{value}</span>
    </div>
  );
}
