/**
 * React Native용 타로카드 페이지
 * 타로카드 리딩과 AI 해석 기능을 제공합니다.
 */

import React, { useState, useEffect } from 'react'
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert,
  Modal,
  TextInput 
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../contexts/ThemeContext'
import { TarotDataAPI, TarotCard, TarotSpread, TarotHistoryManager, TarotReading } from '../utils/tarotAPI'
import { AITarotService, AITarotRequest, AITarotResponse } from '../utils/aiTarotService'

const TarotPage: React.FC = () => {
  const { isDark } = useTheme()
  const [cards, setCards] = useState<TarotCard[]>([])
  const [spreads, setSpreads] = useState<TarotSpread[]>([])
  const [selectedSpread, setSelectedSpread] = useState<TarotSpread | null>(null)
  const [drawnCards, setDrawnCards] = useState<TarotCard[]>([])
  const [question, setQuestion] = useState('')
  const [userContext, setUserContext] = useState('')
  const [interpretation, setInterpretation] = useState('')
  const [aiResponse, setAiResponse] = useState<AITarotResponse | null>(null)
  const [showReading, setShowReading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showQuestionInput, setShowQuestionInput] = useState(false)
  const [showContextInput, setShowContextInput] = useState(false)
  const [useAI, setUseAI] = useState(false)
  const [aiConnectionStatus, setAiConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking')

  useEffect(() => {
    loadTarotData()
    checkAIConnection()
  }, [])

  const loadTarotData = async () => {
    try {
      setIsLoading(true)
      const [cardsData, spreadsData] = await Promise.all([
        TarotDataAPI.getTarotDataset(),
        Promise.resolve(TarotDataAPI.getTarotSpreads())
      ])
      setCards(cardsData)
      setSpreads(spreadsData)
    } catch (error) {
      console.error('타로 데이터 로딩 실패:', error)
      Alert.alert('오류', '타로 데이터를 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const checkAIConnection = async () => {
    try {
      const isConnected = await AITarotService.checkConnection()
      setAiConnectionStatus(isConnected ? 'connected' : 'disconnected')
    } catch (error) {
      console.error('AI 연결 상태 확인 실패:', error)
      setAiConnectionStatus('disconnected')
    }
  }

  const drawCards = async () => {
    if (!selectedSpread) {
      Alert.alert('알림', '스프레드를 선택해주세요.')
      return
    }

    if (!question.trim()) {
      Alert.alert('알림', '질문을 입력해주세요.')
      return
    }

    setIsLoading(true)

    try {
      // 랜덤으로 카드 선택
      const shuffled = [...cards].sort(() => Math.random() - 0.5)
      const selected = shuffled.slice(0, selectedSpread.cardCount)
      setDrawnCards(selected)

      let interpretationText = ''
      let aiResult: AITarotResponse | null = null

      // AI 요청 데이터 생성
      const aiRequest: AITarotRequest = {
        question,
        cards: selected.map((card, index) => ({
          name: card.name,
          meaning: card.meaning,
          position: selectedSpread.positions[index] || `카드 ${index + 1}`
        })),
        spreadType: selectedSpread.name,
        userContext: userContext.trim() || undefined
      }

      if (useAI) {
        try {
          // Gemini API 연결 상태에 따라 다른 해석 사용
          if (aiConnectionStatus === 'connected') {
            // Gemini AI 해석 사용
            aiResult = await AITarotService.generateAIInterpretation(aiRequest)
            interpretationText = aiResult.interpretation
            setAiResponse(aiResult)
          } else {
            // 규칙 기반 AI 해석 사용
            aiResult = await AITarotService.generateFreeAIInterpretation(aiRequest)
            interpretationText = aiResult.interpretation
            setAiResponse(aiResult)
          }
        } catch (error) {
          console.error('AI 해석 실패:', error)
          // AI 실패시 기본 해석 사용
          interpretationText = TarotDataAPI.generateInterpretation(
            selected, 
            question, 
            selectedSpread.id
          )
          setAiResponse(null)
        }
      } else {
        // 기본 해석 생성
        interpretationText = TarotDataAPI.generateInterpretation(
          selected, 
          question, 
          selectedSpread.id
        )
        setAiResponse(null)
      }

      setInterpretation(interpretationText)
      setShowReading(true)

      // 히스토리에 저장
      const reading: TarotReading = {
        id: Date.now().toString(),
        type: selectedSpread.name,
        question,
        cards: selected,
        timestamp: new Date(),
        interpretation: interpretationText
      }
      TarotHistoryManager.saveReading(reading)
    } catch (error) {
      console.error('카드 뽑기 실패:', error)
      Alert.alert('오류', '카드를 뽑는 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const resetReading = () => {
    setDrawnCards([])
    setQuestion('')
    setUserContext('')
    setInterpretation('')
    setAiResponse(null)
    setSelectedSpread(null)
    setShowReading(false)
  }

  const handleQuestionSubmit = () => {
    if (question.trim()) {
      setShowQuestionInput(false)
    }
  }

  const handleContextSubmit = () => {
    setShowContextInput(false)
  }

  const CardDisplay = ({ card, position }: { card: TarotCard; position: string }) => (
    <View style={[styles.cardContainer, { backgroundColor: isDark ? '#1e1e1e' : '#ffffff' }]}>
      <Text style={[styles.cardPosition, { color: isDark ? '#4ecdc4' : '#45b7d1' }]}>
        {position}
      </Text>
      <Text style={styles.cardEmoji}>{card.image}</Text>
      <Text style={[styles.cardName, { color: isDark ? '#ffffff' : '#000000' }]}>
        {card.name}
      </Text>
      <Text style={[styles.cardMeaning, { color: isDark ? '#cccccc' : '#666666' }]}>
        {card.meaning}
      </Text>
    </View>
  )

  

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* 헤더 */}
      <View style={[styles.header, { backgroundColor: isDark ? '#1e1e1e' : '#ffffff' }]}>
        <Text style={[styles.headerTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
          🔮 타로카드 리딩
        </Text>
        <Text style={[styles.headerSubtitle, { color: isDark ? '#cccccc' : '#666666' }]}>
          신비로운 타로카드로 미래를 탐험하세요
        </Text>
      </View>

      {/* AI 사용 옵션 */}
      <View style={[styles.section, { backgroundColor: isDark ? '#1e1e1e' : '#ffffff' }]}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
          AI 해석 옵션
        </Text>
        <TouchableOpacity
          style={[
            styles.aiToggleButton,
            useAI && { backgroundColor: isDark ? '#4ecdc4' : '#4ecdc4' }
          ]}
          onPress={() => setUseAI(!useAI)}

        >
          <Ionicons 
            name={useAI ? 'sparkles' : 'sparkles-outline'} 
            size={20} 
            color={useAI ? '#ffffff' : (isDark ? '#cccccc' : '#666666')} 
          />
          <Text style={[
            styles.aiToggleText, 
            { color: useAI ? '#ffffff' : (isDark ? '#cccccc' : '#666666') }
          ]}>
            {useAI ? '지능형 해석 사용 중' : '지능형 해석 사용'}
          </Text>
        </TouchableOpacity>
        {useAI && (
          <Text style={[styles.aiDescription, { color: isDark ? '#cccccc' : '#666666' }]}>
            AI가 질문과 카드를 분석하여 개인화된 해석을 제공합니다
          </Text>
        )}
      </View>

      {/* 스프레드 선택 */}
      <View style={[styles.section, { backgroundColor: isDark ? '#1e1e1e' : '#ffffff' }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
            스프레드 선택
          </Text>
          <Text style={[styles.spreadCountInfo, { color: isDark ? '#cccccc' : '#666666' }]}>
            총 {spreads.length}개 스프레드
          </Text>
        </View>
        <Text style={[styles.spreadHint, { color: isDark ? '#cccccc' : '#666666' }]}>
          좌우로 스와이프하여 더 많은 스프레드를 확인하세요
        </Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.spreadScrollContainer}
        >
          {spreads.map((spread) => (
            <TouchableOpacity
              key={spread.id}
              style={[
                styles.spreadOption,
                selectedSpread?.id === spread.id && { borderColor: '#4ecdc4', borderWidth: 1 }
              ]}
              onPress={() => setSelectedSpread(spread)}
            >
              <Text style={[styles.spreadName, { color: '#000000' }]}>
                {spread.name}
              </Text>
              <Text style={[styles.spreadDescription, { color: '#666666' }]}>
                {spread.description}
              </Text>
              <Text style={[styles.spreadCount, { color: isDark ? '#4ecdc4' : '#45b7d1' }]}>
                🃏 {spread.cardCount}장
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
       
      </View>

      {/* 질문 입력 */}
      <View style={[styles.section, { backgroundColor: isDark ? '#1e1e1e' : '#ffffff' }]}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
          질문 입력
        </Text>
        <Text style={[styles.questionHint, { color: isDark ? '#cccccc' : '#666666' }]}>
          궁금한 내용을 자세히 적어주세요
        </Text>
        
        {showQuestionInput ? (
          <View style={styles.questionInputContainer}>
            <TextInput
              style={[
                styles.questionTextInput,
                { 
                  backgroundColor: isDark ? '#2a2a2a' : '#f0f0f0',
                  color: isDark ? '#ffffff' : '#000000',
                  borderColor: isDark ? '#4ecdc4' : '#45b7d1'
                }
              ]}
              placeholder="질문을 입력하세요..."
              placeholderTextColor={isDark ? '#666666' : '#999999'}
              value={question}
              onChangeText={setQuestion}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            <View style={styles.questionInputButtons}>
              <TouchableOpacity
                style={[styles.questionSubmitButton, { backgroundColor: '#4ecdc4' }]}
                onPress={handleQuestionSubmit}
              >
                <Text style={styles.questionSubmitButtonText}>확인</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.questionCancelButton, { backgroundColor: '#666666' }]}
                onPress={() => setShowQuestionInput(false)}
              >
                <Text style={styles.questionCancelButtonText}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.questionInput, { backgroundColor: isDark ? '#2a2a2a' : '#f0f0f0' }]}
            onPress={() => setShowQuestionInput(true)}
          >
            <Text style={[styles.questionText, { color: question ? (isDark ? '#ffffff' : '#000000') : '#999999' }]}>
              {question || '질문을 입력하세요...'}
            </Text>
            <Ionicons name="create" size={20} color="#999999" />
          </TouchableOpacity>
        )}
      </View>

      {/* 사용자 컨텍스트 입력 (AI 사용시) */}
      {useAI && (
        <View style={[styles.section, { backgroundColor: isDark ? '#1e1e1e' : '#ffffff' }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
            추가 정보 (선택사항)
          </Text>
          <Text style={[styles.contextHint, { color: isDark ? '#cccccc' : '#666666' }]}>
            현재 상황이나 배경 정보를 추가하면 더 정확한 AI 해석을 받을 수 있습니다
          </Text>
          
          {showContextInput ? (
            <View style={styles.contextInputContainer}>
              <TextInput
                style={[
                  styles.contextTextInput,
                  { 
                    backgroundColor: isDark ? '#2a2a2a' : '#f0f0f0',
                    color: isDark ? '#ffffff' : '#000000',
                    borderColor: isDark ? '#4ecdc4' : '#45b7d1'
                  }
                ]}
                placeholder="현재 상황이나 배경 정보를 입력하세요..."
                placeholderTextColor={isDark ? '#666666' : '#999999'}
                value={userContext}
                onChangeText={setUserContext}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
              <View style={styles.contextInputButtons}>
                <TouchableOpacity
                  style={[styles.contextSubmitButton, { backgroundColor: '#4ecdc4' }]}
                  onPress={handleContextSubmit}
                >
                  <Text style={styles.contextSubmitButtonText}>확인</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.contextCancelButton, { backgroundColor: '#666666' }]}
                  onPress={() => setShowContextInput(false)}
                >
                  <Text style={styles.contextCancelButtonText}>취소</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.contextInput, { backgroundColor: isDark ? '#2a2a2a' : '#f0f0f0' }]}
              onPress={() => setShowContextInput(true)}
            >
              <Text style={[styles.contextText, { color: userContext ? (isDark ? '#ffffff' : '#000000') : '#999999' }]}>
                {userContext || '추가 정보를 입력하세요...'}
              </Text>
              <Ionicons name="information-circle" size={20} color="#999999" />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* 카드 뽑기 버튼 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.drawButton, { backgroundColor: '#4ecdc4' }]}
          onPress={drawCards}
          disabled={!selectedSpread || !question.trim() || isLoading}
        >
          <Ionicons name="shuffle" size={24} color="#ffffff" />
          <Text style={styles.drawButtonText}>
            {isLoading ? '카드 뽑는 중...' : '카드 뽑기'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 카드 리딩 결과 모달 */}
      <Modal
        visible={showReading}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={[styles.modalContainer, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
          <View style={[styles.modalHeader, { backgroundColor: isDark ? '#1e1e1e' : '#ffffff' }]}>
            <Text style={[styles.modalTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
              타로카드 리딩 결과
            </Text>
            <TouchableOpacity onPress={() => setShowReading(false)}>
              <Ionicons name="close" size={24} color={isDark ? '#ffffff' : '#000000'} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* 질문 */}
            <View style={[styles.questionSection, { backgroundColor: isDark ? '#1e1e1e' : '#ffffff' }]}>
              <Text style={[styles.questionLabel, { color: isDark ? '#4ecdc4' : '#45b7d1' }]}>
                질문
              </Text>
              <Text style={[styles.questionDisplay, { color: isDark ? '#ffffff' : '#000000' }]}>
                {question}
              </Text>
            </View>

            {/* 뽑힌 카드들 */}
            <View style={styles.cardsSection}>
              <Text style={[styles.cardsTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
                뽑힌 카드
              </Text>
              {drawnCards.map((card, index) => (
                <CardDisplay
                  key={index}
                  card={card}
                  position={selectedSpread?.positions[index] || `카드 ${index + 1}`}
                />
              ))}
            </View>

            {/* AI 해석 결과 */}
            {aiResponse && (
              <View style={[styles.aiSection, { backgroundColor: isDark ? '#1e1e1e' : '#ffffff' }]}>
                <View style={styles.aiHeader}>
                  <Ionicons name="sparkles" size={24} color="#4ecdc4" />
                  <Text style={[styles.aiSectionTitle, { color: isDark ? '#4ecdc4' : '#45b7d1' }]}>
                    AI 해석 결과
                  </Text>
                </View>
                
                {/* 조언 */}
                <View style={styles.aiContent}>
                  <Text style={[styles.aiLabel, { color: isDark ? '#4ecdc4' : '#45b7d1' }]}>
                    조언
                  </Text>
                  <Text style={[styles.aiText, { color: isDark ? '#ffffff' : '#000000' }]}>
                    {aiResponse.advice}
                  </Text>
                </View>

                {/* 키워드 */}
                <View style={styles.aiContent}>
                  <Text style={[styles.aiLabel, { color: isDark ? '#4ecdc4' : '#45b7d1' }]}>
                    핵심 키워드
                  </Text>
                  <View style={styles.keywordsContainer}>
                    {aiResponse.keywords.map((keyword, index) => (
                      <View key={index} style={[styles.keywordTag, { backgroundColor: '#4ecdc4' }]}>
                        <Text style={styles.keywordText}>{keyword}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* 감정적 가이던스 */}
                <View style={styles.aiContent}>
                  <Text style={[styles.aiLabel, { color: isDark ? '#4ecdc4' : '#45b7d1' }]}>
                    감정적 가이던스
                  </Text>
                  <Text style={[styles.aiText, { color: isDark ? '#ffffff' : '#000000' }]}>
                    {aiResponse.emotionalGuidance}
                  </Text>
                </View>

                {/* 실행 단계 */}
                <View style={styles.aiContent}>
                  <Text style={[styles.aiLabel, { color: isDark ? '#4ecdc4' : '#45b7d1' }]}>
                    실행 단계
                  </Text>
                  {aiResponse.practicalSteps.map((step, index) => (
                    <View key={index} style={styles.stepContainer}>
                      <Text style={[styles.stepNumber, { color: '#4ecdc4' }]}>
                        {index + 1}
                      </Text>
                      <Text style={[styles.stepText, { color: isDark ? '#ffffff' : '#000000' }]}>
                        {step}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* 기본 해석 */}
            <View style={[styles.interpretationSection, { backgroundColor: isDark ? '#1e1e1e' : '#ffffff' }]}>
              <Text style={[styles.interpretationTitle, { color: isDark ? '#4ecdc4' : '#45b7d1' }]}>
                {aiResponse ? '기본 해석' : '해석'}
              </Text>
              <Text style={[styles.interpretationText, { color: isDark ? '#ffffff' : '#000000' }]}>
                {interpretation}
              </Text>
            </View>
          </ScrollView>

          {/* 모달 하단 버튼 */}
          <View style={[styles.modalFooter, { backgroundColor: isDark ? '#1e1e1e' : '#ffffff' }]}>
            <TouchableOpacity
              style={[styles.resetButton, { backgroundColor: '#ff6b6b' }]}
              onPress={resetReading}
            >
              <Text style={styles.resetButtonText}>새로운 리딩</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: '#666666' }]}
              onPress={() => setShowReading(false)}
            >
              <Text style={styles.closeButtonText}>닫기</Text>
            </TouchableOpacity>
          </View>
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
    marginBottom: 10,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,

    textAlign: 'center',
  },
  aiStatusContainer: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
  },
  aiStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  aiStatusText: {
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '500',
  },
  aiStatusHelp: {
    fontSize: 12,
    fontStyle: 'italic',
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
    marginBottom: 15,
  },
  aiToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  aiToggleText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  aiDescription: {
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  spreadCountInfo: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  spreadHint: {
    fontSize: 12,
    marginBottom: 15,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  spreadScrollContainer: {
    paddingRight: 20,
  },
  spreadOption: {
    width: 150,
    padding: 20,
    marginRight: 15,
    borderRadius: 15,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  spreadName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  spreadDescription: {
    fontSize: 12,
    marginBottom: 10,
    lineHeight: 16,
  },
  spreadCount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  spreadNavigation: {
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 8,
  },
  spreadNavigationText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  questionHint: {
    fontSize: 14,
    marginBottom: 15,
  },
  questionInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
  },
  questionText: {
    fontSize: 16,
    flex: 1,
  },
  questionInputContainer: {
    gap: 15,
  },
  questionTextInput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    minHeight: 80,
  },
  questionInputButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  questionSubmitButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  questionSubmitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  questionCancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  questionCancelButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contextHint: {
    fontSize: 14,
    marginBottom: 15,
  },
  contextInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
  },
  contextText: {
    fontSize: 16,
    flex: 1,
  },
  contextInputContainer: {
    gap: 15,
  },
  contextTextInput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    minHeight: 80,
  },
  contextInputButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  contextSubmitButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  contextSubmitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contextCancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  contextCancelButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  drawButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
    borderRadius: 15,
    elevation: 3,
  },
  drawButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
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
  questionSection: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  questionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  questionDisplay: {
    fontSize: 16,
    lineHeight: 22,
  },
  cardsSection: {
    marginBottom: 20,
  },
  cardsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  cardContainer: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardPosition: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardEmoji: {
    fontSize: 48,
    marginBottom: 15,
  },
  cardName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  cardMeaning: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  aiSection: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  aiSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  aiContent: {
    marginBottom: 20,
  },
  aiLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  aiText: {
    fontSize: 16,
    lineHeight: 22,
  },
  keywordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  keywordTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  keywordText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
    minWidth: 20,
  },
  stepText: {
    fontSize: 16,
    lineHeight: 22,
    flex: 1,
  },
  interpretationSection: {
    padding: 20,
    borderRadius: 15,
  },
  interpretationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  interpretationText: {
    fontSize: 16,
    lineHeight: 24,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  resetButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})

export default TarotPage
