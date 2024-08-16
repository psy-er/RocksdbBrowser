#include <rocksdb/db.h>
#include <rocksdb/sst_file_writer.h>
#include <iostream>
#pragma comment(lib, "Rpcrt4.lib")
#pragma comment(lib, "Shlwapi.lib")


using namespace std;
using namespace rocksdb;

int main() {
    rocksdb::Options options;
    options.create_if_missing = true;

    // SST ���� ����
    rocksdb::SstFileWriter sst_file_writer(rocksdb::EnvOptions(), options);

    std::string file_path = "C:\\RocksdbBrowser\\RocksdbBrower\\Sample sst\\sst_file/output.sst";
    rocksdb::Status s = sst_file_writer.Open(file_path);
    if (!s.ok()) {
        std::cerr << "Error opening file: " << s.ToString() << std::endl;
        return 1;
    }

    // ������ ����
    s = sst_file_writer.Put("key1", "value1");
    if (!s.ok()) {
        std::cerr << "Error writing to file: " << s.ToString() << std::endl;
        return 1;
    }

    s = sst_file_writer.Put("key2", "value2");
    if (!s.ok()) {
        std::cerr << "Error writing to file: " << s.ToString() << std::endl;
        return 1;
    }

    // �Ϸ� �� ������
    s = sst_file_writer.Finish();
    if (!s.ok()) {
        std::cerr << "Error finishing file: " << s.ToString() << std::endl;
        return 1;
    }

    std::cout << "SST file created successfully." << std::endl;
    return 0;
}