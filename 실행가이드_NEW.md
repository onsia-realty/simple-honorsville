# 🚀 웹사이트 원스톱 자동 복제 가이드

## 📋 초간단 실행법

### 1️⃣ 원클릭 복제 명령어
```bash
npm run clone --url="https://example.com" --name="NewSite"
```

### 2️⃣ 유튜브 포함 복제
```bash
npm run clone --url="https://example.com" --name="NewSite" --youtube="https://youtube.com/watch?v=VIDEO1"
```

---

## 🎯 실제 사용 예시

### 예시 1: ckplusone 사이트 복제
```bash
npm run clone --url="https://ckplusone.cafe24.com/" --name="CKPlusClone"
```

### 예시 2: 여러 유튜브 영상 포함
```bash
npm run clone --url="https://ckplusone.cafe24.com/" --name="CKPlusClone" --youtube="https://youtube.com/watch?v=abc123,https://youtube.com/watch?v=def456"
```

---

## ✅ 자동으로 처리되는 것들

### 완전 자동
- ✅ 타겟 사이트의 모든 이미지 자동 다운로드
- ✅ HTML 구조와 텍스트 100% 복제
- ✅ CSS 스타일 완벽 보존
- ✅ 전화번호를 1668-5257로 자동 변경
- ✅ 관심고객 등록 폼 자동 생성
- ✅ 유튜브 동영상 자동 임베드
- ✅ 반응형 디자인 유지
- ✅ API 라우트 자동 생성

---

## 📁 결과물 구조

```
ckplusone-main/
├── public/
│   └── NewSite/        ← 크롤링된 모든 이미지
│       ├── img_001.jpg
│       ├── img_002.png
│       └── ...
├── app/
│   ├── page.tsx        ← 복제된 메인 페이지
│   └── api/
│       └── customer/   ← 관심고객 API
│           └── route.ts
└── scripts/
    └── auto-clone.js   ← 자동 복제 스크립트
```

---

## 🚨 주의사항

1. **사이트명**: 영문만 사용 (한글, 공백 불가)
2. **URL**: https:// 포함해서 정확히 입력
3. **유튜브**: 여러 개는 콤마(,)로 구분

---

## 💡 고급 기능

### 여러 사이트 한번에 복제
```bash
# sites.txt 파일 생성
# https://site1.com:Site1Name
# https://site2.com:Site2Name

# 일괄 실행
for line in $(cat sites.txt); do
  IFS=':' read -r url name <<< "$line"
  npm run clone --url="$url" --name="$name"
done
```

---

## 🔧 문제 해결

### Playwright 설치 안됨
```bash
npm install playwright
```

### 이미지 다운로드 실패
- 타겟 사이트가 이미지 핫링킹 방지 설정이 있을 수 있음
- VPN 사용 권장

### 페이지 렌더링 문제
```bash
npm run dev
# 브라우저에서 F12 → Console 에러 확인
```

---

## 🎉 완료!

복제가 완료되면:
1. `npm run dev` 실행
2. http://localhost:3000 접속
3. 완벽하게 복제된 사이트 확인!

**즉시 배포 가능한 Next.js 프로젝트 완성!**