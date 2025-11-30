import api from "./api";
import axios from "axios";

export async function login(email, password) {
  try {
    const response = await api.post("/Login/login", { email, password });

    localStorage.setItem("token", response.data.data.token);
    localStorage.setItem("user", response.data.data.id);

    return { success: true };
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Erro ao autenticar. Verifique suas credenciais.",
    };
  }
}

export async function getCurrentUser() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Usuário não autenticado");

  try {
    const response = await api.get("/Login/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    throw error;
  }
}
export async function signup(name, email, password) {
  try {
    const response = await api.post("/User/CreateUser", {
      name,
      email,
      password,
    });

 console.log("Resposta do servidor:", response.data);    localStorage.setItem("token", response.data.data.token);
    localStorage.setItem("user", response.data.data.id);

    return {
      success: true,
      message: response.data.message || "Cadastro realizado com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Erro ao cadastrar. Tente novamente.",
    };
  }
}

export async function signupWithGoogle(googleToken) {
  try {
    const response = await api.post("/User/GoogleSignUp", {
      token: googleToken,
    });

    localStorage.setItem("token", response.data.data.token);
    localStorage.setItem("user", response.data.data.id);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Erro ao cadastrar via Google.",
    };
  }
}
export async function loginGoogle(user) {
  try {
    const response = await api.post("/Login/GoogleLogin", {
      email: user.email,
      name: user.name,
      picture: user.picture,
      sub: user.sub, 
    });

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    return { success: true };
  } catch (error) {
    console.error("Erro ao logar com google:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Erro no login Google!",
    };
  }
}
