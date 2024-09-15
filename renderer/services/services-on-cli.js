"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Services = void 0;
const _file_1 = require("../../main/lib/file-on-disk");
const send_curl_on_cli_1 = require("../../main/lib/send-curl-on-cli");
const execute_script_1 = require("../../shared/execute-script");
const keyValuePair = {};
exports.Services = {
    set(key, value) {
        keyValuePair[key] = value;
        return Promise.resolve();
    },
    get(key) {
        return Promise.resolve(keyValuePair[key]);
    },
    delete(key) {
        delete keyValuePair[key];
        return Promise.resolve();
    },
    clear() {
        Object.keys(keyValuePair).forEach((key) => {
            delete keyValuePair[key];
        });
        return Promise.resolve();
    },
    has(key) {
        return Promise.resolve(keyValuePair[key] !== undefined);
    },
    sendCurl({ curlRequest, variables, selectedDirectory, }) {
        return (0, send_curl_on_cli_1.sendCurl)({ curlRequest, variables, selectedDirectory });
    },
    selectDirectory() {
        throw new Error('Not supported');
    },
    exportFile({ base64, name }) {
        throw new Error('Not supported');
    },
    importFile() {
        throw new Error('Not supported');
    },
    getDirectoryInfo(path) {
        return (0, _file_1.getDirectoryInfo)(path);
    },
    createDirectory(path) {
        return (0, _file_1.createDirectory)(path);
    },
    createFile(path) {
        return (0, _file_1.createFile)(path);
    },
    deleteDirectoryOrFile(path) {
        return (0, _file_1.deleteDirectoryOrFile)(path);
    },
    readFile(path) {
        return (0, _file_1.readFile)(path);
    },
    writeFile(path, document) {
        return (0, _file_1.writeFile)(path, document);
    },
    renameDirectoryOrFile({ oldPath, newPath, }) {
        return (0, _file_1.renameDirectoryOrFile)({
            oldPath,
            newPath,
        });
    },
    duplicateDirectoryOrFile(filePath) {
        return (0, _file_1.duplicateDirectoryOrFile)(filePath);
    },
    moveDirectoryOrFile({ oldPath, newPath, }) {
        return (0, _file_1.moveDirectoryOrFile)({
            oldPath,
            newPath,
        });
    },
    fixSelectedSubDirectoryOrFile({ selectedSubDirectoryOrFile, selectedDirectory, selectedSubType, }) {
        return (0, _file_1.fixSelectedSubDirectoryOrFile)({
            selectedSubDirectoryOrFile,
            selectedDirectory,
            selectedSubType,
        });
    },
    openExternal(url) {
        throw new Error('Not supported');
    },
    checkForUpdates() {
        throw new Error('Not supported');
    },
    downloadUpdates() {
        throw new Error('Not supported');
    },
    getDownloadUpdatesProgress() {
        throw new Error('Not supported');
    },
    quitAndInstall() {
        throw new Error('Not supported');
    },
    executeScript(args) {
        return (0, execute_script_1.executeScript)(args);
    },
    readFileAsBase64(path) {
        return (0, _file_1.readFileAsBase64)(path);
    },
    checkIfFileExists(path) {
        return (0, _file_1.checkIfFileExists)(path);
    },
    showItemInFolder(path) {
        throw new Error('Not supported');
    },
};
//# sourceMappingURL=services-on-cli.js.map