// vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // This is the fix.
    // It tells the Vite dev server to allow requests to this host.
    allowedHosts: ['api.mydreambeauty.net'],
  },
});
