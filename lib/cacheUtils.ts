// lib/cacheUtils.ts

export function setLocalStorageItem<T>(key: string, value: T, expirationInMinutes: number = 60) {
    const now = new Date();
    const item = {
      value: value,
      expiry: now.getTime() + expirationInMinutes * 60 * 1000,
    };
    localStorage.setItem(key, JSON.stringify(item));
  }
  
  export function getLocalStorageItem(key: string) {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
      return null;
    }
    const item = JSON.parse(itemStr);
    const now = new Date();
    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  }