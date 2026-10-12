import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
  },
  build: {
    // ✅ Output dist folder inside backend root
    outDir: path.resolve(__dirname, '../backend/dist'),
    emptyOutDir: true,
    // ✅ Optimize for production
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2015',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'react-icons', 'lucide-react'],
          'axios-vendor': ['axios'],
        },
      },
    },
  },
});