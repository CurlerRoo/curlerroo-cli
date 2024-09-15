"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfFileExists = exports.writeFileFromBase64 = exports.readFileAsBase64 = exports.fixSelectedSubDirectoryOrFile = exports.copyFile = exports.moveDirectoryOrFile = exports.duplicateDirectoryOrFile = exports.renameDirectoryOrFile = exports.writeFile = exports.readFile = exports.deleteDirectoryOrFile = exports.createFile = exports.createDirectory = exports.getDirectoryInfo = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const lodash_1 = __importDefault(require("lodash"));
const directory_tree_1 = __importDefault(require("directory-tree"));
const types_1 = require("../../shared/types");
const _constants_1 = require("../../shared/constants/constants-on-electron");
const get_doc_from_doc_on_disk_1 = require("../../shared/get-doc-from-doc-on-disk");
const get_doc_on_disk_from_doc_1 = require("../../shared/get-doc-on-disk-from-doc");
const getDirectoryInfo = async (dirPath) => {
    const data = (0, directory_tree_1.default)(dirPath, { exclude: /.git/ });
    return data;
};
exports.getDirectoryInfo = getDirectoryInfo;
const createDirectory = async (dirPath) => {
    const parsedIndex = parseInt(dirPath.split('-').slice(-1)[0]);
    const isIndexed = !Number.isNaN(parsedIndex);
    const index = isIndexed ? parsedIndex : 0;
    await fs_extra_1.default.mkdir(dirPath).catch(async (err) => {
        if (err.code === 'EEXIST') {
            if (isIndexed) {
                await (0, exports.createDirectory)(`${dirPath.split('-').slice(0, -1).join('-')}-${index + 1}`);
            }
            else {
                await (0, exports.createDirectory)(`${dirPath}-${index + 1}`);
            }
        }
    });
};
exports.createDirectory = createDirectory;
const createFile = async (filePath) => {
    const extension = filePath.split('.').slice(-1)[0];
    const parsedIndex = parseInt(filePath
        .split('-')
        .slice(-1)[0]
        .replace(new RegExp(`.${extension}$`), ''));
    const isIndexed = !Number.isNaN(parsedIndex);
    const index = isIndexed ? parsedIndex : 0;
    const fileExisted = await fs_extra_1.default.pathExists(filePath);
    if (fileExisted) {
        if (isIndexed) {
            return (0, exports.createFile)(`${filePath
                .replace(new RegExp(`.${extension}$`), '')
                .split('-')
                .slice(0, -1)
                .join('-')}-${index + 1}.${extension}`);
        }
        return (0, exports.createFile)(`${filePath.replace(new RegExp(`.${extension}$`), '')}-${index + 1}.${extension}`);
    }
    await fs_extra_1.default.writeFile(filePath, '');
    return { filePath };
};
exports.createFile = createFile;
const deleteDirectoryOrFile = async (dirPath) => {
    await fs_extra_1.default.remove(dirPath);
};
exports.deleteDirectoryOrFile = deleteDirectoryOrFile;
const readFile = async (filePath) => {
    try {
        const text = await fs_extra_1.default.readFile(filePath, 'utf-8');
        if (!text
            .replaceAll('\n', '')
            .replaceAll(' ', '')
            .replaceAll('\t', '')
            .replaceAll('\r', '')) {
            return { parsed: null, type: 'empty' };
        }
        const parsed = lodash_1.default.flow((_text) => JSON.parse(_text), (doc) => types_1.docOnDiskSchema.parse(doc), get_doc_from_doc_on_disk_1.getDocFromDocOnDisk)(text);
        return { parsed, type: 'valid' };
    }
    catch (err) {
        console.error(err);
        return { parsed: null, type: 'invalid' };
    }
};
exports.readFile = readFile;
const writeFile = async (filePath, document) => {
    try {
        const parsedDocOnDisk = (0, get_doc_on_disk_from_doc_1.getDocOnDiskFromDoc)(document);
        const text = JSON.stringify(parsedDocOnDisk, null, 2);
        // check if file exists
        await fs_extra_1.default.access(filePath);
        await fs_extra_1.default.writeFile(filePath, text);
    }
    catch (err) {
        console.error(err);
        throw err;
    }
};
exports.writeFile = writeFile;
const renameDirectoryOrFile = async ({ oldPath, newPath, }) => {
    if (await fs_extra_1.default.pathExists(newPath)) {
        throw new Error('File or directory already exists');
    }
    await fs_extra_1.default.rename(oldPath, newPath);
};
exports.renameDirectoryOrFile = renameDirectoryOrFile;
const _duplicateDirectoryOrFile = async (filePath, originalFilePath) => {
    const extension = filePath.split('.').slice(-1)[0];
    const pathWithoutExtension = filePath.replace(new RegExp(`.${extension}$`), '');
    const parsedIndex = parseInt(pathWithoutExtension.split('-').slice(-1)[0]);
    const isIndexed = !Number.isNaN(parsedIndex);
    const index = isIndexed ? parsedIndex : 0;
    const fileExisted = await fs_extra_1.default.pathExists(pathWithoutExtension.concat(`.${extension}`));
    if (fileExisted) {
        if (isIndexed) {
            await _duplicateDirectoryOrFile(`${pathWithoutExtension.split('-').slice(0, -1).join('-')}-${index + 1}`.concat(`.${extension}`), originalFilePath || pathWithoutExtension);
        }
        else {
            await _duplicateDirectoryOrFile(`${pathWithoutExtension}-${index + 1}`.concat(`.${extension}`), originalFilePath || pathWithoutExtension);
        }
    }
    await fs_extra_1.default.copyFile(originalFilePath, pathWithoutExtension.concat(`.${extension}`));
};
const duplicateDirectoryOrFile = async (filePath) => {
    await _duplicateDirectoryOrFile(filePath, filePath);
};
exports.duplicateDirectoryOrFile = duplicateDirectoryOrFile;
const moveDirectoryOrFile = async ({ oldPath, newPath, }) => {
    await fs_extra_1.default.move(oldPath, newPath);
};
exports.moveDirectoryOrFile = moveDirectoryOrFile;
const copyFile = async ({ sourceFilePath, destinationFilePath, }) => {
    await fs_extra_1.default.copyFile(sourceFilePath, destinationFilePath);
};
exports.copyFile = copyFile;
const fixSelectedSubDirectoryOrFile = async ({ selectedDirectory, selectedSubDirectoryOrFile, selectedSubType, }) => {
    if (!selectedSubDirectoryOrFile.includes(selectedDirectory)) {
        return {
            selectedSubDirectoryOrFile: selectedDirectory,
            selectedSubType: 'directory',
        };
    }
    if (await fs_extra_1.default.pathExists(selectedSubDirectoryOrFile)) {
        return {
            selectedSubDirectoryOrFile,
            selectedSubType,
        };
    }
    return (0, exports.fixSelectedSubDirectoryOrFile)({
        selectedDirectory,
        selectedSubDirectoryOrFile: `${selectedSubDirectoryOrFile
            .split(_constants_1.PATH_SEPARATOR)
            .slice(0, -1)}`,
        selectedSubType: 'directory',
    });
};
exports.fixSelectedSubDirectoryOrFile = fixSelectedSubDirectoryOrFile;
const readFileAsBase64 = async (filePath) => {
    return fs_extra_1.default
        .readFile(filePath)
        .then((data) => data.toString('base64'))
        .catch(() => '');
};
exports.readFileAsBase64 = readFileAsBase64;
const writeFileFromBase64 = async (filePath, base64) => {
    const buffer = Buffer.from(base64, 'base64');
    await fs_extra_1.default.writeFile(filePath, buffer);
};
exports.writeFileFromBase64 = writeFileFromBase64;
const checkIfFileExists = async (filePath) => {
    return fs_extra_1.default.pathExists(filePath);
};
exports.checkIfFileExists = checkIfFileExists;
//# sourceMappingURL=file-on-disk.js.map