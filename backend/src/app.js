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
//app.use('/rocksdb', rocksdbRoutes);

const exec = require('child_process').exec;
const sstDumpPath = "C:\\RocksdbBrowser\\RocksdbBrower\\rocksdb\\build\\tools\\Release\\sst_dump.exe"; // sst_dump.exe의 경로
//const sstFilePath = "C:\\RocksdbBrowser\\RocksdbBrower\\Sample sst\\sst_file\\output.sst";
const dumpFilePath = "C:\\RocksdbBrowser\\RocksdbBrower\\Sample sst\\sst_file\\dump.txt";

app.post('/analyze-sst', (req, res) => {
    const { sstFilePath } = req.body;
    //const dumpFilePath = path.join(__dirname, 'dump.txt'); // __dirname은 디렉토리 경로를 가짐

    // 먼저 sst_dump를 실행해야 합니다.
    const { exec } = require('child_process');
    exec(`"${sstDumpPath}" --file="${sstFilePath}" --output_format=plain --output_file="${dumpFilePath}"`, (err, stdout, stderr) => {
        if (err) {
            return res.status(500).json({ error: stderr });
        }

        console.log(`sstFilePath: ${sstFilePath}`);
        console.log(`dumpFilePath: ${dumpFilePath}`);
        console.log(`stdout: ${stdout}`);

        // 덤프된 파일 읽기
        fs.readFile(dumpFilePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            // 필요에 따라 덤프된 데이터를 처리합니다.
            res.json({ data });
        });
    });
});

module.exports = app;
