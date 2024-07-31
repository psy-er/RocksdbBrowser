import React, { useState } from 'react';
import axios from 'axios';

const FileForm = () => {
    const [filePath, setFilePath] = useState('');
    const [fileInfo, setFileInfo] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/rocksdb/insert', {
                key: filePath,
                value: fileInfo
            });
            console.log(response.data);
        } catch (error) {
            console.error('There was an error inserting the data!', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="text" 
                placeholder="File Path" 
                value={filePath} 
                onChange={(e) => setFilePath(e.target.value)} 
            />
            <textarea 
                placeholder="File Info as JSON" 
                value={JSON.stringify(fileInfo)} 
                onChange={(e) => setFileInfo(JSON.parse(e.target.value))} 
            />
            <button type="submit">Insert File Info</button>
        </form>
    );
};

export default FileForm;
