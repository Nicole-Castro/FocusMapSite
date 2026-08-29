import api from "./api.js";
export async function getSessionsByProfessional({ page = 1, pageSize = 10, status, userId, dateFrom, dateTo } = {}) {
  const params = { page, pageSize };
  if (status)   params.status    = status;
  // Query param continua "patientId" — contrato do backend não muda.
  if (userId)   params.patientId = userId;
  if (dateFrom) params.dateFrom  = dateFrom;
  if (dateTo)   params.dateTo    = dateTo;
  const res = await api.get(`/Session/professional`, { params });
  return res.data.data; // { items, totalCount, page, pageSize, totalPages }
}

export async function getSessionsByUser(userId) {
  // Rota do backend continua /Session/patient/:id — contrato não muda.
  const res = await api.get(`/Session/patient/${userId}`);
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

