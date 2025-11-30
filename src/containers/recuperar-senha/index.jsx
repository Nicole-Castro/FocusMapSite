import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';

export default function RecuperarSenha() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    console.log('Recuperar senha para:', email);
    alert('Link de recuperação enviado para: ' + email);
  };

  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden lg:flex w-1/2 bg-gray-200 items-center justify-center">
        <div className="w-64 h-64 bg-white rounded-lg flex items-center justify-center shadow-xl">
          <Mail size={120} strokeWidth={1.5} className="text-gray-300" />
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">Esqueceu sua senha?</h1>
          <p className="text-sm text-gray-600 mb-8 leading-relaxed">
            Digite seu e-mail cadastrado e enviaremos um link para redefinir sua senha.
          </p>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-primary-500 text-white font-medium rounded hover:bg-primary-600 transition mb-6"
          >
            Enviar Link de Recuperação
          </button>

          <button
            onClick={() => navigate('/')}
            className="block w-full text-center text-sm text-gray-600 hover:text-primary-500 transition"
          >
            ← Voltar para o login
          </button>
        </div>
      </div>
    </div>
  );
}