// 부동산 이미지 자동 생성/선택 모듈

// 키워드별 로컬 이미지 매핑
const imageBank = {
    '아파트': [
        '/crawled-images/Generated Image September 21, 2025 - 2_14PM.png',
        '/crawled-images/apartment-1.jpg',
        '/crawled-images/apartment-2.jpg'
    ],
    '분양': [
        '/crawled-images/sale-1.jpg',
        '/crawled-images/sale-2.jpg'
    ],
    '클러스터': [
        '/crawled-images/cluster-1.jpg',
        '/crawled-images/cluster-2.jpg'
    ],
    '양지지구': [
        '/crawled-images/yangji-1.jpg',
        '/crawled-images/yangji-2.jpg'
    ],
    'default': [
        '/crawled-images/Generated Image September 21, 2025 - 2_14PM.png'
    ]
};

// Unsplash 무료 API 사용 (부동산 실제 이미지)
async function fetchUnsplashImage(keyword) {
    const accessKey = 'YOUR_UNSPLASH_ACCESS_KEY'; // 무료로 발급 가능
    const query = encodeURIComponent(`korean apartment ${keyword}`);

    try {
        const response = await fetch(
            `https://api.unsplash.com/photos/random?query=${query}&client_id=${accessKey}`
        );

        if (response.ok) {
            const data = await response.json();
            return data.urls.regular;
        }
    } catch (error) {
        console.error('Unsplash API 오류:', error);
    }

    return null;
}

// Stable Diffusion Web UI API (로컬 설치 시)
async function generateWithStableDiffusion(prompt) {
    try {
        const response = await fetch('http://127.0.0.1:7860/sdapi/v1/txt2img', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: `modern korean apartment building, ${prompt}, professional photography, 8k`,
                negative_prompt: 'low quality, blurry, distorted',
                steps: 20,
                width: 1024,
                height: 576
            })
        });

        if (response.ok) {
            const data = await response.json();
            return `data:image/png;base64,${data.images[0]}`;
        }
    } catch (error) {
        console.error('Stable Diffusion 오류:', error);
    }

    return null;
}

// 키워드 기반 이미지 선택/생성
async function getImageForContent(title, content) {
    // 1. 키워드 추출
    const keywords = extractKeywords(title + ' ' + content);

    // 2. 로컬 이미지 뱅크에서 먼저 검색
    for (const keyword of keywords) {
        if (imageBank[keyword]) {
            const images = imageBank[keyword];
            return images[Math.floor(Math.random() * images.length)];
        }
    }

    // 3. 외부 API 시도 (Unsplash)
    const unsplashImage = await fetchUnsplashImage(keywords.join(' '));
    if (unsplashImage) {
        return unsplashImage;
    }

    // 4. 기본 이미지 반환
    return imageBank.default[0];
}

// 키워드 추출 함수
function extractKeywords(text) {
    const importantWords = [
        '아파트', '분양', '클러스터', '양지', '경남아너스빌',
        '청약', '입주', '평면도', '조감도', '모델하우스',
        '프리미엄', '특별', '혜택', '할인'
    ];

    const found = [];
    for (const word of importantWords) {
        if (text.includes(word)) {
            found.push(word);
        }
    }

    return found.length > 0 ? found : ['부동산'];
}

// DALL-E 3 사용 (OpenAI API 키 필요)
async function generateWithDALLE(prompt) {
    const apiKey = 'YOUR_OPENAI_API_KEY';

    try {
        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'dall-e-3',
                prompt: `한국 고급 아파트 단지, ${prompt}, 전문 부동산 사진, 고품질`,
                n: 1,
                size: '1792x1024',
                quality: 'standard'
            })
        });

        if (response.ok) {
            const data = await response.json();
            return data.data[0].url;
        }
    } catch (error) {
        console.error('DALL-E 오류:', error);
    }

    return null;
}

module.exports = {
    getImageForContent,
    fetchUnsplashImage,
    generateWithStableDiffusion,
    generateWithDALLE,
    extractKeywords
};