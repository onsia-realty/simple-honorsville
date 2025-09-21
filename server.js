const express = require('express');
const path = require('path');
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