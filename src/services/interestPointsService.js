import api from "./api";

const InterestPointsService = {
  // ---------------------------------------------------
  // Criar ponto de interesse (agora com userId na URL)
  // ---------------------------------------------------
  create: async (userId, data) => {
    const response = await api.post(`/interestpoint/${userId}`, data);
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
  // Buscar pontos por usuário
  // (rota do backend continua /interestpoint/patient/:id — contrato não muda)
  // ---------------------------------------------------
  getByUser: async (userId) => {
    const response = await api.get(`/interestpoint/patient/${userId}`);
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
