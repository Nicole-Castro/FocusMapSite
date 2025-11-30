import api from "./api.js";
export async function getSessionsByProfessional(professionalId) {
  try {
    const res = await api.get(`/Session/professional/${professionalId}`);
    return res.data.data || [];
  } catch (err) {
    console.error("Erro ao buscar sessões:", err);
    return [];
  }
}
export async function getSessionDataByPatient(patientId) {
  try {
    const res = await api.get(`/SessionData/patient/${patientId}`);
    return res.data.data || [];
  } catch (err) {
    console.error("Erro ao buscar session data:", err);
    return [];
  }
}
