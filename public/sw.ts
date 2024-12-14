
/// <reference lib="webworker" />

const DB_NAME = 'manifest-db';
const STORE_NAME = 'manifest-store';

let cachedManifest: Record<string, string> | null = null;

// IndexedDB 초기화
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function loadCachedManifest(): Promise<Record<string, string> | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const getRequest = store.get('manifest');
    getRequest.onsuccess = () => resolve(getRequest.result ?? null);
    getRequest.onerror = () => reject(getRequest.error);
  });
}

async function saveManifest(manifest: Record<string, string>): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const putRequest = store.put(manifest, 'manifest');
    putRequest.onsuccess = () => resolve();
    putRequest.onerror = () => reject(putRequest.error);
  });
}

self.addEventListener('install', (event: any) => {
  (self as any).skipWaiting(); // 즉시 활성화
});

self.addEventListener('activate', (event: any) => {
  event.waitUntil(
    (async () => {
      cachedManifest = await loadCachedManifest();
      try {
        const response = await fetch('/manifest.json', { cache: 'no-cache' });
        const latestManifest: Record<string, string> = await response.json();

        if (cachedManifest) {
          for (const route in latestManifest) {
            if (cachedManifest[route] && cachedManifest[route] !== latestManifest[route]) {
              // 특정 라우트의 청크 파일이 변경됨을 감지
              const clientsList = await (self as any).clients.matchAll({ includeUncontrolled: true });
              for (const client of clientsList) {
                client.postMessage({ type: 'ROUTE_UPDATED', route });
              }
            }
          }
        }

        // 최신 manifest 저장
        await saveManifest(latestManifest);
        cachedManifest = latestManifest;
        await (self as any).clients.claim();
      } catch (error) {
        console.error('Error fetching manifest.json:', error);
      }
    })(),
  );
});
