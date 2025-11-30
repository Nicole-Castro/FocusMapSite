import React, { useState, useEffect } from 'react';
import { createPatient } from "../../services/createPatient";

export default function CadastroPaciente() {
  const [photo, setPhoto] = useState(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
  });

  const validate = () => {
    const newErrors = {};

    // Nome
    if (!formData.nome.trim()) {
      newErrors.nome = "O nome é obrigatório.";
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = "O email é obrigatório.";
    } else {
      const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regexEmail.test(formData.email)) {
        newErrors.email = "Digite um email válido.";
      }
    }

    // Senha
     const password = formData.senha;

    if (!password) {
      newErrors.senha = "A senha é obrigatória.";
    } else {
      const requisitos = [];

      if (password.length < 6) requisitos.push("mínimo 6 caracteres");
      if (!/[A-Z]/.test(password)) requisitos.push("1 letra maiúscula");
      if (!/[a-z]/.test(password)) requisitos.push("1 letra minúscula");
      if (!/[0-9]/.test(password)) requisitos.push("1 número");
      if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password))
        requisitos.push("1 caractere especial");

      if (requisitos.length > 0) {
        newErrors.senha = "A senha deve conter: " + requisitos.join(", ") + ".";
      }
   }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // true se válido
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    setErrors(prev => ({ ...prev, [name]: "" })); // remove erro ao digitar
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return; // impede o envio
    }

    const payload = {
      name: formData.nome,
      email: formData.email,
      password: formData.senha,
    };

    const res = await createPatient(payload);

   if (res.success) {
  setFormData({ nome: '', email: '', senha: '' });
  setPhoto(null);
  setErrors({});

} else {
  setErrors(prev => ({
    ...prev,
    form: res.message || "Erro ao cadastrar paciente."
  }));
}

  };

  return (
    <div className="max-w-4xl mx-auto">
      {errors.form && (
  <p className="text-red-600 text-center font-medium mb-4">
    {errors.form}
  </p>
)}

      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Cadastro de Paciente</h2>

        <div className="space-y-6">
          {/* Nome */}
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
              className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none transition ${
                errors.nome ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-primary-500"
              }`}
            />
            {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome}</p>}
          </div>

          {/* Email */}
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
              className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none transition ${
                errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-primary-500"
              }`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Senha */}
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
              className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none transition ${
                errors.senha ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-primary-500"
              }`}
            />
            {errors.senha && <p className="text-red-500 text-sm mt-1">{errors.senha}</p>}
          </div>

          {/* Botão */}
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
  );
}
