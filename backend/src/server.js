// 애플리케이션 서버를 시작

const app = require('./app');
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});