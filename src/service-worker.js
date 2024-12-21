import { precacheAndRoute } from 'workbox-precaching';

precacheAndRoute(self.__WB_MANIFEST);

const DB_NAME = 'manifest-db';
const STORE_NAME = 'manifest-store';

let cachedManifest = null;

async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
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

async function loadCachedManifest() {
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

// Service Worker 설치 이벤트
self.addEventListener('install', () => {
  console.log('[Service Worker] Install event');
  self.skipWaiting(); // 즉시 활성화
});

// Service Worker 활성화 이벤트
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate event');
  event.waitUntil(
    (async () => {
      cachedManifest = await loadCachedManifest();
      try {
        const response = await fetch('/manifest.json', { cache: 'no-cache' });
        const latestManifest = await response.json();

        console.table({
          'Cached manifest': cachedManifest,
          'Latest manifest': latestManifest,
        });

        const updatedRoutes = [];
        for (const route in latestManifest) {
          if (cachedManifest[route] && cachedManifest[route] !== latestManifest[route]) {
            updatedRoutes.push(route);
          }
        }

        if (updatedRoutes.length > 0) {
          console.log('Updated routes detected:', updatedRoutes);

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
    })(),
  );
});


async function saveManifest(manifest) {
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

// 메시지 이벤트 (클라이언트와 통신)
self.addEventListener('message', (event) => {
  console.log('[Service Worker] Message received:', event.data);
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});