import { useCallback, useEffect, useState } from "react";

/** Reads/writes JSON in localStorage after hydration (SSR-safe). */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      /* ignore corrupt values */
    }
    setLoaded(true);
  }, [key]);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage may be unavailable */
    }
  }, [key, value, loaded]);

  const update = useCallback((next: T | ((prev: T) => T)) => setValue(next), []);

  return { value, setValue: update, loaded } as const;
}
