# 이미지 폴더 구조 및 가이드

## 📁 폴더 구조

```
public/
└── images/
    ├── main/          # 메인 이미지
    ├── gallery/       # 갤러리 이미지
    ├── floorplan/     # 평면도 이미지
    ├── location/      # 입지/교통 이미지
    └── facility/      # 시설/혜택 이미지
```

## 🖼️ 필요한 이미지 목록

### main/ (메인 이미지)
- `hero-main.jpg` - 메인 히어로 이미지 (1920x1080)
- `hero-mobile.jpg` - 모바일용 메인 이미지 (768x1024)

### gallery/ (프로젝트 갤러리)
- `exterior-01.jpg` - 외관 이미지 1
- `exterior-02.jpg` - 외관 이미지 2
- `interior-01.jpg` - 실내 이미지 1
- `interior-02.jpg` - 실내 이미지 2
- `interior-03.jpg` - 실내 이미지 3
- `model-house-01.jpg` - 모델하우스 1
- `model-house-02.jpg` - 모델하우스 2

### floorplan/ (평면도)
- `84a-type.jpg` - 84A 타입 평면도
- `84b-type.jpg` - 84B 타입 평면도
- `101-type.jpg` - 101 타입 평면도
- `115-type.jpg` - 115 타입 평면도
- `unit-plan.jpg` - 단지 배치도

### location/ (입지 및 교통)
- `location-map.jpg` - 위치 안내도
- `traffic-info.jpg` - 교통 안내
- `nearby-infra.jpg` - 주변 인프라
- `education.jpg` - 교육 환경
- `shopping.jpg` - 쇼핑/편의시설

### facility/ (시설 및 혜택)
- `community-01.jpg` - 커뮤니티 시설 1
- `community-02.jpg` - 커뮤니티 시설 2
- `landscape.jpg` - 조경 계획
- `brand-story.jpg` - 브랜드 소개
- `benefits.jpg` - 특별 혜택
- `contact-info.jpg` - 연락처 안내

## 📏 권장 이미지 사이즈

| 용도 | 권장 크기 | 파일 형식 | 최대 용량 |
|------|-----------|-----------|-----------|
| 메인 이미지 | 1920x1080 | JPG | 500KB |
| 갤러리 이미지 | 1920x900 | JPG | 400KB |
| 평면도 | 1200x1200 | JPG/PNG | 300KB |
| 모바일 이미지 | 768x1024 | JPG | 200KB |

## 🎨 이미지 최적화 팁

1. **압축**: TinyPNG 또는 Squoosh 사용
2. **포맷**:
   - 사진: JPG (품질 80-85%)
   - 평면도: PNG (투명 배경 필요시)
3. **네이밍**:
   - 소문자 사용
   - 공백 대신 하이픈(-) 사용
   - 한글 파일명 피하기

## ⚡ WebP 변환 (선택사항)

더 나은 성능을 원한다면 WebP 포맷으로 변환:

```bash
# ImageMagick 사용 예시
convert input.jpg -quality 80 output.webp
```

## 📱 반응형 이미지 (선택사항)

다양한 화면 크기를 위한 이미지 세트:
- `image.jpg` - 기본 (1920px)
- `image-md.jpg` - 태블릿 (1024px)
- `image-sm.jpg` - 모바일 (768px)