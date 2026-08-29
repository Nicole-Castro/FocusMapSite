import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../services/authService";

/**
 * Guarda de rota: só deixa passar se o usuário logado tiver role "Admin".
 * Isso é só conveniência de UI (esconder/redirecionar) — a segurança de verdade
 * é o backend recusando com 403 quem não for Admin (ver [Authorize(Roles = "Admin")]
 * em UserController.CreateUser).
 */
export default function AdminRoute({ children }) {
  const [status, setStatus] = useState("loading"); // loading | allowed | denied

  useEffect(() => {
    let mounted = true;
    getCurrentUser()
      .then((user) => {
        if (mounted) setStatus(user?.role === "Admin" ? "allowed" : "denied");
      })
      .catch(() => {
        if (mounted) setStatus("denied");
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (status === "loading") return null;
  if (status === "denied") return <Navigate to="/dashboard" replace />;
  return children;
}
