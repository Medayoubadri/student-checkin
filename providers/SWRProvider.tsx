// providers/SWRProvider.tsx
"use client";

import { SWRConfig } from "swr";
import { getLocalStorageItem, setLocalStorageItem } from "@/lib/cacheUtils";

export function SWRProviders({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) => fetch(url).then((res) => res.json()),
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        refreshInterval: 300000, // 5 minutes
        onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
          if (retryCount >= 3) return;
          setTimeout(() => revalidate({ retryCount }), 5000);
        },
        provider: () => {
          return {
            get: (key) => getLocalStorageItem(key),
            set: (key, value) => setLocalStorageItem(key, value, 5), // Cache for 5 minutes
            delete: (key) => localStorage.removeItem(key),
            clear: () => localStorage.clear(),
            keys: () => Object.keys(localStorage)[Symbol.iterator](),
          };
        },
      }}
    >
      {children}
    </SWRConfig>
  );
}