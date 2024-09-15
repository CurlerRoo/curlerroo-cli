"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenize = void 0;
const tokenize = ({ regex, str, startIndex, type, contextType, }) => {
    const matches = [];
    let lastIndex = 0;
    while (true) {
        const match = regex.exec(str);
        if (!match) {
            const value = str.slice(lastIndex);
            if (!value) {
                break;
            }
            matches.push({
                value,
                index: lastIndex,
                type: contextType,
            });
            break;
        }
        if (match.index > lastIndex) {
            matches.push({
                value: str.slice(lastIndex, match.index),
                index: lastIndex,
                type: contextType,
            });
        }
        matches.push({
            value: match[0],
            index: match.index,
            type,
        });
        lastIndex = match.index + match[0].length;
    }
    return matches.map((match) => ({
        ...match,
        index: match.index + (startIndex ?? 0),
    }));
};
exports.tokenize = tokenize;
//# sourceMappingURL=tokenize.js.map