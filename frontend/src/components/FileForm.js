import React, { useState } from 'react';
import axios from 'axios';
import WithNavbar from '../WithNavbar';

const FileForm = () => {
    const [filePath, setFilePath] = useState('');
    const [fileInfo, setFileInfo] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        let parsedFileInfo;
        try {
            parsedFileInfo = JSON.parse(fileInfo);
        } catch (error) {
            console.error('Invalid JSON:', error);
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/rocksdb/insert', {
                key: filePath,
                value: parsedFileInfo
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
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
                    value={fileInfo} 
                    onChange={(e) => setFileInfo(e.target.value)} 
                />
                <button type="submit">Insert File Info</button>
            </form>
    );
};

export default FileForm;
