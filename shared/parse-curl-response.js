"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCurlResponse = void 0;
const lodash_1 = __importDefault(require("lodash"));
const parseCurlResponse = ({ headers, body, bodyFilePath, bodyBase64, }) => {
    const parts = headers
        .replaceAll(/\r+\n/g, '\n')
        .split('\n')
        .filter((m) => m[0] === '<' || m[0] === '>')
        .join('\n')
        .split('< \n')
        .filter(Boolean);
    const numberOfHeaderParts = parts.length;
    if (!parts.length && headers.includes('Connection refused')) {
        throw new Error('Connection refused');
    }
    const responeses = [
        ...Array(numberOfHeaderParts || 1)
            .fill(null)
            .map((__, index) => parts[index])
            .map((m) => m || '')
            .map((part, index) => ({
            protocol: part.split('\n< ')[1] || '',
            status: parseInt(part.split('\n< ')[1]?.split(' ')[1]) || 0,
            headers: (0, lodash_1.default)(part.split('\n'))
                .filter((m) => m.startsWith('< '))
                .map((m) => m.replace('< ', ''))
                .map((header) => header.split(': '))
                .map(([name, ...values]) => [name, values.join('')])
                .filter(([, value]) => !!value)
                .fromPairs()
                .value(),
            body: index === numberOfHeaderParts - 1 && !bodyBase64 ? body : '',
            bodyFilePath: index === numberOfHeaderParts - 1 ? bodyFilePath : '',
            bodyBase64: index === numberOfHeaderParts - 1 ? bodyBase64 : '',
        })),
    ];
    return responeses;
};
exports.parseCurlResponse = parseCurlResponse;
//# sourceMappingURL=parse-curl-response.js.map