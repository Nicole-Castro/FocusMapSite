import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { createPatient } from "../../services/createPatient";

export default function CadastroPaciente() {
  const [photo, setPhoto] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    profissional: '',
    email: '',
    senha: '',
    dataRegistro: '' // preenchida automaticamente
  });

  useEffect(() => {
    const hoje = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    setFormData(prev => ({
      ...prev,
      dataRegistro: hoje
    }));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
  };

  const handleSubmit = async () => {
    console.log("Submitting form data");
    const payload = {
      name: formData.nome,
      email: formData.email,
      password: formData.senha,
      professional: formData.profissional,
      registrationDate: formData.dataRegistro
    };
    const res = await createPatient(payload);
    if (res.success) {
      alert('Paciente cadastrado com sucesso!');
      
      const hoje = new Date().toISOString().split('T')[0];
      setFormData({ 
        nome: '', 
        profissional: '', 
        email: '', 
        senha: '', 
        dataRegistro: hoje 
      });
      setPhoto(null);
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Cadastro de Paciente</h2>

        <div className="flex flex-col items-center mb-8 pb-8 border-b border-gray-200">
          <label className="text-sm font-medium text-gray-700 mb-4">Foto do Paciente</label>
          
          <div className="relative mb-4">
            <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-300">
              {photo ? (
                <img src={photo} alt="Foto do paciente" className="w-full h-full object-cover" />
              ) : (
                <User size={48} className="text-gray-400" />
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <label className="px-6 py-2 bg-white text-primary-600 border-2 border-primary-500 rounded-lg font-medium cursor-pointer hover:bg-primary-50 transition">
              Inserir Imagem
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
            
            {photo && (
              <button
                onClick={handleRemovePhoto}
                className="px-6 py-2 text-primary-600 font-medium hover:underline"
              >
                Remover
              </button>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Dados do Paciente</h3>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Paciente
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  placeholder="Digite o nome completo"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profissional Vinculado
                </label>
                <input
                  type="text"
                  name="profissional"
                  value={formData.profissional}
                  onChange={handleInputChange}
                  placeholder="Nome do profissional"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email do Paciente
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="email@exemplo.com"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <input
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Registro
              </label>
              <input
                type="date"
                name="dataRegistro"
                value={formData.dataRegistro}
                disabled
                className="w-full px-4 py-3 bg-gray-200 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed"
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={handleSubmit}
                className="px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-lg hover:from-primary-600 hover:to-primary-700 transition shadow-md hover:shadow-lg"
              >
                Cadastrar Paciente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}