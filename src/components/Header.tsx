/**
 * React Native용 헤더 컴포넌트
 * 앱 제목, 테마 토글, 사용자 정보, 로그아웃 버튼을 포함합니다.
 */

import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'

interface HeaderProps {
  title?: string
}

const Header: React.FC<HeaderProps> = ({ title = 'inluck' }) => {
  const { isDark, toggleTheme } = useTheme()
  const { authState, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('로그아웃 실패:', error)
    }
  }

  return (
    <View style={[styles.header, { backgroundColor: isDark ? '#1a1a1a' : '#ffffff' }]}>
      <View style={styles.container}>
        <View style={styles.leftSection}>
          <Text style={[styles.title, { color: isDark ? '#ffffff' : '#000000' }]}>
            {title}
          </Text>
        </View>

        <View style={styles.rightSection}>
          {/* 사용자 정보 */}
          {authState.user && (
            <View style={styles.userSection}>
              <Image 
                source={{ uri: authState.user.picture }} 
                style={styles.userAvatar}
                defaultSource={{ uri: 'https://via.placeholder.com/40' }}
              />
              <Text style={[styles.userName, { color: isDark ? '#cccccc' : '#666666' }]}>
                {authState.user.name}
              </Text>
            </View>
          )}

          {/* 테마 토글 버튼 */}
          <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
            <Ionicons 
              name={isDark ? 'sunny' : 'moon'} 
              size={24} 
              color={isDark ? '#ffd700' : '#666666'} 
            />
          </TouchableOpacity>

          {/* 로그아웃 버튼 */}
          {authState.user && (
            <TouchableOpacity onPress={handleSignOut} style={styles.logoutButton}>
              <Ionicons 
                name="log-out-outline" 
                size={24} 
                color={isDark ? '#ff6b6b' : '#ff6b6b'} 
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 50, // 상태바 높이 고려
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  leftSection: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  userName: {
    fontSize: 14,
    fontWeight: '500',
    maxWidth: 100,
  },
  themeButton: {
    padding: 8,
    borderRadius: 20,
  },
  logoutButton: {
    padding: 8,
    borderRadius: 20,
  },
})

export default Header
