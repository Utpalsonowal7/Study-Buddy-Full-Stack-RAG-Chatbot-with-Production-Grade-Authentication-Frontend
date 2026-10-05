export const STORAGE_KEYS = {
     user: "study-buddy:user",
} as const;

export function readStorage<T>(key: string, fallback: T): T {
     try {
          const value = localStorage.getItem(key);
          return value ? (JSON.parse(value) as T) : fallback;
     } catch {
          return fallback;
     }
}

export function writeStorage<T>(key: string, value: T): void {
     localStorage.setItem(key, JSON.stringify(value));
}
