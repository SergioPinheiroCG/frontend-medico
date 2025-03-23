import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Importando o axios para a requisição HTTP
import '../styles/Login.css';

function Login() {
  const [cpf, setCpf] = useState(''); // Alterado para CPF
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Envia a solicitação de login com axios
      const response = await axios.post('/api/login', { cpf, senha });

      if (response.status === 200) {
        // Se a resposta for bem-sucedida, armazena o token no localStorage
        localStorage.setItem('token', response.data.token);
        
        // Redireciona para a página home após o login
        navigate('/home');
      } else {
        setErro('Erro desconhecido');
      }
    } catch (error) {
      // Caso de erro na requisição
      if (error.response) {
        // Erro retornado pelo backend
        setErro(error.response.data.message || 'Erro desconhecido');
      } else {
        // Erro na comunicação com o servidor
        setErro('Erro ao conectar com o servidor');
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Bem-vindo ao Sistema de Atendimento Médico</h2>
      <img src="medic.png" alt="Médico" className="login-image" />

      <h2>Login</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="CPF"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
      </form>

      {/* Exibir mensagem de erro, se houver */}
      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      <button className="cadastro-button" onClick={() => navigate('/cadastro')}>Cadastrar</button>
    </div>
  );
}

export default Login;
