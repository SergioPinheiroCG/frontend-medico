import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import CadastroUsuario from './pages/CadastroUsuario';
import Home from './pages/Home';
import CadastroPaciente from './pages/CadastroPaciente';
import Prontuario from './pages/Prontuario';
import AlterarPaciente from './pages/AlterarPaciente';

import './styles/global.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<CadastroUsuario />} />
        <Route path="/cadastro/:cpf" element={<CadastroPaciente />} />
        <Route path="/home" element={<Home />} />
        <Route path="/cadastro-paciente" element={<CadastroPaciente />} />
        <Route path="/cadastro-paciente/:cpf" element={<CadastroPaciente />} />
        <Route path="/prontuario" element={<Prontuario />} />
        <Route path="/prontuario/:cpf" element={<Prontuario />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/alterar/:cpf" element={<AlterarPaciente />} />


      </Routes>
    </Router>
  );
}

export default App;
