"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDocFromDocOnDisk = void 0;
const lodash_1 = __importDefault(require("lodash"));
const types_1 = require("./types");
const uuid_1 = require("uuid");
// migrate here
const getDocFromDocOnDisk = (docOnDisk) => {
    const parsed = lodash_1.default.flow((doc) => {
        return {
            ...doc,
            id: doc.id || (0, uuid_1.v4)(),
            executingAllCells: false,
            cells: doc.cells.map((cell) => ({
                ...cell,
                id: cell.id || (0, uuid_1.v4)(),
                cursor_position: {
                    lineNumber: 1,
                    column: 1,
                    offset: 0,
                },
                outputs: cell.outputs.map((output) => ({
                    ...output,
                    formattedBody: '',
                    bodyFilePath: output.bodyFilePath || '',
                    bodyBase64: output.bodyBase64 || '',
                })),
            })),
        };
    }, (doc) => types_1.docSchema.parse(doc))(docOnDisk);
    return parsed;
};
exports.getDocFromDocOnDisk = getDocFromDocOnDisk;
//# sourceMappingURL=get-doc-from-doc-on-disk.js.map