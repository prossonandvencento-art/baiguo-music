/**
 * IndexedDB storage for local user audio files.
 * Allows permanent storage of full MP3/WAV tracks without the 5MB localStorage limit.
 */

const DB_NAME = 'EchoesBaiguoMusicDB';
const STORE_NAME = 'customAudioTracks';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
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

export async function saveAudioFile(key: string, file: Blob): Promise<string> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const putReq = store.put(file, key);
    putReq.onsuccess = () => {
      const url = URL.createObjectURL(file);
      resolve(url);
    };
    putReq.onerror = () => reject(putReq.error);
  });
}

export async function loadAudioFile(key: string): Promise<string | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const getReq = store.get(key);
      getReq.onsuccess = () => {
        const result = getReq.result;
        if (result && result instanceof Blob) {
          const url = URL.createObjectURL(result);
          resolve(url);
        } else {
          resolve(null);
        }
      };
      getReq.onerror = () => resolve(null);
    });
  } catch (e) {
    console.warn('Error loading audio from IndexedDB', e);
    return null;
  }
}

/**
 * Automatically crops any uploaded image into a high-quality 1:1 square centered composition.
 */
export function cropAndCompressCoverImage(file: File, targetSize = 900): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = targetSize;
        canvas.height = targetSize;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        // Center crop calculation for perfect 1:1 square album art
        const minDim = Math.min(img.width, img.height);
        const sx = (img.width - minDim) / 2;
        const sy = (img.height - minDim) / 2;

        // Smooth image rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, targetSize, targetSize);
        const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
        resolve(croppedDataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image for cropping'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export async function saveCoverImage(trackId: string, dataUrl: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const putReq = store.put(dataUrl, `cover_${trackId}`);
      putReq.onsuccess = () => resolve();
      putReq.onerror = () => reject(putReq.error);
    });
  } catch (err) {
    console.warn('Failed to save cover image to IndexedDB, fallback to localStorage', err);
    try {
      localStorage.setItem(`echoes_cover_${trackId}`, dataUrl);
    } catch {
      // quota exceeded fallback
    }
  }
}

export async function loadCoverImage(trackId: string): Promise<string | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const getReq = store.get(`cover_${trackId}`);
      getReq.onsuccess = () => {
        const result = getReq.result;
        if (result && typeof result === 'string') {
          resolve(result);
        } else {
          // Check localStorage fallback
          const local = localStorage.getItem(`echoes_cover_${trackId}`);
          resolve(local);
        }
      };
      getReq.onerror = () => {
        const local = localStorage.getItem(`echoes_cover_${trackId}`);
        resolve(local);
      };
    });
  } catch (e) {
    console.warn('Error loading cover from IndexedDB', e);
    return localStorage.getItem(`echoes_cover_${trackId}`);
  }
}
