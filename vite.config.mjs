import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Define the base URL based on the environment variable
const base = process.env.BASE_URL || '/';

export default defineConfig({
  plugins: [react()], // Add React plugin for Vite
  base: base, // Set the base public path for the project
  optimizeDeps: {
    include: ['some-dependency'], // Specify dependencies to be pre-bundled by esbuild
  },
});