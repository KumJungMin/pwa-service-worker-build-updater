import { precacheAndRoute } from 'workbox-precaching';

declare let self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: any;
  
};

const DB_NAME = 'manifest-db';
const STORE_NAME = 'manifest-store';

let cachedManifest = null;

/** 오프라인 캐싱 */
precacheAndRoute(self.__WB_MANIFEST);


self.addEventListener('install', () => {
  console.log('[Service Worker] Install event');
  self.skipWaiting();
});

self.addEventListener('message', (event) => {
  console.log('[Service Worker] Message received:', event.data);
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (event.data && event.data.type === 'CHECK_FOR_BUILD_UPDATE') {
    console.log('[Service Worker] Checking for build update');
    checkRouteUpdate();
  }
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate event');
  event.waitUntil((async () => await checkRouteUpdate())());
});

async function checkRouteUpdate() {
  cachedManifest = await loadCachedManifest();
  try {
    const response = await fetch('/manifest.json', { cache: 'no-cache' });
    const latestManifest: Record<string, string> = await response.json();

    console.table({
      'Cached manifest': cachedManifest,
      'Latest manifest': latestManifest,
    });

    const updatedRoutes = [];
    for (const route in latestManifest) {
      const isRouteUpdated = cachedManifest[route] !== latestManifest[route];

      if (cachedManifest[route] && isRouteUpdated) {
        updatedRoutes.push(route);
      }
    }

    if (updatedRoutes.length > 0) {
      const clients = await self.clients.matchAll({ includeUncontrolled: true });
      for (const client of clients) {
        client.postMessage({
          type: 'ROUTE_UPDATED',
          routes: updatedRoutes,
        });
      }
    }
    await saveManifest(latestManifest);
    cachedManifest = latestManifest;
    await self.clients.claim();
  } catch (error) {
    console.error('Error fetching or processing manifest.json:', error);
  }
}


async function loadCachedManifest(): Promise<Record<string, string>> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const getRequest = store.get('manifest');

      getRequest.onsuccess = () => resolve(getRequest.result || {});
      getRequest.onerror = (event) => {
        console.error('Load manifest failed:', event);
        reject(event);
      };
    });
  } catch (error) {
    console.error('Failed to load cached manifest:', error);
    return {};
  }
}

async function saveManifest(manifest: Record<string, string>): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const putRequest = store.put(manifest, 'manifest');

      putRequest.onsuccess = () => resolve();
      putRequest.onerror = (event) => {
        console.error('Save manifest failed:', event);
        reject(event);
      };
    });
  } catch (error) {
    console.error('Failed to save manifest:', error);
  }
}

async function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      const hasStore = db.objectStoreNames.contains(STORE_NAME);

      if (!hasStore) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = (event) => {
      console.error('IndexedDB open failed:', event);
      reject(event);
    };
  });
}
