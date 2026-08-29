import api from "./api";

// Endpoint admin-only (backend valida a role via [Authorize(Roles = "Admin")]).
// Reaproveita o endpoint /User/CreateUser, que hoje só cria contas Professional.
export async function createProfessional({ name, email, password }) {
  try {
    const response = await api.post("/User/CreateUser", { name, email, password });
    return { success: true, data: response.data?.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Erro ao cadastrar profissional.",
    };
  }
}
