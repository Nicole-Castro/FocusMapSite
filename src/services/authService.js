import api from './api';
import axios from 'axios';

export async function login(email, password) {
  try {
    const response = await api.post('/Login/login', { email, password });

    localStorage.setItem('token', response.data.data.token);
localStorage.setItem('user', response.data.data.id);


    return { success: true };
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        'Erro ao autenticar. Verifique suas credenciais.',
    };
  }
}

export async function getCurrentUser() {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Usuário não autenticado');

  try {
    const response = await api.get('/Login/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    throw error;
  }
}
