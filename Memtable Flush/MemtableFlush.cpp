#include <iostream>
#include <rocksdb/db.h>
#include <rocksdb/status.h>
#include <rocksdb/options.h>

using namespace std;
using namespace rocksdb;

int main() {

    rocksdb::DB* db;
    rocksdb::Options options;
    options.create_if_missing = true;

    // RocksDB 열기
    rocksdb::Status status = rocksdb::DB::Open(options, "test", &db);
    if (!status.ok()) {
        cerr << "Unable to open RocksDB: " << status.ToString() << endl;
        return 1;
    }

    // 데이터 삽입
    status = db->Put(rocksdb::WriteOptions(), "key1", "value1");
    if (!status.ok()) {
        cerr << "Failed to put data: " << status.ToString() << endl;
    }

    // MemTable Flush 수행
    status = db->Flush(rocksdb::FlushOptions());
    if (!status.ok()) {
        cerr << "Fail to flush memtable: " << status.ToString() << endl;
    }
    else {
        cout << "Success to flush memtable" << endl;
    }

    delete db;
    return 0;
}
