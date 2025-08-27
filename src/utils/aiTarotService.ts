/**
 * AI 타로카드 해석 서비스
 * Gemini AI API를 사용하여 개인화된 타로카드 해석을 제공합니다.
 */

import Constants from 'expo-constants'
import * as Updates from 'expo-updates'

export interface AITarotRequest {
  question: string
  cards: Array<{
    name: string
    meaning: string
    position: string
  }>
  spreadType: string
  userContext?: string
}

export interface AITarotResponse {
  interpretation: string
  advice: string
  keywords: string[]
  emotionalGuidance: string
  practicalSteps: string[]
  confidence: number
}

export class AITarotService {
  private static readonly GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'
  
  // 환경변수에서 API 키 가져오기 (Updates.manifest.extra 우선)
  private static get API_KEY(): string {
    const fromUpdates = (Updates.manifest as any)?.extra?.GEMINI_API_KEY
    const fromConstants = (Constants.expoConfig?.extra as any)?.GEMINI_API_KEY
    const apiKey = fromUpdates || fromConstants || ''
    return apiKey
  }
  
  /**
   * Gemini AI API 연결 상태 확인
   */
  static async checkConnection(): Promise<boolean> {
    try {
      // API 키가 설정되어 있는지 확인 및 로깅
      const fromUpdates = (Updates.manifest as any)?.extra?.GEMINI_API_KEY
      const fromConstants = (Constants.expoConfig?.extra as any)?.GEMINI_API_KEY
      const apiKey = this.API_KEY
      const masked = apiKey ? `${apiKey.slice(0, 6)}*** (len:${apiKey.length})` : 'EMPTY'
      console.log('[Gemini] key source:', fromUpdates ? 'Updates.manifest.extra' : (fromConstants ? 'Constants.expoConfig.extra' : 'NONE'))
      console.log('[Gemini] key preview:', masked)

      if (!apiKey) {
        console.log('[Gemini] Missing API key')
        return false
      }

      // API 연결 테스트 (간단한 요청으로 확인)
      const testResponse = await fetch(`${this.GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'ping' }] }],
          generationConfig: { maxOutputTokens: 4 }
        })
      })
      console.log('[Gemini] checkConnection status:', testResponse.status, testResponse.ok)
      return testResponse.ok
    } catch (error) {
      console.error('[Gemini] checkConnection error:', error)
      return false
    }
  }

  /**
   * AI 타로카드 해석 생성
   */
  static async generateAIInterpretation(request: AITarotRequest): Promise<AITarotResponse> {
    try {
      const apiKey = this.API_KEY
      if (!apiKey) {
        throw new Error('Gemini API 키가 설정되지 않았습니다. API 키를 설정해주세요.')
      }

      const prompt = this.createTarotPrompt(request)
      const response = await fetch(`${this.GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, topK: 40, topP: 0.95, maxOutputTokens: 1000 }
        })
      })
      console.log('[Gemini] generate status:', response.status, response.ok)

      if (!response.ok) {
        const txt = await response.text().catch(() => '')
        console.warn('[Gemini] generate failed body:', txt)
        throw new Error('AI 해석 생성에 실패했습니다.')
      }

      const data = await response.json()
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text
      if (!aiResponse) {
        console.warn('[Gemini] empty candidates in response:', JSON.stringify(data).slice(0, 300))
        throw new Error('AI 응답을 받지 못했습니다.')
      }

      return this.parseAIResponse(aiResponse, request)
    } catch (error) {
      console.error('[Gemini] generate error:', error)
      return this.generateFallbackInterpretation(request)
    }
  }

  /**
   * 타로카드 해석을 위한 프롬프트 생성
   */
  private static createTarotPrompt(request: AITarotRequest): string {
    const cardDescriptions = request.cards.map(card => 
      `${card.position}: ${card.name} - ${card.meaning}`
    ).join('\n')

    return `당신은 경험 많은 타로카드 리더입니다. 다음 정보를 바탕으로 깊이 있고 개인화된 해석을 제공해주세요.

질문: ${request.question}
스프레드 타입: ${request.spreadType}
${request.userContext ? `사용자 컨텍스트: ${request.userContext}` : ''}

뽑힌 카드들:
${cardDescriptions}

다음 형식으로 해석해주세요:

**전체 해석:**
[카드들의 조합을 통한 전체적인 상황과 에너지 분석]

**상세 해석:**
[각 카드의 위치별 의미와 질문과의 연관성]

**조언:**
[구체적이고 실용적인 조언]

**핵심 키워드:**
[3-5개의 핵심 키워드]

**감정적 가이던스:**
[감정 상태와 마음가짐에 대한 조언]

**실행 단계:**
[구체적인 행동 계획 3단계]

**주의사항:**
[현재 상황에서 주의해야 할 점]

해석은 한국어로 작성하고, 긍정적이면서도 현실적인 관점을 유지해주세요.`
  }

  /**
   * AI 응답을 구조화된 형태로 파싱
   */
  private static parseAIResponse(aiResponse: string, request: AITarotRequest): AITarotResponse {
    try {
      // AI 응답에서 주요 섹션 추출
      const sections = this.extractSections(aiResponse)
      
      // 기본값 생성 함수
      const generateDefaultKeywords = () => {
        const question = request.question.toLowerCase()
        if (question.includes('사랑') || question.includes('연애') || question.includes('관계')) {
          return ['사랑', '이해', '소통', '인내', '성장']
        } else if (question.includes('직업') || question.includes('일') || question.includes('경력')) {
          return ['노력', '학습', '성장', '인내', '성공']
        } else if (question.includes('건강') || question.includes('몸') || question.includes('질병')) {
          return ['건강', '균형', '휴식', '운동', '긍정']
        }
        return ['성찰', '성장', '변화', '직감', '평화']
      }

      const generateDefaultSteps = () => {
        const question = request.question.toLowerCase()
        if (question.includes('사랑') || question.includes('연애') || question.includes('관계')) {
          return [
            '현재 관계 상태를 객관적으로 파악하기',
            '상대방의 입장에서 생각해보기',
            '구체적인 소통 계획 수립하기'
          ]
        } else if (question.includes('직업') || question.includes('일') || question.includes('경력')) {
          return [
            '현재 업무 상황과 목표 정리하기',
            '필요한 기술과 지식 파악하기',
            '단계별 성장 계획 수립하기'
          ]
        } else if (question.includes('건강') || question.includes('몸') || question.includes('질병')) {
          return [
            '현재 건강 상태 점검하기',
            '생활 습관 개선 계획 수립하기',
            '규칙적인 운동과 휴식 실천하기'
          ]
        }
        return [
          '현재 상황을 객관적으로 분석하기',
          '카드의 메시지를 마음에 새기기',
          '구체적인 행동 계획 수립하기'
        ]
      }
      
      return {
        interpretation: sections.interpretation || this.generateBasicInterpretation(request),
        advice: sections.advice || '현재 상황을 차분히 파악하고 신중하게 행동하세요.',
        keywords: sections.keywords || generateDefaultKeywords(),
        emotionalGuidance: sections.emotionalGuidance || '감정에 휘둘리지 말고 객관적인 시각을 유지하세요.',
        practicalSteps: sections.practicalSteps || generateDefaultSteps(),
        confidence: sections.confidence || 0.8
      }
    } catch (error) {
      console.error('AI 응답 파싱 실패:', error)
      return this.generateFallbackInterpretation(request)
    }
  }

  /**
   * AI 응답에서 섹션별 내용 추출
   */
  private static extractSections(aiResponse: string): any {
    const sections: any = {}
    
    // 전체 해석 추출 (더 유연한 패턴)
    const interpretationMatch = aiResponse.match(/(?:전체 해석|해석|리딩):?\s*([\s\S]*?)(?=(?:조언|핵심 키워드|감정적 가이던스|실행 단계|주의사항|\*\*|$))/i)
    if (interpretationMatch) {
      sections.interpretation = interpretationMatch[1].trim()
    }

    // 조언 추출 (더 유연한 패턴)
    const adviceMatch = aiResponse.match(/(?:조언|조언사항|가이드):?\s*([\s\S]*?)(?=(?:핵심 키워드|감정적 가이던스|실행 단계|주의사항|\*\*|$))/i)
    if (adviceMatch) {
      sections.advice = adviceMatch[1].trim()
    }

    // 키워드 추출 (더 유연한 패턴)
    const keywordsMatch = aiResponse.match(/(?:핵심 키워드|키워드|주요 키워드):?\s*([\s\S]*?)(?=(?:감정적 가이던스|실행 단계|주의사항|\*\*|$))/i)
    if (keywordsMatch) {
      const keywordsText = keywordsMatch[1].trim()
      // 다양한 구분자로 키워드 분리
      sections.keywords = keywordsText
        .split(/[,，\n•·\-\s]+/)
        .map(k => k.trim())
        .filter(k => k.length > 0 && k.length < 20) // 너무 긴 텍스트 제외
        .slice(0, 5) // 최대 5개 키워드
    }

    // 감정적 가이던스 추출 (더 유연한 패턴)
    const emotionalMatch = aiResponse.match(/(?:감정적 가이던스|감정 가이던스|마음가짐|감정 상태):?\s*([\s\S]*?)(?=(?:실행 단계|주의사항|\*\*|$))/i)
    if (emotionalMatch) {
      sections.emotionalGuidance = emotionalMatch[1].trim()
    }

    // 실행 단계 추출 (더 유연한 패턴)
    const stepsMatch = aiResponse.match(/(?:실행 단계|행동 계획|실행 계획|단계별 계획):?\s*([\s\S]*?)(?=(?:주의사항|\*\*|$))/i)
    if (stepsMatch) {
      const stepsText = stepsMatch[1].trim()
      // 줄바꿈, 숫자, 글머리 기호 등으로 단계 분리
      sections.practicalSteps = stepsText
        .split(/\n|(?=\d+\.)|(?=•)|(?=\-)/)
        .map(s => s.trim())
        .filter(s => s.length > 0 && s.length < 100) // 너무 긴 텍스트 제외
        .slice(0, 5) // 최대 5개 단계
    }

    // 디버그 로깅 추가
    console.log('[Gemini] Extracted sections:', {
      interpretation: !!sections.interpretation,
      advice: !!sections.advice,
      keywords: sections.keywords?.length || 0,
      emotionalGuidance: !!sections.emotionalGuidance,
      practicalSteps: sections.practicalSteps?.length || 0
    })

    return sections
  }

  /**
   * AI 실패시 기본 해석 생성
   */
  private static generateFallbackInterpretation(request: AITarotRequest): AITarotResponse {
    const cardNames = request.cards.map(card => card.name).join(', ')
    
    return {
      interpretation: `"${request.question}"에 대한 타로카드의 메시지입니다.\n\n선택된 카드: ${cardNames}\n\n이 리딩은 당신의 현재 상황을 반영하며, 내면의 직감과 지혜를 통해 답을 찾을 수 있도록 안내합니다.`,
      advice: '카드의 메시지를 마음에 새기고, 자신의 직감을 신뢰하세요. 때로는 잠시 멈춰서 상황을 돌아보는 것이 도움이 됩니다.',
      keywords: ['직감', '성찰', '성장'],
      emotionalGuidance: '감정의 흐름을 자연스럽게 받아들이고, 내면의 평화를 찾는 시간을 가지세요.',
      practicalSteps: ['현재 상황 정리', '내면의 소리 듣기', '단계별 계획 수립'],
      confidence: 0.6
    }
  }

  /**
   * 기본 해석 생성 (AI 없이)
   */
  private static generateBasicInterpretation(request: AITarotRequest): string {
    const cardNames = request.cards.map(card => card.name).join(', ')
    const spreadName = request.spreadType
    
    return `"${request.question}"에 대한 ${spreadName} 리딩입니다.

선택된 카드들:
${request.cards.map((card, index) => 
  `${card.position}: ${card.name} - ${card.meaning}`
).join('\n')}

이 리딩은 당신의 현재 상황과 질문에 대한 통찰을 제공합니다. 각 카드의 의미를 마음에 새기고, 자신의 직감을 신뢰하세요.`
  }

  /**
   * API 키 설정
   */
  static setAPIKey(apiKey: string): void {
    // 실제 구현시에는 안전한 저장소 사용
    console.log('Gemini API 키가 설정되었습니다.')
  }

  /**
   * 무료 AI 서비스 (API 키 없이 사용 가능)
   */
  static async generateFreeAIInterpretation(request: AITarotRequest): Promise<AITarotResponse> {
    try {
      // 간단한 규칙 기반 해석 생성
      const interpretation = this.generateRuleBasedInterpretation(request)
      
      return {
        interpretation: interpretation.main,
        advice: interpretation.advice,
        keywords: interpretation.keywords,
        emotionalGuidance: interpretation.emotional,
        practicalSteps: interpretation.steps,
        confidence: 0.7
      }
    } catch (error) {
      console.error('무료 AI 해석 생성 실패:', error)
      return this.generateFallbackInterpretation(request)
    }
  }

  /**
   * 규칙 기반 해석 생성 (AI 없이)
   */
  private static generateRuleBasedInterpretation(request: AITarotRequest): any {
    const cards = request.cards
    const question = request.question.toLowerCase()
    
    // 질문 유형별 기본 조언
    let advice = '현재 상황을 차분히 파악하고 신중하게 행동하세요.'
    let emotional = '감정에 휘둘리지 말고 객관적인 시각을 유지하세요.'
    
    if (question.includes('사랑') || question.includes('연애') || question.includes('관계')) {
      advice = '진정한 사랑은 시간과 이해를 필요로 합니다. 서두르지 말고 자연스러운 흐름을 따르세요.'
      emotional = '마음을 열고 상대방의 감정을 이해하려고 노력하세요.'
    } else if (question.includes('직업') || question.includes('일') || question.includes('경력')) {
      advice = '꾸준한 노력과 학습이 성공의 열쇠입니다. 현재 위치에서 최선을 다하세요.'
      emotional = '스트레스를 관리하고 적절한 휴식을 취하세요.'
    } else if (question.includes('건강') || question.includes('몸') || question.includes('질병')) {
      advice = '건강은 가장 소중한 자산입니다. 규칙적인 생활과 운동을 실천하세요.'
      emotional = '긍정적인 마음가짐이 건강에 도움이 됩니다.'
    }

    // 카드별 키워드 추출
    const keywords = cards.map(card => {
      // card 객체에 keywords 속성이 없을 수 있으므로 안전하게 처리
      return '직감'
    }).slice(0, 3)

    // 실행 단계 생성
    const steps = [
      '현재 상황을 객관적으로 분석하기',
      '카드의 메시지를 마음에 새기기',
      '구체적인 행동 계획 수립하기'
    ]

    return {
      main: `"${request.question}"에 대한 타로카드의 메시지입니다.\n\n선택된 카드: ${cards.map(c => c.name).join(', ')}\n\n이 리딩은 당신의 현재 상황을 반영하며, 내면의 직감과 지혜를 통해 답을 찾을 수 있도록 안내합니다.`,
      advice,
      keywords,
      emotional,
      steps
    }
  }
}

/**
 * Hugging Face Inference API를 사용한 대체 AI 서비스
 */
export class HuggingFaceTarotService {
  private static readonly API_URL = 'https://api-inference.huggingface.co/models/'
  private static readonly DEFAULT_MODEL = 'microsoft/DialoGPT-medium'
  
  /**
   * Hugging Face API를 사용한 타로카드 해석
   */
  static async generateInterpretation(request: AITarotRequest): Promise<AITarotResponse> {
    try {
      // 무료 API 사용시 제한이 있을 수 있음
      const prompt = this.createPrompt(request)
      
      // 실제 구현시 Hugging Face API 키 필요
      // const response = await fetch(`${this.API_URL}${this.DEFAULT_MODEL}`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${API_KEY}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({ inputs: prompt })
      // })
      
      // 임시로 기본 해석 반환
      return AITarotService.generateFreeAIInterpretation(request)
    } catch (error) {
      console.error('Hugging Face API 호출 실패:', error)
      return AITarotService.generateFreeAIInterpretation(request)
    }
  }

  private static createPrompt(request: AITarotRequest): string {
    return `Tarot reading for: ${request.question}\nCards: ${request.cards.map(c => c.name).join(', ')}`
  }
}


