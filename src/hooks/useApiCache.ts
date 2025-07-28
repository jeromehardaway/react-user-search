import { useState } from 'react';
import { CACHE_DURATION } from '../config/api.js';

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

const cacheStore: Record<string, CacheItem<unknown>> = {};

export function useApiCache() {
  const [isStale, setIsStale] = useState<boolean>(false);

  const getCachedData = <T>(key: string): T | null => {
    const item = cacheStore[key] as CacheItem<T> | undefined;
    
    if (!item) {
      return null;
    }

    const now = Date.now();
    const isExpired = now - item.timestamp > CACHE_DURATION;
    
    if (isExpired) {
      setIsStale(true);
  return item.data;
    }
    
    return item.data;
  };

  const setCachedData = <T>(key: string, data: T): void => {
    cacheStore[key] = {
      data,
      timestamp: Date.now(),
    };
    setIsStale(false);
  };

  const invalidateCache = (key: string): void => {
    delete cacheStore[key];
  };

  const clearAllCache = (): void => {
    Object.keys(cacheStore).forEach(key => {
      delete cacheStore[key];
    });
  };

  return {
    getCachedData,
    setCachedData,
    invalidateCache,
    clearAllCache,
    isStale,
  };
}
