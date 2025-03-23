import mongoose from 'mongoose'; // Importando mongoose
import Endereco from './Endereco.js'; // Importando o modelo Endereco
import Prontuario from './Prontuario.js'; // Importando o modelo Prontuario
import User from './User.js'; // Importando o modelo User

const patientSchema = new mongoose.Schema({
    nome: { type: String, required: true }, 
    cpf: { type: String, unique: true, required: true },
    endereco: { type: mongoose.Schema.Types.ObjectId, ref: 'Endereco' }, // Relacionamento 1:1 com Endereco
    prontuarios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Prontuario' }], // Relacionamento 1:N com Prontuário
    medicos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Relacionamento N:N com User (médicos)
});

// Exportando o modelo Patient
export default mongoose.model('Patient', patientSchema);

