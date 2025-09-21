const express = require('express');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// SMS API 라우트 임포트
const sendSMS = require('./api/send-sms');

const app = express();
const PORT = 8001;

// JSON 파싱 미들웨어
app.use(express.json());

// Serve static files from the current directory
app.use(express.static(__dirname));

// Serve crawled images
app.use('/crawled-images', express.static(path.join(__dirname, 'crawled-images')));

// SMS API 라우트
app.post('/api/send-sms', sendSMS);

// 블로그 포스트 생성 API
app.post('/api/create-post', (req, res) => {
    try {
        const { title, description, keywords, category, content, fileName } = req.body;

        if (!title || !description || !content || !fileName) {
            return res.status(400).json({
                success: false,
                message: '필수 필드가 누락되었습니다.'
            });
        }

        const currentDate = new Date().toISOString().split('T')[0];
        const safeFileName = fileName.replace(/[^a-z0-9가-힣\-]/g, '').toLowerCase();

        const htmlTemplate = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta name="keywords" content="${keywords || ''}">
    <meta name="author" content="클러스터용인 경남아너스빌">
    <meta name="robots" content="index, follow">

    <!-- Open Graph 태그 -->
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="클러스터용인 경남아너스빌">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="../crawled-images/Generated Image September 21, 2025 - 2_14PM.png">
    <meta property="og:url" content="https://simple-honorsville.vercel.app/blog/${safeFileName}.html">

    <!-- 구조화된 데이터 -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "${title}",
        "description": "${description}",
        "author": {
            "@type": "Organization",
            "name": "클러스터용인 경남아너스빌"
        },
        "publisher": {
            "@type": "Organization",
            "name": "클러스터용인 경남아너스빌",
            "logo": {
                "@type": "ImageObject",
                "url": "https://simple-honorsville.vercel.app/crawled-images/Generated Image September 21, 2025 - 2_14PM.png"
            }
        },
        "datePublished": "${currentDate}",
        "dateModified": "${currentDate}",
        "image": "https://simple-honorsville.vercel.app/crawled-images/Generated Image September 21, 2025 - 2_14PM.png"
    }
    </script>

    <link rel="canonical" href="https://simple-honorsville.vercel.app/blog/${safeFileName}.html">

    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Malgun Gothic', '맑은 고딕', sans-serif;
            line-height: 1.8;
            color: #333;
            background: #f8f9fa;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }

        .header {
            background: #1a472a;
            color: white;
            padding: 20px;
            text-align: center;
        }

        .breadcrumb {
            padding: 15px 20px;
            background: #e9ecef;
            font-size: 14px;
            color: #666;
        }

        .breadcrumb a {
            color: #007bff;
            text-decoration: none;
        }

        .article {
            padding: 30px;
        }

        .article h1 {
            font-size: 28px;
            color: #1a472a;
            margin-bottom: 20px;
            line-height: 1.4;
        }

        .meta {
            color: #666;
            font-size: 14px;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid #eee;
        }

        .article h2 {
            color: #1a472a;
            font-size: 22px;
            margin: 30px 0 15px 0;
            padding-left: 10px;
            border-left: 4px solid #ffd700;
        }

        .article h3 {
            color: #2c5530;
            font-size: 18px;
            margin: 25px 0 12px 0;
        }

        .article p {
            margin-bottom: 18px;
            text-align: justify;
        }

        .highlight {
            background: #fff3cd;
            padding: 15px;
            border-left: 4px solid #ffd700;
            margin: 20px 0;
        }

        .cta-box {
            background: linear-gradient(135deg, #1a472a, #2c5530);
            color: white;
            padding: 25px;
            border-radius: 10px;
            text-align: center;
            margin: 30px 0;
        }

        .cta-box h3 {
            color: #ffd700 !important;
            margin-bottom: 15px;
        }

        .cta-button {
            background: #ffd700;
            color: #1a472a;
            padding: 12px 30px;
            border: none;
            border-radius: 25px;
            font-weight: bold;
            text-decoration: none;
            display: inline-block;
            margin-top: 15px;
            transition: all 0.3s;
        }

        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(255,215,0,0.3);
        }

        @media (max-width: 768px) {
            .container {
                margin: 0;
                box-shadow: none;
            }

            .article {
                padding: 20px;
            }

            .article h1 {
                font-size: 24px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>클러스터용인 경남아너스빌 블로그</h1>
            <p>최신 부동산 정보와 개발 소식</p>
        </div>

        <div class="breadcrumb">
            <a href="../final-version.html">홈</a> > <a href="../blog/">블로그</a> > ${category || '일반'}
        </div>

        <article class="article">
            <h1>${title}</h1>

            <div class="meta">
                <strong>발행일:</strong> ${currentDate} | <strong>카테고리:</strong> ${category || '일반'} | <strong>작성자:</strong> 부동산 전문가
            </div>

            ${content}
        </article>
    </div>
</body>
</html>`;

        const blogDir = path.join(__dirname, 'blog');
        if (!fs.existsSync(blogDir)) {
            fs.mkdirSync(blogDir, { recursive: true });
        }

        const filePath = path.join(blogDir, `${safeFileName}.html`);
        fs.writeFileSync(filePath, htmlTemplate, 'utf8');

        // 사이트맵 업데이트
        updateSitemap(safeFileName, title, currentDate);

        res.json({
            success: true,
            message: '포스트가 성공적으로 생성되었습니다!',
            fileName: `${safeFileName}.html`,
            url: `/blog/${safeFileName}.html`
        });

    } catch (error) {
        console.error('포스트 생성 중 오류:', error);
        res.status(500).json({
            success: false,
            message: '포스트 생성 중 오류가 발생했습니다.'
        });
    }
});

// 사이트맵 업데이트 함수
function updateSitemap(fileName, title, date) {
    try {
        const sitemapPath = path.join(__dirname, 'sitemap.xml');
        let sitemap = fs.readFileSync(sitemapPath, 'utf8');

        const newUrl = `    <url>
        <loc>https://simple-honorsville.vercel.app/blog/${fileName}.html</loc>
        <lastmod>${date}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>

</urlset>`;

        sitemap = sitemap.replace('</urlset>', newUrl);
        fs.writeFileSync(sitemapPath, sitemap, 'utf8');
    } catch (error) {
        console.error('사이트맵 업데이트 오류:', error);
    }
}

// 블로그 포스트 목록 조회 API
app.get('/api/posts', (req, res) => {
    try {
        const blogDir = path.join(__dirname, 'blog');
        if (!fs.existsSync(blogDir)) {
            return res.json([]);
        }

        const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.html'));
        const posts = files.map(file => {
            const filePath = path.join(blogDir, file);
            const stats = fs.statSync(filePath);
            const content = fs.readFileSync(filePath, 'utf8');

            // HTML에서 제목 추출
            const titleMatch = content.match(/<title>(.*?)<\/title>/);
            const title = titleMatch ? titleMatch[1] : file.replace('.html', '');

            return {
                fileName: file.replace('.html', ''),
                title: title,
                created: stats.birthtime.toISOString().split('T')[0],
                modified: stats.mtime.toISOString().split('T')[0]
            };
        });

        res.json(posts);
    } catch (error) {
        console.error('포스트 목록 조회 오류:', error);
        res.status(500).json({ success: false, message: '포스트 목록 조회 중 오류가 발생했습니다.' });
    }
});

// Default route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'final-version.html'));
});

app.listen(PORT, () => {
    console.log(`
    ✅ Server is running at http://localhost:${PORT}

    Available pages:
    - http://localhost:${PORT}/ (final-version.html) 🎯 원래 로직 + 실제 이미지
    - http://localhost:${PORT}/final-version.html
    - http://localhost:${PORT}/fixed-version.html
    - http://localhost:${PORT}/real-version.html

    Press Ctrl+C to stop the server
    `);
});