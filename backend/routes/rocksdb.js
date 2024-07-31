const express = require('express');
const router = express.Router();
const RocksDB = require('rocksdb');

const dbPath = "rocksdb16";
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

    iterator.each((err, key, value) => {
        if (err) {
            res.status(500).json({ message: 'Failed to retrieve data', error: err });
            return;
        }
        if (key && value) {
            result.push({ key: key.toString(), value: JSON.parse(value.toString()) });
        } else {
            res.status(200).json(result);
        }
    });
});

module.exports = router;

