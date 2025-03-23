import mongoose from 'mongoose'; // Importando mongoose

const EnderecoSchema = new mongoose.Schema({
    rua: { type: String, required: true },
    numero: { type: String, required: true },
    cidade: { type: String, required: true },
    estado: { type: String, required: true },
    cep: { type: String, required: true }
});

// Exportando o modelo Endereco
export default mongoose.model('Endereco', EnderecoSchema);
