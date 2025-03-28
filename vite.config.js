import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,  // Define a porta do frontend
    proxy: {
      '/api': 'http://localhost:5000',  // Redireciona chamadas ao backend
    },
  },
});

