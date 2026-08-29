import React, { useEffect, useState } from 'react';
import { login, loginGoogle } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import { Eye, EyeOff, AlertCircle, X } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  // Toast some sozinho depois de um tempo.
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(timer);
  }, [toast]);

  // -------------------------------
  // 🔎 Função de validação
  // -------------------------------
  const validate = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "O email é obrigatório.";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Digite um email válido.";
    }

    if (!password) {
      newErrors.password = "A senha é obrigatória.";
    } else if (password.length < 6) {
      newErrors.password = "A senha deve ter pelo menos 6 caracteres.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -------------------------------
  // 🔐 Login Normal
  // -------------------------------
  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);

    const result = await login(email, password);

    setLoading(false);

    if (result.success) {
      navigate("/dashboard");
    } else {
      // Só o toast — o e-mail e a senha continuam preenchidos, nada recarrega.
      setToast(result.message || "Não foi possível entrar. Verifique seus dados.");
    }
  };

  // -------------------------------
  // 🔵 Login Google
  // -------------------------------
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);

        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          }
        );

        const result = await loginGoogle(userInfo.data);
        setLoading(false);

        if (result.success) {
          navigate("/dashboard");
        } else {
          setToast(result.message || "Erro ao entrar com Google. Tente novamente.");
        }

      } catch (error) {
        setLoading(false);
        setToast("Erro ao entrar com Google. Tente novamente.");
      }
    },
    onError: () => {
      setToast("Erro ao conectar com Google.");
    },
  });

  return (
    <div className="flex min-h-screen w-full">
      {/* Toast de erro */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-start gap-3 max-w-sm w-full bg-white border border-red-200 shadow-lg rounded-lg p-4">
          <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-sm text-gray-700 flex-1">{toast}</p>
          <button onClick={() => setToast(null)} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Lado esquerdo */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 items-center justify-center">
        <div className="w-80 h-80 bg-white rounded-2xl flex items-center justify-center shadow-2xl p-8">
          <img
            src="/images/logo.png"
            alt="Logo Focus Map"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Lado direito - formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">

          <h1 className="text-3xl font-bold mb-8 text-gray-800">Iniciar Sessão</h1>

          {/* Campo Email */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none transition ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-primary-500 focus:border-primary-500"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Campo Senha */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full px-4 py-3 pr-11 bg-gray-50 border rounded-lg focus:outline-none transition ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            onClick={() => navigate('/recuperar-senha')}
            className="block ml-auto mb-6 text-sm text-primary-600 hover:text-primary-700 font-medium transition"
          >
            Esqueceu sua senha?
          </button>

          {/* Botão Entrar */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-lg hover:from-primary-600 hover:to-primary-700 transition shadow-md hover:shadow-lg mb-4 disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

        </div>
      </div>
    </div>
  );
}
