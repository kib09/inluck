/**
 * React Native용 운세 페이지
 * 별자리별 오늘의 운세와 운세 히스토리를 제공합니다.
 */

import React, { useState, useEffect } from 'react'
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert,
  Modal 
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../contexts/ThemeContext'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface ZodiacSign {
  id: string
  name: string
  symbol: string
  dateRange: string
  element: string
  luckyColor: string
  luckyNumber: number
}

interface FortuneReading {
  id: string
  zodiacSign: string
  date: string
  overall: string
  love: string
  career: string
  health: string
  wealth: string
  timestamp: Date
}

const FortunePage: React.FC = () => {
  const { isDark } = useTheme()
  const [selectedZodiac, setSelectedZodiac] = useState<ZodiacSign | null>(null)
  const [fortuneHistory, setFortuneHistory] = useState<FortuneReading[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const zodiacSigns: ZodiacSign[] = [
    { id: 'aries', name: '양자리', symbol: '♈', dateRange: '3.21 ~ 4.19', element: '불', luckyColor: '빨간색', luckyNumber: 9 },
    { id: 'taurus', name: '황소자리', symbol: '♉', dateRange: '4.20 ~ 5.20', element: '땅', luckyColor: '초록색', luckyNumber: 6 },
    { id: 'gemini', name: '쌍둥이자리', symbol: '♊', dateRange: '5.21 ~ 6.21', element: '공기', luckyColor: '노란색', luckyNumber: 5 },
    { id: 'cancer', name: '게자리', symbol: '♋', dateRange: '6.22 ~ 7.22', element: '물', luckyColor: '은색', luckyNumber: 2 },
    { id: 'leo', name: '사자자리', symbol: '♌', dateRange: '7.23 ~ 8.22', element: '불', luckyColor: '주황색', luckyNumber: 1 },
    { id: 'virgo', name: '처녀자리', symbol: '♍', dateRange: '8.23 ~ 9.22', element: '땅', luckyColor: '갈색', luckyNumber: 5 },
    { id: 'libra', name: '천칭자리', symbol: '♎', dateRange: '9.23 ~ 10.23', element: '공기', luckyColor: '파란색', luckyNumber: 6 },
    { id: 'scorpio', name: '전갈자리', symbol: '♏', dateRange: '10.24 ~ 11.22', element: '물', luckyColor: '보라색', luckyNumber: 8 },
    { id: 'sagittarius', name: '사수자리', symbol: '♐', dateRange: '11.23 ~ 12.21', element: '불', luckyColor: '보라색', luckyNumber: 3 },
    { id: 'capricorn', name: '염소자리', symbol: '♑', dateRange: '12.22 ~ 1.19', element: '땅', luckyColor: '검은색', luckyNumber: 4 },
    { id: 'aquarius', name: '물병자리', symbol: '♒', dateRange: '1.20 ~ 2.18', element: '공기', luckyColor: '하늘색', luckyNumber: 7 },
    { id: 'pisces', name: '물고기자리', symbol: '♓', dateRange: '2.19 ~ 3.20', element: '물', luckyColor: '하늘색', luckyNumber: 11 }
  ]

  useEffect(() => {
    loadFortuneHistory()
  }, [])

  const loadFortuneHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem('fortune_history')
      if (stored) {
        const history = JSON.parse(stored)
        setFortuneHistory(history.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        })))
      }
    } catch (error) {
      console.error('운세 히스토리 로딩 실패:', error)
    }
  }

  const generateFortune = async () => {
    if (!selectedZodiac) {
      Alert.alert('알림', '별자리를 선택해주세요.')
      return
    }

    setIsGenerating(true)

    // 운세 생성 로직
    const fortunes = {
      overall: generateOverallFortune(),
      love: generateLoveFortune(),
      career: generateCareerFortune(),
      health: generateHealthFortune(),
      wealth: generateWealthFortune()
    }

    const newFortune: FortuneReading = {
      id: Date.now().toString(),
      zodiacSign: selectedZodiac.name,
      date: new Date().toLocaleDateString('ko-KR'),
      ...fortunes,
      timestamp: new Date()
    }

    // 히스토리에 추가
    const updatedHistory = [newFortune, ...fortuneHistory]
    setFortuneHistory(updatedHistory)

    // AsyncStorage에 저장
    try {
      await AsyncStorage.setItem('fortune_history', JSON.stringify(updatedHistory))
    } catch (error) {
      console.error('운세 저장 실패:', error)
    }

    setIsGenerating(false)
    Alert.alert('운세 생성 완료!', `${selectedZodiac.name}의 오늘 운세가 생성되었습니다.`)
  }

  const generateOverallFortune = (): string => {
    const fortunes = [
      '오늘은 행운이 가득한 날입니다. 새로운 기회를 놓치지 마세요.',
      '차분하게 상황을 파악하고 신중하게 행동하는 것이 좋겠습니다.',
      '주변 사람들과의 소통이 중요한 하루입니다.',
      '창의적인 아이디어가 떠오르는 날입니다. 기록해두세요.',
      '건강에 특별히 신경 쓰는 것이 좋겠습니다.',
      '금전적으로 좋은 소식이 있을 수 있습니다.',
      '학습과 성장에 집중하면 좋은 결과를 얻을 수 있습니다.',
      '가족과의 시간을 가지는 것이 행복을 가져다 줄 것입니다.'
    ]
    return fortunes[Math.floor(Math.random() * fortunes.length)]
  }

  const generateLoveFortune = (): string => {
    const fortunes = [
      '로맨틱한 만남이 기다리고 있습니다.',
      '기존 관계가 더욱 깊어질 수 있는 날입니다.',
      '솔직한 대화가 관계 개선의 열쇠입니다.',
      '자신을 사랑하는 것이 우선입니다.',
      '새로운 인연을 만날 수 있는 기회가 있습니다.',
      '과거의 상처를 치유하는 시간을 가지세요.',
      '로맨틱한 데이트를 계획해보세요.',
      '마음을 열고 소통하는 것이 중요합니다.'
    ]
    return fortunes[Math.floor(Math.random() * fortunes.length)]
  }

  const generateCareerFortune = (): string => {
    const fortunes = [
      '업무에서 인정받을 수 있는 기회가 있습니다.',
      '새로운 프로젝트에 도전해보세요.',
      '동료들과의 협력이 성공의 열쇠입니다.',
      '창의적인 아이디어를 제안해보세요.',
      '차근차근 계획을 세우고 실행하세요.',
      '네트워킹이 중요한 날입니다.',
      '새로운 기술을 배우는 것이 좋겠습니다.',
      '리더십을 발휘할 수 있는 기회가 있습니다.'
    ]
    return fortunes[Math.floor(Math.random() * fortunes.length)]
  }

  const generateHealthFortune = (): string => {
    const fortunes = [
      '규칙적인 운동이 건강에 도움이 됩니다.',
      '충분한 휴식을 취하는 것이 중요합니다.',
      '건강한 식습관을 유지하세요.',
      '스트레스 관리에 신경 쓰세요.',
      '새로운 운동을 시작해보세요.',
      '정기적인 건강검진을 받는 것이 좋겠습니다.',
      '마음의 평화를 찾는 시간을 가지세요.',
      '자연과 함께하는 시간이 건강에 도움이 됩니다.'
    ]
    return fortunes[Math.floor(Math.random() * fortunes.length)]
  }

  const generateWealthFortune = (): string => {
    const fortunes = [
      '투자에 신중하게 접근하세요.',
      '예산 관리가 중요한 날입니다.',
      '새로운 수입원을 찾아볼 수 있습니다.',
      '지출을 줄이는 것이 좋겠습니다.',
      '금융 상담을 받아보는 것이 도움이 됩니다.',
      '저축에 집중하는 것이 좋겠습니다.',
      '부업을 고려해볼 수 있는 날입니다.',
      '재정 계획을 세우는 것이 중요합니다.'
    ]
    return fortunes[Math.floor(Math.random() * fortunes.length)]
  }

  const clearHistory = async () => {
    Alert.alert(
      '히스토리 삭제',
      '모든 운세 히스토리를 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            setFortuneHistory([])
            try {
              await AsyncStorage.removeItem('fortune_history')
            } catch (error) {
              console.error('히스토리 삭제 실패:', error)
            }
          }
        }
      ]
    )
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* 헤더 */}
      <View style={[styles.header, { backgroundColor: isDark ? '#1e1e1e' : '#ffffff' }]}>
        <Text style={[styles.headerTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
          ⭐ 오늘의 운세
        </Text>
        <Text style={[styles.headerSubtitle, { color: isDark ? '#cccccc' : '#666666' }]}>
          별자리별 오늘의 운세를 확인해보세요
        </Text>
      </View>

      {/* 별자리 선택 */}
      <View style={[styles.section, { backgroundColor: isDark ? '#1e1e1e' : '#ffffff' }]}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
          별자리 선택
        </Text>
        <View style={styles.zodiacGrid}>
          {zodiacSigns.map((zodiac) => (
            <TouchableOpacity
              key={zodiac.id}
              style={[
                styles.zodiacItem,
                selectedZodiac?.id === zodiac.id && { borderColor: '#4ecdc4', borderWidth: 1 }
              ]}
              onPress={() => setSelectedZodiac(zodiac)}
            >
              <Text style={styles.zodiacSymbol}>{zodiac.symbol}</Text>
              <Text style={[styles.zodiacName, { color: '#000000'  }]}>
                {zodiac.name}
              </Text>
              <Text style={[styles.zodiacDate, { color:'#666666'  }]}>
                {zodiac.dateRange}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 운세 생성 버튼 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.generateButton, { backgroundColor: '#4ecdc4' }]}
          onPress={generateFortune}
          disabled={!selectedZodiac || isGenerating}
        >
          <Ionicons name="star" size={24} color="#ffffff" />
          <Text style={styles.generateButtonText}>
            {isGenerating ? '운세 생성 중...' : '운세 생성하기'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 최근 운세 */}
      {fortuneHistory.length > 0 && (
        <View style={[styles.recentSection, { backgroundColor: isDark ? '#1e1e1e' : '#ffffff' }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
            최근 운세
          </Text>
          <View style={styles.fortuneCard}>
            <Text style={[styles.fortuneZodiac, { color: isDark ? '#4ecdc4' : '#45b7d1' }]}>
              {fortuneHistory[0].zodiacSign}
            </Text>
            <Text style={[styles.fortuneDate, { color: isDark ? '#cccccc' : '#666666' }]}>
              {fortuneHistory[0].date}
            </Text>
            <Text style={[styles.fortuneText, { color: isDark ? '#ffffff' : '#000000' }]}>
              {fortuneHistory[0].overall}
            </Text>
          </View>
        </View>
      )}

      {/* 히스토리 버튼 */}
      {fortuneHistory.length > 0 && (
        <View style={styles.historyButtonContainer}>
          <TouchableOpacity
            style={[styles.historyButton, { backgroundColor: '#4ecdc4' }]}
            onPress={() => setShowHistory(true)}
          >
            <Ionicons name="time" size={20} color="#ffffff" />
            <Text style={styles.historyButtonText}>운세 히스토리</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.clearButton, { backgroundColor: '#ff6b6b' }]}
            onPress={clearHistory}
          >
            <Ionicons name="trash" size={20} color="#ffffff" />
            <Text style={styles.clearButtonText}>히스토리 삭제</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 운세 히스토리 모달 */}
      <Modal
        visible={showHistory}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={[styles.modalContainer, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
          <View style={[styles.modalHeader, { backgroundColor: isDark ? '#1e1e1e' : '#ffffff' }]}>
            <Text style={[styles.modalTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
              운세 히스토리
            </Text>
            <TouchableOpacity onPress={() => setShowHistory(false)}>
              <Ionicons name="close" size={24} color={isDark ? '#ffffff' : '#000000'} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {fortuneHistory.map((fortune, index) => (
              <View key={fortune.id} style={[styles.historyItem, { backgroundColor: isDark ? '#1e1e1e' : '#ffffff' }]}>
                <View style={styles.historyHeader}>
                  <Text style={[styles.historyZodiac, { color: isDark ? '#4ecdc4' : '#45b7d1' }]}>
                    {fortune.zodiacSign}
                  </Text>
                  <Text style={[styles.historyDate, { color: isDark ? '#cccccc' : '#666666' }]}>
                    {fortune.date}
                  </Text>
                </View>
                
                <View style={styles.fortuneDetails}>
                  <View style={styles.fortuneRow}>
                    <Text style={[styles.fortuneLabel, { color: isDark ? '#4ecdc4' : '#45b7d1' }]}>
                      전체운세:
                    </Text>
                    <Text style={[styles.fortuneDetailText, { color: isDark ? '#ffffff' : '#000000' }]}>
                      {fortune.overall}
                    </Text>
                  </View>
                  <View style={styles.fortuneRow}>
                    <Text style={[styles.fortuneLabel, { color: isDark ? '#4ecdc4' : '#45b7d1' }]}>
                      연애운:
                    </Text>
                    <Text style={[styles.fortuneDetailText, { color: isDark ? '#ffffff' : '#000000' }]}>
                      {fortune.love}
                    </Text>
                  </View>
                  <View style={styles.fortuneRow}>
                    <Text style={[styles.fortuneLabel, { color: isDark ? '#4ecdc4' : '#45b7d1' }]}>
                      직업운:
                    </Text>
                    <Text style={[styles.fortuneDetailText, { color: isDark ? '#ffffff' : '#000000' }]}>
                      {fortune.career}
                    </Text>
                  </View>
                  <View style={styles.fortuneRow}>
                    <Text style={[styles.fortuneLabel, { color: isDark ? '#4ecdc4' : '#45b7d1' }]}>
                      건강운:
                    </Text>
                    <Text style={[styles.fortuneDetailText, { color: isDark ? '#ffffff' : '#000000' }]}>
                      {fortune.health}
                    </Text>
                  </View>
                  <View style={styles.fortuneRow}>
                    <Text style={[styles.fortuneLabel, { color: isDark ? '#4ecdc4' : '#45b7d1' }]}>
                      금전운:
                    </Text>
                    <Text style={[styles.fortuneDetailText, { color: isDark ? '#ffffff' : '#000000' }]}>
                      {fortune.wealth}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>
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
  header: {
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  section: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  zodiacGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  zodiacItem: {
    width: '30%',
    padding: 15,
    marginBottom: 15,
    borderRadius: 15,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    alignItems: 'center',
  },
  zodiacSymbol: {
    fontSize: 32,
    marginBottom: 8,
  },
  zodiacName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  zodiacDate: {
    fontSize: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  generateButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
    borderRadius: 15,
    elevation: 3,
  },
  generateButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  recentSection: {
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
  fortuneCard: {
    alignItems: 'center',
  },
  fortuneZodiac: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  fortuneDate: {
    fontSize: 14,
    marginBottom: 15,
  },
  fortuneText: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
  historyButtonContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  historyButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
  },
  historyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  clearButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
  },
  clearButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  historyItem: {
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
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  historyZodiac: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  historyDate: {
    fontSize: 14,
  },
  fortuneDetails: {
    gap: 10,
  },
  fortuneRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  fortuneLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    width: 60,
    marginRight: 10,
  },
  fortuneDetailText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
})

export default FortunePage
