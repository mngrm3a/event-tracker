import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { themeExtractorPlugin } from './vite-plugins/vite-plugin-theme';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),
    themeExtractorPlugin({
      cssPath: 'src/index.css',
      outFile: 'src/themeColors.ts',
      resolve: true
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // @ -> src
    },
  },
});
