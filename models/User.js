import mongoose from 'mongoose'; // Importando mongoose
import Patient from './Patient.js'; // Importando o modelo Patient (ajuste o caminho conforme necessário)
import bcrypt from 'bcrypt'; // Importando bcrypt

const userSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    cpf: { type: String, unique: true, required: true },
    email: { type: String, unique: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }, // Valida o formato do email
    senha: { type: String, required: true },
    role: { type: String, enum: ['medico', 'admin'], default: 'medico' },
    pacientes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }] // N:N (Um médico pode ter vários pacientes e um paciente pode ter vários médicos)
});

// Exportando o modelo User
export default mongoose.model('User', userSchema);
