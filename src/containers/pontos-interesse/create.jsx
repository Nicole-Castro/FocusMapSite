import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InterestPointsService from "../../services/interestPointsService";

export default function CreatePoint() {
  const navigate = useNavigate();
  const { patientId } = useParams();

  const [form, setForm] = useState({
    name: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await InterestPointsService.create(patientId, {
        name: form.name,
      });

      navigate(`/dashboard/patient/${patientId}/points`);
    } catch (error) {
      console.error("Erro ao salvar ponto:", error);
      alert("Ocorreu um erro ao salvar o ponto.");
    }
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">Cadastrar Ponto</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 font-medium">Nome</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
            placeholder="Digite o nome do ponto"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600"
          >
            Salvar
          </button>

          <button
            type="button"
            onClick={() => navigate(`/points?patientId=${patientId}`)}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
