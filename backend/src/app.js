const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const sstDumpPath = "C:\\RocksdbBrowser\\RocksdbBrower\\rocksdb\\build\\tools\\Release\\sst_dump.exe";
const dumpFilePath = "C:\\RocksdbBrowser\\RocksdbBrower\\Sample sst\\sst_file\\dump.txt";
//const sstFilePath = "C:\\RocksdbBrowser\\RocksdbBrower\\Sample sst\\sst_file\\output.sst";

app.post('/analyze-sst', (req, res) => {
    const { sstFilePath } = req.body;

    if (!fs.existsSync(sstFilePath)) {
        return res.status(400).json({ error: 'File not found' });
    }

    exec(`"${sstDumpPath}" --file="${sstFilePath}" --command=raw > "${dumpFilePath}"`, (err, stdout, stderr) => {
        if (err) {
            console.error(`Error executing sst_dump: ${stderr}`);
            return res.status(500).json({ error: stderr });
        }

        // 덤프된 파일 읽기
        fs.readFile(dumpFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error(`Error reading dump file: ${err.message}`);
                return res.status(500).json({ error: err.message });
            }

            console.log('Dump data:', data); // 데이터 확인

            // 데이터 변환 및 JSON 응답 생성
            try {
                // 예시로 JSON 파싱 - 실제 데이터 형식에 맞게 수정 필요
                const jsonData = data.split('\n').map(line => {
                    const [key, value] = line.split(':');
                    return { key: key.trim(), value: value.trim() };
                });

                res.json({ records: jsonData });
            } catch (parseError) {
                console.error(`Error parsing dump data: ${parseError.message}`);
                res.status(500).json({ error: 'Failed to parse dump data' });
            }
        });
    });
});

module.exports = app;
