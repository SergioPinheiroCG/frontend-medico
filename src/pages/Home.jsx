import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  const navigate = useNavigate();

  // Estados para armazenar dados do paciente e controle de erros
  const [cpfBusca, setCpfBusca] = useState('');
  const [paciente, setPaciente] = useState(null);
  const [erroCpf, setErroCpf] = useState(false);
  const [erro, setErro] = useState(''); // Erro global

  // Função para obter o token JWT do localStorage
  const getToken = () => localStorage.getItem('token');

  // Função para buscar paciente na API
  const buscarPaciente = async () => {
    const token = getToken();
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      console.log(`Buscando paciente com CPF: ${cpfBusca}`);
      const resposta = await axios.get(`/api/patient/${cpfBusca}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Resposta da API:', resposta); // Log para a resposta completa da API

      // Verifique a estrutura da resposta
      if (resposta.status === 200) {
        setPaciente(resposta.data.data); // A resposta da API está em resposta.data.data
        setErroCpf(false); // Limpa erro se o paciente for encontrado
      } else {
        setPaciente(null);
        setErroCpf(true); // Se não encontrar, mostra erro
      }
    } catch (error) {
      console.error('Erro na busca de paciente:', error); // Log do erro
      setPaciente(null);
      setErroCpf(true); // Exibe erro se paciente não for encontrado
    }
  };

  // Função para cadastrar novo paciente
  const cadastrarPaciente = () => {
    navigate('/cadastro-paciente');
  };

  // Função para redirecionar para a tela de atendimento
  const prontuario = () => {
    navigate(`/prontuario/${cpf}`);
  };

  // Função para alterar dados do paciente
  const alterarPaciente = () => {
    navigate(`/alterar/${paciente.cpf}`);
  };

  // Função para excluir paciente
  const excluirPaciente = async () => {
    const token = getToken();
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await axios.delete(`/api/patient/${paciente.cpf}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // Atualiza a UI após a exclusão
      setPaciente(null);
      setCpfBusca('');
      setErroCpf(false);
    } catch  {
      setErro('Erro ao excluir paciente. Tente novamente.');
    }
  };

  // Verifica se CPF foi inserido e limpa paciente se não
  useEffect(() => {
    if (!cpfBusca) {
      setPaciente(null);
      setErroCpf(false);
    }
  }, [cpfBusca]);

  // Função para lidar com a tecla Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      buscarPaciente();  // Chama a função de busca quando Enter é pressionado
    }
  };

  return (
    <div className="home-container">
      <h2>Selecione o Paicente</h2>
      <img src="/medic.png" alt="Médico" className="home-image" />

      <div className="search-paciente">
        <h3>Buscar Paciente</h3>
        <input
          type="text"
          placeholder="Digite o CPF"
          value={cpfBusca}
          onChange={(e) => setCpfBusca(e.target.value)}
          onKeyDown={handleKeyPress}  
        />
        <button onClick={buscarPaciente}>Buscar</button>
        

        {erroCpf && <p className="error-message">Paciente não encontrado! Deseja cadastrar?</p>}

        {/* Exibe dados do paciente encontrado */}
        {paciente && !erroCpf && (
          <div className="paciente-info">
            <h3>Dados do Paciente</h3>
            <p>Nome: {paciente.nome}</p>
            <p>CPF: {paciente.cpf}</p>
            <div className="paciente-buttons">
              <button onClick={() => navigate(`/prontuario/${paciente.cpf}`)}>Acessar Prontuário</button>
              <button onClick={alterarPaciente}>Alterar Dados</button>
              <button onClick={excluirPaciente}>Excluir Paciente</button>
            </div>
          </div>
        )}

        {/* Se paciente não for encontrado, oferece a opção de cadastrar */}
        {erroCpf && (
          <div>
            <button onClick={cadastrarPaciente}>Cadastrar Paciente</button>
          </div>
        )}

        {/* Exibe erro geral */}
        {erro && <p className="error-message">{erro}</p>}
      </div>
      
      <button onClick={() => navigate('/login')} className="voltar-button">Voltar para Login</button>
    </div>
    
  );
}

export default Home;
