// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';
import { Plugin } from 'vite';
import { writeFileSync } from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'My Vue App',
        short_name: 'VueApp',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
    generateManifestPlugin(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
      },
    },
  },
});

/**
 * 커스텀 매니페스트 생성 플러그인
 */
function generateManifestPlugin(): Plugin {
  return {
    name: 'generate-manifest',
    writeBundle: async (options, bundle) => {
      const manifest: Record<string, string> = {};
      for (const fileName in bundle) {
        const chunk = bundle[fileName];
        if (chunk.type === 'chunk') {
          const routeNameMatch = fileName.match(/^(chunk-)([A-Za-z0-9]+)\.[a-z0-9]+\.js$/);
          if (routeNameMatch) {
            const routeName = routeNameMatch[2];
            manifest[routeName] = `/${fileName}`;
          }
        }
      }
      const manifestPath = path.resolve(__dirname, 'dist', 'manifest.json');
      writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
      console.log('manifest.json generated');
    },
  };
}
