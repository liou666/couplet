import { useEffect, useState } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prevValue: T) => T)) => void] {
  const getStoredValue = () => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    }
    catch (error) {
      console.warn(`Error parsing localStorage key "${key}":`, error)
      return initialValue
    }
  }

  const [storedValue, setStoredValue] = useState<T>(getStoredValue)

  const setValue = (value: T | ((prevValue: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      localStorage.setItem(key, JSON.stringify(valueToStore))
    }
    catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        try {
          setStoredValue(JSON.parse(event.newValue))
        }
        catch (error) {
          console.warn(`Error parsing localStorage event for key "${key}":`, error)
        }
      }
    }
    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [key])

  return [storedValue, setValue]
}
