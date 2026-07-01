import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
      // Proxy Piston to avoid browser CORS. Client hits /piston/*, Vite forwards to localhost:2000/api/v2/*.
      '/piston': {
        target: 'http://localhost:2000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/piston/, '/api/v2'),
      },
    },
  },
});
