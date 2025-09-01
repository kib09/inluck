/**
 * 웹 전용 라우터 컴포넌트
 * 웹에서 개인정보 처리방침 등 정적 페이지에 접근할 수 있도록 합니다.
 */

import React from 'react'
import { Platform } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import PrivacyPolicyPage from '../pages/PrivacyPolicyPage'

const Stack = createStackNavigator()

const WebRouter: React.FC = () => {
  // 웹에서만 실행
  if (Platform.OS !== 'web') {
    return null
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen 
          name="PrivacyPolicy" 
          component={PrivacyPolicyPage}
          options={{
            title: '개인정보 처리방침'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default WebRouter

