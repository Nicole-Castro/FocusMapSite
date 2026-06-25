import api from "./api";

export async function getPatients(searchTerm = "") {
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
    console.error("Erro ao buscar pacientes:", error);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Erro ao buscar pacientes. Tente novamente.",
    };
  }
}

export async function deletePatient(id) {
  try {
    const response = await api.delete(`/User/DeletePatient/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Erro ao excluir paciente.",
    };
  }
}
export async function getTotalPatients() {
  try {
    const res = await api.get("/User/TotalPatients");
    return res.data.data || res.data || [];
  } catch (err) {
    console.error("Erro ao buscar pacientes:", err);
    return [];
  }
}

export async function getPatientById(id) {
  return api.get(`/user/${id}`);
}
