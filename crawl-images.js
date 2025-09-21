const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');

// 이미지 저장 폴더 생성
const imagesDir = path.join(__dirname, 'crawled-images');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

// URL에서 파일명 추출
function getFileNameFromUrl(url) {
    try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;
        let fileName = path.basename(pathname);

        // 파일명이 없으면 랜덤 생성
        if (!fileName || fileName === '') {
            fileName = `image_${Date.now()}.jpg`;
        }

        // 중복 방지를 위해 타임스탬프 추가
        const ext = path.extname(fileName);
        const name = path.basename(fileName, ext);
        return `${name}_${Date.now()}${ext}`;
    } catch (e) {
        return `image_${Date.now()}.jpg`;
    }
}

// 이미지 다운로드 함수
function downloadImage(url, fileName) {
    return new Promise((resolve, reject) => {
        const filePath = path.join(imagesDir, fileName);
        const file = fs.createWriteStream(filePath);

        const protocol = url.startsWith('https') ? https : http;

        protocol.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`✅ Downloaded: ${fileName}`);
                resolve(filePath);
            });
        }).on('error', (err) => {
            fs.unlink(filePath, () => {});
            console.log(`❌ Failed to download: ${url}`);
            reject(err);
        });
    });
}

async function crawlImages() {
    console.log('🚀 Starting image crawling...\n');

    const browser = await chromium.launch({
        headless: false // 브라우저를 볼 수 있게 설정
    });

    const page = await browser.newPage();

    console.log('📍 Navigating to the website...');
    await page.goto('https://showhouse.iwinv.net/0726/?smtg_ad=2801', {
        waitUntil: 'networkidle',
        timeout: 60000
    });

    // 페이지 스크롤하여 모든 이미지 로드
    console.log('📜 Scrolling to load all images...');
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 500;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 200);
        });
    });

    // 조금 더 기다리기
    await page.waitForTimeout(3000);

    // 모든 이미지 태그 찾기
    console.log('🔍 Finding all images...\n');
    const imageUrls = await page.evaluate(() => {
        const images = [];

        // img 태그에서 이미지 URL 추출
        document.querySelectorAll('img').forEach(img => {
            if (img.src && !img.src.includes('data:')) {
                images.push(img.src);
            }
        });

        // background-image에서 URL 추출
        document.querySelectorAll('*').forEach(element => {
            const bgImage = window.getComputedStyle(element).backgroundImage;
            if (bgImage && bgImage !== 'none') {
                const matches = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/);
                if (matches && matches[1] && !matches[1].includes('data:')) {
                    images.push(matches[1]);
                }
            }
        });

        // 중복 제거
        return [...new Set(images)];
    });

    console.log(`📊 Found ${imageUrls.length} unique images\n`);

    // 이미지 정보를 저장할 배열
    const imageList = [];

    // 모든 이미지 다운로드
    for (let i = 0; i < imageUrls.length; i++) {
        const url = imageUrls[i];
        const fileName = getFileNameFromUrl(url);

        console.log(`[${i + 1}/${imageUrls.length}] Downloading: ${fileName}`);

        try {
            await downloadImage(url, fileName);
            imageList.push({
                originalUrl: url,
                fileName: fileName,
                localPath: path.join(imagesDir, fileName)
            });
        } catch (error) {
            console.log(`Failed to download: ${error.message}`);
        }
    }

    // 이미지 정보를 JSON 파일로 저장
    const infoPath = path.join(imagesDir, 'image-info.json');
    fs.writeFileSync(infoPath, JSON.stringify(imageList, null, 2));
    console.log(`\n📝 Image information saved to: ${infoPath}`);

    console.log(`\n✨ Crawling complete! Downloaded ${imageList.length} images to: ${imagesDir}`);

    await browser.close();
}

// 실행
crawlImages().catch(console.error);