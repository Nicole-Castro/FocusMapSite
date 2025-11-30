// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
  withCredentials: true,
});
console.log("API URL:", import.meta.env.VITE_API_URL);
// Interceptor para incluir o token JWT
const noAuthRoutes = ["/User/CreateUser", "/User/Login"];

api.interceptors.request.use((config) => {
  if (!noAuthRoutes.some((r) => config.url.includes(r))) {
    const token = localStorage.getItem("token");
    if (token && token !== "null") {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});


// Interceptor para capturar erros e agir conforme o status
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error("Erro de rede ou servidor offline:", error);
      return Promise.reject(error);
    }

    const status = error.response.status;

    // Token expirado
    if (status === 401) {
      console.warn("Token expirado ou inválido.");

      // (opcional) logout automático
      localStorage.removeItem("token");
      window.location.href = "/";
    }

    // Acesso negado
    if (status === 403) {
      console.warn("Acesso negado.");
    }

    return Promise.reject(error);
  }
);

export default api;
