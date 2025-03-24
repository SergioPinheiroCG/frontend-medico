import mongoose from 'mongoose'; 
import Patient from './Patient.js'; 
import User from './User.js'; 

const prontuarioSchema = new mongoose.Schema({
    paciente: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true }, // 1x1 (Um prontuário pertence a um único paciente)
    medico: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // 1xN (Um médico pode ter vários prontuários)
    descricao: { type: String, required: true },
    diagnostico: { type: String, required: true },
    tratamento: { type: String, required: true },
    observacoes: { type: String },
    data: { type: Date, default: Date.now }
});

// Exportando o modelo Prontuario
export default mongoose.model('Prontuario', prontuarioSchema);


