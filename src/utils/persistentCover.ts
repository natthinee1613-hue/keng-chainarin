import { CoverConfig, DEFAULT_COVER_CONFIG } from '../types/cover';

const DB_NAME = 'PoliceRegion9DB';
const DB_VERSION = 1;
const STORE_NAME = 'app_config';
const COVER_RECORD_KEY = 'persistent_cover_config';
const LOCAL_STORAGE_KEY = 'police_cover_config_p9_v1';

// Open IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      return reject(new Error('IndexedDB not supported'));
    }
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

/**
 * Compresses an uploaded image file using HTML5 Canvas
 * Keeps high quality (up to 1920x1080) but reduces size from 5MB+ to ~150KB - 250KB
 * preventing localStorage QuotaExceededError and loss of cover photo.
 */
export function compressImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Invalid image file'));
      img.onload = () => {
        const maxWidth = 1920;
        const maxHeight = 1080;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        // Draw image with smooth scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP first for optimal compression, fallback to JPEG
        let dataUrl: string;
        try {
          dataUrl = canvas.toDataURL('image/webp', 0.85);
          if (!dataUrl.startsWith('data:image/webp')) {
            dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          }
        } catch {
          dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        }

        resolve(dataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Save cover configuration safely to both LocalStorage and IndexedDB
 */
export async function savePersistentCover(config: CoverConfig): Promise<void> {
  // Always enforce showCover = true so the cover NEVER disappears
  const safeConfig: CoverConfig = {
    ...config,
    showCover: true,
  };

  // 1. Try LocalStorage
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(safeConfig));
  } catch (err) {
    console.warn('LocalStorage quota reached, relying on IndexedDB', err);
  }

  // 2. Try IndexedDB
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(safeConfig, COVER_RECORD_KEY);
  } catch (err) {
    console.warn('IndexedDB save failed', err);
  }
}

/**
 * Load cover configuration with dual fallback (LocalStorage -> IndexedDB -> DEFAULT_COVER_CONFIG)
 */
export async function loadPersistentCover(): Promise<CoverConfig> {
  // 1. Try LocalStorage
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        return {
          ...DEFAULT_COVER_CONFIG,
          ...parsed,
          showCover: true, // Permanent visibility guarantee
          imageUrl: parsed.imageUrl || DEFAULT_COVER_CONFIG.imageUrl,
        };
      }
    }
  } catch (e) {
    console.warn('Failed to parse cover from LocalStorage', e);
  }

  // 2. Try IndexedDB
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const result = await new Promise<CoverConfig | null>((resolve) => {
      const req = store.get(COVER_RECORD_KEY);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });

    if (result) {
      return {
        ...DEFAULT_COVER_CONFIG,
        ...result,
        showCover: true,
        imageUrl: result.imageUrl || DEFAULT_COVER_CONFIG.imageUrl,
      };
    }
  } catch (e) {
    console.warn('Failed to load from IndexedDB', e);
  }

  // 3. Fallback to DEFAULT_COVER_CONFIG with guaranteed official SVG banner
  return {
    ...DEFAULT_COVER_CONFIG,
    showCover: true,
  };
}
