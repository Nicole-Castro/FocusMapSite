import React, { useState } from "react";
import { createPatient } from "../../services/createPatient";
import { User, Mail, Lock, CheckCircle, AlertCircle } from "lucide-react";

export default function CadastroPaciente() {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
  });

  // 🔥 força da senha
  const getPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*]/.test(password)) score++;

    if (score <= 1) return { label: "Fraca", color: "bg-red-500" };
    if (score === 2) return { label: "Média", color: "bg-yellow-500" };
    return { label: "Forte", color: "bg-green-500" };
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.nome.trim()) newErrors.nome = "Nome obrigatório";

    if (!formData.email.trim()) {
      newErrors.email = "Email obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    const p = formData.senha;

    if (!p) newErrors.senha = "Senha obrigatória";
    else if (
      p.length < 6 ||
      !/[A-Z]/.test(p) ||
      !/[a-z]/.test(p) ||
      !/[0-9]/.test(p) ||
      !/[!@#$%^&*]/.test(p)
    ) {
      newErrors.senha = "Senha não atende aos requisitos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);

    const res = await createPatient({
      name: formData.nome,
      email: formData.email,
      password: formData.senha,
    });

    setLoading(false);

    if (res.success) {
      setFormData({ nome: "", email: "", senha: "" });
      setErrors({});
    } else {
      setErrors((prev) => ({
        ...prev,
        form: res.message || "Erro ao cadastrar",
      }));
    }
  };

  const strength = getPasswordStrength(formData.senha);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Cadastro de Paciente
        </h1>
        <p className="text-sm text-gray-500">
          Crie um novo paciente no sistema
        </p>
      </div>

      {errors.form && (
        <div className="flex items-center gap-2 bg-red-50 text-red-700 p-3 rounded-lg">
          <AlertCircle size={16} />
          {errors.form}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* FORM */}
        <div className="bg-white border rounded-xl p-6 shadow-sm space-y-5">
          {/* Nome */}
          <Input
            icon={User}
            label="Nome"
            name="nome"
            value={formData.nome}
            onChange={handleInputChange}
            error={errors.nome}
            placeholder="Nome completo"
          />

          {/* Email */}
          <Input
            icon={Mail}
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
            placeholder="email@exemplo.com"
          />

          {/* Senha */}
          <div>
            <Input
              icon={Lock}
              label="Senha"
              name="senha"
              type="password"
              value={formData.senha}
              onChange={handleInputChange}
              error={errors.senha}
              placeholder="••••••••"
            />

            {/* 🔥 barra de força */}
            {formData.senha && (
              <div className="mt-2">
                <div className="w-full h-2 bg-gray-200 rounded">
                  <div
                    className={`h-2 rounded ${strength.color}`}
                    style={{
                      width:
                        strength.label === "Fraca"
                          ? "33%"
                          : strength.label === "Média"
                            ? "66%"
                            : "100%",
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Força da senha: {strength.label}
                </p>
              </div>
            )}
          </div>

          {/* BOTÃO */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition shadow disabled:opacity-50"
          >
            {loading ? "Cadastrando..." : "Cadastrar Paciente"}
          </button>
        </div>

        {/* PREVIEW (🔥 DIFERENCIAL VISUAL) */}
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-xl p-6 flex flex-col justify-between shadow">
          <div>
            <h3 className="text-lg font-semibold mb-4">Preview do Paciente</h3>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
                {formData.nome?.charAt(0) || "P"}
              </div>

              <div>
                <p className="font-semibold text-lg">
                  {formData.nome || "Nome do paciente"}
                </p>
                <p className="text-sm opacity-80">
                  {formData.email || "email@exemplo.com"}
                </p>
              </div>
            </div>
          </div>

          <div className="text-sm opacity-80">
            Este paciente poderá ser monitorado pelo FocusMap com dados EEG.
          </div>
        </div>
      </div>
    </div>
  );
}

/* INPUT COMPONENT */
function Input({ icon: Icon, label, error, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>

      <div className="relative">
        <Icon
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          {...props}
          className={`w-full pl-10 pr-3 py-3 bg-gray-50 border rounded-lg focus:outline-none transition ${
            error
              ? "border-red-500 focus:ring-red-400"
              : "border-gray-300 focus:ring-primary-400"
          }`}
        />
      </div>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
