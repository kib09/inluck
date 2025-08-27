/**
 * React Native용 홈 페이지
 * 메인 메뉴와 앱 소개를 포함합니다.
 */

import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '../contexts/ThemeContext'
import { useNavigation } from '@react-navigation/native'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import Footer from '../components/Footer'

// 네비게이션 타입 정의
type TabParamList = {
  Home: undefined
  Tarot: undefined
  Lotto: undefined
  Fortune: undefined
}

type HomeNavigationProp = BottomTabNavigationProp<TabParamList, 'Home'>

interface MenuItem {
  id: string
  title: string
  description: string
  icon: keyof typeof Ionicons.glyphMap
  color: string
  targetScreen: keyof TabParamList
}

const Home: React.FC = () => {
  const { isDark } = useTheme()
  const navigation = useNavigation<HomeNavigationProp>()
  const insets = useSafeAreaInsets()

  const menuItems: MenuItem[] = [
    {
      id: 'lotto',
      title: '로또 번호 추첨',
      description: '행운의 로또 번호를 생성해보세요',
      icon: 'trophy',
      color: '#ff6b6b',
      targetScreen: 'Lotto'
    },
    {
      id: 'fortune',
      title: '오늘의 운세',
      description: '별자리별 오늘의 운세를 확인하세요',
      icon: 'star',
      color: '#4ecdc4',
      targetScreen: 'Fortune'
    },
    {
      id: 'tarot',
      title: '타로카드 리딩',
      description: '신비로운 타로카드로 미래를 탐험하세요',
      icon: 'moon',
      color: '#45b7d1',
      targetScreen: 'Tarot'
    }
  ]

  const handleMenuPress = (targetScreen: keyof TabParamList) => {
    navigation.navigate(targetScreen)
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* 앱 소개 섹션 */}
      <View style={[styles.heroSection, { backgroundColor: isDark ? '#1e1e1e' : '#ffffff' }]}>
        <View style={styles.heroContent}>
          <Text style={[styles.heroTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
            🍀 inluck 🍀
          </Text>
          <Text style={[styles.heroSubtitle, { color: isDark ? '#cccccc' : '#666666' }]}>
            행운과 미래를 탐험하는 신비로운 앱
          </Text>
          <Text style={[styles.heroDescription, { color: isDark ? '#aaaaaa' : '#888888' }]}>
            로또 번호 추첨, 별자리 운세, 타로카드 리딩까지{'\n'}
            당신의 운명을 탐험해보세요!
          </Text>
        </View>
      </View>

      {/* 메뉴 섹션 */}
      <View style={styles.menuSection}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
          메뉴 선택
        </Text>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.menuItem, { backgroundColor: isDark ? '#1e1e1e' : '#ffffff' }]}
            onPress={() => handleMenuPress(item.targetScreen)}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIcon, { backgroundColor: item.color }]}>
              <Ionicons name={item.icon} size={28} color="#ffffff" />
            </View>
            <View style={styles.menuContent}>
              <Text style={[styles.menuTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
                {item.title}
              </Text>
              <Text style={[styles.menuDescription, { color: isDark ? '#cccccc' : '#666666' }]}>
                {item.description}
              </Text>
            </View>
            <Ionicons 
              name="chevron-forward" 
              size={24} 
              color={isDark ? '#666666' : '#cccccc'} 
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* 앱 정보 섹션 */}
      <View style={[styles.infoSection, { backgroundColor: isDark ? '#1e1e1e' : '#ffffff' }]}>
        <Text style={[styles.infoTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
          앱 정보
        </Text>
        <Text style={[styles.infoText, { color: isDark ? '#cccccc' : '#666666' }]}>
          • 무료로 제공되는 모든 기능{'\n'}
          • 오프라인에서도 사용 가능{'\n'}
          • 개인정보 수집하지 않음{'\n'}
          • 정기적인 업데이트
        </Text>
      </View>

      {/* 풋터 추가 */}
      <Footer />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  heroSection: {
    margin: 20,
    borderRadius: 20,
    padding: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },
  heroDescription: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  menuSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  menuIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  menuDescription: {
    fontSize: 14,
  },
  infoSection: {
    margin: 20,
    borderRadius: 20,
    padding: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
  },
})

export default Home
