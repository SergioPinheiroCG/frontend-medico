import Prontuario from '../models/Prontuario.js';
import Patient from '../models/Patient.js';
import mongoose from 'mongoose';


// Função para enviar resposta de erro de forma padronizada
const sendErrorResponse = (res, statusCode, message, error = null) => {
    const response = { message };
    if (error) response.error = error.message || error;
    return res.status(statusCode).send(response);
};

// Função para enviar resposta de sucesso
const sendSuccessResponse = (res, data, message = 'Operação realizada com sucesso') => {
    return res.status(200).send({ message, data });
};

// Cria um prontuário para o paciente
export const createProntuario = async (req, res) => {
    try {
        const medicoId = req.user.id; // Pegando o ID do médico autenticado pelo token
        const { descricao, diagnostico, tratamento, observacoes } = req.body;
        const { cpf } = req.params; // Pegando o CPF da URL

        console.log("Médico autenticado:", medicoId);
        console.log("CPF do paciente recebido:", cpf);

        if (!medicoId) {
            return res.status(401).json({ message: "Médico não autenticado." });
        }

        // Buscar paciente pelo CPF
        const paciente = await Patient.findOne({ cpf });

        if (!paciente) {
            return res.status(404).json({ message: "Paciente não encontrado." });
        }

        // Criar prontuário associado ao paciente e ao médico autenticado
        const newProntuario = new Prontuario({
            paciente: paciente._id,
            medico: medicoId,
            descricao,
            diagnostico,
            tratamento,
            observacoes
        });

        await newProntuario.save();

        // Adicionar o prontuário ao array de prontuários do paciente
        paciente.prontuarios.push(newProntuario._id);
        await paciente.save();

        res.status(201).json({
            message: "Prontuário criado com sucesso!",
            prontuario: newProntuario
        });

    } catch (error) {
        res.status(400).json({ message: "Erro ao criar prontuário.", error: error.message });
    }
};

// Busca prontuários por CPF do paciente
export const getProntuariosByPatientCpf = async (req, res) => {
    try {
        const { cpf } = req.params;

        // Busca o paciente e seus prontuários
        const paciente = await Patient.findOne({ cpf }).populate('prontuarios');
        if (!paciente) {
            return sendErrorResponse(res, 404, 'Paciente não encontrado.');
        }

        return sendSuccessResponse(res, paciente.prontuarios);
    } catch (error) {
        return sendErrorResponse(res, 500, 'Erro ao buscar prontuários', error);
    }
};

// Atualiza o prontuário de um paciente
export const updateProntuario = async (req, res) => {
    try {
        const { cpf, prontuarioId } = req.params;
        const updates = req.body;

        // Busca o paciente pelo CPF
        const paciente = await Patient.findOne({ cpf });
        if (!paciente) {
            return sendErrorResponse(res, 404, 'Paciente não encontrado.');
        }

        // Busca e atualiza o prontuário associado ao paciente
        const prontuario = await Prontuario.findOneAndUpdate(
            { _id: prontuarioId, paciente: paciente._id },
            updates,
            { new: true }
        );
        if (!prontuario) {
            return sendErrorResponse(res, 404, 'Prontuário não encontrado.');
        }

        return sendSuccessResponse(res, prontuario, 'Prontuário atualizado com sucesso');
    } catch (error) {
        return sendErrorResponse(res, 400, 'Erro ao atualizar prontuário', error);
    }
};

export const deleteProntuario = async (req, res) => {
    try {
      const { id } = req.params;

      // Verifica se o ID fornecido é válido
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID inválido.' });
      }

      // Tenta encontrar e excluir o prontuário pelo ID
      const prontuario = await Prontuario.findByIdAndDelete(id);

      if (!prontuario) {
        return res.status(404).json({ message: 'Prontuário não encontrado.' });
      }

      res.json({ message: 'Prontuário excluído com sucesso.' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao excluir prontuário.', error });
    }
};
  
  


// Busca todos os prontuários
export const getAllProntuarios = async (req, res) => {
    try {
        const prontuarios = await Prontuario.find();
        res.status(200).send(prontuarios);
    } catch (error) {
        res.status(500).send({ message: 'Erro ao buscar prontuários.', error: error.message });
    }
};
