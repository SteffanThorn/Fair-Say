// Client-only storage for guest (unauthenticated) poll activity.
// Values self-expire after `ttlMs` — read them back with getGuestItem,
// never localStorage.getItem directly, so stale guest data never resurfaces.
const DEFAULT_TTL_MS = 60 * 60 * 1000; // 1 hour

export function setGuestItem(key, value, ttlMs = DEFAULT_TTL_MS) {
  try {
    localStorage.setItem(key, JSON.stringify({ value, expiresAt: Date.now() + ttlMs }));
  } catch {
    // localStorage unavailable (private mode, quota) — guest preview just won't persist.
  }
}

export function getGuestItem(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { value, expiresAt } = JSON.parse(raw);
    if (!expiresAt || Date.now() > expiresAt) {
      localStorage.removeItem(key);
      return null;
    }
    return value;
  } catch {
    return null;
  }
}

export function clearGuestItem(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}
