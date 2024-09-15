"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatBashJSONString = void 0;
const formatBashJSONString = ({ jsonString, indent = 2, initialIndentLevel = 0, }) => {
    const indentString = ' '.repeat(indent);
    const isSingleOuterQuote = jsonString.startsWith("'") && jsonString.endsWith("'");
    const is$SingleOuterQuote = jsonString.startsWith("$'") && jsonString.endsWith("'");
    const isDoubleOuterQuote = jsonString.startsWith('"') && jsonString.endsWith('"');
    const is$DoubleOuterQuote = jsonString.startsWith('$"') && jsonString.endsWith('"');
    const formatChar = ({ char, inString, inVariable, quoteChar, indentLevel, prevChar, restString, }) => {
        // on/off string
        if ((char === '"' || char === "'") && prevChar !== '\\') {
            if (!inString) {
                return {
                    formattedChar: char,
                    inString: true,
                    inVariable,
                    quoteChar: char,
                    indentLevel,
                    skipNext: false,
                };
            }
            if (char === quoteChar) {
                return {
                    formattedChar: char,
                    inString: false,
                    inVariable,
                    quoteChar: null,
                    indentLevel,
                    skipNext: false,
                };
            }
        }
        // short circuit emtpy objects and arrays
        // otherwise, it do nothitng
        if (!inString) {
            if (char === '{' || char === '[') {
                // but if it is prefixed with '$' then it's a variable, then it is not the bracket we are looking for
                if (prevChar === '$') {
                    return {
                        formattedChar: char,
                        inString,
                        inVariable: true,
                        quoteChar,
                        indentLevel,
                        skipNext: false,
                    };
                }
                const closeChar = char === '{' ? '}' : ']';
                const isCloseNext = restString.startsWith(`${closeChar}`) ||
                    restString.match(new RegExp(`^\\s*${closeChar}`));
                if (isCloseNext) {
                    // For empty objects and arrays with possible spaces, shorten the format
                    return {
                        formattedChar: char + closeChar,
                        inString,
                        inVariable,
                        quoteChar,
                        indentLevel,
                        skipNext: true,
                    };
                }
            }
            if (char === '{' || char === '[') {
                if (prevChar === '$') {
                    return {
                        formattedChar: char,
                        inString,
                        inVariable: true,
                        quoteChar,
                        indentLevel,
                        skipNext: false,
                    };
                }
                return {
                    formattedChar: char + '\n' + indentString.repeat(indentLevel + 1),
                    inString,
                    inVariable,
                    quoteChar,
                    indentLevel: indentLevel + 1,
                    skipNext: false,
                };
            }
            if (char === '}' || char === ']') {
                // we are in a ${variable} and we are closing that variable
                // so it's not the bracket we are looking for
                if (inVariable) {
                    return {
                        formattedChar: char,
                        inString,
                        inVariable: false,
                        quoteChar,
                        indentLevel,
                        skipNext: false,
                    };
                }
                return {
                    formattedChar: '\n' + indentString.repeat(indentLevel - 1) + char,
                    inString,
                    inVariable,
                    quoteChar,
                    indentLevel: indentLevel - 1,
                    skipNext: false,
                };
            }
            if (char === ',') {
                return {
                    formattedChar: char + '\n' + indentString.repeat(indentLevel),
                    inString,
                    inVariable,
                    quoteChar,
                    indentLevel,
                    skipNext: false,
                };
            }
            if (char === ':') {
                return {
                    formattedChar: char + ' ',
                    inString,
                    inVariable,
                    quoteChar,
                    indentLevel,
                    skipNext: false,
                };
            }
            if (char === ' ' || char === '\n' || char === '\t' || char === '\r') {
                return {
                    formattedChar: '',
                    inString,
                    inVariable,
                    quoteChar,
                    indentLevel,
                    skipNext: false,
                };
            }
            return {
                formattedChar: char,
                inString,
                inVariable,
                quoteChar,
                indentLevel,
                skipNext: false,
            };
        }
        return {
            formattedChar: char,
            inString,
            inVariable,
            quoteChar,
            indentLevel,
            skipNext: false,
        };
    };
    const innerJSON = (() => {
        if (isSingleOuterQuote || isDoubleOuterQuote) {
            return jsonString.slice(1, -1);
        }
        if (is$SingleOuterQuote || is$DoubleOuterQuote) {
            return jsonString.slice(2, -1);
        }
        return jsonString;
    })();
    const { formatted } = [...innerJSON].reduce(({ formatted, inString, inVariable, quoteChar, indentLevel, skipNext }, char, index, chars) => {
        if (skipNext) {
            if (char === ' ' || char === '\n' || char === '\t' || char === '\r') {
                return {
                    formatted,
                    inString,
                    inVariable,
                    quoteChar,
                    indentLevel,
                    skipNext,
                };
            }
            return {
                formatted,
                inString,
                inVariable,
                quoteChar,
                indentLevel,
                skipNext: false,
            };
        }
        const nextChar = chars[index + 1] || null;
        const restString = innerJSON.slice(index + 1);
        const { formattedChar, inString: newInString, inVariable: newInVariable, quoteChar: newQuoteChar, indentLevel: newIndentLevel, skipNext: newSkipNext, } = formatChar({
            char,
            inString,
            inVariable,
            quoteChar,
            indentLevel,
            prevChar: index > 0 ? chars[index - 1] : null,
            nextChar,
            restString,
        });
        return {
            formatted: formatted + formattedChar,
            inString: newInString !== undefined ? newInString : inString,
            inVariable: newInVariable !== undefined ? newInVariable : inVariable,
            quoteChar: newQuoteChar !== undefined ? newQuoteChar : quoteChar,
            indentLevel: newIndentLevel !== undefined ? newIndentLevel : indentLevel,
            skipNext: newSkipNext,
        };
    }, {
        formatted: '',
        inString: false,
        inVariable: false,
        quoteChar: null,
        indentLevel: initialIndentLevel,
        skipNext: false,
    });
    if (isSingleOuterQuote) {
        return `'${formatted}'`;
    }
    if (isDoubleOuterQuote) {
        return `"${formatted}"`;
    }
    if (is$SingleOuterQuote) {
        return `$'${formatted}'`;
    }
    if (is$DoubleOuterQuote) {
        return `$"${formatted}"`;
    }
    return formatted;
};
exports.formatBashJSONString = formatBashJSONString;
//# sourceMappingURL=json-stringify.js.map