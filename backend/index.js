const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const rocksdbRoutes = require('./routes/rocksdb');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use('/rocksdb', rocksdbRoutes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
