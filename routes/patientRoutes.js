import express from 'express';
import { createPatient, getAllPatients, getPatientByCpf, updatePatient, deletePatient, getAllEnderecos, getPacienteEndereco } from '../controllers/patientController.js';
import authMiddleware from '../middlewares/authMiddleware.js'; 


const router = express.Router();

router.post('/patient', authMiddleware, createPatient);
router.get('/patient', authMiddleware, getAllPatients);
router.get('/patient/:cpf', authMiddleware, getPatientByCpf);
router.put('/patient/:cpf', authMiddleware, updatePatient);
router.delete('/patient/:cpf', authMiddleware, deletePatient);
router.get('/enderecos', authMiddleware, getAllEnderecos);
router.get('/enderecos/:cpf', authMiddleware, getPacienteEndereco);
export default router;


