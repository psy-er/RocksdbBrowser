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
//생성되는 dump 파일 그대로를 적으면 overwrite 에러가 난다. 그래서 임의의 dump 파일명을 적어 우회 시켜 생성해야 한다.
const dumpFilePath = "C:\\RocksdbBrowser\\RocksdbBrower\\Sample sst\\sst_file\\dump.txt";
const realdumpFilePath = "C:\\RocksdbBrowser\\RocksdbBrower\\Sample sst\\sst_file\\output_dump.txt";
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
        fs.readFile(realdumpFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error(`Error reading dump file: ${err.message}`);
                return res.status(500).json({ error: err.message });
            }

            console.log('Dump data:', data); // 데이터 확인

            try {
                const sections = data.split('--------------------------------------').map(s => s.trim());
                const jsonData = {};

                sections.forEach(section => {
                    const lines = section.split('\n').map(line => line.trim());

                    if (lines.length === 0) return;

                    const header = lines[0];
                    const content = lines.slice(1);

                    switch (header) {
                        case 'Footer Details:':
                            jsonData.footerDetails = parseKeyValueSection(content);
                            break;
                        case 'Metaindex Details:':
                            jsonData.metaindexDetails = parseKeyValueSection(content);
                            break;
                        case 'Table Properties:':
                            jsonData.tableProperties = parseKeyValueSection(content);
                            break;
                        case 'Index Details:':
                            jsonData.indexDetails = parseIndexDetails(content);
                            break;
                        case 'Data Block Summary:':
                            jsonData.dataBlockSummary = parseKeyValueSection(content);
                            break;
                        default:
                            // 추가적으로 생성될 내용도 적기
                            break;
                    }
                });

                res.json(jsonData);

            } catch (parseError) {
                console.error(`Error parsing dump data: ${parseError.message}`);
                res.status(500).json({ error: 'Failed to parse dump data' });
            }
        });
    });
});

function parseKeyValueSection(lines) {
    const sectionData = {};
    lines.forEach(line => {
        const [key, value] = line.split(':').map(s => s.trim());
        if (key && value !== undefined) {
            sectionData[key] = value;
        }
    });
    return sectionData;
}

function parseIndexDetails(lines) {
    const indexDetails = {
        blocks: []
    };
    let currentBlock = null;

    lines.forEach(line => {
        if (line.startsWith('HEX') || line.startsWith('ASCII')) {
            if (!currentBlock) {
                currentBlock = {};
            }

            const [type, data] = line.split(' ').filter(Boolean);
            currentBlock[type.toLowerCase()] = data;

        } else if (line.startsWith('Block key')) {
            if (currentBlock) {
                indexDetails.blocks.push(currentBlock);
                currentBlock = null;
            }
        } else {
            const [key, value] = line.split(':').map(s => s.trim());
            if (key && value !== undefined) {
                indexDetails[key] = value;
            }
        }
    });

    if (currentBlock) {
        indexDetails.blocks.push(currentBlock);
    }

    return indexDetails;
}

module.exports = app;
