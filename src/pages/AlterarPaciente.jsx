import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/Alterar.css';

function AlterarPaciente() {
  const navigate = useNavigate();
  const { cpf } = useParams(); // Para pegar o CPF caso seja edição
  const [nome, setNome] = useState('');
  const [cpfPaciente, setCpfPaciente] = useState('');
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');  // Aqui, vamos separar o endereço em partes
  const [numero, setNumero] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  useEffect(() => {
    if (cpf) {
      const buscarPaciente = async () => {
        try {
          const token = localStorage.getItem('token'); 

          if (!token) {
            setErro('Você precisa estar logado para buscar os dados do paciente.');
            return;
          }

          const resposta = await axios.get(`/api/patient/${cpf}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const paciente = resposta.data.data;
          setNome(paciente.nome);
          setCpfPaciente(paciente.cpf);
          setRua(paciente.endereco.rua);
          setNumero(paciente.endereco.numero);
          setCidade(paciente.endereco.cidade);
          setEstado(paciente.endereco.estado);
          setCep(paciente.endereco.cep);

        } catch {
          setErro('Erro ao buscar os dados do paciente.');
        }
      };

      buscarPaciente();
    }
  }, [cpf]);

  // Função para alterar o paciente
  const alterarPaciente = async () => {
    const dadosAtualizados = {
      nome,  // Atualizando o nome
      endereco: {
        rua,
        numero,
        cidade,
        estado,
        cep,
      },  // Atualizando o endereço diretamente dentro do paciente
    };

    try {
      const respostaPaciente = await axios.put(
        `http://localhost:3000/api/patient/${cpfPaciente}`,
        dadosAtualizados,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (respostaPaciente.status === 200) {
        setSucesso('Paciente alterado com sucesso!');
        navigate('/home');
      }
    } catch (error) {
      console.error("Erro ao atualizar paciente:", error.response?.data || error.message);
      setErro('Erro ao alterar paciente. Tente novamente.');
    }
  };

  return (
    <div className="alterar-container">
      <h2>Alterar Dados do Paciente</h2>
      <img src="/medic.png" alt="Médico" className="image-alterar" />


      {erro && <p className="error-message">{erro}</p>}
      {sucesso && <p className="success-message">{sucesso}</p>}
      
      {/* Campos do paciente */}
      <div className="campo">
        <label>Nome:</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome completo"
        />
      </div>
      <div className="campo">
        <label>CPF:</label>
        <input
          type="text"
          value={cpfPaciente}
          onChange={(e) => setCpfPaciente(e.target.value)}
          placeholder="CPF do paciente"
          disabled={true} // Não permite editar o CPF
        />
      </div>
      <div className="campo">
        <label>CEP:</label>
        <input
          type="text"
          value={cep}
          onChange={(e) => setCep(e.target.value)}
          placeholder="CEP"
        />
      </div>
      <div className="campo">
        <label>Rua:</label>
        <input
          type="text"
          value={rua}
          onChange={(e) => setRua(e.target.value)}
          placeholder="Rua"
        />
      </div>
      <div className="campo">
        <label>Número:</label>
        <input
          type="text"
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          placeholder="Número da casa"
        />
      </div>
      <div className="campo">
        <label>Cidade:</label>
        <input
          type="text"
          value={cidade}
          onChange={(e) => setCidade(e.target.value)}
          placeholder="Cidade"
        />
      </div>
      <div className="campo">
        <label>Estado:</label>
        <input
          type="text"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          placeholder="Estado"
        />
      </div>

      <div className="botoes-cadastro">
        <button onClick={alterarPaciente}>Alterar Paciente</button>
        <button type="button" onClick={() => navigate("/home")}>Voltar</button>
      </div>
    </div>
  );
}

export default AlterarPaciente;
