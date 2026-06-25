import api from "./api.js";
export async function getSessionsByProfessional({ page = 1, pageSize = 10, status, patientId, dateFrom, dateTo } = {}) {
  const params = { page, pageSize };
  if (status)    params.status    = status;
  if (patientId) params.patientId = patientId;
  if (dateFrom)  params.dateFrom  = dateFrom;
  if (dateTo)    params.dateTo    = dateTo;
  const res = await api.get(`/Session/professional`, { params });
  return res.data.data; // { items, totalCount, page, pageSize, totalPages }
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


