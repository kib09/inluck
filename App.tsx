/**
 * inluck 앱 - React Native 메인 컴포넌트
 * 구글 로그인 후 하단 탭 네비게이션을 사용하여 각 기능 페이지를 관리합니다.
 */

import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'
import { ThemeProvider } from './src/contexts/ThemeContext'
import { AuthProvider, useAuth } from './src/contexts/AuthContext'
import LoginPage from './src/pages/LoginPage'
import Home from './src/pages/Home'
import TarotPage from './src/pages/TarotPage'
import LottoPage from './src/pages/LottoPage'
import FortunePage from './src/pages/FortunePage'
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native'

// 탭 네비게이터 타입 정의
type TabParamList = {
  Home: undefined
  Lotto: undefined
  Fortune: undefined
  Tarot: undefined
}

const Tab = createBottomTabNavigator<TabParamList>()

function TabNavigator() {
  const insets = useSafeAreaInsets()

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline'
          } else if (route.name === 'Lotto') {
            iconName = focused ? 'trophy' : 'trophy-outline'
          } else if (route.name === 'Fortune') {
            iconName = focused ? 'star' : 'star-outline'
          }  else if (route.name === 'Tarot') {
            iconName = focused ? 'moon' : 'moon-outline'
          }else {
            iconName = 'help-circle'
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: '#4ecdc4',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          paddingBottom: Math.max(insets.bottom, 15), // 안전 영역 고려
          paddingTop: 5,
          height: 60 + Math.max(insets.bottom, 15), // 안전 영역만큼 높이 증가
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={Home} 
        options={{ 
          title: '홈',
          tabBarLabel: '홈'
        }} 
      />
      
      <Tab.Screen 
        name="Lotto" 
        component={LottoPage} 
        options={{ 
          title: '로또',
          tabBarLabel: '로또'
        }} 
      />
      <Tab.Screen 
        name="Fortune" 
        component={FortunePage} 
        options={{ 
          title: '운세',
          tabBarLabel: '운세'
        }} 
      />
      <Tab.Screen 
        name="Tarot" 
        component={TarotPage} 
        options={{ 
          title: '타로',
          tabBarLabel: '타로'
        }} 
      />
    </Tab.Navigator>
  )
}

function AppContent() {
  const { authState } = useAuth()

  // 로딩 중일 때 - 스플래시 화면
  if (authState.isLoading) {
    return (
      <View style={styles.splashContainer}>
        <View style={styles.splashContent}>
          <Text style={styles.splashEmoji}>🍀</Text>
          <Text style={styles.splashTitle}>inluck</Text>
          <Text style={styles.splashSubtitle}>행운을 찾는 당신의 신비로운 동반자</Text>
          <ActivityIndicator size="large" color="#4ecdc4" style={styles.loadingSpinner} />
        </View>
      </View>
    )
  }

  // 로그인되지 않은 경우 - 무조건 로그인 페이지 표시
  if (!authState.isAuthenticated || !authState.user) {
    return <LoginPage />
  }

  // 로그인된 경우에만 메인 앱 표시
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <TabNavigator />
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashContent: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  splashEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  splashTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
  },
  splashSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  loadingSpinner: {
    marginTop: 20,
  },
})

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  )
}
