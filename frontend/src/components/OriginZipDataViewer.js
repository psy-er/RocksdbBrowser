import React, { useState } from 'react';
import axios from 'axios';

function OriginZipDataViewer() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [jsonData, setJsonData] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]); // 선택한 파일을 상태로 저장
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert('Please select a ZIP file first');
      return;
    }

    const formData = new FormData();
    formData.append('sstFile', selectedFile); // 파일을 FormData에 추가

    try {
      const response = await axios.post('http://localhost:5000/origin/analyze-sst/zip', formData, {
        headers: {
          'Content-Type': 'multipart/form-data' // 파일 업로드를 위한 헤더
        }
      });

      setJsonData(response.data); // 응답으로 받은 데이터
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
          Select ZIP File:
          <input
            type="file"
            onChange={handleFileChange}
            accept=".zip" // ZIP 파일만 허용하도록 설정
          />
        </label>
        <button type="submit">Convert and View</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {jsonData && renderKeyValuePairs(jsonData)}
    </div>
  );
}

export default OriginZipDataViewer;
