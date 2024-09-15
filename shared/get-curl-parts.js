"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurlParts = void 0;
const _constants_1 = require("./constants/constants-on-electron");
const tokenize_1 = require("./tokenize");
const tokenizeString = (str, startIndex) => {
    return (0, tokenize_1.tokenize)({
        regex: new RegExp(
        // (?<!#[^\\n]*): not commented
        // (?<!${ANY_BREAKLINE_ESCAPE_CHAR_REGEX}): not escaped
        // \\$?: the string can start with $. For example: $'hello' TODO: check if this works on PowerShell
        // (['"]): the string can start with ' or "
        // .*?: the string can contain anything
        // ${NOT_ANY_BREAKLINE_ESCAPE_CHAR_REGEX}: the string can contain anything but not multiline
        // \\1: the string can end with the same quote as the start
        `(?<!#[^\\n]*)(?<!${_constants_1.ANY_BREAKLINE_ESCAPE_CHAR_REGEX})\\$?(['"]).*?${_constants_1.NOT_ANY_BREAKLINE_ESCAPE_CHAR_REGEX}\\1`, 'gs'),
        str,
        type: 'value',
        contextType: null,
        startIndex,
    });
};
const tokenizeOption = (str, startIndex) => {
    return (0, tokenize_1.tokenize)({
        regex: /(?<=\s)-{1,2}[a-zA-Z0-9-]+/g,
        str,
        type: 'option',
        contextType: null,
        startIndex,
    });
};
const tokenizeBackslashNewline = (str, startIndex) => {
    return (0, tokenize_1.tokenize)({
        regex: new RegExp(`${_constants_1.ANY_BREAKLINE_ESCAPE_CHAR_REGEX}\\n`, 'g'),
        str,
        type: 'backslash-newline',
        contextType: null,
        startIndex,
    });
};
const tokenizeNewline = (str, startIndex) => {
    return (0, tokenize_1.tokenize)({
        regex: /\n/g,
        str,
        type: 'newline',
        contextType: null,
        startIndex,
    });
};
const tokenizeSpace = (str, startIndex) => {
    return (0, tokenize_1.tokenize)({
        regex: /\s+/g,
        str,
        type: 'space',
        contextType: null,
        startIndex,
    });
};
const tokenizeCurl = (str, startIndex) => {
    return (0, tokenize_1.tokenize)({
        regex: /^curl/g,
        str,
        type: 'curl',
        contextType: null,
        startIndex,
    });
};
const tokenizeVariable = (str, startIndex, contextType) => {
    return (0, tokenize_1.tokenize)({
        regex: /(\$[a-zA-Z_][a-zA-Z0-9_]*)|(\${[a-zA-Z_][a-zA-Z0-9_]*})/g,
        str,
        type: 'variable',
        contextType,
        startIndex,
    });
};
const tokenizeEscapedVariable = (str, startIndex, contextType) => {
    return (0, tokenize_1.tokenize)({
        regex: /(\$[a-zA-Z_][a-zA-Z0-9_]*)|(\${[a-zA-Z_][a-zA-Z0-9_]*})/g,
        str,
        type: 'escaped-variable',
        contextType,
        startIndex,
    });
};
const tokenizeLiteralValue = (str, startIndex) => {
    return (0, tokenize_1.tokenize)({
        regex: /.+/g,
        str,
        type: 'value',
        contextType: null,
        startIndex,
    });
};
const tokenizeComment = (str, startIndex) => {
    return (0, tokenize_1.tokenize)({
        regex: /#.*/g,
        str,
        type: 'comment',
        contextType: null,
        startIndex,
    });
};
const convertIndicesToLineColumn = (str, indices) => {
    const lineColumnIndices = indices.map((index) => {
        const line = str.slice(0, index).split('\n').length;
        const column = index - str.slice(0, index).lastIndexOf('\n');
        return {
            line,
            column,
        };
    });
    return lineColumnIndices;
};
const getCurlParts = (request) => {
    const parts = [
        {
            value: request.replace(/\r+\n/g, '\n'),
            index: 0,
            type: null,
        },
    ];
    const stringParts = parts
        .flatMap((part) => {
        if (part.type != null) {
            return [part];
        }
        return tokenizeString(part.value, part.index);
    })
        .flatMap((part) => {
        if (part.type != null) {
            return [part];
        }
        return tokenizeComment(part.value, part.index);
    })
        .flatMap((part) => {
        if (part.type != null) {
            return [part];
        }
        return tokenizeOption(part.value, part.index);
    })
        .flatMap((part) => {
        if (part.type != null) {
            return [part];
        }
        return tokenizeBackslashNewline(part.value, part.index);
    })
        .flatMap((part) => {
        if (part.type != null) {
            return [part];
        }
        return tokenizeNewline(part.value, part.index);
    })
        .flatMap((part) => {
        if (part.type != null) {
            return [part];
        }
        return tokenizeSpace(part.value, part.index);
    })
        .flatMap((part) => {
        if (part.type != null) {
            return [part];
        }
        return tokenizeCurl(part.value, part.index);
    })
        .flatMap((part) => {
        if (part.type != null) {
            return [part];
        }
        return tokenizeLiteralValue(part.value, part.index);
    })
        .flatMap((part) => {
        if (part.type === 'value' &&
            (part.value?.startsWith('"') || part.value?.startsWith('$"')) &&
            part.value?.endsWith('"')) {
            return tokenizeEscapedVariable(part.value, part.index, part.type);
        }
        // Not sure. But I think it's unquoted value
        if ((part.type === 'value' &&
            part.value?.[0] !== "'" &&
            part.value?.[part.value.length - 1] !== '"') ||
            part.type == null) {
            return tokenizeVariable(part.value, part.index, part.type);
        }
        return [part];
    });
    return stringParts.map((part) => ({
        ...part,
        ...convertIndicesToLineColumn(request, [part.index])[0],
    }));
};
exports.getCurlParts = getCurlParts;
//# sourceMappingURL=get-curl-parts.js.map