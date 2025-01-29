'use client'
import { useEffect } from 'react'
import { useDarkMode } from '@/app/hooks/useDarkMode'

const DarkModeProvider = () => {
  const isDarkMode = useDarkMode()

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])
  return null
}

export default DarkModeProvider
