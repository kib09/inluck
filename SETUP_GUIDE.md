# 🔐 inluck 앱 설정 가이드

## 📋 필수 환경 변수 설정

이 프로젝트를 실행하기 위해서는 다음 환경 변수들을 설정해야 합니다.

### 1. Google OAuth 설정

**GOOGLE_CLIENT_ID**
- Google Cloud Console에서 OAuth 2.0 클라이언트 ID를 생성하여 설정
- 형식: `123456789-abcdefghijklmnop.apps.googleusercontent.com`

### 2. Gemini AI API 설정

**GEMINI_API_KEY**
- Google AI Studio에서 API 키를 생성하여 설정
- 형식: `AIzaSy...`

## 🛠️ 설정 방법

### 방법 1: EAS 시크릿 사용 (권장)

1. **EAS CLI로 환경 변수 설정**:
```bash
# Google OAuth 클라이언트 ID 설정
eas secret:create --scope project --name GOOGLE_CLIENT_ID --value "실제_클라이언트_ID"

# Gemini API 키 설정
eas secret:create --scope project --name GEMINI_API_KEY --value "실제_API_키"
```

2. **eas.json 수정**: 환경 변수를 EAS 시크릿으로 참조하도록 수정
```json
{
  "build": {
    "development": {
      "env": {
        "GOOGLE_CLIENT_ID": "GOOGLE_CLIENT_ID",
        "GEMINI_API_KEY": "GEMINI_API_KEY"
      }
    }
  }
}
```

### 방법 2: 로컬 개발용 (개발자만)

`eas.json` 파일의 `env` 섹션에서 플레이스홀더를 실제 값으로 교체:

```json
"env": {
  "GOOGLE_CLIENT_ID": "실제_클라이언트_ID",
  "GEMINI_API_KEY": "실제_API_키"
}
```

## 🚀 EAS 빌드 실행

### 개발 빌드
```bash
eas build --platform android --profile development
```

### 프로덕션 빌드
```bash
eas build --platform android --profile production
```

## ⚠️ 보안 주의사항

- **절대** API 키나 클라이언트 ID를 GitHub에 직접 커밋하지 마세요
- 프로덕션 빌드 시에는 EAS 시크릿을 사용하세요
- 로컬 개발 시에만 `eas.json`에 직접 값을 입력하세요

## 🔍 환경 변수 확인

설정이 완료되었는지 확인하려면:

```bash
# EAS 시크릿 목록 확인
eas secret:list

# 환경 변수 값 확인 (빌드 시)
eas build --platform android --profile development
```

## 📞 문제 해결

환경 변수 설정에 문제가 있다면:
1. EAS CLI가 최신 버전인지 확인
2. 프로젝트에 로그인되어 있는지 확인
3. EAS 프로젝트 ID가 올바른지 확인
