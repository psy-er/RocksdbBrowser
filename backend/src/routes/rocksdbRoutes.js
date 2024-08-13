const express = require('express');
const router = express.Router();
const { execFile } = require('child_process');
const levelup = require('levelup');
const leveldown = require('leveldown');

const dbPath = 'C:\\RocksdbBrowser\\RocksdbBrower\\rocksdbpath\\test4';
const db = levelup(leveldown(dbPath), { createIfMissing: true });

db.open((err) => {
    if (err) throw err;
    console.log('RocksDB connected');
});

// C++ 애플리케이션 실행 함수
function runRocksDBApp(callback) {
    execFile('C:\\RocksdbBrowser\\RocksdbBrower\\Memtable Flush\\x64\\Release\\Memtable Flush.exe', (error, stdout, stderr) => {
        if (error) {
            console.error('Error executing C++ app:', stderr);
            callback(error, null);
        } else {
            console.log('C++ app output:', stdout);
            callback(null, stdout);
        }
    });
}

// Insert key-value
router.post('/insert', (req, res) => {
    const { key, value } = req.body;

    db.put(key, JSON.stringify(value), { sync: true }, (err) => {
        if (err) {
            res.status(500).json({ message: 'Failed to insert data', error: err });
        } else {
            // C++ 애플리케이션 실행 후 결과 반환
            runRocksDBApp((error, output) => {
                if (error) {
                    res.status(500).json({ message: 'Failed to run C++ app', error: error });
                } else {
                    res.status(200).json({ message: 'Data inserted successfully', output: output });
                }
            });
        }
    });
});

// Get all data
router.get('/all', (req, res) => {
    const result = [];
    const iterator = db.iterator();

    const collectData = () => {
        iterator.next((err, key, value) => {
            if (err) {
                res.status(500).json({ message: 'Failed to retrieve data', error: err });
                return;
            }
            if (key === null || value === null) {
                iterator.end((endErr) => {
                    if (endErr) {
                        res.status(500).json({ message: 'Failed to close iterator', error: endErr });
                        return;
                    }
                    res.status(200).json(result);
                });
                return;
            }
            if (key !== undefined && value !== undefined) {
                result.push({ key: key.toString(), value: JSON.parse(value.toString()) });
            } else {
                console.warn('Received undefined key or value');
            }
            collectData();
        });
    };

    collectData();
});

module.exports = router;
