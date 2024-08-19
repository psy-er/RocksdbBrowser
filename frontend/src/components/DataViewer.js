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

  const renderSection = (title, content) => (
    <div>
      <h3>{title}</h3>
      <ul>
        {Object.entries(content).map(([key, value], index) => (
          <li key={index}>
            <strong>{key}:</strong> {JSON.stringify(value)}
          </li>
        ))}
      </ul>
    </div>
  );

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
      {data ? (
        <div>
          {data.footerDetails && renderSection('Footer Details', data.footerDetails)}
          {data.metaindexDetails && renderSection('Metaindex Details', data.metaindexDetails)}
          {data.tableProperties && renderSection('Table Properties', data.tableProperties)}
          {data.indexDetails && renderSection('Index Details', data.indexDetails)}
          {data.dataBlockSummary && renderSection('Data Block Summary', data.dataBlockSummary)}
        </div>
      ) : (
        <p>sst 파일 경로를 입력해주세요.</p>
      )}
    </div>
  );
}

export default DataViewer;
