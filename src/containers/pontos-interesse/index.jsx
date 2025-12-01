import React, { useState } from 'react';
import { MapPin, Trash2, Edit2, Save, Users, Check, X } from 'lucide-react';

export default function PontosInteresse() {
  const [pontos, setPontos] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
  });
  const [pacientesInteresses, setPacientesInteresses] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);

  // Mock de pontos já criados
  const [pontosExistentes] = useState([
    { id: 1, nome: 'Matemática', descricao: 'Assunto relacionado a números e cálculos'},
    { id: 2, nome: 'Português', descricao: 'Assunto relacionado à língua portuguesa'},
    { id: 3, nome: 'Música', descricao: 'Assunto relacionado a teoria musical e prática'},
  ]);

  // Mock de pacientes
  const [pacientes] = useState([
    { id: 1, name: 'João Silva', email: 'joao.silva@email.com', professional: 'Dr. Carlos', registrationDate: '2024-01-15' },
    { id: 2, name: 'Maria Santos', email: 'maria.santos@email.com', professional: 'Dra. Ana', registrationDate: '2024-01-20' },
    { id: 3, name: 'Pedro Costa', email: 'pedro.costa@email.com', professional: 'Dr. Carlos', registrationDate: '2024-02-05' },
    { id: 4, name: 'Ana Oliveira', email: 'ana.oliveira@email.com', professional: 'Dra. Ana', registrationDate: '2024-02-10' },
    { id: 5, name: 'Carlos Souza', email: 'carlos.souza@email.com', professional: 'Dr. João', registrationDate: '2024-02-15' },
    { id: 6, name: 'Juliana Lima', email: 'juliana.lima@email.com', professional: 'Dra. Ana', registrationDate: '2024-03-01' },
    { id: 7, name: 'Roberto Alves', email: 'roberto.alves@email.com', professional: 'Dr. Carlos', registrationDate: '2024-03-05' },
    { id: 8, name: 'Fernanda Rocha', email: 'fernanda.rocha@email.com', professional: 'Dr. João', registrationDate: '2024-03-10' },
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (!formData.nome || !formData.descricao) {
      alert('Por favor, preencha pelo menos o nome e a descrição');
      return;
    }

    if (isEditing !== null) {
      setPontos(pontos.map(p => 
        p.id === isEditing ? { ...formData, id: isEditing } : p
      ));
      alert('Ponto de interesse atualizado com sucesso!');
    } else {
      const novoPonto = {
        ...formData,
        id: Date.now()
      };
      setPontos([...pontos, novoPonto]);
      alert('Ponto de interesse criado com sucesso!');
    }

    setFormData({
      nome: '',
      descricao: '',
    });
    setIsEditing(null);
  };

  const handleEdit = (ponto) => {
    setFormData({
      nome: ponto.nome,
      descricao: ponto.descricao,
    });
    setIsEditing(ponto.id);
  };

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir este ponto de interesse?')) {
      setPontos(pontos.filter(p => p.id !== id));
      alert('Ponto de interesse excluído com sucesso!');
    }
  };

  const handleCancel = () => {
    setFormData({
      nome: '',
      descricao: '',
    });
    setIsEditing(null);
  };

  const todosPontos = [...pontosExistentes, ...pontos];

  const openModal = (paciente) => {
    setPacienteSelecionado(paciente);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setPacienteSelecionado(null);
  };

  const toggleInteresse = (pacienteId, pontoId) => {
    setPacientesInteresses(prev => {
      const pacienteInteresses = prev[pacienteId] || [];
      const hasInteresse = pacienteInteresses.includes(pontoId);
      
      return {
        ...prev,
        [pacienteId]: hasInteresse
          ? pacienteInteresses.filter(id => id !== pontoId)
          : [...pacienteInteresses, pontoId]
      };
    });
  };

  const getInteressesCount = (pacienteId) => {
    return (pacientesInteresses[pacienteId] || []).length;
  };

  const salvarInteresses = () => {
    alert('Interesses salvos com sucesso!');
    closeModal();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {isEditing ? 'Editar Ponto de Interesse' : 'Criar Ponto de Interesse'}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Ponto*
              </label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                placeholder="Ex: Português, Matemática, Música"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição*
              </label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                placeholder="Descreva o assunto ou tema do ponto de interesse"
                rows="3"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition resize-none"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSubmit}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-lg hover:from-primary-600 hover:to-primary-700 transition shadow-md hover:shadow-lg"
              >
                <Save size={20} />
                {isEditing ? 'Atualizar' : 'Criar'} Ponto
              </button>

              {isEditing && (
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition"
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Pontos de Interesse Cadastrados
          </h2>

          {todosPontos.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600 text-lg font-medium">
                Nenhum ponto cadastrado
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Crie seu primeiro ponto de interesse
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {todosPontos.map((ponto) => (
                <div
                  key={ponto.id}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary-300 transition"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                        <MapPin className="text-white" size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{ponto.nome}</h3>
                        <p className="text-sm text-gray-600">{ponto.descricao}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(ponto)}
                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition"
                        title="Editar"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(ponto.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Atribuir Interesses aos Pacientes
        </h2>

        {todosPontos.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 text-lg font-medium">
              Nenhum ponto cadastrado
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Crie pontos de interesse para atribuí-los aos pacientes
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {pacientes.map((paciente) => (
              <div
                key={paciente.id}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary-300 transition cursor-pointer"
                onClick={() => openModal(paciente)}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="text-white" size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 truncate">{paciente.name}</h3>
                    <p className="text-sm text-gray-600 truncate">{paciente.email}</p>
                    <p className="text-xs text-primary-600 font-medium mt-1">
                      {getInteressesCount(paciente.id)} interesse(s) atribuído(s)
                    </p>
                  </div>
                </div>
                <button
                  className="w-full mt-2 px-4 py-2 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal(paciente);
                  }}
                >
                  Gerenciar Interesses
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalOpen && pacienteSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6 text-white">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <Users className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{pacienteSelecionado.name}</h3>
                    <p className="text-primary-100 text-sm">{pacienteSelecionado.email}</p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Selecione os pontos de interesse para este paciente:
              </h4>
              <div className="space-y-3">
                {todosPontos.map((ponto) => {
                  const isSelected = (pacientesInteresses[pacienteSelecionado.id] || []).includes(ponto.id);
                  return (
                    <button
                      key={ponto.id}
                      onClick={() => toggleInteresse(pacienteSelecionado.id, ponto.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition ${
                        isSelected
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isSelected ? 'bg-primary-500' : 'bg-gray-300'
                        }`}>
                          <MapPin size={20} className="text-white" />
                        </div>
                        <div className="text-left flex-1 min-w-0">
                          <h5 className={`font-semibold truncate ${isSelected ? 'text-primary-700' : 'text-gray-800'}`}>
                            {ponto.nome}
                          </h5>
                          <p className="text-sm text-gray-600 truncate">{ponto.descricao}</p>
                        </div>
                      </div>
                      {isSelected && (
                        <Check size={24} className="text-primary-600 flex-shrink-0 ml-3" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-200 flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
              <button
                onClick={salvarInteresses}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-lg hover:from-primary-600 hover:to-primary-700 transition shadow-md hover:shadow-lg"
              >
                Salvar Interesses
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}