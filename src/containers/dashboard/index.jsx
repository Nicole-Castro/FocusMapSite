import React, { useEffect, useState } from 'react';
import { Users, UserPlus, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getTotalPatients } from "../../services/getPatient";
import { getSessionsByProfessional } from "../../services/sessionService";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPatients: "-",
    sessionsToday: "-",
    newPatients: "-",
  });

const userId = localStorage.getItem("user"); 

  async function loadDashboardData() {
  try {
    // 📌 Pacientes
    const patientsRes = await getTotalPatients();
    const totalPatients = patientsRes.total ?? 0;


console.log("getTotalPatients()", patientsRes);

    // 📌 Sessões
    const sessionsRes = await getSessionsByProfessional(userId);
    const sessions = sessionsRes.data ?? [];
    console.log("getSessionsByProfessional()", sessionsRes);

    setStats({
      totalPatients: totalPatients,
      sessionsToday: sessions.length,
    });

  } catch (err) {
    console.error("Erro ao carregar dashboard:", err);
  }
}


  useEffect(() => {
    loadDashboardData();
  }, []);

  const cards = [
    {
      icon: Users,
      label: 'Total de Pacientes',
      value: stats.totalPatients,
      color: 'bg-blue-500',
    },
    {
      icon: Activity,
      label: 'Total de Sessões',
      value: stats.sessionsToday,
      color: 'bg-green-500',
    },
   
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Bem-vindo ao Focus Map</h1>
        <p className="text-primary-100">Gerencie seus pacientes e monitore as sessões</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="text-white" size={24} />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
