
import api from './api';

export async function createPatient({ name, email, password }) {
  console.log("ENVIANDO REQUISIÇÃO PARA API...", { name, email, password }); // <---

  try {
    const response = await api.post('/User/CreatePatient', { name, email, password });
    console.log("RESPOSTA DA API:", response); // <---

    return { success: true, data: response.data };
  } catch (error) {
    console.error("ERRO NA API:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Erro desconhecido",
    };
  }
}
