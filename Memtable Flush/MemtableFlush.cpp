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
    options.write_buffer_size = 1; 

    // �����ͺ��̽� ����
    rocksdb::Status status = rocksdb::RepairDB("C:\\RocksdbBrowser\\RocksdbBrower\\rocksdbpath\\test4", options);
    if (!status.ok()) {
        std::cerr << "�����ͺ��̽� ���� ����: " << status.ToString() << std::endl;
        return 1;
    }

    std::cout << "�����ͺ��̽� ���� ����!" << std::endl;

    // RocksDB ����
    status = rocksdb::DB::Open(options, "test4", &db);
    assert(status.ok());
    if (!status.ok()) {
        cerr << "Unable to open RocksDB: " << status.ToString() << endl;
        return 1;
    }

    // ������ ����
    status = db->Put(rocksdb::WriteOptions(), "key1", "value1");
    if (!status.ok()) {
        cerr << "Failed to put data: " << status.ToString() << endl;
        return 1;
    }

    // MemTable Flush ����
    rocksdb::FlushOptions flush_options;
    flush_options.wait = true; // �÷��� �Ϸ���� ���
    status = db->Flush(flush_options);
    if (!status.ok()) {
        cerr << "Fail to flush memtable: " << status.ToString() << endl;
        return 1;
    }
    else {
        cout << "Success to flush memtable!" << endl;
    }

    // ���Ѽ� ȣ��
    rocksdb::CompactRangeOptions compact_options;
    status = db->CompactRange(compact_options, nullptr, nullptr);
    if (!status.ok()) {
        cerr << "Failed to compact range: " << status.ToString() << endl;
        return 1;
    }

    cout << "Success to compact range" << endl;

    delete db;
    return 0;
}
