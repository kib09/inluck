/**
 * 개인정보 처리방침 웹 페이지
 * 웹에서 개인정보 처리방침을 확인할 수 있습니다.
 */

import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  StatusBar
} from 'react-native'
import { useTheme } from '../contexts/ThemeContext'

const { width } = Dimensions.get('window')

const PrivacyPolicyPage: React.FC = () => {
  const { isDark } = useTheme()

  return (
    <View style={[
      styles.container,
      { backgroundColor: isDark ? '#1a1a1a' : '#ffffff' }
    ]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={[
            styles.title,
            { color: isDark ? '#ffffff' : '#000000' }
          ]}>
            inluck 개인정보 처리방침
          </Text>
          <Text style={[
            styles.subtitle,
            { color: isDark ? '#cccccc' : '#666666' }
          ]}>
            최종 업데이트: 2024년 8월 26일 | 버전: 1.0
          </Text>
        </View>

        {/* 내용 */}
        <View style={styles.content}>
          {/* 섹션 1 */}
          <View style={styles.section}>
            <Text style={[
              styles.sectionTitle,
              { color: isDark ? '#4ecdc4' : '#4ecdc4' }
            ]}>
              1. 개인정보 수집 및 이용 목적
            </Text>
            <Text style={[
              styles.sectionSubtitle,
              { color: isDark ? '#e0e0e0' : '#333333' }
            ]}>
              1.1 수집하는 개인정보
            </Text>
            <Text style={[
              styles.paragraph,
              { color: isDark ? '#cccccc' : '#555555' }
            ]}>
              inluck 앱은 다음과 같은 개인정보를 수집합니다:
            </Text>
            <View style={styles.bulletList}>
              <Text style={[
                styles.bulletItem,
                { color: isDark ? '#cccccc' : '#555555' }
              ]}>
                • 구글 계정 정보: 이메일 주소, 이름, 프로필 사진
              </Text>
              <Text style={[
                styles.bulletItem,
                { color: isDark ? '#cccccc' : '#555555' }
              ]}>
                • 앱 사용 데이터: 앱 내 기능 사용 기록, 설정 정보
              </Text>
            </View>
            
            <Text style={[
              styles.sectionSubtitle,
              { color: isDark ? '#e0e0e0' : '#333333' }
            ]}>
              1.2 개인정보 이용 목적
            </Text>
            <Text style={[
              styles.paragraph,
              { color: isDark ? '#cccccc' : '#555555' }
            ]}>
              수집된 개인정보는 다음 목적으로만 이용됩니다:
            </Text>
            <View style={styles.bulletList}>
              <Text style={[
                styles.bulletItem,
                { color: isDark ? '#cccccc' : '#555555' }
              ]}>
                • 서비스 제공: 개인화된 운세, 로또 번호 추천, 타로카드 해석
              </Text>
              <Text style={[
                styles.bulletItem,
                { color: isDark ? '#cccccc' : '#555555' }
              ]}>
                • 사용자 인증: 구글 계정을 통한 안전한 로그인
              </Text>
              <Text style={[
                styles.bulletItem,
                { color: isDark ? '#cccccc' : '#555555' }
              ]}>
                • 서비스 개선: 사용자 경험 향상을 위한 데이터 분석
              </Text>
            </View>
          </View>

          {/* 섹션 2 */}
          <View style={styles.section}>
            <Text style={[
              styles.sectionTitle,
              { color: isDark ? '#4ecdc4' : '#4ecdc4' }
            ]}>
              2. 개인정보 수집 방법
            </Text>
            <Text style={[
              styles.sectionSubtitle,
              { color: isDark ? '#e0e0e0' : '#333333' }
            ]}>
              2.1 자동 수집
            </Text>
            <View style={styles.bulletList}>
              <Text style={[
                styles.bulletItem,
                { color: isDark ? '#cccccc' : '#555555' }
              ]}>
                • 구글 OAuth 2.0을 통한 계정 정보 연동
              </Text>
              <Text style={[
                styles.bulletItem,
                { color: isDark ? '#cccccc' : '#555555' }
              ]}>
                • 앱 사용 시 자동으로 생성되는 로그 데이터
              </Text>
            </View>
            
            <Text style={[
              styles.sectionSubtitle,
              { color: isDark ? '#e0e0e0' : '#333333' }
            ]}>
              2.2 사용자 제공
            </Text>
            <View style={styles.bulletList}>
              <Text style={[
                styles.bulletItem,
                { color: isDark ? '#cccccc' : '#555555' }
              ]}>
                • 구글 로그인 시 동의한 정보만 수집
              </Text>
              <Text style={[
                styles.bulletItem,
                { color: isDark ? '#cccccc' : '#555555' }
              ]}>
                • 명시적 동의 없이는 추가 정보 수집하지 않음
              </Text>
            </View>
          </View>

          {/* 섹션 3 */}
          <View style={styles.section}>
            <Text style={[
              styles.sectionTitle,
              { color: isDark ? '#4ecdc4' : '#4ecdc4' }
            ]}>
              3. 개인정보 보관 및 파기
            </Text>
            <Text style={[
              styles.sectionSubtitle,
              { color: isDark ? '#e0e0e0' : '#333333' }
            ]}>
              3.1 보관 기간
            </Text>
            <View style={styles.bulletList}>
              <Text style={[
                styles.bulletItem,
                { color: isDark ? '#cccccc' : '#555555' }
              ]}>
                • 구글 계정 정보: 앱 사용 기간 동안 보관
              </Text>
              <Text style={[
                styles.bulletItem,
                { color: isDark ? '#cccccc' : '#555555' }
              ]}>
                • 사용 데이터: 앱 삭제 시 자동 삭제
              </Text>
            </View>
            
            <Text style={[
              styles.sectionSubtitle,
              { color: isDark ? '#e0e0e0' : '#333333' }
            ]}>
              3.2 파기 방법
            </Text>
            <View style={styles.bulletList}>
              <Text style={[
                styles.bulletItem,
                { color: isDark ? '#cccccc' : '#555555' }
              ]}>
                • 자동 파기: 앱 삭제 시 모든 데이터 자동 삭제
              </Text>
              <Text style={[
                styles.bulletItem,
                { color: isDark ? '#cccccc' : '#555555' }
              ]}>
                • 수동 파기: 계정 삭제 요청 시 즉시 삭제
              </Text>
            </View>
          </View>

          {/* 섹션 4 */}
          <View style={styles.section}>
            <Text style={[
              styles.sectionTitle,
              { color: isDark ? '#4ecdc4' : '#4ecdc4' }
            ]}>
              4. 개인정보 제3자 제공
            </Text>
            <Text style={[
              styles.paragraph,
              { color: isDark ? '#cccccc' : '#555555' }
            ]}>
              inluck은 사용자의 개인정보를 제3자에게 제공하지 않습니다.
            </Text>
            <Text style={[
              styles.paragraph,
              { color: isDark ? '#cccccc' : '#555555' }
            ]}>
              다음의 경우에만 개인정보를 제공할 수 있습니다:
            </Text>
            <View style={styles.bulletList}>
              <Text style={[
                styles.bulletItem,
                { color: isDark ? '#cccccc' : '#555555' }
              ]}>
                • 법령에 따른 요구사항이 있는 경우
              </Text>
              <Text style={[
                styles.bulletItem,
                { color: isDark ? '#cccccc' : '#555555' }
              ]}>
                • 사용자의 명시적 동의가 있는 경우
              </Text>
            </View>
          </View>

          {/* 섹션 5 */}
          <View style={styles.section}>
            <Text style={[
              styles.sectionTitle,
              { color: isDark ? '#4ecdc4' : '#4ecdc4' }
            ]}>
              5. 개인정보 보호 조치
            </Text>
            <Text style={[
              styles.sectionSubtitle,
              { color: isDark ? '#e0e0e0' : '#333333' }
            ]}>
              5.1 기술적 보호
            </Text>
            <View style={styles.bulletList}>
              <Text style={[
                styles.bulletItem,
                { color: isDark ? '#cccccc' : '#555555' }
              ]}>
                • 모든 개인정보는 암호화하여 저장
              </Text>
              <Text style={[
                styles.bulletItem,
                { color: isDark ? '#cccccc' : '#555555' }
              ]}>
                • 승인된 개발자만 데이터에 접근 가능
              </Text>
              <Text style={[
                styles.bulletItem,
                { color: isDark ? '#cccccc' : '#555555' }
              ]}>
                • 정기적인 보안 점검 및 업데이트
              </Text>
            </View>
            
            <Text style={[
              styles.sectionSubtitle,
              { color: isDark ? '#e0e0e0' : '#333333' }
            ]}>
              5.2 관리적 보호
            </Text>
            <View style={styles.bulletList}>
              <Text style={[
                styles.bulletItem,
                { color: isDark ? '#cccccc' : '#555555' }
              ]}>
                • 최소한의 권한만 부여
              </Text>
              <Text style={[
                styles.bulletItem,
                { color: isDark ? '#cccccc' : '#555555' }
              ]}>
                • 개발자 대상 개인정보 보호 교육
              </Text>
            </View>
          </View>

          {/* 섹션 6 */}
          <View style={styles.section}>
            <Text style={[
              styles.sectionTitle,
              { color: isDark ? '#4ecdc4' : '#4ecdc4' }
            ]}>
              6. 사용자 권리
            </Text>
            <Text style={[
              styles.sectionSubtitle,
              { color: isDark ? '#e0e0e0' : '#333333' }
            ]}>
              6.1 개인정보 관련 권리
            </Text>
            <Text style={[
              styles.paragraph,
              { color: isDark ? '#cccccc' : '#555555' }
            ]}>
              사용자는 다음 권리를 가집니다:
            </Text>
            <View style={styles.bulletList}>
              <Text style={[
                styles.bulletItem,
                { color: isDark ? '#cccccc' : '#555555' }
              ]}>
                • 열람권: 본인의 개인정보 열람 요청
              </Text>
              <Text style={[
                styles.bulletItem,
                { color: isDark ? '#cccccc' : '#555555' }
              ]}>
                • 정정권: 잘못된 개인정보 정정 요청
              </Text>
              <Text style={[
                styles.bulletItem,
                { color: isDark ? '#cccccc' : '#555555' }
              ]}>
                • 삭제권: 개인정보 삭제 요청
              </Text>
              <Text style={[
                styles.bulletItem,
                { color: isDark ? '#cccccc' : '#555555' }
              ]}>
                • 처리정지권: 개인정보 처리 중단 요청
              </Text>
            </View>
            
            <Text style={[
              styles.sectionSubtitle,
              { color: isDark ? '#e0e0e0' : '#333333' }
            ]}>
              6.2 권리 행사 방법
            </Text>
            <Text style={[
              styles.paragraph,
              { color: isDark ? '#cccccc' : '#555555' }
            ]}>
              권리 행사는 다음 방법으로 가능합니다:
            </Text>
            <Text style={[
              styles.bulletItem,
              { color: isDark ? '#cccccc' : '#555555' }
            ]}>
              • 이메일: dslqoehf@gmail.com
            </Text>
          </View>

          {/* 섹션 7 */}
          <View style={styles.section}>
            <Text style={[
              styles.sectionTitle,
              { color: isDark ? '#4ecdc4' : '#4ecdc4' }
            ]}>
              7. 쿠키 및 추적 기술
            </Text>
            <Text style={[
              styles.sectionSubtitle,
              { color: isDark ? '#e0e0e0' : '#333333' }
            ]}>
              7.1 쿠키 사용
            </Text>
            <Text style={[
              styles.paragraph,
              { color: isDark ? '#cccccc' : '#555555' }
            ]}>
              inluck은 사용자 경험 향상을 위해 최소한의 쿠키만 사용합니다.
            </Text>
            
            <Text style={[
              styles.sectionSubtitle,
              { color: isDark ? '#e0e0e0' : '#333333' }
            ]}>
              7.2 추적 기술
            </Text>
            <View style={styles.bulletList}>
              <Text style={[
                styles.bulletItem,
                { color: isDark ? '#cccccc' : '#555555' }
              ]}>
                • Google Analytics: 서비스 개선을 위한 익명화된 사용 통계
              </Text>
              <Text style={[
                styles.bulletItem,
                { color: isDark ? '#cccccc' : '#555555' }
              ]}>
                • 사용자 식별: 개인을 특정할 수 없는 형태로만 수집
              </Text>
            </View>
          </View>

          {/* 섹션 8 */}
          <View style={styles.section}>
            <Text style={[
              styles.sectionTitle,
              { color: isDark ? '#4ecdc4' : '#4ecdc4' }
            ]}>
              8. 아동 개인정보 보호
            </Text>
            <Text style={[
              styles.sectionSubtitle,
              { color: isDark ? '#e0e0e0' : '#333333' }
            ]}>
              8.1 연령 제한
            </Text>
            <Text style={[
              styles.paragraph,
              { color: isDark ? '#cccccc' : '#555555' }
            ]}>
              inluck은 만 14세 미만 아동의 개인정보를 수집하지 않습니다.
            </Text>
            
            <Text style={[
              styles.sectionSubtitle,
              { color: isDark ? '#e0e0e0' : '#333333' }
            ]}>
              8.2 보호자 동의
            </Text>
            <Text style={[
              styles.paragraph,
              { color: isDark ? '#cccccc' : '#555555' }
            ]}>
              만 14세 이상이지만 미성년자인 경우, 보호자의 동의를 받아야 합니다.
            </Text>
          </View>

          {/* 섹션 9 */}
          <View style={styles.section}>
            <Text style={[
              styles.sectionTitle,
              { color: isDark ? '#4ecdc4' : '#4ecdc4' }
            ]}>
              9. 개인정보 처리방침 변경
            </Text>
            <Text style={[
              styles.sectionSubtitle,
              { color: isDark ? '#e0e0e0' : '#333333' }
            ]}>
              9.1 변경 통지
            </Text>
            <Text style={[
              styles.paragraph,
              { color: isDark ? '#cccccc' : '#555555' }
            ]}>
              개인정보 처리방침이 변경되는 경우:
            </Text>
            <View style={styles.bulletList}>
              <Text style={[
                styles.bulletItem,
                { color: isDark ? '#cccccc' : '#555555' }
              ]}>
                • 앱 내 공지: 주요 변경사항을 앱 내에서 공지
              </Text>
              <Text style={[
                styles.bulletItem,
                { color: isDark ? '#cccccc' : '#555555' }
              ]}>
                • 이메일 통지: 사용자에게 이메일로 개별 통지
              </Text>
            </View>
            
            <Text style={[
              styles.sectionSubtitle,
              { color: isDark ? '#e0e0e0' : '#333333' }
            ]}>
              9.2 동의 철회
            </Text>
            <Text style={[
              styles.paragraph,
              { color: isDark ? '#cccccc' : '#555555' }
            ]}>
              변경된 처리방침에 동의하지 않는 경우:
            </Text>
            <View style={styles.bulletList}>
              <Text style={[
                styles.bulletItem,
                { color: isDark ? '#cccccc' : '#555555' }
              ]}>
                • 서비스 이용 중단: 앱 사용을 중단할 수 있음
              </Text>
              <Text style={[
                styles.bulletItem,
                { color: isDark ? '#cccccc' : '#555555' }
              ]}>
                • 계정 삭제: 언제든지 계정을 삭제할 수 있음
              </Text>
            </View>
          </View>

          {/* 섹션 10 */}
          <View style={styles.section}>
            <Text style={[
              styles.sectionTitle,
              { color: isDark ? '#4ecdc4' : '#4ecdc4' }
            ]}>
              10. 개인정보 보호책임자
            </Text>
            <Text style={[
              styles.sectionSubtitle,
              { color: isDark ? '#e0e0e0' : '#333333' }
            ]}>
              10.1 책임자 정보
            </Text>
            <View style={styles.bulletList}>
              <Text style={[
                styles.bulletItem,
                { color: isDark ? '#cccccc' : '#555555' }
              ]}>
                • 이름: 김인배
              </Text>
              <Text style={[
                styles.bulletItem,
                { color: isDark ? '#cccccc' : '#555555' }
              ]}>
                • 이메일: dslqoehf@gmail.com
              </Text>
              <Text style={[
                styles.bulletItem,
                { color: isDark ? '#cccccc' : '#555555' }
              ]}>
                • 연락처: 010-6451-2662
              </Text>
            </View>
            
            <Text style={[
              styles.sectionSubtitle,
              { color: isDark ? '#e0e0e0' : '#333333' }
            ]}>
              10.2 문의 및 신고
            </Text>
            <Text style={[
              styles.paragraph,
              { color: isDark ? '#cccccc' : '#555555' }
            ]}>
              개인정보 관련 문의나 신고는 다음 방법으로 가능합니다:
            </Text>
            <Text style={[
              styles.bulletItem,
              { color: isDark ? '#cccccc' : '#555555' }
            ]}>
              • 이메일: dslqoehf@gmail.com
            </Text>
          </View>

          {/* 푸터 */}
          <View style={styles.footer}>
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
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  content: {
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    lineHeight: 28,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 8,
    lineHeight: 22,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 10,
  },
  bulletList: {
    marginLeft: 10,
    marginBottom: 15,
  },
  bulletItem: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 5,
  },
  footer: {
    marginTop: 40,
    paddingTop: 30,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    marginBottom: 5,
  },
  footerSubText: {
    fontSize: 12,
  },
})

export default PrivacyPolicyPage

