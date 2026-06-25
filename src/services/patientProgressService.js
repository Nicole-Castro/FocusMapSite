import api from "./api"; // mesmo axios instance já usado no projeto

export const getPatientProgress = async (patientId) => {
  const { data } = await api.get(`/SessionData/progress/${patientId}`);
  return data?.data ?? null;
};