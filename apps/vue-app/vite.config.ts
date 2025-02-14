import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';
import path from 'path';

export default defineConfig({
  plugins: [vue(), vuetify()],
  resolve: {
    alias: {
      '@private-prompts/shared': path.resolve(__dirname, '../../shared/src'),
      '@assets': path.resolve(__dirname, '../../assets'),
    },
  },
  server: {
    fs: {
      allow: ['../..'],
    }
  }
});

