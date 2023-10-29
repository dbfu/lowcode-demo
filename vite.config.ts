import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'docs',
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:7001',
        rewrite(path) {
          return path.replace(/^\/api/, '');
        },
      },
    },
  },
});
