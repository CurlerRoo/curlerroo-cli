"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDocOnDiskFromDoc = void 0;
const lodash_1 = __importDefault(require("lodash"));
const types_1 = require("./types");
const getDocOnDiskFromDoc = (doc) => {
    const parsedDocOnDisk = lodash_1.default.flow((doc) => types_1.docSchema.parse(doc), (doc) => ({
        ...doc,
        cells: doc.cells.map((cell) => ({
            ...cell,
            send_status: cell.send_status === 'sending' ? 'idle' : cell.send_status,
            sending_id: undefined,
        })),
    }), (doc) => types_1.docOnDiskSchema.parse(doc))(doc);
    return parsedDocOnDisk;
};
exports.getDocOnDiskFromDoc = getDocOnDiskFromDoc;
//# sourceMappingURL=get-doc-on-disk-from-doc.js.map