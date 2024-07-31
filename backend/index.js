const express = require('express');
const cors = require('cors'); // CORS 미들웨어 추가
const app = express();
const port = 5000;

app.use(cors()); // CORS 미들웨어 사용

app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from the server!' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

