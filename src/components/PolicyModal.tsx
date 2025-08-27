/**
 * 개인정보 처리방침 및 이용약관 모달 컴포넌트
 * 사용자가 개인정보 처리방침과 이용약관을 확인할 수 있습니다.
 */

import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  StatusBar
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '../contexts/ThemeContext'

const { width, height } = Dimensions.get('window')

interface PolicyModalProps {
  isVisible: boolean
  onClose: () => void
  type: 'privacy' | 'terms'
}

const PolicyModal: React.FC<PolicyModalProps> = ({ isVisible, onClose, type }) => {
  const { isDark } = useTheme()
  const insets = useSafeAreaInsets()

  if (!isVisible) return null

  const getTitle = () => {
    return type === 'privacy' ? '개인정보 처리방침' : '이용약관'
  }

  const getContent = () => {
    if (type === 'privacy') {
      return {
        title: 'inluck 개인정보 처리방침',
        lastUpdated: '2024년 8월 26일',
        version: '1.0',
        sections: [
          {
            title: '1. 개인정보 수집 및 이용 목적',
            content: [
              'inluck 앱은 다음과 같은 개인정보를 수집합니다:',
              '• 구글 계정 정보: 이메일 주소, 이름, 프로필 사진',
              '• 앱 사용 데이터: 앱 내 기능 사용 기록, 설정 정보',
              '',
              '수집된 개인정보는 다음 목적으로만 이용됩니다:',
              '• 서비스 제공: 개인화된 운세, 로또 번호 추천, 타로카드 해석',
              '• 사용자 인증: 구글 계정을 통한 안전한 로그인',
              '• 서비스 개선: 사용자 경험 향상을 위한 데이터 분석'
            ]
          },
          {
            title: '2. 개인정보 수집 방법',
            content: [
              '• 구글 OAuth 2.0을 통한 계정 정보 연동',
              '• 앱 사용 시 자동으로 생성되는 로그 데이터',
              '• 구글 로그인 시 동의한 정보만 수집',
              '• 명시적 동의 없이는 추가 정보 수집하지 않음'
            ]
          },
          {
            title: '3. 개인정보 보관 및 파기',
            content: [
              '• 구글 계정 정보: 앱 사용 기간 동안 보관',
              '• 사용 데이터: 앱 삭제 시 자동 삭제',
              '• 앱 삭제 시 모든 데이터 자동 삭제',
              '• 계정 삭제 요청 시 즉시 삭제'
            ]
          },
          {
            title: '4. 개인정보 제3자 제공',
            content: [
              'inluck은 사용자의 개인정보를 제3자에게 제공하지 않습니다.',
              '',
              '다음의 경우에만 개인정보를 제공할 수 있습니다:',
              '• 법령에 따른 요구사항이 있는 경우',
              '• 사용자의 명시적 동의가 있는 경우'
            ]
          },
          {
            title: '5. 개인정보 보호 조치',
            content: [
              '기술적 보호:',
              '• 모든 개인정보는 암호화하여 저장',
              '• 승인된 개발자만 데이터에 접근 가능',
              '• 정기적인 보안 점검 및 업데이트',
              '',
              '관리적 보호:',
              '• 최소한의 권한만 부여',
              '• 개발자 대상 개인정보 보호 교육'
            ]
          },
          {
            title: '6. 사용자 권리',
            content: [
              '사용자는 다음 권리를 가집니다:',
              '• 열람권: 본인의 개인정보 열람 요청',
              '• 정정권: 잘못된 개인정보 정정 요청',
              '• 삭제권: 개인정보 삭제 요청',
              '• 처리정지권: 개인정보 처리 중단 요청',
              '',
              '권리 행사는 다음 방법으로 가능합니다:',
              '• 이메일: dslqoehf@gmail.com'
            ]
          },
          {
            title: '7. 쿠키 및 추적 기술',
            content: [
              '• 사용자 경험 향상을 위해 최소한의 쿠키만 사용',
              '• Google Analytics: 서비스 개선을 위한 익명화된 사용 통계',
              '• 개인을 특정할 수 없는 형태로만 수집'
            ]
          },
          {
            title: '8. 아동 개인정보 보호',
            content: [
              '• 만 14세 미만 아동의 개인정보를 수집하지 않음',
              '• 만 14세 이상이지만 미성년자인 경우, 보호자의 동의 필요'
            ]
          },
          {
            title: '9. 개인정보 처리방침 변경',
            content: [
              '개인정보 처리방침이 변경되는 경우:',
              '• 앱 내 공지: 주요 변경사항을 앱 내에서 공지',
              '• 이메일 통지: 사용자에게 이메일로 개별 통지',
              '• 변경사항에 대한 동의 철회 가능'
            ]
          }
        ]
      }
    } else {
      return {
        title: 'inluck 이용약관',
        lastUpdated: '2024년 8월 26일',
        version: '1.0',
        sections: [
          {
            title: '1. 총칙',
            content: [
              '본 약관은 inluck 앱의 이용과 관련하여 서비스 제공자와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.',
              '',
              '정의:',
              '• 서비스: inluck 앱을 통해 제공되는 모든 서비스',
              '• 이용자: 본 약관에 동의하고 서비스를 이용하는 자',
              '• 콘텐츠: 서비스 내에서 제공되는 운세, 로또 번호, 타로카드 해석 등',
              '',
              '본 약관은 서비스 이용 시점부터 효력을 발생하며, 약관 변경 시 공지 후 적용됩니다.'
            ]
          },
          {
            title: '2. 서비스 이용',
            content: [
              'inluck은 다음과 같은 서비스를 제공합니다:',
              '• 운세 서비스: 개인화된 운세 분석 및 제공',
              '• 로또 서비스: AI 기반 로또 번호 추천',
              '• 타로 서비스: 지능형 타로카드 해석',
              '• 기타 서비스: 행운과 관련된 다양한 기능',
              '',
              '서비스 이용 방법:',
              '• 가입: 구글 계정을 통한 간편 가입',
              '• 로그인: 구글 OAuth 2.0을 통한 안전한 인증',
              '• 이용: 로그인 후 모든 서비스 무료 이용 가능',
              '',
              '서비스 이용 시간:',
              '• 24시간 이용: 서버 점검 시간을 제외하고 24시간 이용 가능',
              '• 점검 공지: 서버 점검이 필요한 경우 사전 공지'
            ]
          },
          {
            title: '3. 이용자의 의무',
            content: [
              '이용자는 다음 사항을 준수해야 합니다:',
              '• 법령 준수: 관련 법령 및 공공질서 준수',
              '• 타인 권리 존중: 타인의 권리나 명예, 신용 등을 침해하지 않음',
              '• 서비스 안정성: 서비스의 안정적 운영을 방해하지 않음',
              '',
              '금지행위:',
              '• 불법적 이용: 불법적인 목적으로 서비스 이용',
              '• 해킹 시도: 서비스 보안을 침해하는 행위',
              '• 스팸 발송: 다른 이용자에게 불필요한 메시지 발송',
              '',
              '계정 관리:',
              '• 계정 보안: 본인의 계정 정보를 안전하게 관리',
              '• 무단 사용 금지: 타인에게 계정을 대여하거나 양도 금지',
              '• 비밀번호 변경: 정기적인 비밀번호 변경 권장'
            ]
          },
          {
            title: '4. 서비스 제공자의 의무',
            content: [
              '서비스 제공:',
              '• 안정적 운영: 서비스의 안정적이고 지속적인 제공',
              '• 보안 강화: 이용자 정보 보호를 위한 보안 조치',
              '• 품질 향상: 지속적인 서비스 품질 개선',
              '',
              '개인정보 보호:',
              '• 개인정보 수집: 최소한의 개인정보만 수집',
              '• 보안 조치: 개인정보 보호를 위한 기술적, 관리적 조치',
              '• 제3자 제공 금지: 이용자 동의 없이 제3자에게 제공하지 않음',
              '',
              '고객지원:',
              '• 문의 응대: 이용자 문의에 대한 신속한 응대',
              '• 기술 지원: 서비스 이용 관련 기술적 지원 제공',
              '• 불만 처리: 이용자 불만사항에 대한 적극적 해결'
            ]
          },
          {
            title: '5. 서비스 이용 제한',
            content: [
              '이용 제한 사유:',
              '• 약관 위반: 본 약관을 위반한 경우',
              '• 불법적 이용: 불법적인 목적으로 서비스를 이용한 경우',
              '• 서비스 방해: 다른 이용자의 서비스 이용을 방해한 경우',
              '',
              '이용 제한 절차:',
              '• 경고: 1차 경고 후 이용 제한',
              '• 일시 정지: 경고 후에도 지속되는 경우 일시 정지',
              '• 영구 정지: 중대한 위반의 경우 영구 정지',
              '',
              '이용 제한 해제:',
              '• 정당한 사유: 이용 제한 사유가 해소된 경우',
              '• 해제 신청: 이용 제한 해제를 위한 신청 절차',
              '• 검토 후 결정: 신청 내용 검토 후 해제 여부 결정'
            ]
          },
          {
            title: '6. 책임과 면책',
            content: [
              '서비스 제공자의 책임:',
              '• 서비스 제공: 약정된 서비스의 제공',
              '• 개인정보 보호: 이용자 개인정보의 안전한 보호',
              '• 손해 배상: 서비스 제공자의 귀책사유로 인한 손해 배상',
              '',
              '면책 사항:',
              '• 천재지변, 전쟁, 폭동 등 불가항력적 사유로 인한 서비스 중단',
              '• 이용자의 귀책사유로 인한 서비스 이용의 장애',
              '• 제3자가 제공하는 서비스의 장애'
            ]
          },
          {
            title: '7. 분쟁 해결',
            content: [
              '분쟁 발생 시:',
              '• 우선적으로 상호 협의를 통해 해결',
              '• 협의가 이루어지지 않을 경우 관련 법령에 따라 해결',
              '• 관할 법원: 서비스 제공자 소재지 관할 법원'
            ]
          }
        ]
      }
    }
  }

  const content = getContent()

  return (
    <View style={styles.modalOverlay}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.8)'}
      />
      
      {/* 배경 터치 시 모달 닫기 */}
      <TouchableOpacity 
        style={styles.backgroundTouch}
        onPress={onClose}
        activeOpacity={1}
      />
      
      <TouchableOpacity 
        style={[
          styles.modalContainer,
          { 
            backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
            marginTop: insets.top + 20,
            marginBottom: insets.bottom + 20
          }
        ]}
        onPress={() => {}} // 모달 내부 터치 시 닫히지 않도록
        activeOpacity={1}
      >
        {/* 헤더 */}
        <View style={[
          styles.modalHeader,
          { borderBottomColor: isDark ? '#333333' : '#e0e0e0' }
        ]}>
          <Text style={[
            styles.modalTitle,
            { color: isDark ? '#ffffff' : '#000000' }
          ]}>
            {getTitle()}
          </Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="close" 
              size={24} 
              color={isDark ? '#cccccc' : '#666666'} 
            />
          </TouchableOpacity>
        </View>

        {/* 콘텐츠 */}
        <ScrollView 
          style={styles.modalContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* 제목 및 버전 정보 */}
          <View style={styles.contentHeader}>
            <Text style={[
              styles.contentTitle,
              { color: isDark ? '#ffffff' : '#000000' }
            ]}>
              {content.title}
            </Text>
            <View style={styles.versionInfo}>
              <Text style={[
                styles.versionText,
                { color: isDark ? '#cccccc' : '#666666' }
              ]}>
                최종 업데이트: {content.lastUpdated}
              </Text>
              <Text style={[
                styles.versionText,
                { color: isDark ? '#cccccc' : '#666666' }
              ]}>
                버전: {content.version}
              </Text>
            </View>
          </View>

          {/* 섹션별 내용 */}
          {content.sections.map((section, index) => (
            <View key={index} style={styles.section}>
              <Text style={[
                styles.sectionTitle,
                { color: isDark ? '#4ecdc4' : '#4ecdc4' }
              ]}>
                {section.title}
              </Text>
              {section.content.map((line, lineIndex) => (
                <Text 
                  key={lineIndex} 
                  style={[
                    styles.sectionContent,
                    { 
                      color: isDark ? '#e0e0e0' : '#333333',
                      fontWeight: line.startsWith('•') ? '400' : '500'
                    }
                  ]}
                >
                  {line}
                </Text>
              ))}
            </View>
          ))}
        </ScrollView>

        {/* 하단 버튼 */}
        <View style={[
          styles.modalFooter,
          { borderTopColor: isDark ? '#333333' : '#e0e0e0' }
        ]}>
          <TouchableOpacity
            style={[
              styles.confirmButton,
              { backgroundColor: isDark ? '#4ecdc4' : '#4ecdc4' }
            ]}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.confirmButtonText}>
              확인
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  backgroundTouch: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    width: width * 0.9,
    maxWidth: 400,
    height: height * 0.8,
    maxHeight: 600,
    borderRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    overflow: 'hidden', // 모달 내부 콘텐츠가 모서리를 벗어나지 않도록
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contentHeader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  contentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  versionInfo: {
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    marginBottom: 5,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
  },
  confirmButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
})

export default PolicyModal
