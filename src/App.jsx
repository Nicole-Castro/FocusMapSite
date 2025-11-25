import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './containers/login';
import Cadastro from './containers/cadastro';
import RecuperarSenha from './containers/recuperar-senha';
import CadastroPaciente from './containers/cadastro-paciente';
import PacientesList from './containers/pacientes';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        <Route path="/cadastro-paciente" element={<CadastroPaciente />} />
        <Route path="/pacientes" element={<PacientesList />} />
      </Routes>
    </Router>
  );
}

export default App;