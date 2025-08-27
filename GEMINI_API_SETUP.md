# 🔮 Gemini AI API 설정 가이드

## 📋 **개요**
inluck 앱의 타로카드 해석 기능을 위해 Gemini AI API를 연동하는 방법을 안내합니다.

## 🚀 **1단계: Google AI Studio에서 API 키 생성**

### **1-1. Google AI Studio 접속**
1. [Google AI Studio](https://aistudio.google.com/)에 접속
2. Google 계정으로 로그인

### **1-2. API 키 생성**
1. **"Get API key"** 버튼 클릭
2. **"Create API key"** 선택
3. 새 API 키 생성 및 복사

## ⚙️ **2단계: 앱에 API 키 설정**

### **2-1. app.json 수정**
```json
{
  "expo": {
    "extra": {
      "GOOGLE_CLIENT_ID": "your_google_client_id",
      "GEMINI_API_KEY": "your_gemini_api_key_here"
    }
  }
}
```

### **2-2. .env 파일 생성 (선택사항)**
```env
GOOGLE_CLIENT_ID=your_google_client_id
GEMINI_API_KEY=your_gemini_api_key_here
```

## 🔧 **3단계: API 키 보안**

### **3-1. 보안 주의사항**
- API 키를 공개 저장소에 업로드하지 마세요
- `.gitignore`에 `.env` 파일 추가
- 프로덕션 환경에서는 환경변수로 관리

### **3-2. .gitignore 설정**
```gitignore
# 환경변수 파일
.env
.env.local
.env.production
```

## 📱 **4단계: 앱에서 API 키 사용**

### **4-1. 자동 연결 확인**
앱을 실행하면 자동으로 Gemini API 연결 상태를 확인합니다:
- 🟢 **연결됨**: "Gemini AI 연결됨"
- 🔴 **연결 안됨**: "규칙 기반 지능형 해석 사용 가능"

### **4-2. AI 해석 사용**
1. **AI 해석 옵션** 토글 활성화
2. **질문 입력** 및 **추가 정보** 입력
3. **카드 뽑기** 실행
4. Gemini AI가 제공하는 정교한 해석 확인

## 🎯 **5단계: API 키 테스트**

### **5-1. 연결 테스트**
앱 실행 시 자동으로 API 연결을 테스트합니다:
- 간단한 텍스트 생성 요청으로 연결 상태 확인
- 연결 실패 시 자동으로 규칙 기반 해석으로 전환

### **5-2. 해석 품질 비교**
- **규칙 기반**: 기본적인 키워드와 조언
- **Gemini AI**: 개인화된 상세 해석과 실행 단계

## 💡 **6단계: 문제 해결**

### **6-1. 일반적인 문제들**

#### **API 키 오류**
```
Error: Gemini API 키가 설정되지 않았습니다.
```
**해결방법**: app.json의 `GEMINI_API_KEY` 값을 확인하고 올바른 API 키로 설정

#### **연결 실패**
```
Error: AI 해석 생성에 실패했습니다.
```
**해결방법**: 
1. 인터넷 연결 상태 확인
2. API 키 유효성 확인
3. Google AI Studio에서 API 할당량 확인

#### **응답 없음**
```
Error: AI 응답을 받지 못했습니다.
```
**해결방법**:
1. API 요청 형식 확인
2. 프롬프트 길이 조정
3. 재시도

### **6-2. 디버깅 방법**
```typescript
// 개발자 콘솔에서 확인
console.log('Gemini API 키:', Constants.expoConfig?.extra?.GEMINI_API_KEY)
console.log('API 연결 상태:', await AITarotService.checkConnection())
```

## 🔄 **7단계: 앱 재배포**

### **7-1. 변경사항 적용**
```bash
# 앱 재빌드 및 배포
npx eas update --branch preview --message "Add Gemini AI API support"
```

### **7-2. 배포 후 확인**
1. 새 버전의 앱 설치
2. Gemini API 연결 상태 확인
3. AI 해석 기능 테스트

## 📊 **8단계: 성능 모니터링**

### **8-1. API 사용량 확인**
- [Google AI Studio](https://aistudio.google.com/)에서 사용량 모니터링
- 월별 API 호출 횟수 및 비용 확인

### **8-2. 응답 시간 최적화**
- 프롬프트 최적화
- 캐싱 전략 적용
- 사용자 경험 개선

## 🎉 **완료!**

Gemini AI API가 성공적으로 연동되었습니다! 이제 inluck 앱에서:

✅ **정교한 AI 타로 해석**  
✅ **개인화된 조언과 실행 단계**  
✅ **감정적 가이던스**  
✅ **실용적인 행동 계획**

을 제공받을 수 있습니다.

## 📞 **지원**

문제가 발생하거나 추가 도움이 필요한 경우:
- **이메일**: support@inluck.app
- **앱 내**: 설정 → 고객지원 → 문의하기

---

**🍀 행운과 미래를 탐험하는 inluck 앱을 즐겨보세요! 🍀**
