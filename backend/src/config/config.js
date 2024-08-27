const path = require('path');

// 환경변수 경로 설정
// sst_dump 경로와 파일 경로 설정
const config = {
    sstDumpPath: "C:\\RocksdbBrowser\\RocksdbBrower\\rocksdb\\build\\tools\\Release\\sst_dump.exe",
    dumpFilePath: "C:\\RocksdbBrowser\\RocksdbBrower\\Sample sst\\sst_file\\dump.txt",
    realdumpFilePath: "C:\\RocksdbBrowser\\RocksdbBrower\\Sample sst\\sst_file\\output_dump.txt",
    sstToolPath: "C:\\RocksdbBrowser\\RocksdbBrower\\Sst\\Sst\\x64\\Release\\Sst.exe"
};

// Sample sstFile 경로 (Dump 후 viewer시 필요함) => 파일 탐색기 기능 추가함 (Dump 사용하지 않을 때)
// const sstFilePath = "C:\\RocksdbBrowser\\RocksdbBrower\\Sample sst\\sst_file\\output.sst";
// const sstFilePath = "C:\\RocksdbBrowser\\RocksdbBrower\\Sample sst\\sst_file\\output.zip";

module.exports = config;
