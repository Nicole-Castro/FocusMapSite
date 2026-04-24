import { useState, useEffect } from "react";
import { User, Mail, Lock, Save, ArrowLeft, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // 🔹 Simulação carregamento usuário
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userData")) || {
      name: "Usuário",
      email: "usuario@email.com",
    };

    setForm({
      name: user.name,
      email: user.email,
      password: "",
    });
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSave() {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // 🔥 Aqui você chama sua API depois
      console.log("Salvando:", form);

      // Simulação
      await new Promise((r) => setTimeout(r, 1000));

      setSuccess("Perfil atualizado com sucesso!");
    } catch (err) {
      setError("Erro ao atualizar perfil.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition"
        >
          <ArrowLeft size={18} />
          Voltar
        </button>

        <h1 className="text-2xl font-bold text-gray-800">Meu Perfil</h1>

        <div />
      </div>

      {/* CARD PERFIL */}
      <div className="bg-white border rounded-2xl shadow-sm p-6 flex flex-col md:flex-row gap-6 items-center">
        {/* Avatar */}
        <div className="relative">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg">
            {form.name?.charAt(0) || "U"}
          </div>

          <button className="absolute bottom-0 right-0 bg-white border rounded-full p-2 shadow hover:bg-gray-100">
            <Camera size={16} />
          </button>
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-xl font-semibold text-gray-800">{form.name}</h2>
          <p className="text-gray-500">{form.email}</p>

          <span className="inline-block mt-2 text-xs bg-primary-100 text-primary-600 px-3 py-1 rounded-full">
            Profissional
          </span>
        </div>
      </div>

      {/* FORM */}
      <div className="bg-white border rounded-2xl shadow-sm p-6 space-y-5">
        <h3 className="text-lg font-semibold text-gray-700">
          Informações da Conta
        </h3>

        {/* ALERTAS */}
        {success && (
          <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Nome */}
        <div>
          <label className="text-sm text-gray-600 mb-1 block">Nome</label>
          <div className="relative">
            <User
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-primary-400 outline-none"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="text-sm text-gray-600 mb-1 block">Email</label>
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-primary-400 outline-none"
            />
          </div>
        </div>

        {/* Senha */}
        <div>
          <label className="text-sm text-gray-600 mb-1 block">Nova senha</label>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-primary-400 outline-none"
            />
          </div>
        </div>

        {/* BOTÃO */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition shadow disabled:opacity-50"
          >
            <Save size={18} />
            {loading ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </div>
    </div>
  );
}
