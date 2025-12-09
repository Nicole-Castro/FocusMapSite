import api from "./api.js";
export async function getSessionsByProfessional(professionalId) {
  const res = await api.get(`/Session/professional`);
  return res.data.data; // pega apenas a lista
}

export async function getSessionsByPatient(patientId) {
  const res = await api.get(`/Session/patient/${patientId}`);
  return res.data.data; 
}

export async function getSessionById(id) {
  const res = await api.get(`/Session/${id}`);
  return res.data.data;
}

export async function getSessionDataById(id) {
  const res = await api.get(`/SessionData/session/${id}`);
  return res.data.data;
}

export async function getSessionDashboard(id) {
  const res = await api.get(`/Session/${id}/dashboard`);
  return res.data.data;
}


