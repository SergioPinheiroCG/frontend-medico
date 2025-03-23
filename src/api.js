import axios from 'axios';

// Cria uma instância do axios com a baseURL do seu backend
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Adiciona um interceptador para enviar o token em todas as requisições
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Pega o token armazenado no localStorage
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // Adiciona o token no header de todas as requisições
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;

