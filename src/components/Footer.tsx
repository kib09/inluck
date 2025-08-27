/**
 * React Native용 풋터 컴포넌트
 * 앱 정보와 저작권을 표시합니다.
 */

import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useTheme } from '../contexts/ThemeContext'

const Footer: React.FC = () => {
  const { isDark } = useTheme()

  return (
    <View style={[styles.footer, { 
      backgroundColor: isDark ? '#1a1a1a' : '#f8f8f8',
      borderTopColor: isDark ? '#333333' : '#e0e0e0'
    }]}>
      <Text style={[styles.footerText, { color: isDark ? '#e0e0e0' : '#666666' }]}>
        🍀 inluck v1.0.0
      </Text>
      <Text style={[styles.copyrightText, { color: isDark ? '#aaaaaa' : '#999999' }]}>
        © 2024 inluck App. All rights reserved.
      </Text>
      <Text style={[styles.descriptionText, { color: isDark ? '#cccccc' : '#888888' }]}>
        행운과 미래를 탐험하는 신비로운 앱
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  footer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  copyrightText: {
    fontSize: 12,
    marginBottom: 6,
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 11,
    textAlign: 'center',
    fontStyle: 'italic',
  },
})

export default Footer
