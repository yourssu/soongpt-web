import { defineConfig } from 'vite';

import { sentryVitePlugin } from '@sentry/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    sentryVitePlugin({
      org: 'yourssu-web',
      project: 'soongpt-web',
    }),
  ],

  build: {
    sourcemap: true,
  },
});
