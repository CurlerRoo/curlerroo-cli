#!/usr/bin/env node

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const _file_1 = require("../main/lib/file-on-disk");
const store_1 = require("../renderer/state/store");
const active_document_1 = require("../renderer/state/features/documents/active-document");
const path_1 = __importDefault(require("path"));
const glob_1 = require("glob");
const bluebird_1 = __importDefault(require("bluebird"));
const exec_sh_1 = require("../main/lib/exec-sh");
// get input file from command line
const main = async () => {
    // check if curl is installed
    await (0, exec_sh_1.execShPromise)('curl --version', true).catch((e) => {
        console.error('Error: curl is not installed');
        process.exit(1);
    });
    const workingDirectory = process.argv[2];
    const files = (0, glob_1.globSync)(`${workingDirectory}/**/*.crr`);
    const results = await bluebird_1.default.map(files, async (crrFilePath) => {
        try {
            const { parsed: document, type } = await (0, _file_1.readFile)(crrFilePath);
            if (type !== 'valid' || !document) {
                throw new Error(`Invalid file: ${crrFilePath}`);
            }
            const store = (0, store_1.createNewStore)();
            store.dispatch((0, active_document_1.setActiveDocument)({
                id: document.id,
                shared_id: document.shared_id,
                version: 2,
                filePath: crrFilePath,
                executingAllCells: document.executingAllCells,
                cells: document.cells.map((cell) => ({
                    ...cell,
                    outputs: cell.outputs.map((output) => ({
                        ...output,
                        formattedBody: '',
                    })),
                })),
                globalVariables: document.globalVariables,
                activeCellIndex: 0,
            }));
            store.dispatch((0, active_document_1.sendAllCurls)({
                selectedDirectory: workingDirectory,
            }));
            await new Promise((resolve) => {
                setTimeout(resolve, 1000);
            });
            while (Math.random() + 2) {
                const cells = store.getState().activeDocument?.cells;
                if (cells?.every((cell) => cell.send_status !== 'sending')) {
                    break;
                }
                else {
                    await new Promise((resolve) => {
                        setTimeout(resolve, 10);
                    });
                }
            }
            const outputFolder = crrFilePath
                .replace(workingDirectory, `${workingDirectory}/curlerroo-cli-output`)
                .replace(/\.crr$/, '');
            const activeDocument = store.getState().activeDocument;
            if (!activeDocument) {
                throw new Error(`Error: ${crrFilePath}: No active document`);
            }
            const results = activeDocument.cells.map((cell, i) => {
                fs_extra_1.default.mkdirSync(outputFolder, { recursive: true });
                fs_extra_1.default.writeFileSync(path_1.default.join(outputFolder, `cell-${i}.json`), JSON.stringify(cell, null, 2));
                if (cell.send_status === 'error' ||
                    cell.pre_scripts_error ||
                    cell.post_scripts_error) {
                    const message = `${crrFilePath}#${i}: Error: ${cell.pre_scripts_error ||
                        cell.post_scripts_error ||
                        cell.outputs.flatMap((output) => output.body).join('.')}`;
                    console.log(message);
                    return {
                        success: false,
                        message,
                    };
                }
                const message = `${crrFilePath}#${i}: Success`;
                console.log(message);
                return {
                    success: true,
                    message,
                };
            });
            return results;
        }
        catch (e) {
            const error = e;
            const message = `${crrFilePath}: Error: ${error.message}`;
            console.log(message);
            return {
                success: false,
                message,
            };
        }
    }, {
        concurrency: 4,
    }).then((m) => m.flat());
    console.log('\nTotal:', results.length);
    console.log('Success:', results.filter((result) => result.success).length);
    console.log('Failed:', results.filter((result) => !result.success).length);
    console.log('See output in:', `${workingDirectory}/curlerroo-cli-output`);
    if (results.some((result) => !result.success)) {
        console.log('Process exited with error');
        process.exit(1);
    }
    console.log('Process exited successfully');
    process.exit(0);
};
main();
//# sourceMappingURL=index.js.map
