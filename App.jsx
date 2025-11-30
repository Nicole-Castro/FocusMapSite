import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './src/containers/login';
import Cadastro from './src/containers/cadastro';
import RecuperarSenha from './src/containers/recuperar-senha';
import DashboardLayout from './src/components/DashboardLayout';
import Dashboard from './src/containers/dashboard';
import CadastroPaciente from './src/containers/cadastro-paciente';
import PacientesList from './src/containers/pacientes';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas públicas (sem layout) */}
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        
        {/* Rotas protegidas (com layout do dashboard) */}
        <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
        <Route path="/dashboard/pacientes" element={<DashboardLayout><PacientesList /></DashboardLayout>} />
        <Route path="/dashboard/cadastro-paciente" element={<DashboardLayout><CadastroPaciente /></DashboardLayout>} />
      </Routes>
    </Router>
  );
}

export default App;