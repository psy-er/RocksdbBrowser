#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <memory>
#include <rocksdb/sst_file_reader.h>
#include <rocksdb/options.h>
#include <nlohmann/json.hpp>  

using json = nlohmann::json;

int main(int argc, char* argv[]) {
    if (argc != 3) {
        std::cerr << "Usage: " << argv[0] << " <sst_file_path> <output_json_path>" << std::endl;
        return 1;
    }

    std::string sst_file_path = argv[1];
    std::string output_json_path = argv[2];

    rocksdb::Options options;
    options.env = rocksdb::Env::Default();

    // SstFileReader 인스턴스 생성
    rocksdb::SstFileReader sst_reader(options);

    // SstFileReader에 파일 경로를 넘겨줌
    rocksdb::Status status = sst_reader.Open(sst_file_path);
    if (!status.ok()) {
        std::cerr << "Error opening SST file: " << status.ToString() << std::endl;
        return 1;
    }

    json json_data;
    std::unique_ptr<rocksdb::Iterator> it(sst_reader.NewIterator(rocksdb::ReadOptions()));
    for (it->SeekToFirst(); it->Valid(); it->Next()) {
        json_data[it->key().ToString()] = it->value().ToString();
    }

    if (!it->status().ok()) {
        std::cerr << "Error during iteration: " << it->status().ToString() << std::endl;
        return 1;
    }

    std::ofstream output_file(output_json_path);
    output_file << json_data.dump(4);
    output_file.close();

    return 0;
}
