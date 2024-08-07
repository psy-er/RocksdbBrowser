// Express 애플리케이션을 설정하고 미들웨어 추가
const express = require('express');
const bodyParser = require('body-parser');
const rocksdbRoutes = require('./routes/rocksdbRoutes');
const app = express();
const cors = require('cors');

app.use(cors()); // cors 설정
app.use(bodyParser.json());
app.use('/rocksdb', rocksdbRoutes);

// 라우트 설정
// app.use('/api/users', userRoutes);


module.exports = app;