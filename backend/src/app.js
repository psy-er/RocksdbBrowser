const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const rocksdbController = require('./controller/dataViewerController');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Multer 설정
const upload = multer({ dest: 'uploads/' });

app.use((req, res, next) => {
    console.log(`Request Method: ${req.method}`);
    console.log(`Request URL: ${req.url}`);
    console.log(`Request Headers: ${JSON.stringify(req.headers)}`);
    next();
});

// 라우팅 설정
app.post('/analyze-sst', rocksdbController.analyzeSst);
app.post('/analyze-sst/zip', rocksdbController.analyzeSstZip);
app.post('/origin/analyze-sst', upload.single('sstFile'), rocksdbController.originAnalyzeSst);
app.post('/origin/analyze-sst/zip', upload.single('sstFile'), rocksdbController.originAnalyzeSstZip);

module.exports = app;
