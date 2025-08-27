/**
 * React Native용 로또 페이지
 * 로또 번호 추첨과 히스토리 관리 기능을 제공합니다.
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
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '../contexts/ThemeContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Footer from '../components/Footer'

interface LottoNumber {
  id: string
  numbers: number[]
  bonusNumber: number
  timestamp: Date
  type: 'manual' | 'auto'
}

const LottoPage: React.FC = () => {
  const { isDark } = useTheme()
  const [generatedNumbers, setGeneratedNumbers] = useState<LottoNumber[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const insets = useSafeAreaInsets()

  useEffect(() => {
    loadLottoHistory()
  }, [])

  const loadLottoHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem('lotto_numbers')
      if (stored) {
        const history = JSON.parse(stored)
        setGeneratedNumbers(history.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        })))
      }
    } catch (error) {
      console.error('로또 히스토리 로딩 실패:', error)
    }
  }

  const generateLottoNumbers = async () => {
    setIsGenerating(true)
    
    // 로또 번호 생성 (1-45 중 6개 + 보너스 번호 1개)
    const numbers: number[] = []
    const bonusNumber: number[] = []
    
    // 6개 번호 생성
    while (numbers.length < 6) {
      const num = Math.floor(Math.random() * 45) + 1
      if (!numbers.includes(num)) {
        numbers.push(num)
      }
    }
    
    // 보너스 번호 생성
    while (bonusNumber.length < 1) {
      const num = Math.floor(Math.random() * 45) + 1
      if (!numbers.includes(num) && !bonusNumber.includes(num)) {
        bonusNumber.push(num)
      }
    }
    
    // 정렬
    numbers.sort((a, b) => a - b)
    
    const newLottoNumber: LottoNumber = {
      id: Date.now().toString(),
      numbers,
      bonusNumber: bonusNumber[0],
      timestamp: new Date(),
      type: 'auto'
    }
    
    // 히스토리에 추가
    const updatedHistory = [newLottoNumber, ...generatedNumbers]
    setGeneratedNumbers(updatedHistory)
    
    // AsyncStorage에 저장
    try {
      await AsyncStorage.setItem('lotto_numbers', JSON.stringify(updatedHistory))
    } catch (error) {
      console.error('로또 번호 저장 실패:', error)
    }
    
    setIsGenerating(false)
  }

  const clearHistory = async () => {
    Alert.alert(
      '히스토리 삭제',
      '모든 로또 번호 히스토리를 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            setGeneratedNumbers([])
            try {
              await AsyncStorage.removeItem('lotto_numbers')
            } catch (error) {
              console.error('히스토리 삭제 실패:', error)
            }
          }
        }
      ]
    )
  }

  const NumberDisplay = ({ numbers, bonusNumber }: { numbers: number[]; bonusNumber: number }) => (
    <View style={styles.numberContainer}>
      {numbers.map((num, index) => (
        <View key={index} style={[styles.numberBall, { backgroundColor: '#ff6b6b' }]}>
          <Text style={styles.numberText}>{num}</Text>
        </View>
      ))}
      <View style={[styles.bonusBall, { backgroundColor: '#4ecdc4' }]}>
        <Text style={styles.bonusText}>+{bonusNumber}</Text>
      </View>
    </View>
  )

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingBottom: Math.max(insets.bottom, 20) + 80 } // 탭 바 높이 + 여백
      ]}
    >
      {/* 헤더 */}
      <View style={[styles.header, { backgroundColor: isDark ? '#1e1e1e' : '#ffffff' }]}>
        <Text style={[styles.headerTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
          🎯 로또 번호 추첨
        </Text>
        <Text style={[styles.headerSubtitle, { color: isDark ? '#cccccc' : '#666666' }]}>
          행운의 로또 번호를 생성해보세요
        </Text>
      </View>

      {/* 번호 생성 버튼 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.generateButton, { backgroundColor: '#ff6b6b' }]}
          onPress={generateLottoNumbers}
          disabled={isGenerating}
        >
          <Ionicons name="dice" size={24} color="#ffffff" />
          <Text style={styles.generateButtonText}>
            {isGenerating ? '번호 생성 중...' : '로또 번호 생성'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 최근 생성된 번호 */}
      {generatedNumbers.length > 0 && (
        <View style={[styles.recentSection, { backgroundColor: isDark ? '#1e1e1e' : '#ffffff' }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
            최근 생성된 번호
          </Text>
          <NumberDisplay 
            numbers={generatedNumbers[0].numbers} 
            bonusNumber={generatedNumbers[0].bonusNumber} 
          />
          <Text style={[styles.timestamp, { color: isDark ? '#cccccc' : '#666666' }]}>
            {generatedNumbers[0].timestamp.toLocaleString('ko-KR')}
          </Text>
        </View>
      )}

      {/* 히스토리 버튼 */}
      {generatedNumbers.length > 0 && (
        <View style={styles.historyButtonContainer}>
          <TouchableOpacity
            style={[styles.historyButton, { backgroundColor: '#4ecdc4' }]}
            onPress={() => setShowHistory(true)}
          >
            <Ionicons name="time" size={20} color="#ffffff" />
            <Text style={styles.historyButtonText}>히스토리 보기</Text>
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

      {/* 히스토리 모달 */}
      <Modal
        visible={showHistory}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={[styles.modalContainer, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
          <View style={[styles.modalHeader, { backgroundColor: isDark ? '#1e1e1e' : '#ffffff' }]}>
            <Text style={[styles.modalTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
              로또 번호 히스토리
            </Text>
            <TouchableOpacity onPress={() => setShowHistory(false)}>
              <Ionicons name="close" size={24} color={isDark ? '#ffffff' : '#000000'} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {generatedNumbers.map((lottoNumber, index) => (
              <View key={lottoNumber.id} style={[styles.historyItem, { backgroundColor: isDark ? '#1e1e1e' : '#ffffff' }]}>
                <View style={styles.historyHeader}>
                  <Text style={[styles.historyIndex, { color: isDark ? '#4ecdc4' : '#45b7d1' }]}>
                    #{index + 1}
                  </Text>
                  <Text style={[styles.historyType, { color: isDark ? '#cccccc' : '#666666' }]}>
                    {lottoNumber.type === 'auto' ? '자동' : '수동'}
                  </Text>
                </View>
                <NumberDisplay 
                  numbers={lottoNumber.numbers} 
                  bonusNumber={lottoNumber.bonusNumber} 
                />
                <Text style={[styles.historyTimestamp, { color: isDark ? '#aaaaaa' : '#888888' }]}>
                  {lottoNumber.timestamp.toLocaleString('ko-KR')}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>

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
    marginBottom: 10,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  numberContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  numberBall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    elevation: 2,
  },
  numberText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bonusBall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    elevation: 2,
  },
  bonusText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 14,
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
  historyIndex: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyType: {
    fontSize: 14,
  },
  historyTimestamp: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
  },
})

export default LottoPage
