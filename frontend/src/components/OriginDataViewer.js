import React, { useState } from 'react';
import axios from 'axios';

function OriginDataViewer() {
  const [sstFilePath, setSstFilePath] = useState('');
  const [jsonData, setJsonData] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sstFilePath) {
      alert('Please enter the full SST file path first');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/origin/analyze-sst', {
        sstFilePath, // 전체 경로를 서버에 전달
      });

      setJsonData(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
      setJsonData(null); // 에러 발생 시 데이터를 초기화
    }
  };

  const renderKeyValuePairs = (data) => (
    <div>
      <h3>Key : Value</h3>
      <ul>
        {Object.entries(data).length > 0 ? (
          Object.entries(data).map(([key, value], index) => (
            <li key={index}>
              <strong>{key}:</strong> {value}
            </li>
          ))
        ) : (
          <li>No data available</li>
        )}
      </ul>
    </div>
  );

  return (
    <div>
      <h1>RocksDB SST File Viewer</h1>
      <form onSubmit={handleSubmit}>
        <label>
          SST File Path:
          <input
            type="text"
            value={sstFilePath}
            onChange={(e) => setSstFilePath(e.target.value)}
          />
        </label>
        <button type="submit">Convert and View</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {jsonData && renderKeyValuePairs(jsonData)}
    </div>
  );
}

export default OriginDataViewer;
