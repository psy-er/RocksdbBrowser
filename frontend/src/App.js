import React from 'react';
import FileForm from './components/FileForm';
import FileList from './components/FileList';

function App() {
    return (
        <div className="App">
            <h1>RocksDB Browser</h1>
            <FileForm />
            <FileList />
        </div>
    );
}

export default App;
