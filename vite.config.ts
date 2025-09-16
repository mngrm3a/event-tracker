import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { themeExtractorPlugin } from './vite-plugins/vite-plugin-theme';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    themeExtractorPlugin({
      cssPath: 'src/index.css',
      outFile: 'src/themeColors.ts',
      resolve: true,
    }),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg}'],
      },
      manifest: {
        name: 'Event Tracker',
        short_name: 'Event Tracker',
        theme_color: '#8ec5ff',
        icons: [
          {
            src: 'logo-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'logo-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  base: '/event-tracker/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // @ -> src
    },
  },
});
