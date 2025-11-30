import React from 'react';
import { Users, UserPlus, Activity, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  const stats = [
    { 
      icon: Users, 
      label: 'Total de Pacientes', 
      value: '-', 
      color: 'bg-blue-500',
      trend: '-'
    },
    { 
      icon: Activity, 
      label: 'Sessões Hoje', 
      value: '-', 
      color: 'bg-green-500',
      trend: '-'
    },
    { 
      icon: UserPlus, 
      label: 'Novos Pacientes', 
      value: '-', 
      color: 'bg-purple-500',
      trend: '-'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Bem-vindo ao Focus Map</h1>
        <p className="text-primary-100">Gerencie seus pacientes e monitore suas sessões de EEG</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="text-white" size={24} />
              </div>
              <span className="text-gray-400 text-sm font-semibold">{stat.trend}</span>
            </div>
            <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Ações Rápidas</h2>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/dashboard/cadastro-paciente')}
              className="w-full flex items-center gap-3 px-4 py-3 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition"
            >
              <UserPlus size={20} />
              <span className="font-medium">Cadastrar Novo Paciente</span>
            </button>
            <button
              onClick={() => navigate('/dashboard/pacientes')}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition"
            >
              <Users size={20} />
              <span className="font-medium">Ver Todos os Pacientes</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Pacientes Recentes</h2>
          <div className="flex items-center justify-center h-40 bg-gray-50 rounded-lg">
            <p className="text-gray-400 text-sm">Aguardando integração com backend</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Atividade Recente</h2>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-400">Gráfico de atividade será integrado com backend</p>
        </div>
      </div>
    </div>
  );
}