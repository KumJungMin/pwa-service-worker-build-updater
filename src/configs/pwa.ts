export const config = {
    srcDir: 'src',
    filename: 'service-worker.ts',
    strategies: 'injectManifest',
    injectRegister: 'inline',
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
      theme_color: '#ffffff',
    },
}