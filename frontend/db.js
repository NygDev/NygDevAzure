// IndexedDB helpers — sync queue and response cache.
// Stores: "queue" (pending POSTs), "cache" (key-value response cache).

const _DB_NAME    = 'gym-logger';
const _DB_VERSION = 1;

function _open() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(_DB_NAME, _DB_VERSION);
    req.onupgradeneeded = ({ target: { result: db } }) => {
      if (!db.objectStoreNames.contains('queue'))
        db.createObjectStore('queue', { keyPath: 'localId' });
      if (!db.objectStoreNames.contains('cache'))
        db.createObjectStore('cache');
    };
    req.onsuccess = ({ target: { result } }) => resolve(result);
    req.onerror   = ({ target: { error  } }) => reject(error);
  });
}

async function enqueue(url, body) {
  const db      = await _open();
  const localId = crypto.randomUUID();
  await new Promise((resolve, reject) => {
    const tx = db.transaction('queue', 'readwrite');
    tx.objectStore('queue').add({ localId, url, body, queuedAt: Date.now() });
    tx.oncomplete = resolve;
    tx.onerror    = ({ target: { error } }) => reject(error);
  });
  return localId;
}

async function getQueue() {
  const db = await _open();
  return new Promise((resolve, reject) => {
    const tx  = db.transaction('queue', 'readonly');
    const req = tx.objectStore('queue').getAll();
    req.onsuccess = ({ target: { result } }) => resolve(result);
    req.onerror   = ({ target: { error  } }) => reject(error);
  });
}

async function dequeue(localId) {
  const db = await _open();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('queue', 'readwrite');
    tx.objectStore('queue').delete(localId);
    tx.oncomplete = resolve;
    tx.onerror    = ({ target: { error } }) => reject(error);
  });
}

async function setCached(key, value) {
  const db = await _open();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('cache', 'readwrite');
    tx.objectStore('cache').put(value, key);
    tx.oncomplete = resolve;
    tx.onerror    = ({ target: { error } }) => reject(error);
  });
}

async function getCached(key) {
  const db = await _open();
  return new Promise((resolve, reject) => {
    const tx  = db.transaction('cache', 'readonly');
    const req = tx.objectStore('cache').get(key);
    req.onsuccess = ({ target: { result } }) => resolve(result ?? null);
    req.onerror   = ({ target: { error  } }) => reject(error);
  });
}
