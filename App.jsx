import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./src/containers/login";
import Cadastro from "./src/containers/cadastro";
import RecuperarSenha from "./src/containers/recuperar-senha";
import DashboardLayout from "./src/components/DashboardLayout";
import Dashboard from "./src/containers/dashboard";

import CadastroPaciente from "./src/containers/cadastro-paciente";
import PacientesList from "./src/containers/pacientes";

import PontosInteresse from "./src/containers/pontos-interesse";
import PointsCreate from "./src/containers/pontos-interesse/create";
import PointsEdit from "./src/containers/pontos-interesse/edit";

import HistoricoSessoes from "./src/containers/historico-sessoes";
import SessaoDetalhes from "./src/containers/sessao-detalhes";
import DashboardSessao from "./src/containers/session-dashboard";
import UserProfile from "./src/containers/user";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />

        {/* Área protegida (Dashboard) */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />

          {/* Pacientes */}
          <Route path="pacientes" element={<PacientesList />} />
          <Route path="cadastro-paciente" element={<CadastroPaciente />} />

          {/* Pontos de interesse */}
          <Route
            path="patient/:patientId/points"
            element={<PontosInteresse />}
          />
          <Route
            path="patient/:patientId/points/create"
            element={<PointsCreate />}
          />
          <Route
            path="patient/:patientId/points/edit/:id"
            element={<PointsEdit />}
          />

          {/* Sessões */}
          <Route path="historico-sessoes" element={<HistoricoSessoes />} />
          <Route path="sessao-detalhes/:id" element={<SessaoDetalhes />} />
          <Route path="sessao/:id" element={<DashboardSessao />} />
          <Route path="/dashboard/perfil" element={<UserProfile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
