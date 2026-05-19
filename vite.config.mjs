import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { handleApiRequest } from './server/lib/api.mjs';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'agent-project-os-api',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (!req.url?.startsWith('/api/')) {
            next();
            return;
          }

          try {
            await handleApiRequest(req, res, process.cwd());
          } catch (error) {
            next(error);
          }
        });
      }
    }
  ],
  server: {
    port: 5173
  }
});

