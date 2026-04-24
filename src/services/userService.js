import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// 🔐 interceptor para mandar o token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export async function getCurrentUser() {
  try {
    const res = await API.get("/me");
    return res.data;
  } catch (err) {
    console.error("Erro ao buscar usuário:", err);
    return null;
  }
}
