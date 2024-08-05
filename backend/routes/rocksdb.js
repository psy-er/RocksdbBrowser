const express = require('express');
const router = express.Router();
const RocksDB = require('rocksdb');

const dbPath = "testdb";
const db = RocksDB(dbPath);

db.open({ createIfMissing: true }, (err) => {
    if (err) throw err;
    console.log('RocksDB connected');
});

// Insert file info
router.post('/insert', (req, res) => {
    const { key, value } = req.body;

    db.put(key, JSON.stringify(value), (err) => {
        if (err) {
            res.status(500).json({ message: 'Failed to insert data', error: err });
        } else {
            res.status(200).json({ message: 'Data inserted successfully' });
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
                // End of the iteration
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
            // Continue to the next entry
            collectData();
        });
    };

    collectData(); // Start data collection
});

module.exports = router;
