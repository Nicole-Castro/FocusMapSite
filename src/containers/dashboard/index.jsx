import React, { useEffect, useState } from "react";
import { Users, Activity, PlusCircle, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getTotalPatients } from "../../services/getPatient";
import { getSessionsByProfessional } from "../../services/sessionService";

export default function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalPatients: "-",
    sessions: "-",
  });

  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("user");

  async function loadDashboardData() {
    try {
      setLoading(true);

      const patientsRes = await getTotalPatients();
      const totalPatients = patientsRes.total ?? 0;

      const sessionsRes = await getSessionsByProfessional(userId);
      const sessions = sessionsRes.data ?? [];

      setStats({
        totalPatients,
        sessions: sessions.length,
      });
    } catch (err) {
      console.error("Erro ao carregar dashboard:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  const cards = [
    {
      icon: Users,
      label: "Pacientes",
      value: stats.totalPatients,
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Activity,
      label: "Sessões",
      value: stats.sessions,
      color: "from-green-500 to-green-600",
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* HERO */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white shadow-md">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Bem-vindo</h1>
        <p className="text-primary-100">
          Acompanhe seus pacientes e sessões em tempo real
        </p>

        {/* AÇÕES RÁPIDAS */}
        <div className="flex flex-wrap gap-3 mt-6">
          <button
            onClick={() => navigate("/dashboard/pacientes")}
            className="flex items-center gap-2 px-4 py-2 bg-white text-primary-600 font-medium rounded-lg hover:bg-gray-100 transition"
          >
            <Users size={16} />
            Ver Pacientes
          </button>

          <button
            onClick={() => navigate("/dashboard/historico-sessoes")}
            className="flex items-center gap-2 px-4 py-2 bg-white text-primary-600 font-medium rounded-lg hover:bg-gray-100 transition"
          >
            <Calendar size={16} />
            Sessões
          </button>
        </div>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-6 border group"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`bg-gradient-to-br ${stat.color} p-3 rounded-xl shadow`}
              >
                <stat.icon className="text-white" size={22} />
              </div>

              {/* efeito hover */}
              <span className="text-xs text-gray-400 group-hover:text-primary-500 transition">
                Ver detalhes →
              </span>
            </div>

            <p className="text-gray-500 text-sm">{stat.label}</p>

            {loading ? (
              <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mt-2"></div>
            ) : (
              <p className="text-3xl font-bold text-gray-800 mt-1">
                {stat.value}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* AÇÃO EXTRA */}
      <div className="bg-white rounded-2xl border shadow-sm p-6 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-800">
            Adicionar novo paciente
          </h3>
          <p className="text-sm text-gray-500">
            Cadastre rapidamente um novo paciente no sistema
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard/cadastro-paciente")}
          className="flex items-center gap-2 px-5 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition shadow"
        >
          <PlusCircle size={18} />
          Novo Paciente
        </button>
      </div>
    </div>
  );
}
