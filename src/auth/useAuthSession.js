import { useEffect, useState } from 'react'
import { AUTH_CHANGED_EVENT, SESSION_KEY, getCurrentUser } from './auth'

export const useAuthSession = () => {
  const [user, setUser] = useState(getCurrentUser)

  useEffect(() => {
    const refreshUser = () => setUser(getCurrentUser())
    const refreshFromStorage = (event) => {
      if (event.key === SESSION_KEY) refreshUser()
    }
    window.addEventListener(AUTH_CHANGED_EVENT, refreshUser)
    window.addEventListener('storage', refreshFromStorage)
    return () => {
      window.removeEventListener(AUTH_CHANGED_EVENT, refreshUser)
      window.removeEventListener('storage', refreshFromStorage)
    }
  }, [])

  return user
}
