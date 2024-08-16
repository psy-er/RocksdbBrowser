import React, { useState } from 'react';
import axios from 'axios';

function DataViewer() {
  const [sstFilePath, setSstFilePath] = useState('');
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/analyze-sst', {
        sstFilePath,
      });

      setRecords(response.data.records);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
      setRecords([]);
    }
  };

  return (
    <div>
      <h1>RocksDB SST Analyzer</h1>
      <form onSubmit={handleSubmit}>
        <label>
          SST File Path:
          <input
            type="text"
            value={sstFilePath}
            onChange={(e) => setSstFilePath(e.target.value)}
          />
        </label>
        <button type="submit">Analyze</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {records.map((record, index) => (
          <li key={index}>
            <strong>{record.key}:</strong> {record.value}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DataViewer;
