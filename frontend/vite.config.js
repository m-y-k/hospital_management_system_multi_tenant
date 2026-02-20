import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api/auth': 'http://localhost:8081',
      '/api/hospitals': 'http://localhost:8082',
      '/api/doctors': 'http://localhost:8082',
      '/api/patients': 'http://localhost:8082',
      '/api/staff': 'http://localhost:8082',
      '/api/medicines': 'http://localhost:8082',
      '/api/dashboard': 'http://localhost:8082',
      '/api/appointments': 'http://localhost:8083',
    },
  },
});
