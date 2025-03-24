import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Cadastro.css';

function CadastroUsuario() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [role, setRole] = useState('medico'); // Valor padrão
  const [erro, setErro] = useState('');

  const cadastrarUsuario = async () => {
    if (!nome || !cpf || !email || !senha || !role) {
      setErro('Por favor, preencha todos os campos.');
      return;
    }

    try {
      const resposta = await axios.post('/api/register', {
        nome,
        cpf,
        email,
        senha,
        role
      });

      if (resposta.status === 201) {
        navigate('/login');
      }
    } catch {
      setErro('Erro ao cadastrar. Tente novamente.');
    }
  };

  return (
    <div className="cadastro-container">
      <h2>Cadastro de Usuário</h2>
      <img src="/medic.png" alt="Médico" className="image-alterar" />

      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      <div className="campo">
        <label>Nome</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome completo"
        />
      </div>

      <div className="campo">
        <label>CPF</label>
        <input
          type="text"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          placeholder="Digite seu CPF"
        />
      </div>

      <div className="campo">
        <label>E-mail</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Seu e-mail"
        />
      </div>

      <div className="campo">
        <label>Senha</label>
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Sua senha"
        />
      </div>

      <div className="campo">
        <label>Tipo de usuário</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="medico">Médico</option>
          <option value="paciente">Paciente</option>
        </select>
      </div>

      <div className="botoes-cadastro">
        <button onClick={cadastrarUsuario}>Cadastrar</button>
      </div>
      <button onClick={() => navigate('/login')} className="voltar-button">Voltar</button>
    </div>
  );
}

export default CadastroUsuario;
