import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FileList from './components/FileList';
import InsertData from './feat_data/InsertData';
import SelectData from './feat_data/SelectData';
import NewRocksdb from './feat_new_rocksdb/NewRocksdb';
import ReadCompressedDirectory from './feat_read_directory/ReadCompressedDirectory';
import ReadDirectory from './feat_read_directory/ReadDirectory';
import ReadCompressedFile from './feat_read_file/ReadCompressedFile';
import ReadFile from './feat_read_file/ReadFile';
import ReadRocksdbMetadata from './feat_read_rocksdb_metadata/ReadRocksdbMetadata';
import RocksdbManual from './feat_introduce_rocksdb/RocksdbManual';
import IndexLayout from './IndexLayout';

function App() {
    return (
        
            <Routes>
                
                {/* test */}
                <Route path="/" element={<IndexLayout/>} />
                <Route path="/filelist" element={<FileList />} />

                {/*Rocksdb 메인 페이지*/}
                <Route path="/manual" element={<RocksdbManual />} />

                {/*Key-Value 데이터*/}
                <Route path="/data/insert" element={<InsertData />} />
                <Route path="/data/select" element={<SelectData />} />
            
                {/* 새로운 Rocksdb 생성 */}
                <Route path="/new/rocksdb" element={<NewRocksdb />} />
      
                {/* SST 파일 업로드 후 데이터 확인하기 */}
                <Route path="/file/compressed" element={<ReadCompressedFile />} />
                <Route path="/file" element={<ReadFile />} />
      
                {/* Rocksdb Path 업로드 후 데이터 확인하기 */}
                <Route path="/directory/compresssed" element={<ReadCompressedDirectory />} />
                <Route path="/directory" element={<ReadDirectory />} />

                {/* Rocksdb Metadata */}
                <Route path="/metadata" element={<ReadRocksdbMetadata />} />

            </Routes>
        
    );
}

export default App;
