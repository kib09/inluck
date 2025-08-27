/**
 * React Native용 테마 컨텍스트
 * 다크모드와 라이트모드를 지원하며 AsyncStorage를 통해 사용자 설정을 저장합니다.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useColorScheme } from 'react-native'

export type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  isDark: boolean
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme()
  const [theme, setThemeState] = useState<Theme>('system')
  const [isDark, setIsDark] = useState(false)

  // 테마 설정 로드
  useEffect(() => {
    loadTheme()
  }, [])

  // 시스템 테마 변경 감지
  useEffect(() => {
    if (theme === 'system') {
      setIsDark(systemColorScheme === 'dark')
    }
  }, [theme, systemColorScheme])

  // 테마 설정 저장
  const setTheme = async (newTheme: Theme) => {
    try {
      setThemeState(newTheme)
      await AsyncStorage.setItem('theme', newTheme)
      
      if (newTheme === 'system') {
        setIsDark(systemColorScheme === 'dark')
      } else {
        setIsDark(newTheme === 'dark')
      }
    } catch (error) {
      console.error('테마 설정 저장 실패:', error)
    }
  }

  // 테마 토글
  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark'
    setTheme(newTheme)
  }

  // 저장된 테마 설정 로드
  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme')
      if (savedTheme) {
        setThemeState(savedTheme as Theme)
        if (savedTheme === 'system') {
          setIsDark(systemColorScheme === 'dark')
        } else {
          setIsDark(savedTheme === 'dark')
        }
      } else {
        // 기본값은 시스템 테마
        setIsDark(systemColorScheme === 'dark')
      }
    } catch (error) {
      console.error('테마 설정 로드 실패:', error)
      setIsDark(systemColorScheme === 'dark')
    }
  }

  const value: ThemeContextType = {
    theme,
    isDark,
    setTheme,
    toggleTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
