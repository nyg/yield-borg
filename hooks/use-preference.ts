import { useCallback, useSyncExternalStore } from 'react'

const prefix = 'yieldborg.'
const memory = new Map<string, string>()
const listeners = new Set<() => void>()

const notify = () => listeners.forEach(listener => listener())

const onStorage = (event: StorageEvent) => {
   if (event.key?.startsWith(prefix)) {
      memory.delete(event.key.slice(prefix.length))
      notify()
   }
}

function subscribe(listener: () => void) {
   if (listeners.size === 0) {
      window.addEventListener('storage', onStorage)
   }
   listeners.add(listener)

   return () => {
      listeners.delete(listener)
      if (listeners.size === 0) {
         window.removeEventListener('storage', onStorage)
      }
   }
}

function read(key: string) {
   try {
      return memory.get(key) ?? localStorage.getItem(prefix + key)
   } catch {
      return null
   }
}

function write(key: string, value: string) {
   memory.set(key, value)
   notify()
   try {
      localStorage.setItem(prefix + key, value)
   } catch {
      // storage blocked or full: the value stays in memory for this visit
   }
}

const subscribeToNothing = () => () => {}

export function useHydrated() {
   return useSyncExternalStore(subscribeToNothing, () => true, () => false)
}

export function useStoredValue(key: string) {
   const value = useSyncExternalStore(subscribe, () => read(key), () => null)
   const setValue = useCallback((next: string) => write(key, next), [key])
   return [value, setValue] as const
}

export function usePreference<T extends string>(
   key: string, options: readonly { value: T }[], fallback: T
): readonly [T, (next: T) => void] {
   const [stored, setStored] = useStoredValue(key)
   const value = options.find(option => option.value === stored)?.value ?? fallback
   return [value, setStored]
}
