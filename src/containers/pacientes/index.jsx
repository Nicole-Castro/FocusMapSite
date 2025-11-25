import { useEffect, useState } from "react";
import { getPatients } from "../../services/getPatient";

export default function PacientesList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadPatients() {
    setLoading(true);
    setError("");

    const result = await getPatients();

    if (result.success) {
      setPatients(result.data);
    } else {
      setError(result.message);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadPatients();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Pacientes Cadastrados</h1>

      <button onClick={loadPatients} style={{ marginBottom: "15px" }}>
        Atualizar lista
      </button>

      {loading && <p>Carregando...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && patients.length === 0 && <p>Nenhum paciente encontrado.</p>}

      <ul>
        {patients.map((p) => (
          <li key={p.id} style={{ marginBottom: "8px" }}>
            <strong>{p.name}</strong> — {p.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
