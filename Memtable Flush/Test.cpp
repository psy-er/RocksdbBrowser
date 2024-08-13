#include <iostream>
#include "rocksdb/db.h"
#include "rocksdb/options.h"

using namespace std;
using namespace rocksdb;

int main() {
    rocksdb::Options options;
    options.create_if_missing = true;

    // �����ͺ��̽� ����
    rocksdb::Status status = rocksdb::RepairDB("C:\\RocksdbBrowser\\RocksdbBrower\\backend\\test4", options);
    if (!status.ok()) {
        std::cerr << "�����ͺ��̽� ���� ����: " << status.ToString() << std::endl;
        return 1;
    }

    std::cout << "�����ͺ��̽� ���� ����!" << std::endl;
    return 0;
}
