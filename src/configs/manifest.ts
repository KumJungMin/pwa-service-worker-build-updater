export function generateManifestPlugin(dirname: string) {
  
  return {
    name: 'generate-manifest',
    writeBundle: async (_, bundle) => {
      const fs = await import('fs');
      const pathModule = await import('path');


      const manifest: Record<string, string> = {};
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
      const manifestPath = pathModule.default.resolve(dirname, 'dist', 'manifest.json');

      fs.default.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
      console.log('manifest.json generated', manifest); 
    },
  };
}
