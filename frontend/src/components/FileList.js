import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FileList = () => {
    const [fileData, setFileData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/rocksdb/all');
                setFileData(response.data);
            } catch (error) {
                console.error('There was an error fetching the data!', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h2>File List</h2>
            <ul>
                {fileData.map((file, index) => (
                    <li key={index}>
                        <strong>Path:</strong> {file.key} <br />
                        <strong>Info:</strong> {JSON.stringify(file.value)}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FileList;
