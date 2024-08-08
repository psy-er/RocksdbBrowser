const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const rocksdbRoutes = require('./routes/rocksdbRoutes');

const app = express();

app.use(cors()); // cors 설정
app.use(bodyParser.json());
app.use('/rocksdb', rocksdbRoutes); // 올바른 경로로 라우터 사용

// 추가 라우트 설정 (예: 사용자 라우트)
// const userRoutes = require('./routes/userRoutes');
// app.use('/api/users', userRoutes);

module.exports = app;
