import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';

export default defineConfig({
  darkMode: 'class',
  plugins: [
    tailwindcss(),
    react()
  ],
  define: {
    global: 'window'  
  },
  server: {
    https: {
      key: fs.readFileSync('./localhost-key.pem'),
      cert: fs.readFileSync('./localhost.pem'),
    },
    port: 3000
  }
});
