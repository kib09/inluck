/**
 * 로그인 페이지
 * 구글 로그인을 통해 앱에 접근할 수 있습니다.
 */

import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StatusBar
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'
import PolicyModal from '../components/PolicyModal'

const { width, height } = Dimensions.get('window')

const LoginPage: React.FC = () => {
  const { isDark } = useTheme()
  const { signIn, testSignIn, authState } = useAuth()
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const insets = useSafeAreaInsets()

  const handleGoogleSignIn = async () => {
    if (isSigningIn) return

    setIsSigningIn(true)
    try {
      await signIn()
      if (!authState.isAuthenticated) {
        Alert.alert(
          '로그인 실패',
          '구글 로그인에 실패했습니다. 다시 시도해주세요.',
          [{ text: '확인' }]
        )
      }
    } catch (error) {
      Alert.alert(
        '오류',
        '로그인 중 오류가 발생했습니다. 다시 시도해주세요.',
        [{ text: '확인' }]
      )
    } finally {
      setIsSigningIn(false)
    }
  }

  const handleTestSignIn = async () => {
    if (isSigningIn) return

    setIsSigningIn(true)
    try {
      await testSignIn()
    } catch (error) {
      Alert.alert(
        '오류',
        '테스트 로그인 중 오류가 발생했습니다.',
        [{ text: '확인' }]
      )
    } finally {
      setIsSigningIn(false)
    }
  }

  return (
    <View style={[
      styles.container,
      { backgroundColor: isDark ? '#121212' : '#f8f9fa' }
    ]}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#121212' : '#f8f9fa'}
      />
      
      {/* 배경 그라디언트 효과 */}
      <View style={[
        styles.backgroundGradient,
        { backgroundColor: isDark ? '#1a1a1a' : '#ffffff' }
      ]} />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }
        ]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* 메인 콘텐츠 */}
        <View style={styles.content}>
          {/* 앱 로고 및 제목 */}
          <View style={styles.headerSection}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoEmoji}>🍀</Text>
            </View>
            <Text style={[
              styles.appTitle,
              { color: isDark ? '#ffffff' : '#000000' }
            ]}>
              inluck
            </Text>
            <Text style={[
              styles.appSubtitle,
              { color: isDark ? '#cccccc' : '#666666' }
            ]}>
              행운을 찾는 당신의 신비로운 동반자
            </Text>
          </View>

          {/* 앱 소개 */}
          <View style={[
            styles.introSection,
            { backgroundColor: isDark ? '#1e1e1e' : '#ffffff' }
          ]}>
            <Text style={[
              styles.introTitle,
              { color: isDark ? '#ffffff' : '#000000' }
            ]}>
              ✨ inluck만의 특별한 경험
            </Text>
            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <Ionicons name="trophy" size={20} color="#ff6b6b" />
                <Text style={[
                  styles.featureText,
                  { color: isDark ? '#cccccc' : '#666666' }
                ]}>
                 무료 로또 번호 추천
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="star" size={20} color="#4ecdc4" />
                <Text style={[
                  styles.featureText,
                  { color: isDark ? '#cccccc' : '#666666' }
                ]}>
                  개인화된 운세 분석
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="moon" size={20} color="#45b7d1" />
                <Text style={[
                  styles.featureText,
                  { color: isDark ? '#cccccc' : '#666666' }
                ]}>
                  AI 기반 지능형 타로카드 해석
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="cloud-offline" size={20} color="#f39c12" />
                <Text style={[
                  styles.featureText,
                  { color: isDark ? '#cccccc' : '#666666' }
                ]}>
                  오프라인에서도 작동
                </Text>
              </View>
            </View>
          </View>

          {/* 로그인 안내 */}
          <View style={[
            styles.loginInfoSection,
            { 
              backgroundColor: isDark ? '#2a2a2a' : '#f8f9fa',
              borderColor: isDark ? 'rgba(78, 205, 196, 0.4)' : 'rgba(78, 205, 196, 0.3)'
            }
          ]}>
            <Text style={[
              styles.loginInfoTitle,
              { color: isDark ? '#ffffff' : '#000000' }
            ]}>
              🔐 안전한 로그인
            </Text>
            <Text style={[
              styles.loginInfoText,
              { color: isDark ? '#e0e0e0' : '#666666' }
            ]}>
              구글 계정으로 간편하게 로그인하여 개인화된 서비스를 이용하세요.
            </Text>
            <Text style={[
              styles.offlineInfoText,
              { color: isDark ? '#4ecdc4' : '#4ecdc4' }
            ]}>
              💡 로그인 후에는 인터넷 없이도  기능들을 사용할 수 있습니다!
            </Text>
          </View>

          {/* 로그인 버튼 */}
          <View style={styles.loginSection}>
            <TouchableOpacity
              style={[
                styles.googleSignInButton,
                isSigningIn && styles.disabledButton
              ]}
              onPress={handleGoogleSignIn}
              disabled={isSigningIn}
              activeOpacity={0.8}
            >
              {isSigningIn ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <>
                  <Ionicons name="logo-google" size={24} color="#ffffff" />
                  <Text style={styles.googleSignInText}>
                    구글로 계속하기
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* 개발용 테스트 로그인 버튼 */}
            {__DEV__ && (
              <TouchableOpacity
                style={[
                  styles.testSignInButton,
                  { 
                    backgroundColor: isDark ? '#404040' : '#e0e0e0',
                    borderWidth: 1,
                    borderColor: isDark ? '#555555' : '#d0d0d0'
                  },
                  isSigningIn && styles.disabledButton
                ]}
                onPress={handleTestSignIn}
                disabled={isSigningIn}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.testSignInText,
                  { color: isDark ? '#e0e0e0' : '#666666' }
                ]}>
                  테스트 로그인 (개발용)
                </Text>
              </TouchableOpacity>
            )}

            {/* 개인정보 처리방침 */}
            <View style={styles.privacyContainer}>
              <Text style={[
                styles.privacyText,
                { color: isDark ? '#cccccc' : '#999999' }
              ]}>
                로그인 시 inluck의{' '}
              </Text>
              <TouchableOpacity 
                onPress={() => setShowPrivacyModal(true)}
                style={styles.linkButton}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.privacyLink,
                  { color: isDark ? '#4ecdc4' : '#4ecdc4' }
                ]}>
                  개인정보 처리방침
                </Text>
              </TouchableOpacity>
              <Text style={[
                styles.privacyText,
                { color: isDark ? '#cccccc' : '#999999' }
              ]}>
                과{' '}
              </Text>
              <TouchableOpacity 
                onPress={() => setShowTermsModal(true)}
                style={styles.linkButton}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.privacyLink,
                  { color: isDark ? '#4ecdc4' : '#4ecdc4' }
                ]}>
                  이용약관
                </Text>
              </TouchableOpacity>
              <Text style={[
                styles.privacyText,
                { color: isDark ? '#cccccc' : '#999999' }
              ]}>
                에 동의하게 됩니다.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 하단 정보 */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
        <Text style={[
          styles.footerText,
          { color: isDark ? '#666666' : '#999999' }
        ]}>
          © 2024 inluck. 모든 권리 보유.
        </Text>
        <Text style={[
          styles.footerSubText,
          { color: isDark ? '#555555' : '#888888' }
        ]}>
          행운은 준비된 자에게 찾아옵니다 🍀
        </Text>
      </View>

      {/* 개인정보 처리방침 모달 */}
      <PolicyModal
        isVisible={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        type="privacy"
      />

      {/* 이용약관 모달 */}
      <PolicyModal
        isVisible={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        type="terms"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    minHeight: height - 100, // 최소 높이 보장
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoEmoji: {
    fontSize: 50,
  },
  appTitle: {
    fontSize: Math.min(width * 0.08, 36), // 반응형 폰트 크기
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  appSubtitle: {
    fontSize: Math.min(width * 0.04, 16), // 반응형 폰트 크기
    textAlign: 'center',
    lineHeight: 22,
  },
  introSection: {
    width: '100%',
    padding: 25,
    borderRadius: 20,
    marginBottom: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  introTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  featureList: {
    // gap 대신 marginBottom 사용
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15, // gap 대신 marginBottom
  },
  featureText: {
    fontSize: 16,
    flex: 1,
    marginLeft: 15, // gap 대신 marginLeft
  },
  loginInfoSection: {
    width: '100%',
    padding: 20,
    borderRadius: 15,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'rgba(78, 205, 196, 0.3)',
  },
  loginInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  loginInfoText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 10,
  },
  offlineInfoText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: '500',
  },
  loginSection: {
    width: '100%',
    alignItems: 'center',
  },
  googleSignInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4285f4',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    width: '100%',
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  googleSignInText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  testSignInButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginBottom: 20,
  },
  testSignInText: {
    fontSize: 14,
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  privacyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  privacyText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  privacyLink: {
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  linkButton: {
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    marginBottom: 5,
  },
  footerSubText: {
    fontSize: 11,
    fontStyle: 'italic',
  },
})

export default LoginPage
