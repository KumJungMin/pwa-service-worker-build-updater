// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      srcDir: 'src', // 커스텀 서비스 워커가 src 디렉토리에 위치할 경우
      filename: 'service-worker.js', // 커스텀 서비스 워커 파일명
      strategies: 'injectManifest', // injectManifest 전략 사용
      injectRegister: 'inline', // 서비스 워커 등록 방식
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      workbox: {
        sourcemap: true
      },
      manifest: {
        name: 'My Vue App',
        short_name: 'VueApp',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#ffffff', // PWA 경고 해결: theme_color 추가
      },
    }),
    generateManifestPlugin(), // 커스텀 매니페스트 생성 플러그인
  ],
});

/**
 * 커스텀 매니페스트 생성 플러그인
 */
function generateManifestPlugin() {
  
  return {
    name: 'generate-manifest',
    writeBundle: async (_, bundle) => {
      // 동적 임포트를 통해 fs와 path를 가져옵니다.
      const fs = await import('fs');
      const pathModule = await import('path');


      const manifest = {};
      for (const fileName in bundle) {
        const chunk = bundle[fileName];
        if (chunk.type === 'chunk') {
          const routeNameMatch = fileName.match(/assets\/([^\/\-]+)-[^\/]+\.js/);
          
          if (routeNameMatch) {
            const routeName = routeNameMatch[1];
            manifest[routeName] = `${fileName}`;
            console.log(`Matched route: ${routeName} -> ${fileName}`);
          }
        }
      }
      const manifestPath = pathModule.default.resolve(__dirname, 'dist', 'manifest.json');

      fs.default.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
      console.log('manifest.json generated', manifest); 
    },
  };
}
