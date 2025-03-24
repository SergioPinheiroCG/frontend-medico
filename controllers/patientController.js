import User from '../models/User.js';
import Patient from '../models/Patient.js';
import Prontuario from '../models/Prontuario.js';
import Endereco from '../models/Endereco.js';

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

// Cria um novo paciente
export const createPatient = async (req, res) => {
    try {
        const medicoId = req.user.id;
        const { nome, cpf, endereco, prontuarios } = req.body;

        if (!medicoId) {
            return res.status(401).send({ message: "Médico não autenticado." });
        }

        // Criar o endereço
        const newEndereco = new Endereco(endereco);
        await newEndereco.save();

        // Criar o paciente e associá-lo ao médico
        const newPatient = new Patient({
            nome,
            cpf,
            endereco: newEndereco._id,
            medicos: [medicoId]
        });

        await newPatient.save();

        // Criar os prontuários, se houver
        if (prontuarios && prontuarios.length > 0) {
            const prontuariosCriados = await Prontuario.insertMany(
                prontuarios.map(p => ({
                    ...p,
                    paciente: newPatient._id,
                    medico: medicoId
                }))
            );

            // Atualizar o paciente com os prontuários criados
            newPatient.prontuarios = prontuariosCriados.map(p => p._id);
            await newPatient.save();
        }

        // Associar o paciente ao médico no modelo User
        await User.findByIdAndUpdate(
            medicoId,
            { $addToSet: { pacientes: newPatient._id } },
            { new: true }
        );

        res.status(201).send({
            message: "Paciente cadastrado com sucesso!",
            paciente: newPatient
        });

    } catch (error) {
        res.status(400).send({ message: "Erro ao criar paciente.", error: error.message });
    }
};

// Busca paciente por CPF
export const getPatientByCpf = async (req, res) => {
    try {
        const patient = await Patient.findOne({ cpf: req.params.cpf })
            .populate('endereco')
            .populate('medicos')
            .populate('prontuarios');

        if (!patient) {
            return sendErrorResponse(res, 404, 'Paciente não encontrado');
        }

        return sendSuccessResponse(res, patient);
    } catch (error) {
        return sendErrorResponse(res, 500, 'Erro ao buscar paciente', error);
    }
};

// Busca todos os pacientes
export const getAllPatients = async (req, res) => {
    try {
        const patients = await Patient.find()
            .populate('endereco')
            .populate('medicos')
            .populate('prontuarios');
        
        if (!patients || patients.length === 0) {
            return sendErrorResponse(res, 404, 'Nenhum paciente encontrado');
        }

        return sendSuccessResponse(res, patients);
    } catch (error) {
        return sendErrorResponse(res, 500, 'Erro ao buscar pacientes', error);
    }
};

// Atualiza paciente por CPF
export const updatePatient = async (req, res) => {
    try {
        const { cpf } = req.params;
        const updates = req.body;

        // Se o endereço for enviado, precisa ser tratado
        if (updates.endereco) {
            // Verificar se o paciente já tem um endereço e se o novo endereço precisa ser atualizado
            const patient = await Patient.findOne({ cpf });

            if (patient && patient.endereco) {
                const updatedEndereco = await Endereco.findByIdAndUpdate(
                    patient.endereco, 
                    updates.endereco, 
                    { new: true }
                );
                updates.endereco = updatedEndereco._id; // Atualiza o campo endereco com o ID correto
            } else {
                // Caso não tenha um endereço, cria um novo
                const newEndereco = new Endereco(updates.endereco);
                await newEndereco.save();
                updates.endereco = newEndereco._id;
            }
        }

        // Atualizar o paciente com os dados recebidos
        const patient = await Patient.findOneAndUpdate(
            { cpf }, 
            updates, 
            { new: true }
        )
        .populate('endereco')  // Popula o endereço atualizado
        .populate('medicos')
        .populate('prontuarios');

        if (!patient) {
            return sendErrorResponse(res, 404, 'Paciente não encontrado');
        }

        return sendSuccessResponse(res, patient, 'Paciente atualizado com sucesso');
    } catch (error) {
        return sendErrorResponse(res, 400, 'Erro ao atualizar paciente', error);
    }
};

// Deleta paciente por CPF e seu endereço associado
export const deletePatient = async (req, res) => {
    try {
        const { cpf } = req.params;

        const patient = await Patient.findOneAndDelete({ cpf });
        if (!patient) {
            return sendErrorResponse(res, 404, 'Paciente não encontrado');
        }

        await Endereco.findByIdAndDelete(patient.endereco);

        return sendSuccessResponse(res, null, 'Paciente deletado com sucesso');
    } catch (error) {
        return sendErrorResponse(res, 500, 'Erro ao deletar paciente', error);
    }
};


// Busca endereço do paciente por CPF
export const getPacienteEndereco = async (req, res) => {
    try {
        const { cpf } = req.params;
        const paciente = await Patient.findOne({ cpf }).populate('endereco');

        if (!paciente) {
            return res.status(404).json({ message: 'Paciente não encontrado.' });
        }

        if (!paciente.endereco) {
            return res.status(404).json({ message: 'Endereço não cadastrado para este paciente.' });
        }

        res.status(200).json(paciente.endereco);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar endereço do paciente.', error: error.message });
    }
};


// Busca todos os endereços cadastrados no sistema
export const getAllEnderecos = async (req, res) => {
    try {
        const enderecos = await Endereco.find(); // Busca todos os endereços

        if (!enderecos || enderecos.length === 0) {
            return res.status(404).json({ message: 'Nenhum endereço encontrado.' });
        }

        res.status(200).json(enderecos);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar endereços.', error: error.message });
    }
};

