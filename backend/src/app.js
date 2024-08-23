const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path'); // Make sure to import the path module
const { exec } = require('child_process');
const unzipper = require('unzipper'); // Ensure you have installed this module
const { spawn } = require('child_process');

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
//const sstFilePath = "C:\\RocksdbBrowser\\RocksdbBrower\\Sample sst\\sst_file\\output - 복사본.zip";

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

app.post('/analyze-sst/zip', (req, res) => {
    console.log('POST request received');
    const { sstFilePath } = req.body;

    if (!fs.existsSync(sstFilePath)) {
        return res.status(400).json({ error: 'File not found' });
    }

    const unzipOutputDir = path.join(path.dirname(sstFilePath), 'unzipped');

    if (!fs.existsSync(unzipOutputDir)) {
        fs.mkdirSync(unzipOutputDir);
    }

    fs.createReadStream(sstFilePath)
        .pipe(unzipper.Extract({ path: unzipOutputDir }))
        .on('close', () => {
            console.log('Unzip completed.');

            // Get the first unzipped .sst file
            const unzippedFiles = fs.readdirSync(unzipOutputDir);
            let sstFile = unzippedFiles.find(file => path.extname(file) === '.sst');

            if (!sstFile) {
                return res.status(400).json({ error: 'No .sst file found in the archive' });
            }

            let originalUnzippedFilePath = path.join(unzipOutputDir, sstFile);
            let cleanUnzippedFilePath = path.join(unzipOutputDir, 'cleaned_output.sst');

            // Rename the file to a simpler name if it contains special characters
            try {
                fs.renameSync(originalUnzippedFilePath, cleanUnzippedFilePath);
            } catch (error) {
                return res.status(500).json({ error: 'Failed to rename the unzipped file' });
            }

            // Execute sst_dump
            exec(`"${sstDumpPath}" --file="${cleanUnzippedFilePath}" --command=raw > "${dumpFilePath}"`, (err, stdout, stderr) => {
                if (err) {
                    console.error(`Error executing sst_dump: ${stderr}`);
                    return res.status(500).json({ error: stderr });
                }

                fs.readFile(realdumpFilePath, 'utf8', (err, data) => {
                    if (err) {
                        console.error(`Error reading dump file: ${err.message}`);
                        return res.status(500).json({ error: err.message });
                    }

                    const parsedData = parseDumpData(data);
                    res.json(parsedData);
                });
            });
        })
        .on('error', (err) => {
            console.error(`Error during unzip: ${err.message}`);
            return res.status(500).json({ error: 'Failed to unzip the file' });
        });
});


app.post('/origin/analyze-sst', (req, res) => {
    const { sstFilePath } = req.body;

    if (!sstFilePath) {
        return res.status(400).json({ error: 'sstFilePath is required' });
    }

    const outputJsonPath = path.join(__dirname, 'output.json');

    // 경로 공백 처리를 위해 큰따움표로 묶기
    const command = `"C:\\RocksdbBrowser\\RocksdbBrower\\Sst\\Sst\\x64\\Release\\Sst.exe" "${sstFilePath}" "${outputJsonPath}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).json({ error: 'Failed to convert SST file' });
        }

        fs.readFile(outputJsonPath, 'utf8', (err, data) => {
            if (err) {
                console.error(`readFile error: ${err}`);
                return res.status(500).json({ error: 'Failed to read JSON file' });
            }

            res.json(JSON.parse(data));
        });
    });
});

app.post('/origin/analyze-sst/zip', (req, res) => {
    const { sstFilePath } = req.body;

    if (!sstFilePath) {
        return res.status(400).json({ error: 'sstFilePath is required' });
    }

    if (!fs.existsSync(sstFilePath)) {
        return res.status(400).json({ error: 'File not found' });
    }

    const unzipOutputDir = path.join(path.dirname(sstFilePath), 'unzipped');

    // 압축 해제할 디렉토리 생성
    if (!fs.existsSync(unzipOutputDir)) {
        fs.mkdirSync(unzipOutputDir);
    }

    // 압축 해제 진행
    fs.createReadStream(sstFilePath)
        .pipe(unzipper.Extract({ path: unzipOutputDir }))
        .on('close', () => {
            console.log('Unzip completed.');

            // 첫 번째 .sst 파일 찾기
            const unzippedFiles = fs.readdirSync(unzipOutputDir);
            let sstFile = unzippedFiles.find(file => path.extname(file) === '.sst');

            if (!sstFile) {
                return res.status(400).json({ error: 'No .sst file found in the archive' });
            }

            let originalUnzippedFilePath = path.join(unzipOutputDir, sstFile);
            let cleanUnzippedFilePath = path.join(unzipOutputDir, 'cleaned_output.sst');

            // 파일명 정리
            try {
                fs.renameSync(originalUnzippedFilePath, cleanUnzippedFilePath);
            } catch (error) {
                return res.status(500).json({ error: 'Failed to rename the unzipped file' });
            }

            // 명령어 생성 및 실행
            const outputJsonPath = path.join(__dirname, 'output.json');
            const command = `"C:\\RocksdbBrowser\\RocksdbBrower\\Sst\\Sst\\x64\\Release\\Sst.exe" "${cleanUnzippedFilePath}" "${outputJsonPath}"`;

            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    return res.status(500).json({ error: 'Failed to convert SST file' });
                }

                // JSON 파일 읽기
                fs.readFile(outputJsonPath, 'utf8', (err, data) => {
                    if (err) {
                        console.error(`readFile error: ${err}`);
                        return res.status(500).json({ error: 'Failed to read JSON file' });
                    }

                    res.json(JSON.parse(data));
                });
            });
        })
        .on('error', (err) => {
            console.error(`Error during unzip: ${err.message}`);
            return res.status(500).json({ error: 'Failed to unzip the file' });
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
