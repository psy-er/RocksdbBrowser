#include <iostream>
#include "rocksdb/db.h"
#include "rocksdb/options.h"

using namespace std;
using namespace rocksdb;

int main() {
    rocksdb::Options options;
    options.create_if_missing = true;

    // 데이터베이스 복구
    rocksdb::Status status = rocksdb::RepairDB("C:\\RocksdbBrowser\\RocksdbBrower\\backend\\test4", options);
    if (!status.ok()) {
        std::cerr << "데이터베이스 복구 실패: " << status.ToString() << std::endl;
        return 1;
    }

    std::cout << "데이터베이스 복구 성공!" << std::endl;
    return 0;
}
