import api from "./api";

const InterestPointsService = {
  // ---------------------------------------------------
  // Criar ponto de interesse (agora com patientId na URL)
  // ---------------------------------------------------
  create: async (patientId, data) => {
    const response = await api.post(`/interestpoint/${patientId}`, data);
    return response.data;
  },

  // ---------------------------------------------------
  // Buscar ponto por ID
  // ---------------------------------------------------
  getById: async (id) => {
    const response = await api.get(`/interestpoint/${id}`);
    return response.data;
  },

  // ---------------------------------------------------
  // Buscar pontos por paciente
  // ---------------------------------------------------
  getByPatient: async (patientId) => {
    const response = await api.get(`/interestpoint/patient/${patientId}`);
    return response.data;
  },

  // ---------------------------------------------------
  // Atualizar ponto
  // ---------------------------------------------------
  update: async (id, data) => {
    const response = await api.put(`/interestpoint/${id}`, data);
    return response.data;
  },

  // ---------------------------------------------------
  // Excluir ponto
  // ---------------------------------------------------
  delete: async (id) => {
    const response = await api.delete(`/interestpoint/${id}`);
    return response.data;
  },
};

export default InterestPointsService;
