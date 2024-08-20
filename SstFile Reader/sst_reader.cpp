#include <napi.h>
//#include <node_api.h>
#include <rocksdb/sst_file_reader.h>
#include <rocksdb/options.h>
#include <memory>

Napi::Value ReadSstFile(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    // 첫 번째 인수로 파일 경로를 받아옵니다.
    if (info.Length() < 1 || !info[0].IsString()) {
        Napi::TypeError::New(env, "String expected for file path").ThrowAsJavaScriptException();
        return env.Null();
    }

    std::string file_path = info[0].As<Napi::String>().Utf8Value();

    // RocksDB의 옵션을 설정합니다.
    rocksdb::Options options;
    rocksdb::SstFileReader reader(file_path, options);

    // SST 파일을 엽니다.
    rocksdb::Status status = reader.Open();
    if (!status.ok()) {
        Napi::TypeError::New(env, "Failed to open SST file: " + status.ToString()).ThrowAsJavaScriptException();
        return env.Null();
    }

    // 이터레이터를 생성하고 SST 파일의 내용을 읽습니다.
    std::unique_ptr<rocksdb::Iterator> it(reader.NewIterator(rocksdb::ReadOptions()));
    Napi::Array result = Napi::Array::New(env);
    int index = 0;

    for (it->SeekToFirst(); it->Valid(); it->Next()) {
        Napi::Object entry = Napi::Object::New(env);
        entry.Set("key", Napi::String::New(env, it->key().ToString()));
        entry.Set("value", Napi::String::New(env, it->value().ToString()));
        result.Set(index++, entry);
    }

    if (!it->status().ok()) {
        Napi::TypeError::New(env, "Error during iteration: " + it->status().ToString()).ThrowAsJavaScriptException();
        return env.Null();
    }

    return result;
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set("readSstFile", Napi::Function::New(env, ReadSstFile));
    return exports;
}

NODE_API_MODULE(sst_reader, Init)
