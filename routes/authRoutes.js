// authRoutes.js
import express from 'express';
import { register, login, getAllUsers, getUserByCpf, updateUser, deleteUser } from '../controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js'; 

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/users', authMiddleware, getAllUsers);
router.get('/users/:cpf', authMiddleware, getUserByCpf);
router.put('/users/:cpf', authMiddleware, updateUser);
router.delete('/users/:cpf', authMiddleware, deleteUser);

export default router;



