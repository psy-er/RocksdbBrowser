const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const rocksdbRoutes = require('./routes/rocksdbRoutes');
const path = require('path');
const fs = require('fs');
const rocksdb = require('rocksdb');  // rocksdb-node 대신 rocksdb 사용
const { SstFileReader } = require('rocksdb');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/rocksdb', rocksdbRoutes);

// 추가 라우트 설정 (예: 사용자 라우트)
// const userRoutes = require('./routes/userRoutes');
// app.use('/api/users', userRoutes);

// 예시: RocksDB 데이터베이스 열기 및 사용
app.post('/analyze-sst', (req, res) => {
    const { sstFilePath } = req.body;

    if (!fs.existsSync(sstFilePath)) {
        return res.status(400).json({ error: 'File not found' });
    }

    try {
        const reader = new SstFileReader(sstFilePath);
        reader.open((err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            const records = [];
            reader.each((key, value) => {
                records.push({ key: key.toString(), value: value.toString() });
            });

            reader.close();
            res.json({ records });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = app;
