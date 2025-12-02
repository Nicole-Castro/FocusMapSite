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

function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas públicas (sem layout) */}
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />

        {/* Rotas protegidas (com layout do dashboard) */}
        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          }
        />
        <Route
          path="/dashboard/pacientes"
          element={
            <DashboardLayout>
              <PacientesList />
            </DashboardLayout>
          }
        />
        <Route
          path="/dashboard/cadastro-paciente"
          element={
            <DashboardLayout>
              <CadastroPaciente />
            </DashboardLayout>
          }
        />
        <Route
          path="/dashboard/patient/:patientId/points"
          element={
            <DashboardLayout>
              <PontosInteresse />
            </DashboardLayout>
          }
        />

        <Route
          path="/dashboard/patient/:patientId/points/edit/:id"
          element={
            <DashboardLayout>
              <PointsEdit />
            </DashboardLayout>
          }
        />

        <Route
          path="/dashboard/patient/:patientId/points/create"
          element={
            <DashboardLayout>
              <PointsCreate />
            </DashboardLayout>
          }
        />

        <Route
          path="/dashboard/historico-sessoes"
          element={
            <DashboardLayout>
              <HistoricoSessoes />
            </DashboardLayout>
          }
        />
        <Route
          path="/dashboard/sessao-detalhes/:id"
          element={
            <DashboardLayout>
              <SessaoDetalhes />
            </DashboardLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
