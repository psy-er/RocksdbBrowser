import React, { useState } from 'react';
import axios from 'axios';

function DataViewer() {
  const [sstFilePath, setSstFilePath] = useState('');
  const [data, setData] = useState(null); // 데이터를 저장하는 상태
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/analyze-sst', {
        sstFilePath,
      });

      setData(response.data); // 서버에서 받은 전체 JSON 객체를 상태로 저장
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
      setData(null); // 에러 발생 시 데이터를 초기화
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

    </div>
  );
}

export default DataViewer;
