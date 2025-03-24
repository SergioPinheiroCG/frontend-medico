import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa'; // Ícone de lixeira
import '../styles/Prontuario.css';

function Prontuario() {
  const { cpf } = useParams();
  const navigate = useNavigate(); // Definição do navigate

  const [paciente, setPaciente] = useState(null);
  const [prontuarios, setProntuarios] = useState([]);
  const [erro, setErro] = useState('');
  const [descricao, setDescricao] = useState('');
  const [diagnostico, setDiagnostico] = useState('');
  const [tratamento, setTratamento] = useState('');
  const [observacoes, setObservacoes] = useState('');

  const getToken = () => localStorage.getItem('token');

  const buscarPaciente = async (cpf) => {
    const token = getToken();
    if (!token) {
      setErro('Token não encontrado. Por favor, faça login.');
      return;
    }
    try {
      const resposta = await axios.get(`/api/patient/${cpf}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (resposta.status === 200) {
        setPaciente(resposta.data.data);
        setProntuarios(resposta.data.data.prontuarios || []);
      } else {
        setErro('Paciente não encontrado.');
      }
    } catch (error) {
      setErro('Erro ao buscar paciente.');
      console.error(error);
    }
  };

  useEffect(() => {
    if (cpf) {
      buscarPaciente(cpf);
    } else {
      setErro('CPF não encontrado na URL.');
    }
  }, [cpf]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();

    if (!paciente) {
      setErro("Erro: paciente não encontrado.");
      return;
    }

    try {
      const resposta = await axios.post(
        `/api/prontuario/${paciente.cpf}`, // CPF incluído na URL
        {
          descricao,
          diagnostico,
          tratamento,
          observacoes,
        },
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      if (resposta.status === 201) {
        setProntuarios([...prontuarios, resposta.data.prontuario]); // Atualiza a lista de prontuários
        setDescricao('');
        setDiagnostico('');
        setTratamento('');
        setObservacoes('');
        alert("Prontuário salvo com sucesso!");
      }
    } catch (error) {
      setErro(error.response?.data?.message || "Erro ao adicionar prontuário.");
      console.error("Erro ao cadastrar prontuário:", error);
    }
  };

  const handleDeleteProntuario = async (id) => {
    const token = getToken();
    try {
      const resposta = await axios.delete(`/api/prontuario/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setProntuarios(prontuarios.filter(prontuario => prontuario._id !== id));
    } catch (error) {
      setErro('Erro ao deletar prontuário.');
      console.error(error);
    }
  };

  return (
    <div className="atendimento-container">
      <h2>Prontuário Médico</h2>
      <img src="/medic.png" alt="Médico" className="image-prontuario" />

      {erro && <p className="error-message">{erro}</p>}
      {paciente ? (
        <>
          <div className="dados-paciente">
            <h3>Dados do Paciente</h3>
            <p><strong>Nome:</strong> {paciente.nome}</p>
            <p><strong>CPF:</strong> {paciente.cpf}</p>
            {paciente.endereco && (
              <>
                <h4>Endereço</h4>
                <p>Rua: {paciente.endereco.rua}, {paciente.endereco.numero}</p>
                <p>Cidade: {paciente.endereco.cidade} - {paciente.endereco.estado}</p>
                <p>CEP: {paciente.endereco.cep}</p>
              </>
            )}
          </div>
          <div className="conteudo-principal">
            <div className="prontuario">
              <h3>Novo Atendimento</h3>
              <form onSubmit={handleSubmit}>
                <div className="campo">
                  <label>Descrição:</label>
                  <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Ex: Paciente relatou dor de cabeça" required />
                </div>
                <div className="campo">
                  <label>Diagnóstico:</label>
                  <input type="text" value={diagnostico} onChange={(e) => setDiagnostico(e.target.value)} placeholder="Ex: Enxaqueca crônica" required />
                </div>
                <div className="campo">
                  <label>Tratamento:</label>
                  <input type="text" value={tratamento} onChange={(e) => setTratamento(e.target.value)} placeholder="Ex: Medicamento X e repouso" required />
                </div>
                <div className="campo">
                  <label>Observações:</label>
                  <textarea value={observacoes} onChange={(e) => setObservacoes(e.target.value)} placeholder="Ex: Retorno em 15 dias para nova avaliação" required />
                </div>
                <div className="botoes-prontuario">
                  <button type="submit">Salvar</button>
                  <button type="button" onClick={() => navigate("/home")}>Voltar</button>
                </div>
              </form>
            </div>
            <div className="historico-paciente">
              <h3>Histórico de Prontuários</h3>
              {prontuarios.length > 0 ? (
                <ul>
                  {prontuarios.map((prontuario) => (
                    <li key={prontuario._id}>
                      <div className="prontuario-item">
                        <p><strong>Data:</strong> {new Date(prontuario.data).toLocaleDateString('pt-BR', 
                          { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                        <p><strong>Descrição:</strong> {prontuario.descricao}</p>
                        <p><strong>Diagnóstico:</strong> {prontuario.diagnostico}</p>
                        <p><strong>Tratamento:</strong> {prontuario.tratamento}</p>
                        <p><strong>Observações:</strong> {prontuario.observacoes}</p>
                      </div>
                      <button onClick={() => handleDeleteProntuario(prontuario._id)} className="delete-button">
                        <FaTrash />
                      </button>
                      <hr />
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Sem prontuários encontrados.</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <p>Carregando dados do paciente...</p>
      )}
    </div>
  );
}

export default Prontuario;

