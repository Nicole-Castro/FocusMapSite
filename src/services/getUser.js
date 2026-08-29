import api from "./api";

// Endpoints do backend continuam com nomenclatura antiga (/User/ListPatients etc.) —
// o contrato da API não muda, só a nomenclatura aqui no frontend.

export async function getUsers(searchTerm = "") {
  try {
    const response = await api.get("/User/ListPatients", {
      params: {
        searchTerm: searchTerm || null, // envia como query
      },
    });

    return {
      success: true,
      data: response.data.data || response.data,
    };
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Erro ao buscar usuários. Tente novamente.",
    };
  }
}

export async function deleteUser(id) {
  try {
    const response = await api.delete(`/User/DeletePatient/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Erro ao excluir usuário.",
    };
  }
}
export async function getTotalUsers() {
  try {
    const res = await api.get("/User/TotalPatients");
    return res.data.data || res.data || [];
  } catch (err) {
    console.error("Erro ao buscar usuários:", err);
    return [];
  }
}

export async function getUserById(id) {
  return api.get(`/user/${id}`);
}
