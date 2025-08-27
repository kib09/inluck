/**
 * 구글 로그인 서비스
 * Expo AuthSession을 사용하여 구글 OAuth 인증을 처리합니다.
 */


import * as WebBrowser from 'expo-web-browser'
import * as Crypto from 'expo-crypto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Constants from 'expo-constants'

// WebBrowser 완료를 위한 설정
WebBrowser.maybeCompleteAuthSession()

export interface GoogleUser {
  id: string
  email: string
  name: string
  picture: string
  givenName?: string
  familyName?: string
}

export interface AuthState {
  isAuthenticated: boolean
  user: GoogleUser | null
  isLoading: boolean
}

class GoogleAuthService {
  // app.json에서 주입된 환경변수 사용
  private static readonly GOOGLE_CLIENT_ID = (Constants.expoConfig?.extra as any)?.GOOGLE_CLIENT_ID || ''

  private static readonly GOOGLE_AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth'
  private static readonly GOOGLE_TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token'
  private static readonly GOOGLE_USERINFO_ENDPOINT = 'https://www.googleapis.com/oauth2/v2/userinfo'

  private static readonly SCOPES = [
    'openid',
    'profile',
    'email'
  ]

  /**
   * 구글 로그인 시작
   */
  static async signIn(): Promise<GoogleUser | null> {
    try {
      if (!this.GOOGLE_CLIENT_ID) {
        throw new Error('GOOGLE_CLIENT_ID가 설정되지 않았습니다. app.json을 확인하세요.')
      }

      // CSRF 토큰 생성
      const state = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        Math.random().toString(),
        { encoding: Crypto.CryptoEncoding.HEX }
      )

      // redirect URI 설정 (Google Cloud Console에 등록된 것과 일치해야 함)
      // 여러 형식 시도
      const redirectUris = [
        'inluck://auth',
        'com.yourcompany.inluck://auth',
        'exp://localhost:8081/--/auth'
      ]
      
      const redirectUri = redirectUris[0] // 기본값 사용
      
      console.log('🔍 구글 로그인 시작:')
      console.log('  - Client ID:', this.GOOGLE_CLIENT_ID)
      console.log('  - Redirect URI:', redirectUri)
      console.log('  - State:', state)

      // 인증 URL 생성
      const authUrl = new URL(this.GOOGLE_AUTH_ENDPOINT)
      authUrl.searchParams.append('client_id', this.GOOGLE_CLIENT_ID)
      authUrl.searchParams.append('redirect_uri', redirectUri)
      authUrl.searchParams.append('response_type', 'code')
      authUrl.searchParams.append('scope', this.SCOPES.join(' '))
      authUrl.searchParams.append('state', state)
      authUrl.searchParams.append('access_type', 'offline')
      authUrl.searchParams.append('prompt', 'consent')

      console.log('🔍 생성된 인증 URL:', authUrl.toString())

      // WebBrowser로 인증 페이지 열기
      const result = await WebBrowser.openAuthSessionAsync(
        authUrl.toString(),
        redirectUri
      )

      console.log('🔍 WebBrowser 결과:', result)

      if (result.type === 'success' && result.url) {
        console.log('🔍 성공 URL:', result.url)
        
        // URL에서 인증 코드 추출
        const url = new URL(result.url)
        const code = url.searchParams.get('code')
        const returnedState = url.searchParams.get('state')
        const error = url.searchParams.get('error')

        console.log('🔍 URL 파라미터:')
        console.log('  - Code:', code ? '있음' : '없음')
        console.log('  - State:', returnedState)
        console.log('  - Error:', error)

        // 에러가 있는 경우
        if (error) {
          throw new Error(`구글 인증 에러: ${error}`)
        }

        // state 검증
        if (returnedState !== state) {
          throw new Error('State 검증 실패')
        }

        if (code) {
          // 인증 코드로 액세스 토큰 획득
          const tokens = await this.exchangeCodeForTokens(code, redirectUri)
          if (tokens) {
            // 사용자 정보 획득
            const user = await this.getUserInfo(tokens.access_token)
            if (user) {
              // 사용자 정보 저장
              await this.saveUserData(user, tokens)
              return user
            }
          }
        }
      }

      return null
    } catch (error) {
      console.error('구글 로그인 실패:', error)
      return null
    }
  }

  /**
   * 인증 코드를 액세스 토큰으로 교환
   */
  private static async exchangeCodeForTokens(code: string, redirectUri: string): Promise<{
    access_token: string
    refresh_token?: string
    expires_in: number
  } | null> {
    try {
      const body = new URLSearchParams({
        client_id: this.GOOGLE_CLIENT_ID,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      })

      const response = await fetch(this.GOOGLE_TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
      })

      if (!response.ok) {
        throw new Error('토큰 교환 실패')
      }

      return await response.json()
    } catch (error) {
      console.error('토큰 교환 실패:', error)
      return null
    }
  }

  /**
   * 액세스 토큰으로 사용자 정보 획득
   */
  private static async getUserInfo(accessToken: string): Promise<GoogleUser | null> {
    try {
      const response = await fetch(this.GOOGLE_USERINFO_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error('사용자 정보 획득 실패')
      }

      const userData = await response.json()
      
      return {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
        givenName: userData.given_name,
        familyName: userData.family_name,
      }
    } catch (error) {
      console.error('사용자 정보 획득 실패:', error)
      return null
    }
  }

  /**
   * 사용자 데이터와 토큰을 로컬에 저장
   */
  private static async saveUserData(user: GoogleUser, tokens: any): Promise<void> {
    try {
      await AsyncStorage.multiSet([
        ['user', JSON.stringify(user)],
        ['access_token', tokens.access_token],
        ['refresh_token', tokens.refresh_token || ''],
        ['token_expires_at', (Date.now() + tokens.expires_in * 1000).toString()],
      ])
    } catch (error) {
      console.error('사용자 데이터 저장 실패:', error)
    }
  }

  /**
   * 저장된 사용자 데이터 로드
   */
  static async loadUserData(): Promise<GoogleUser | null> {
    try {
      const userData = await AsyncStorage.getItem('user')
      if (userData) {
        const user = JSON.parse(userData)
        // 토큰 만료 확인
        const expiresAt = await AsyncStorage.getItem('token_expires_at')
        if (expiresAt && Date.now() < parseInt(expiresAt)) {
          return user
        } else {
          // 토큰 만료시 로그아웃
          await this.signOut()
          return null
        }
      }
      return null
    } catch (error) {
      console.error('사용자 데이터 로드 실패:', error)
      return null
    }
  }

  /**
   * 로그아웃
   */
  static async signOut(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        'user',
        'access_token',
        'refresh_token',
        'token_expires_at',
      ])
    } catch (error) {
      console.error('로그아웃 실패:', error)
    }
  }

  /**
   * 인증 상태 확인
   */
  static async checkAuthState(): Promise<AuthState> {
    try {
      const user = await this.loadUserData()
      return {
        isAuthenticated: !!user,
        user,
        isLoading: false,
      }
    } catch (error) {
      console.error('인증 상태 확인 실패:', error)
      return {
        isAuthenticated: false,
        user: null,
        isLoading: false,
      }
    }
  }

  /**
   * 개발용 테스트 로그인 (실제 배포시 제거)
   */
  static async testSignIn(): Promise<GoogleUser> {
    const testUser: GoogleUser = {
      id: 'test_user_123',
      email: 'test@example.com',
      name: '테스트 사용자',
      picture: 'https://via.placeholder.com/150',
      givenName: '테스트',
      familyName: '사용자'
    }

    // 테스트 사용자 정보 저장
    await this.saveUserData(testUser, {
      access_token: 'test_token',
      expires_in: 3600
    })

    return testUser
  }
}

export default GoogleAuthService
