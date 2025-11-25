import api from './api';

export async function getPatients() {
  try {
    const response = await api.get('/User/ListPatients');

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Erro ao buscar pacientes:", error);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        'Erro ao buscar pacientes. Tente novamente.',
    };
  }
}
