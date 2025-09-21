# 클러스터용인 경남아너스빌 - 부동산 랜딩 페이지

벤치마킹 사이트 구조를 기반으로 한 프리미엄 부동산 분양 랜딩 페이지입니다.

## 🏗️ 프로젝트 구조

```
onsia_homemax/
├── real-version.html        # 실제 크롤링한 이미지를 사용한 최종 버전
├── modern-version.html      # 모던한 디자인 요소가 추가된 버전
├── final-version.html       # 유튜브 동영상이 포함된 버전
├── local-version.html       # 로컬 이미지를 사용한 버전
├── crawl-images.js         # 이미지 크롤링 스크립트
├── server.js               # Express 웹 서버
├── crawled-images/         # 크롤링된 이미지 폴더 (37개 이미지)
├── public/                 # 정적 파일들
└── package.json
```

## 🚀 시작하기

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
`.env` 파일에서 SOLAPI 설정을 완료하세요:
```bash
# 솔라피 API 인증 정보 (실제 값으로 교체 필요)
SOLAPI_API_KEY=your_actual_api_key
SOLAPI_API_SECRET=your_actual_api_secret

# 발신번호 (솔라피에 사전 등록된 번호)
SMS_SENDER_NUMBER=1668-5257

# 관리자 번호 (SMS 수신)
ADMIN_PHONE=010-7781-9297
```

### 3. 웹 서버 실행
```bash
npm start
# 또는
npm run dev
```

서버가 실행되면 다음 URL에서 확인할 수 있습니다:
- **메인 페이지**: http://localhost:8001/ (SOLAPI SMS 연동)
- **실제 이미지 버전**: http://localhost:8001/final-version.html
- **대체 버전**: http://localhost:8001/fixed-version.html

## 📊 이미지 크롤링 결과

총 **37개 이미지**가 성공적으로 다운로드되었습니다.
원본 벤치마킹 사이트와 동일한 이미지들을 로컬에서 빠르게 로딩합니다.

## 🎯 완성된 기능

✅ **실제 이미지 크롤링 완료** (37개)
✅ **웹 서버 구동** (http://localhost:8080)
✅ **반응형 디자인** 
✅ **SMS 발송** (SOLAPI 연동)
✅ **YouTube 동영상 통합**
✅ **전화번호 자동 포맷팅**

## 📱 SMS 발송 기능 (SOLAPI)

### 🎯 **자동 SMS 발송**
- **관리자 알림**: 새로운 관심고객 등록시 010-7781-9297로 즉시 알림
- **고객 확인**: 등록 완료 확인 SMS를 고객에게 자동 발송
- **발신번호**: 1668-5257 (솔라피 사전 등록 번호)

### 📋 **SMS 메시지 템플릿**

**관리자용 알림**:
```
[클러스터용인 경남아너스빌]
새 관심고객 등록!

성함: {고객명}
연락처: {고객번호}
문의사항: {문의내용}
등록시간: {타임스탬프}

즉시 연락 요망
```

**고객용 확인**:
```
[클러스터용인 경남아너스빌]
{고객명}님, 관심고객 등록이 완료되었습니다.

빠른 시일 내에 전문 상담원이 연락드리겠습니다.

문의: 1668-5257
```

### ⚙️ **SOLAPI 설정 방법**
1. [솔라피 홈페이지](https://solapi.com)에서 계정 생성
2. 발신번호 1668-5257 등록 및 인증
3. API 키/시크릿 발급
4. `.env` 파일에 설정 정보 입력
5. 충분한 잔액 확보

---
**개발 완료**: 2025년 9월 20일
# simple-honorsville
