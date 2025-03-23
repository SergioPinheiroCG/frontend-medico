import express from 'express';
import { 
    createProntuario, 
    getAllProntuarios, 
    getProntuariosByPatientCpf, 
    updateProntuario, 
    deleteProntuario 
} from '../controllers/prontuarioController.js'; // Importação nomeada das funções
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/prontuario/:cpf', authMiddleware, createProntuario);
router.get('/prontuario', authMiddleware, getAllProntuarios);
router.get('/prontuario/:cpf', authMiddleware, getProntuariosByPatientCpf);
router.put('/prontuario/:cpf', authMiddleware, updateProntuario);
router.delete('/prontuario/:id', authMiddleware, deleteProntuario);

export default router;

