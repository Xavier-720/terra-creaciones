import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// En desarrollo, el frontend (5173) le habla al backend (8080) a través de este proxy.
export default defineConfig({
  // Habilita React y sus herramientas de desarrollo.
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:8080',
      '/uploads': 'http://localhost:8080',
    },
  },
});
