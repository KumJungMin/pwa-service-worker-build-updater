import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

import { generateManifestPlugin, PWAConfig } from './src/configs';


export default defineConfig({
  plugins: [
    vue(),
    VitePWA(PWAConfig),
    generateManifestPlugin(__dirname),
  ],
});