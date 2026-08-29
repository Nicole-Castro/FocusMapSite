import api from "./api";

// Todos os endpoints aqui são admin-only no backend ([Authorize(Roles = "Admin")]).

export async function getProfessionals(searchTerm = "") {
  try {
    const response = await api.get("/User/ListProfessionals", {
      params: { searchTerm: searchTerm || null },
    });
    return { success: true, data: response.data.data || response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Erro ao buscar profissionais.",
    };
  }
}

export async function deleteProfessional(id) {
  try {
    const response = await api.delete(`/User/DeleteProfessional/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Erro ao excluir profissional.",
    };
  }
}

export async function resetProfessionalPassword(id) {
  try {
    const response = await api.post(`/User/ResetProfessionalPassword/${id}`);
    // response.data.data = senha provisória em texto puro, só existe nesta resposta.
    return { success: true, temporaryPassword: response.data.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Erro ao resetar senha.",
    };
  }
}

export async function updateProfessionalName(id, name) {
  try {
    const response = await api.patch(`/User/UpdateUser/${id}`, { name });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Erro ao atualizar profissional.",
    };
  }
}
