#include <napi.h>
#include <rocksdb/sst_file_reader.h>
#include <rocksdb/options.h>

Napi::Value ReadSstFile(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    std::string file_path = info[0].As<Napi::String>();

    rocksdb::Options options;
    rocksdb::SstFileReader reader(file_path, options);

    rocksdb::Status status = reader.Open();
    if (!status.ok()) {
        Napi::TypeError::New(env, "Failed to open SST file").ThrowAsJavaScriptException();
        return env.Null();
    }

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
        Napi::TypeError::New(env, "Error during iteration").ThrowAsJavaScriptException();
        return env.Null();
    }

    return result;
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set("readSstFile", Napi::Function::New(env, ReadSstFile));
    return exports;
}

NODE_API_MODULE(sst_reader, Init)