# 솔라피(Solapi) SMS 연동 가이드
> 클러스터용인 경남아너스빌 홈페이지 기반 솔라피 문자 발송 시스템

## 📋 개요
이 가이드는 1668-5257 번호로 연결된 솔라피 SMS 시스템을 다른 홈페이지에 동일하게 적용하기 위한 완전한 설정 가이드입니다.

## 🔧 필수 환경 변수

### Vercel 환경 변수 설정
```bash
# 솔라피 API 인증 정보
SOLAPI_API_KEY=your_solapi_api_key_here
SOLAPI_API_SECRET=your_solapi_api_secret_here

# 발신/수신 번호 설정
SMS_SENDER_NUMBER=1668-5257
ADMIN_PHONE=010-7781-9297

# 추가 관리자 번호 (선택사항)
ALIGO_SENDER=1668-5257
```

### 로컬 개발용 .env.local
```bash
# 솔라피 API 인증 정보 (실제 값으로 교체 필요)
SOLAPI_API_KEY=your_actual_api_key
SOLAPI_API_SECRET=your_actual_api_secret

# 발신번호 (솔라피에 사전 등록된 번호)
SMS_SENDER_NUMBER=1668-5257

# 관리자 번호 (SMS 수신)
ADMIN_PHONE=010-7781-9297

# 환경 구분
NODE_ENV=development
```

## 📦 필수 패키지 설치

### package.json 의존성
```json
{
  "dependencies": {
    "solapi": "^5.5.1",
    "next": "15.2.4",
    "react": "^19",
    "react-dom": "^19"
  }
}
```

### 설치 명령어
```bash
npm install solapi
# 또는
pnpm add solapi
# 또는
yarn add solapi
```

## 🚀 API 라우트 구현

### 1. 메인 SMS 발송 API (/api/send-notification/route.ts)
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { SolapiMessageService } from 'solapi'

export const runtime = 'nodejs'
export const maxDuration = 10

export async function POST(request: NextRequest) {
  try {
    const { name, phone, timestamp } = await request.json()

    // 환경 변수 확인
    const SOLAPI_API_KEY = process.env.SOLAPI_API_KEY
    const SOLAPI_API_SECRET = process.env.SOLAPI_API_SECRET
    const SMS_SENDER_NUMBER = process.env.SMS_SENDER_NUMBER || '1668-5257'
    const ADMIN_PHONE = process.env.ADMIN_PHONE || '010-7781-9297'

    if (!SOLAPI_API_KEY || !SOLAPI_API_SECRET) {
      console.error('솔라피 API 키가 설정되지 않았습니다.')
      return NextResponse.json(
        {
          success: false,
          error: '서버 설정 오류: API 키가 누락되었습니다.'
        },
        { status: 500 }
      )
    }

    // 솔라피 메시지 서비스 초기화
    const messageService = new SolapiMessageService(SOLAPI_API_KEY, SOLAPI_API_SECRET)

    // 관리자에게 발송할 메시지
    const adminMessage = `[클러스터용인 경남아너스빌]
새 관심고객 등록!

성함: ${name}
연락처: ${phone}
등록시간: ${timestamp}

즉시 연락 요망`

    // 고객에게 발송할 메시지
    const customerMessage = `[클러스터용인 경남아너스빌]
${name}님, 관심고객 등록이 완료되었습니다.

빠른 시일 내에 전문 상담원이 연락드리겠습니다.

문의: ${SMS_SENDER_NUMBER}`

    try {
      // 관리자에게 SMS 발송
      const adminResult = await messageService.sendOne({
        to: ADMIN_PHONE,
        from: SMS_SENDER_NUMBER,
        text: adminMessage,
      })

      console.log('관리자 SMS 발송 성공:', adminResult)

      // 고객에게 SMS 발송
      const customerResult = await messageService.sendOne({
        to: phone,
        from: SMS_SENDER_NUMBER,
        text: customerMessage,
      })

      console.log('고객 SMS 발송 성공:', customerResult)

      return NextResponse.json({
        success: true,
        message: 'SMS 발송 완료',
        method: 'solapi',
        results: {
          admin: adminResult,
          customer: customerResult
        }
      })

    } catch (smsError: any) {
      console.error('SMS 발송 실패:', smsError)

      // 솔라피 에러 메시지 추출
      const errorMessage = smsError.response?.data?.message || smsError.message || 'SMS 발송 실패'

      throw new Error(errorMessage)
    }

  } catch (error: any) {
    console.error('알림 발송 오류:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || '알림 발송 실패'
      },
      { status: 500 }
    )
  }
}
```

### 2. 대체 SMS API (/api/send-sms/route.ts)
```typescript
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// 솔라피(Solapi) API 설정
const SOLAPI_API_KEY = (process.env.SOLAPI_API_KEY || '').trim()
const SOLAPI_API_SECRET = (process.env.SOLAPI_API_SECRET || '').trim()
const SOLAPI_API_URL = 'https://api.solapi.com/messages/v4/send'
const SMS_SENDER_NUMBER = (process.env.SMS_SENDER_NUMBER || '1668-5257').trim()
const ADMIN_PHONE = (process.env.ADMIN_PHONE || '010-7781-9297').trim()

// HMAC 서명 생성 함수
function getAuth() {
  const apiKey = SOLAPI_API_KEY.replace(/[\r\n]/g, '')
  const apiSecret = SOLAPI_API_SECRET.replace(/[\r\n]/g, '')
  const date = new Date().toISOString()
  const salt = crypto.randomBytes(32).toString('hex')
  const signature = crypto
    .createHmac('sha256', apiSecret)
    .update(date + salt)
    .digest('hex')

  const authString = `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`
  return authString.replace(/[\r\n]/g, '').trim()
}

export async function POST(request: NextRequest) {
  try {
    const { name, phone, timestamp } = await request.json()

    // 필수 환경 변수 검증
    if (!SOLAPI_API_KEY || !SOLAPI_API_SECRET) {
      console.error('Missing required environment variables')
      return NextResponse.json(
        { success: false, error: '서버 설정 오류: API 자격 증명이 없습니다' },
        { status: 500 }
      )
    }

    // SMS 메시지 구성
    const message = `[경남아너스빌] 새 관심고객
${name} / ${phone}
${timestamp}
즉시 연락바랍니다.`

    // 메시지 바이트 길이 확인
    const messageBytes = Buffer.byteLength(message, 'utf8')
    const messageType = messageBytes <= 90 ? 'SMS' : 'LMS'

    // Authorization 헤더 생성
    const authHeader = getAuth()

    // 솔라피 API 호출
    const smsResponse = await fetch(SOLAPI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({
        message: {
          to: ADMIN_PHONE,
          from: SMS_SENDER_NUMBER,
          text: message,
          type: messageType
        }
      })
    })

    const result = await smsResponse.json()

    if (!smsResponse.ok) {
      console.error('SMS API Error:', result)
      throw new Error(`SMS 발송 실패: ${result.message || result.error?.message || JSON.stringify(result)}`)
    }

    return NextResponse.json({
      success: true,
      message: 'SMS 발송 완료',
      messageId: result.messageId
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })

  } catch (error) {
    console.error('SMS 발송 오류:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'SMS 발송 실패' },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    )
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
```

## 🎯 프론트엔드 연동

### 폼 제출 처리 예시
```typescript
// 관심고객 등록 폼 제출 함수
const handleSubmit = async (formData: FormData) => {
  try {
    const timestamp = new Date().toLocaleString('ko-KR', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })

    const submissionData = {
      name: formData.name,
      phone: formData.phone,
      timestamp: timestamp
    }

    // SMS 발송 API 호출
    const smsResponse = await fetch('/api/send-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submissionData)
    })

    const smsResult = await smsResponse.json()

    if (smsResult.success) {
      console.log('SMS 발송 성공:', smsResult)
      // 성공 메시지 표시
    } else {
      console.error('SMS 발송 실패:', smsResult.error)
      // 에러 처리
    }

  } catch (error) {
    console.error('제출 오류:', error)
  }
}
```

## 📱 전화번호 연동

### HTML/JSX에서 전화 연결
```jsx
{/* 헤더 전화번호 */}
<a href="tel:1668-5257" className="inline-flex items-center justify-center px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-bold transition-all">
  📞 1668-5257
</a>

{/* 푸터 전화번호 */}
<a href="tel:1668-5257" className="text-white hover:text-orange-300 transition-colors">
  1668-5257
</a>

{/* 모바일용 클릭투콜 버튼 */}
<button
  onClick={() => window.open('tel:1668-5257')}
  className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold"
>
  📞 지금 전화하기
</button>
```

## ⚙️ 배포 설정

### Vercel 배포 체크리스트

1. **환경 변수 설정**
   - Vercel 대시보드 → Settings → Environment Variables
   - 위 환경 변수 목록 모두 추가
   - Production, Preview, Development 모든 환경에 적용

2. **솔라피 계정 설정 확인**
   - 발신번호 (1668-5257) 사전 등록 완료
   - API 키/시크릿 발급 완료
   - 충분한 잔액 확보

3. **배포 후 테스트**
   - 관심고객 등록 테스트
   - Vercel Functions 로그 확인
   - 실제 SMS 수신 확인

### 일반 서버 배포 (PM2, Docker 등)

```bash
# 환경 변수 파일 생성 (.env.production)
SOLAPI_API_KEY=your_actual_api_key
SOLAPI_API_SECRET=your_actual_api_secret
SMS_SENDER_NUMBER=1668-5257
ADMIN_PHONE=010-7781-9297
NODE_ENV=production

# PM2로 배포
pm2 start npm --name "honorsville" -- start

# Docker 환경 변수 설정
docker run -d \
  -e SOLAPI_API_KEY=your_key \
  -e SOLAPI_API_SECRET=your_secret \
  -e SMS_SENDER_NUMBER=1668-5257 \
  -e ADMIN_PHONE=010-7781-9297 \
  -p 3000:3000 \
  your-app-image
```

## 🔍 문제 해결

### 자주 발생하는 문제들

1. **환경 변수가 인식되지 않는 경우**
   ```bash
   # 로컬 개발
   npm run dev # .env.local 파일 확인

   # Vercel
   # 재배포 후 환경 변수 적용 확인
   ```

2. **SMS가 발송되지 않는 경우**
   - 솔라피 대시보드에서 잔액 확인
   - 발신번호 등록 상태 확인
   - API 키/시크릿 재확인

3. **CORS 에러 발생 시**
   - API 라우트에 CORS 헤더 추가됨 (위 코드 참조)
   - OPTIONS 메소드 처리 포함

4. **메시지가 잘리는 경우**
   - SMS: 90바이트 제한
   - LMS: 2000바이트 제한
   - 자동으로 메시지 타입 선택됨

## 📞 연락처 정보

- **분양 문의**: 1668-5257
- **관리자**: 010-7781-9297
- **사업자**: (주)온시아 (214-88-01749)
- **주소**: 경기도 용인시 처인구 양지면 양지리 697번지 일원

## 📝 메시지 템플릿

### 관리자용 알림 메시지
```
[클러스터용인 경남아너스빌]
새 관심고객 등록!

성함: {고객명}
연락처: {고객번호}
등록시간: {타임스탬프}

즉시 연락 요망
```

### 고객용 확인 메시지
```
[클러스터용인 경남아너스빌]
{고객명}님, 관심고객 등록이 완료되었습니다.

빠른 시일 내에 전문 상담원이 연락드리겠습니다.

문의: 1668-5257
```

---

> 이 가이드를 참고하여 다른 홈페이지에도 동일한 솔라피 SMS 시스템을 구축할 수 있습니다.
> 실제 API 키와 시크릿은 보안을 위해 환경 변수로 관리하시기 바랍니다.