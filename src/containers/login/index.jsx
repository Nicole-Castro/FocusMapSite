import React, { useState } from 'react';
import { login } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from "@react-oauth/google"; 


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Pega dados do usuário no Google
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          }
        );

        const result = await loginGoogle(userInfo.data);

        if (result.success) {
          navigate("/dashboard");
        } else {
          alert(result.message);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do google:", error);
      }
    },
    onError: () => {
      alert("Erro ao fazer login pelo Google");
    },
  });
  const handleSubmit = async () => {
    if (!email || !password) {
      alert('Por favor, preencha email e senha.');
      return;
    }
    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      alert(result.message);
    }
  };

  const handleGoogleLogin = () => {
    console.log('Login com Google');
  };

  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 items-center justify-center">
        <div className="w-80 h-80 bg-white rounded-2xl flex items-center justify-center shadow-2xl p-8">
          <img 
            src="src\public\logo.png"
            alt="Logo Focus Map" 
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">Iniciar Sessão</h1>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
            />
          </div>

          <button
            onClick={() => navigate('/recuperar-senha')}
            className="block ml-auto mb-6 text-sm text-primary-600 hover:text-primary-700 font-medium transition"
          >
            Esqueceu sua senha?
          </button>

          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-lg hover:from-primary-600 hover:to-primary-700 transition shadow-md hover:shadow-lg mb-4"
          >
            Entrar
          </button>

         <button 
  onClick={() => googleLogin()}
  className="w-full py-3 bg-white text-primary-600 font-medium border-2 border-primary-500 rounded-lg flex items-center justify-center gap-2"
>
  Login com o Google
</button>


          <p className="text-center text-sm text-gray-600">
            Ainda não tem conta?{' '}
            <button
              onClick={() => navigate('/cadastro')}
              className="text-primary-600 font-semibold hover:text-primary-700 transition"
            >
              Faça seu cadastro
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}