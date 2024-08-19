const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
app.use(cors());

app.use((req, res, next) => {
    console.log(`Request Method: ${req.method}`);
    console.log(`Request URL: ${req.url}`);
    console.log(`Request Headers: ${JSON.stringify(req.headers)}`);
    next(); // Pass request to the next middleware
});

app.use(bodyParser.json());

const sstDumpPath = "C:\\RocksdbBrowser\\RocksdbBrower\\rocksdb\\build\\tools\\Release\\sst_dump.exe";
//생성되는 dump 파일 그대로를 적으면 overwrite 에러가 난다. 그래서 임의의 dump 파일명을 적어 우회 시켜 생성해야 한다.
const dumpFilePath = "C:\\RocksdbBrowser\\RocksdbBrower\\Sample sst\\sst_file\\dump.txt";
const realdumpFilePath = "C:\\RocksdbBrowser\\RocksdbBrower\\Sample sst\\sst_file\\output_dump.txt";
//const sstFilePath = "C:\\RocksdbBrowser\\RocksdbBrower\\Sample sst\\sst_file\\output.sst";


app.post('/analyze-sst', (req, res) => {
    console.log('POST request received');
    const { sstFilePath } = req.body;

    if (!fs.existsSync(sstFilePath)) {
        return res.status(400).json({ error: 'File not found' });
    }

    exec(`"${sstDumpPath}" --file="${sstFilePath}" --command=raw > "${dumpFilePath}"`, (err, stdout, stderr) => {
        if (err) {
            console.error(`Error executing sst_dump: ${stderr}`);
            return res.status(500).json({ error: stderr });
        }

        // Read the dumped file
        fs.readFile(realdumpFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error(`Error reading dump file: ${err.message}`);
                return res.status(500).json({ error: err.message });
            }

            // Parse the data
            const parsedData = parseDumpData(data);
            res.json(parsedData);
        });
    });
});

function parseDumpData(data) {
    const keyValuePattern = /HEX\s+([0-9A-Fa-f]+):\s+([0-9A-Fa-f\s]+)\s+ASCII\s+([^\n]+)\n/g;
    const result = {};
    let match;

    while ((match = keyValuePattern.exec(data)) !== null) {
        const hex = match[1].trim();
        const ascii = match[3].trim();

        // Extract key and value from the ASCII string
        const [key, value] = ascii.split(' : ');
        if (key && value) {
            result[key.trim()] = value.trim();
        }
    }

    return result;
}

module.exports = app;
