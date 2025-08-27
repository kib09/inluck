/**
 * 인증 상태 관리 컨텍스트
 * 구글 로그인 상태와 사용자 정보를 전역적으로 관리합니다.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import GoogleAuthService, { GoogleUser, AuthState } from '../services/GoogleAuthService'

interface AuthContextType {
  authState: AuthState
  signIn: () => Promise<void>
  signOut: () => Promise<void>
  testSignIn: () => Promise<void>
  refreshAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  })

  useEffect(() => {
    // 앱 시작시 인증 상태 확인
    checkAuthState()
  }, [])

  const checkAuthState = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }))
      
      const state = await GoogleAuthService.checkAuthState()
      
      // 사용자 데이터가 없거나 유효하지 않으면 로그아웃 상태로 설정
      if (!state.user || !state.isAuthenticated) {
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        })
        return
      }

      // 유효한 사용자 데이터가 있는 경우에만 로그인 상태로 설정
      setAuthState({
        isAuthenticated: true,
        user: state.user,
        isLoading: false,
      })
    } catch (error) {
      console.error('인증 상태 확인 실패:', error)
      // 오류 발생시 로그아웃 상태로 설정
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      })
    }
  }

  const signIn = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }))
      
      const user = await GoogleAuthService.signIn()
      if (user) {
        setAuthState({
          isAuthenticated: true,
          user,
          isLoading: false,
        })
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        })
      }
    } catch (error) {
      console.error('로그인 실패:', error)
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      })
    }
  }

  const signOut = async () => {
    try {
      await GoogleAuthService.signOut()
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      })
    } catch (error) {
      console.error('로그아웃 실패:', error)
      // 로그아웃 실패시에도 로그아웃 상태로 설정
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      })
    }
  }

  const testSignIn = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }))
      
      const user = await GoogleAuthService.testSignIn()
      setAuthState({
        isAuthenticated: true,
        user,
        isLoading: false,
      })
    } catch (error) {
      console.error('테스트 로그인 실패:', error)
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      })
    }
  }

  const refreshAuth = async () => {
    await checkAuthState()
  }

  const value: AuthContextType = {
    authState,
    signIn,
    signOut,
    testSignIn,
    refreshAuth,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
