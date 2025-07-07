// lib/storage.ts

// Safe wrapper for localStorage operations that prevents SSR-related errors
export const safeLocalStorage = {
  getItem(key: string) {
    if (typeof window !== "undefined") return localStorage.getItem(key);
    return null;
  },
  setItem(key: string, value: string) {
    if (typeof window !== "undefined") localStorage.setItem(key, value);
  },
  removeItem(key: string) {
    if (typeof window !== "undefined") localStorage.removeItem(key);
  },
};
