// CadastroPaciente.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Cadastro.css';

function CadastroPaciente() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [cpfPaciente, setCpfPaciente] = useState('');
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [numero, setNumero] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [descricao, setDescricao] = useState('');
  const [diagnostico, setDiagnostico] = useState('');
  const [tratamento, setTratamento] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const cadastrarPaciente = async () => {
    if (!nome || !cpfPaciente || !cep || !endereco || !numero || !cidade || !estado || !descricao || !diagnostico || !tratamento || !observacoes) {
      setErro('Por favor, preencha todos os campos.');
      return;
    }

    const prontuarios = [{
      descricao,
      diagnostico,
      tratamento,
      observacoes
    }];

    const token = localStorage.getItem('token');

    if (!token) {
      setErro('Você precisa estar logado para cadastrar um paciente.');
      return;
    }

    try {
      const resposta = await axios.post(
        '/api/patient',
        {
          nome,
          cpf: cpfPaciente,
          endereco: { rua: endereco, numero, cidade, estado, cep },
          prontuarios
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (resposta.status === 201) {
        setSucesso('Paciente cadastrado com sucesso!');
        navigate('/home');
      }
    } catch {
      setErro('Erro ao cadastrar paciente. Tente novamente.');
    }
  };

  return (
    <div className="cadastro-container">
      <h2>Cadastro de Paciente</h2>
      <img src="/medic.png" alt="Médico" className="image-alterar" />

      {erro && <p className="error-message">{erro}</p>}
      {sucesso && <p className="success-message">{sucesso}</p>}

      <div className="campo">
        <label>Nome:</label>
        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome completo" />
      </div>
      <div className="campo">
        <label>CPF:</label>
        <input type="text" value={cpfPaciente} onChange={(e) => setCpfPaciente(e.target.value)} placeholder="CPF do paciente" />
      </div>
      <div className="campo">
        <label>CEP:</label>
        <input type="text" value={cep} onChange={(e) => setCep(e.target.value)} placeholder="CEP" />
      </div>
      <div className="campo">
        <label>Endereço:</label>
        <input type="text" value={endereco} onChange={(e) => setEndereco(e.target.value)} placeholder="Endereço" />
      </div>
      <div className="campo">
        <label>Número:</label>
        <input type="text" value={numero} onChange={(e) => setNumero(e.target.value)} placeholder="Número da casa" />
      </div>
      <div className="campo">
        <label>Cidade:</label>
        <input type="text" value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Cidade" />
      </div>
      <div className="campo">
        <label>Estado:</label>
        <input type="text" value={estado} onChange={(e) => setEstado(e.target.value)} placeholder="Estado" />
      </div>

      <div className="campo">
        <label>Descrição:</label>
        <input type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descrição do prontuário" />
      </div>
      <div className="campo">
        <label>Diagnóstico:</label>
        <input type="text" value={diagnostico} onChange={(e) => setDiagnostico(e.target.value)} placeholder="Diagnóstico" />
      </div>
      <div className="campo">
        <label>Tratamento:</label>
        <input type="text" value={tratamento} onChange={(e) => setTratamento(e.target.value)} placeholder="Tratamento" />
      </div>
      <div className="campo">
        <label>Observações:</label>
        <input type="text" value={observacoes} onChange={(e) => setObservacoes(e.target.value)} placeholder="Observações" />
      </div>

      <div className="botoes-cadastro">
        <button onClick={cadastrarPaciente}>Cadastrar Paciente</button>
        
      </div>
      <button onClick={() => navigate('/home')} className="voltar-button">Voltar</button>
    </div>
  );
}

export default CadastroPaciente;
