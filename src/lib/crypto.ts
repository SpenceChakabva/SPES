/**
 * Secure Encrypted Storage — AES-256-GCM via Web Crypto API
 *
 * Architecture:
 *  1. On first visit, a random 16-byte salt is generated and persisted.
 *  2. An AES-GCM-256 key is derived from the salt via PBKDF2 (100 000 iterations).
 *  3. All spes_* data is encrypted before writing to localStorage.
 *  4. On app startup, encrypted values are decrypted into an in-memory cache.
 *  5. Reads are synchronous (from cache); writes encrypt asynchronously.
 *  6. Graceful fallback: if crypto is unavailable, plaintext is used.
 */

const SALT_KEY = 'spes_enc_salt';
const ENC_PREFIX = 'enc:';
const EXCLUDED_KEYS = new Set([SALT_KEY, 'spes_consent', 'spes_rate_log']);

class SecureStorage {
  private cache = new Map<string, string>();
  private key: CryptoKey | null = null;
  private _ready = false;

  get ready() {
    return this._ready;
  }

  /** Must be called (and awaited) before React renders. */
  async init(): Promise<void> {
    try {
      if (!crypto?.subtle) throw new Error('SubtleCrypto unavailable');

      this.key = await this.deriveKey();

      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (!k || !k.startsWith('spes_') || EXCLUDED_KEYS.has(k)) continue;

        const raw = localStorage.getItem(k)!;

        if (raw.startsWith(ENC_PREFIX)) {
          try {
            const plain = await this.decrypt(raw.slice(ENC_PREFIX.length));
            this.cache.set(k, plain);
          } catch {
            // Corrupted — drop the key so the app can start clean
            localStorage.removeItem(k);
          }
        } else {
          // Legacy plaintext — migrate to encrypted
          this.cache.set(k, raw);
          const cipher = await this.encrypt(raw);
          localStorage.setItem(k, ENC_PREFIX + cipher);
        }
      }
    } catch {
      // Fallback: populate cache from raw localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (!k || !k.startsWith('spes_') || EXCLUDED_KEYS.has(k)) continue;
        const raw = localStorage.getItem(k)!;
        this.cache.set(k, raw.startsWith(ENC_PREFIX) ? '' : raw);
      }
    }

    this._ready = true;
  }

  getItem(key: string): string | null {
    if (this._ready) return this.cache.get(key) ?? null;
    return localStorage.getItem(key);
  }

  setItem(key: string, value: string): void {
    this.cache.set(key, value);

    if (this.key) {
      this.encrypt(value)
        .then((cipher) => localStorage.setItem(key, ENC_PREFIX + cipher))
        .catch(() => localStorage.setItem(key, value));
    } else {
      localStorage.setItem(key, value);
    }
  }

  removeItem(key: string): void {
    this.cache.delete(key);
    localStorage.removeItem(key);
  }

  /** Clear all encrypted spes data. */
  clear(): void {
    const toRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('spes_') && !EXCLUDED_KEYS.has(k)) {
        toRemove.push(k);
      }
    }
    toRemove.forEach((k) => {
      this.cache.delete(k);
      localStorage.removeItem(k);
    });
  }

  // --------------- Crypto internals ---------------

  private async deriveKey(): Promise<CryptoKey> {
    let saltHex = localStorage.getItem(SALT_KEY);
    if (!saltHex) {
      const salt = new Uint8Array(16);
      crypto.getRandomValues(salt);
      saltHex = Array.from(salt, (b) => b.toString(16).padStart(2, '0')).join('');
      localStorage.setItem(SALT_KEY, saltHex);
    }

    const salt = new Uint8Array(
      saltHex.match(/.{2}/g)!.map((b) => parseInt(b, 16)),
    );

    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      salt,
      'PBKDF2',
      false,
      ['deriveKey'],
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: new TextEncoder().encode('spes-uct-engine'),
        iterations: 100_000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt'],
    );
  }

  private async encrypt(plaintext: string): Promise<string> {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(plaintext);
    const cipherBuf = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      this.key!,
      encoded,
    );

    const combined = new Uint8Array(iv.length + new Uint8Array(cipherBuf).length);
    combined.set(iv);
    combined.set(new Uint8Array(cipherBuf), iv.length);
    return btoa(String.fromCharCode(...combined));
  }

  private async decrypt(encoded: string): Promise<string> {
    const combined = new Uint8Array(
      atob(encoded)
        .split('')
        .map((c) => c.charCodeAt(0)),
    );
    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      this.key!,
      ciphertext,
    );

    return new TextDecoder().decode(decrypted);
  }
}

export const secureStorage = new SecureStorage();
