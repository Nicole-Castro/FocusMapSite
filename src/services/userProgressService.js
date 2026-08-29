import api from "./api"; // mesmo axios instance já usado no projeto

export const getUserProgress = async (userId) => {
  const { data } = await api.get(`/SessionData/progress/${userId}`);
  return data?.data ?? null;
};
