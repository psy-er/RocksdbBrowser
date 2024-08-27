const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const unzipper = require('unzipper');
const config = require('../config/config');

const parseDumpData = (data) => {
    const keyValuePattern = /HEX\s+([0-9A-Fa-f]+):\s+([0-9A-Fa-f\s]+)\s+ASCII\s+([^\n]+)\n/g;
    const result = {};
    let match;

    while ((match = keyValuePattern.exec(data)) !== null) {
        const hex = match[1].trim();
        const ascii = match[3].trim();

        const [key, value] = ascii.split(' : ');
        if (key && value) {
            result[key.trim()] = value.trim();
        }
    }

    return result;
};

const analyzeSst = (req, res) => {
    const { sstFilePath } = req.body;

    if (!fs.existsSync(sstFilePath)) {
        return res.status(400).json({ error: 'File not found' });
    }

    exec(`"${config.sstDumpPath}" --file="${sstFilePath}" --command=raw > "${config.dumpFilePath}"`, (err, stdout, stderr) => {
        if (err) {
            console.error(`Error executing sst_dump: ${stderr}`);
            return res.status(500).json({ error: stderr });
        }

        fs.readFile(config.realdumpFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error(`Error reading dump file: ${err.message}`);
                return res.status(500).json({ error: err.message });
            }

            const parsedData = parseDumpData(data);
            res.json(parsedData);
        });
    });
};

const analyzeSstZip = (req, res) => {
    const { sstFilePath } = req.body;

    if (!fs.existsSync(sstFilePath)) {
        return res.status(400).json({ error: 'File not found' });
    }

    const unzipOutputDir = path.join(path.dirname(sstFilePath), 'unzipped');

    if (!fs.existsSync(unzipOutputDir)) {
        fs.mkdirSync(unzipOutputDir);
    }

    fs.createReadStream(sstFilePath)
        .pipe(unzipper.Extract({ path: unzipOutputDir }))
        .on('close', () => {
            const unzippedFiles = fs.readdirSync(unzipOutputDir);
            let sstFile = unzippedFiles.find(file => path.extname(file) === '.sst');

            if (!sstFile) {
                return res.status(400).json({ error: 'No .sst file found in the archive' });
            }

            let originalUnzippedFilePath = path.join(unzipOutputDir, sstFile);
            let cleanUnzippedFilePath = path.join(unzipOutputDir, 'cleaned_output.sst');

            try {
                fs.renameSync(originalUnzippedFilePath, cleanUnzippedFilePath);
            } catch (error) {
                return res.status(500).json({ error: 'Failed to rename the unzipped file' });
            }

            exec(`"${config.sstDumpPath}" --file="${cleanUnzippedFilePath}" --command=raw > "${config.dumpFilePath}"`, (err, stdout, stderr) => {
                if (err) {
                    console.error(`Error executing sst_dump: ${stderr}`);
                    return res.status(500).json({ error: stderr });
                }

                fs.readFile(config.realdumpFilePath, 'utf8', (err, data) => {
                    if (err) {
                        console.error(`Error reading dump file: ${err.message}`);
                        return res.status(500).json({ error: err.message });
                    }

                    const parsedData = parseDumpData(data);
                    res.json(parsedData);
                });
            });
        })
        .on('error', (err) => {
            console.error(`Error during unzip: ${err.message}`);
            return res.status(500).json({ error: 'Failed to unzip the file' });
        });
};

const originAnalyzeSst = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'File not uploaded' });
    }

    const sstFilePath = req.file.path;
    const outputJsonPath = path.join(__dirname, 'output.json');

    const command = `"${config.sstToolPath}" "${sstFilePath}" "${outputJsonPath}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).json({ error: 'Failed to convert SST file' });
        }

        fs.readFile(outputJsonPath, 'utf8', (err, data) => {
            if (err) {
                console.error(`readFile error: ${err}`);
                return res.status(500).json({ error: 'Failed to read JSON file' });
            }

            res.json(JSON.parse(data));
        });
    });
};

const originAnalyzeSstZip = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'File not uploaded' });
    }

    const sstFilePath = req.file.path;

    if (!fs.existsSync(sstFilePath)) {
        return res.status(400).json({ error: 'File not found' });
    }

    const unzipOutputDir = path.join(path.dirname(sstFilePath), 'unzipped');

    if (!fs.existsSync(unzipOutputDir)) {
        fs.mkdirSync(unzipOutputDir);
    }

    fs.createReadStream(sstFilePath)
        .pipe(unzipper.Extract({ path: unzipOutputDir }))
        .on('close', () => {
            const unzippedFiles = fs.readdirSync(unzipOutputDir);
            let sstFile = unzippedFiles.find(file => path.extname(file) === '.sst');

            if (!sstFile) {
                return res.status(400).json({ error: 'No .sst file found in the archive' });
            }

            let originalUnzippedFilePath = path.join(unzipOutputDir, sstFile);
            let cleanUnzippedFilePath = path.join(unzipOutputDir, 'cleaned_output.sst');

            try {
                fs.renameSync(originalUnzippedFilePath, cleanUnzippedFilePath);
            } catch (error) {
                return res.status(500).json({ error: 'Failed to rename the unzipped file' });
            }

            const outputJsonPath = path.join(__dirname, 'output.json');
            const command = `"${config.sstToolPath}" "${cleanUnzippedFilePath}" "${outputJsonPath}"`;

            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    return res.status(500).json({ error: 'Failed to convert SST file' });
                }

                fs.readFile(outputJsonPath, 'utf8', (err, data) => {
                    if (err) {
                        console.error(`readFile error: ${err}`);
                        return res.status(500).json({ error: 'Failed to read JSON file' });
                    }

                    res.json(JSON.parse(data));
                });
            });
        })
        .on('error', (err) => {
            console.error(`Error during unzip: ${err.message}`);
            return res.status(500).json({ error: 'Failed to unzip the file' });
        });
};

module.exports = {
    analyzeSst,
    analyzeSstZip,
    originAnalyzeSst,
    originAnalyzeSstZip
};

