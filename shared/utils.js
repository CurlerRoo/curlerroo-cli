"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debugLog = exports.getLinesFromText = exports.findVariableFromCurlPartValue = void 0;
const findVariableFromCurlPartValue = ({ value, variables, }) => {
    const variable = variables.find((v) => `$${v.key}` === value || `\${${v.key}}` === value);
    return variable;
};
exports.findVariableFromCurlPartValue = findVariableFromCurlPartValue;
const getLinesFromText = ({ text }) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
        const isFirst = index === 0;
        const isLast = index === lines.length - 1;
        if (isFirst && !isLast) {
            return `${line}\n`;
        }
        return line;
    });
};
exports.getLinesFromText = getLinesFromText;
const debugLog = (message, ...optionalParams) => {
    if (process.env.NODE_ENV === 'development') {
        console.log(message, ...optionalParams);
    }
};
exports.debugLog = debugLog;
//# sourceMappingURL=utils.js.map