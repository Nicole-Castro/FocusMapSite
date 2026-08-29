import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./src/containers/login";
import RecuperarSenha from "./src/containers/recuperar-senha";
import DashboardLayout from "./src/components/DashboardLayout";
import AdminRoute from "./src/components/AdminRoute";
import Dashboard from "./src/containers/dashboard";

import CadastroUsuario from "./src/containers/cadastro-usuario";
import UsuariosList from "./src/containers/usuarios";

import PontosInteresse from "./src/containers/pontos-interesse";
import PointsCreate from "./src/containers/pontos-interesse/create";
import PointsEdit from "./src/containers/pontos-interesse/edit";

import HistoricoSessoes from "./src/containers/historico-sessoes";
import SessaoDetalhes from "./src/containers/sessao-detalhes";
import DashboardSessao from "./src/containers/session-dashboard";
import PerfilProfissional from "./src/containers/perfil";
import DashboardProgressoUsuario from "./src/containers/user-progress";
import CadastroProfissional from "./src/containers/admin/cadastro-profissional";
import ProfissionaisList from "./src/containers/admin/profissionais";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas públicas */}
        {/* Autocadastro público (/cadastro) foi desativado — só Admin cadastra
            Professional agora, via /dashboard/admin/cadastro-profissional. */}
        <Route path="/" element={<Login />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />

        {/* Área protegida (Dashboard) */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />

          {/* Usuários */}
          <Route path="usuarios" element={<UsuariosList />} />
          <Route path="cadastro-usuario" element={<CadastroUsuario />} />

          {/* Pontos de interesse */}
          <Route
            path="usuario/:userId/points"
            element={<PontosInteresse />}
          />
          <Route
            path="usuario/:userId/points/create"
            element={<PointsCreate />}
          />
          <Route
            path="usuario/:userId/points/edit/:id"
            element={<PointsEdit />}
          />

          {/* Sessões */}
          <Route path="historico-sessoes" element={<HistoricoSessoes />} />
          <Route path="sessao-detalhes/:id" element={<SessaoDetalhes />} />
          <Route path="sessao/:id" element={<DashboardSessao />} />
          <Route path="/dashboard/perfil" element={<PerfilProfissional />} />
          <Route
            path="/dashboard/user-progress/:userId"
            element={<DashboardProgressoUsuario />}
          />

          {/* Admin — só funcionário da empresa (role Admin) acessa de verdade;
              o guard aqui é só UX, a garantia real é o backend (403 pra quem não for Admin). */}
          <Route
            path="admin/profissionais"
            element={
              <AdminRoute>
                <ProfissionaisList />
              </AdminRoute>
            }
          />
          <Route
            path="admin/cadastro-profissional"
            element={
              <AdminRoute>
                <CadastroProfissional />
              </AdminRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
