"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatCurl = exports.groupValueAndVariable = void 0;
const uuid_1 = require("uuid");
const lodash_1 = __importDefault(require("lodash"));
const get_curl_parts_1 = require("./get-curl-parts");
const _constants_1 = require("./constants/constants-on-electron");
const json_stringify_1 = require("./json-stringify");
const trimArray = (array, isTrimValue) => {
    if (!array.length) {
        return array;
    }
    if (isTrimValue(array[0])) {
        return trimArray(array.slice(1), isTrimValue);
    }
    if (isTrimValue(array[array.length - 1])) {
        return trimArray(array.slice(0, array.length - 1), isTrimValue);
    }
    return array;
};
// becareful if you want to strip single or double quotes from the value
// because it might contain spaces
const groupValueAndVariable = (parts) => {
    return parts.reduce((acc, part) => {
        if (acc.lastPartType === 'embedded-value' &&
            ['value', 'variable', 'escaped-variable'].includes(part.type)) {
            const lastValue = acc.groupedParts[acc.groupedParts.length - 1].value;
            const value = (() => {
                if ((lastValue.startsWith("'") &&
                    lastValue.endsWith("'") &&
                    part.value.startsWith("'") &&
                    part.value.endsWith("'")) ||
                    (lastValue.startsWith('"') &&
                        lastValue.endsWith('"') &&
                        part.value.startsWith('"') &&
                        part.value.endsWith('"'))) {
                    return (lastValue.slice(0, lastValue.length - 1) + part.value.slice(1));
                }
                if (lastValue.startsWith("'") &&
                    lastValue.endsWith("'") &&
                    part.value.startsWith('"') &&
                    part.value.endsWith('"') &&
                    !lastValue.includes('"')) {
                    return `"${lastValue.slice(1, lastValue.length - 1)}${part.value.slice(1)}`;
                }
                if (lastValue.startsWith('"') &&
                    lastValue.endsWith('"') &&
                    part.value.startsWith("'") &&
                    part.value.endsWith("'") &&
                    !part.value.includes('"')) {
                    return `${lastValue.slice(0, lastValue.length - 1)}${part.value.slice(1, part.value.length - 1)}"`;
                }
                return lastValue + part.value;
            })();
            return {
                lastPartType: 'embedded-value',
                groupedParts: [
                    ...acc.groupedParts.slice(0, acc.groupedParts.length - 1),
                    {
                        ...acc.groupedParts[acc.groupedParts.length - 1],
                        value,
                    },
                ],
            };
        }
        if (['value', 'variable', 'escaped-variable'].includes(part.type)) {
            return {
                lastPartType: 'embedded-value',
                groupedParts: [
                    ...acc.groupedParts,
                    { ...part, type: 'embedded-value' },
                ],
            };
        }
        return {
            lastPartType: part.type,
            groupedParts: [...acc.groupedParts, part],
        };
    }, {
        lastPartType: null,
        groupedParts: [],
    }).groupedParts;
};
exports.groupValueAndVariable = groupValueAndVariable;
const formatCurl = (curl, options) => {
    const { formatted } = lodash_1.default.flow((_curl) => (0, get_curl_parts_1.getCurlParts)(_curl), exports.groupValueAndVariable, (parts) => parts.filter((part) => [
        // 'variable',
        // 'escaped-variable',
        // 'value',
        'embedded-value',
        'option',
        'curl',
        'space',
        options?.removeComments ? (0, uuid_1.v4)() : 'comment',
    ].includes(part.type)), (parts) => {
        return trimArray(parts, (part) => part.type === 'space');
    }, (parts) => parts.reduce((acc, part) => {
        if (part.type === 'space') {
            return {
                ...acc,
                lastPart: part,
            };
        }
        const shouldBreakLine = (() => {
            if (['option', 'curl', 'comment'].includes(part.type) &&
                !!acc.lastNonSpacePart) {
                return true;
            }
            if (part.type === 'embedded-value' &&
                acc.lastNonSpacePart?.type === 'embedded-value') {
                return true;
            }
            return false;
        })();
        const shouldHaveSpace = (() => {
            if (!shouldBreakLine &&
                !!acc.lastNonSpacePart &&
                // basically, if we have 2 values in a row, we must have no space
                [acc.lastPart?.type, part.type].filter((type) => type === 'embedded-value').length !== 2) {
                return true;
            }
            return false;
        })();
        const shouldBreakLineWithSpace = (() => {
            if (shouldBreakLine &&
                part.type !== 'curl' &&
                part.type !== 'comment') {
                return true;
            }
            return false;
        })();
        const shouldBreakLineWithSlash = (() => {
            if (shouldBreakLine && acc.lastNonSpacePart?.type !== 'comment') {
                return true;
            }
            return false;
        })();
        const shouldHaveAddedOptions = part.type === 'curl';
        // Currently we don't do anything with the content type yet
        // but it is here for future use
        // we could format the body based on the content type
        //
        // Just a reminder: because we're supporting variables in the body
        // standard JSON parsing will not work
        const contentType = (() => {
            if (acc.contentType) {
                return acc.contentType;
            }
            // if the previous part is not header or current part is not value then return
            if (acc.lastNonSpacePart?.type !== 'option' ||
                !['-H', '--header'].includes(acc.lastNonSpacePart?.value) ||
                part.type !== 'embedded-value') {
                return acc.contentType;
            }
            const unquotedValue = part.value
                .replace(/^"(.*)"$/, '$1')
                .replace(/^'(.*)'$/, '$1');
            // if the header value does not contain content-type then return
            if (!unquotedValue.match(/\s*content-type\s*:/i)) {
                return acc.contentType;
            }
            // got it
            const [, value] = unquotedValue.split(/\s*content-type\s*:/i);
            return value.trim();
        })();
        const { shouldQuotePrefix, shouldQuotePostfix } = (() => {
            if (part.type === 'embedded-value' &&
                !part.value.includes("'") &&
                !part.value.includes('"')) {
                return {
                    shouldQuotePrefix: '"',
                    shouldQuotePostfix: '"',
                };
            }
            return {
                shouldQuotePrefix: '',
                shouldQuotePostfix: '',
            };
        })();
        const preformatted = [
            acc.formatted,
            shouldHaveSpace && ' ',
            shouldBreakLineWithSlash && ` ${_constants_1.BREAKLINE_ESCAPE_CHAR}`,
            shouldBreakLine && '\n',
            shouldBreakLineWithSpace && '  ',
            ['-d', '--data', '--data-raw'].includes(acc.lastNonSpacePart?.value) && contentType?.trim().startsWith('application/json')
                ? (0, json_stringify_1.formatBashJSONString)({
                    jsonString: part.value,
                    initialIndentLevel: 1,
                })
                : `${shouldQuotePrefix}${part.value}${shouldQuotePostfix}`,
            shouldHaveAddedOptions &&
                lodash_1.default.entries(options?.addOptions)
                    .map(([key, value]) => ` ${key} ${value}`)
                    .join(''),
        ];
        return {
            formatted: preformatted.filter(Boolean).join(''),
            lastPart: part,
            lastNonSpacePart: part,
            contentType,
        };
    }, {
        formatted: '',
    }))(curl.replace(/\r+\n/g, '\n'));
    return formatted;
};
exports.formatCurl = formatCurl;
//# sourceMappingURL=format-curl.js.map