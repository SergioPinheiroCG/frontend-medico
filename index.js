import 'dotenv/config'; // Carrega as variáveis de ambiente do arquivo .env
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import authRoutes from './routes/authRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import prontuarioRoutes from './routes/prontuarioRoutes.js';
import db from './db/db.js';

const app = express();

app.use(bodyParser.json()); // Permite o uso do body-parser para interpretar requisições POST com JSON
app.use('/api', authRoutes);
app.use('/api', patientRoutes);
app.use('/api', prontuarioRoutes);

// Inicia o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Aplicação rodando na porta ${PORT}`);
});
