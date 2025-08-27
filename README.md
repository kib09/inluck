# 🍀 inluck - 행운과 미래를 탐험하는 신비로운 앱

<div align="center">
  <img src="assets/icon.png" alt="inluck App Icon" width="120" height="120">
  
  [![Expo](https://img.shields.io/badge/Expo-000000?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
  [![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
</div>

## 📱 앱 소개

**inluck**은 행운과 미래를 탐험할 수 있는 종합 운세 앱입니다. 로또 번호 추첨, 별자리별 운세, AI 기반 타로카드 리딩 등 다양한 기능을 통해 사용자에게 신비로운 경험을 제공합니다.

### ✨ 주요 기능

- 🎯 **로또 번호 추첨**: 행운의 로또 번호를 자동으로 생성하고 히스토리 관리
- ⭐ **별자리 운세**: 12개 별자리별 오늘의 운세 (사랑, 직업, 건강, 재물)
- 🔮 **타로카드 리딩**: 다양한 스프레드와 AI 기반 해석으로 미래 탐험
- 🌙 **다크모드 지원**: 사용자 편의를 위한 테마 설정
- 📱 **크로스 플랫폼**: iOS와 Android 모두 지원

## 🚀 기술 스택

### Frontend
- **React Native 0.79.5** - 크로스 플랫폼 모바일 앱 개발
- **Expo SDK 53** - 빠른 개발과 배포를 위한 플랫폼
- **TypeScript 5.8.3** - 타입 안전성과 개발 생산성 향상
- **React Navigation 7** - 네비게이션 및 라우팅

### UI/UX
- **Tailwind CSS** - 모던하고 일관된 디자인 시스템
- **React Native Vector Icons** - 아이콘 라이브러리
- **React Native Reanimated** - 부드러운 애니메이션
- **React Native Gesture Handler** - 제스처 인식

### AI & 외부 서비스
- **Google Gemini AI** - 타로카드 해석을 위한 AI 서비스
- **Google OAuth** - 사용자 인증 시스템

### 데이터 관리
- **AsyncStorage** - 로컬 데이터 저장
- **Context API** - 전역 상태 관리
- **React Hooks** - 함수형 컴포넌트 상태 관리

## 📁 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 UI 컴포넌트
│   ├── Header.tsx      # 앱 헤더 컴포넌트
│   ├── Footer.tsx      # 앱 푸터 컴포넌트
│   └── PolicyModal.tsx # 개인정보처리방침 모달
├── contexts/           # 전역 상태 관리
│   ├── AuthContext.tsx # 인증 상태 관리
│   └── ThemeContext.tsx # 테마 설정 관리
├── pages/              # 주요 페이지 컴포넌트
│   ├── Home.tsx        # 메인 홈 페이지
│   ├── LottoPage.tsx   # 로또 번호 추첨 페이지
│   ├── FortunePage.tsx # 별자리 운세 페이지
│   └── TarotPage.tsx   # 타로카드 리딩 페이지
├── services/           # 외부 서비스 연동
│   └── GoogleAuthService.ts # Google OAuth 서비스
└── utils/              # 유틸리티 함수
    ├── aiTarotService.ts # AI 타로 서비스
    └── tarotAPI.ts      # 타로 데이터 API
```

## 🛠️ 설치 및 실행

### 필수 요구사항
- Node.js 18.0.0 이상
- npm 또는 yarn
- Expo CLI
- iOS Simulator (macOS) 또는 Android Emulator

### 설치 방법

1. **저장소 클론**
```bash
git clone [repository-url]
cd LuckyFortuneApp
```

2. **의존성 설치**
```bash
npm install

    
## 🎨 주요 기능 상세

### 로또 번호 추첨
- 1-45 중 6개 번호 + 보너스 번호 1개 자동 생성
- 생성된 번호 히스토리 저장 및 관리
- 수동 번호 입력 기능

### 별자리 운세
- 12개 별자리 지원 (양자리 ~ 물고기자리)
- 사랑, 직업, 건강, 재물 등 4개 영역 운세
- 일별 운세 히스토리 관리

### 타로카드 리딩
- 다양한 스프레드 패턴 지원
- AI 기반 카드 해석 및 조언
- 질문과 상황에 맞는 맞춤형 리딩
- 리딩 히스토리 저장

## 🌙 테마 시스템

- **라이트 모드**: 밝고 깔끔한 디자인
- **다크 모드**: 눈의 피로를 줄이는 어두운 테마
- **시스템 테마**: OS 설정에 따른 자동 테마 적용
- **AsyncStorage**: 사용자 테마 설정 영구 저장

## 📱 지원 플랫폼

- **Android**: API 레벨 21 (Android 5.0) 이상

## 🔐 보안 및 개인정보

- **Google OAuth**: 안전한 사용자 인증
- **로컬 저장소**: 민감한 정보는 기기 내부에만 저장
- **API 키 보안**: EAS 시크릿을 통한 안전한 API 키 관리
- **개인정보처리방침**: 명확한 개인정보 수집 및 이용 안내

### ⚠️ 보안 주의사항

**중요**: 이 프로젝트에는 API 키와 클라이언트 ID가 포함되어 있습니다. GitHub에 업로드하기 전에 다음 단계를 따라주세요:

1. **환경 변수 설정**: `ENV_SETUP.md` 파일을 참조하여 환경 변수를 설정하세요
2. **API 키 보호**: 실제 API 키는 `app.json`에 직접 입력하지 마세요
3. **EAS 시크릿 사용**: 프로덕션 빌드 시에는 EAS 시크릿을 사용하세요

## 📞 문의 및 지원
- **개발자**: kiminbae
- **이메일**: [dslqoehf@gmail.com]


<div align="center">
  <p>🍀 행운과 함께하는 inluck 앱을 즐겨보세요! 🍀</p>
  <p><em>Made with ❤️ by inveloper</em></p>
</div>
