# 🚀 GitHub 업로드 가이드

## 📋 사전 준비사항

GitHub에 프로젝트를 업로드하기 전에 다음 사항들을 확인하세요:

### ✅ 완료된 보안 조치
- [x] `app.json`에서 실제 API 키 제거
- [x] `.gitignore` 파일 생성
- [x] `ENV_SETUP.md` 파일 생성
- [x] `eas.json` 환경 변수 설정

## 🔐 보안 확인

### 1. app.json 확인
`app.json` 파일에서 다음 값들이 플레이스홀더로 변경되었는지 확인:

```json
"extra": {
  "GOOGLE_CLIENT_ID": "YOUR_GOOGLE_CLIENT_ID_HERE",
  "GEMINI_API_KEY": "YOUR_GEMINI_API_KEY_HERE",
  "eas": {
    "projectId": "YOUR_EAS_PROJECT_ID_HERE"
  }
}
```

### 2. .gitignore 확인
`.gitignore` 파일에 다음 항목들이 포함되어 있는지 확인:

```
# 환경 변수 파일
.env
.env.local
.env*.local

# API 키 관련
*.key
*.pem
*.p12
*.jks

# Expo 빌드 파일
.expo/
dist/
web-build/
```

## 📤 GitHub 업로드 단계

### 1. Git 저장소 초기화
```bash
# Git 저장소 초기화
git init

# 원격 저장소 추가 (GitHub 저장소 URL로 교체)
git remote add origin https://github.com/yourusername/LuckyFortuneApp.git
```

### 2. 파일 추가 및 커밋
```bash
# 모든 파일 추가
git add .

# 첫 번째 커밋
git commit -m "Initial commit: inluck fortune app with security measures"

# 메인 브랜치로 푸시
git push -u origin main
```

### 3. 브랜치 보호 설정 (권장)
GitHub 저장소 설정에서:
1. **Settings** → **Branches** → **Add rule**
2. **Branch name pattern**: `main`
3. **Require a pull request before merging** 체크
4. **Restrict pushes that create files that match** 체크

## 🔍 업로드 후 확인사항

### 1. 민감한 정보 확인
GitHub에 업로드된 파일들을 확인하여 다음 정보들이 노출되지 않았는지 확인:
- [ ] Google OAuth 클라이언트 ID
- [ ] Gemini API 키
- [ ] EAS 프로젝트 ID
- [ ] 기타 민감한 정보

### 2. 파일 구조 확인
다음 파일들이 올바르게 업로드되었는지 확인:
- [ ] `README.md`
- [ ] `ENV_SETUP.md`
- [ ] `GITHUB_UPLOAD_GUIDE.md`
- [ ] `src/` 폴더 전체
- [ ] `package.json`
- [ ] `app.json` (플레이스홀더 포함)
- [ ] `eas.json`

## 🚨 문제 발생 시 대응

### 1. API 키가 실수로 업로드된 경우
```bash
# Git 히스토리에서 파일 완전 제거
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch app.json" \
  --prune-empty --tag-name-filter cat -- --all

# 강제 푸시
git push origin --force --all
```

### 2. 환경 변수 재설정
```bash
# EAS 시크릿 재설정
eas secret:delete --name GOOGLE_CLIENT_ID
eas secret:create --scope project --name GOOGLE_CLIENT_ID --value "새로운_클라이언트_ID"

eas secret:delete --name GEMINI_API_KEY
eas secret:create --scope project --name GEMINI_API_KEY --value "새로운_API_키"
```

## 📚 추가 리소스

- [GitHub 보안 모범 사례](https://docs.github.com/en/github/security)
- [Expo 보안 가이드](https://docs.expo.dev/guides/security/)
- [EAS 시크릿 관리](https://docs.expo.dev/eas-update/eas-secrets/)

## 📞 지원

문제가 발생하거나 추가 도움이 필요한 경우:
1. `ENV_SETUP.md` 파일을 참조하세요
2. Expo 공식 문서를 확인하세요
3. GitHub Issues를 통해 문제를 보고하세요

---

**⚠️ 중요**: 이 가이드를 따라하지 않으면 API 키가 노출될 수 있습니다. 반드시 모든 보안 조치를 완료한 후 GitHub에 업로드하세요!
