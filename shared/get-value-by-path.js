"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValueByPath = void 0;
const getValueByPath = (object, path, defaultValue) => {
    const removeQuotes = (string) => {
        if (string.startsWith('"') && string.endsWith('"')) {
            return string.slice(1, -1);
        }
        if (string.startsWith("'") && string.endsWith("'")) {
            return string.slice(1, -1);
        }
        return string;
    };
    const fullPath = Array.isArray(path)
        ? path
        : path.split(/[.[\]]/).filter(Boolean);
    const value = fullPath.reduce((acc, key) => {
        const unquotedKey = removeQuotes(key);
        const result = acc && unquotedKey in Object(acc) ? acc[unquotedKey] : defaultValue;
        return result;
    }, object);
    if (typeof value === 'object') {
        return value;
    }
    return value;
};
exports.getValueByPath = getValueByPath;
//# sourceMappingURL=get-value-by-path.js.map