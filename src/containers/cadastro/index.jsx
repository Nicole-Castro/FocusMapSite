import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { signup, signupWithGoogle } from "../../services/authService";

export default function Cadastro() {
  const [name, setName] = useState("");         // ← ADICIONADO
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // -------- CADASTRO COM EMAIL/NOME/SENHA --------
  const handleSubmit = async () => {
    try {
const result = await signup(name, email, password);

      if (result.success) {
        navigate("/dashboard");
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      alert("Erro ao criar conta");
    }
  };

  // -------- CADASTRO COM GOOGLE --------
  const googleSignup = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Buscar infos básicas do usuário
        const { data } = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          }
        );

        // Criar senha automática
        const tempPassword = crypto.randomUUID();

        // Enviar para o backend
        const result = await signupWithGoogle({
          name: data.name || "Usuário Google",
          email: data.email,
          password: tempPassword,
        });

        if (result.success) {
          navigate("/dashboard");
        } else {
          alert(result.message);
        }
      } catch (error) {
        console.error("Erro ao cadastrar com Google:", error);
        alert("Erro no cadastro com Google");
      }
    },
    onError: () => {
      alert("Falha ao conectar com Google");
    },
  });

  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 items-center justify-center">
        <div className="w-80 h-80 bg-white rounded-2xl flex items-center justify-center shadow-2xl p-8">
          <img
            src="src/public/logo.png"
            alt="Logo Focus Map"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">
            Realizar Cadastro
          </h1>

          {/* NOME */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome completo"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
            />
          </div>

          {/* EMAIL */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
            />
          </div>

          {/* SENHA */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
            />
          </div>

          {/* BOTÃO CADASTRAR */}
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white 
            font-semibold rounded-lg hover:from-primary-600 hover:to-primary-700 transition 
            shadow-md hover:shadow-lg mb-4"
          >
            Criar Conta
          </button>

          {/* GOOGLE SIGNUP */}
          <button
            onClick={() => googleSignup()}
            className="w-full py-3 bg-white text-primary-600 font-medium border-2 
            border-primary-500 rounded-lg hover:bg-primary-50 transition flex items-center 
            justify-center gap-2 mb-6 shadow-sm"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Criar Conta com Google
          </button>

          <p className="text-center text-sm text-gray-600">
            Já tem uma conta?{" "}
            <button
              onClick={() => navigate("/")}
              className="text-primary-600 font-semibold hover:text-primary-700 transition"
            >
              Faça login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
