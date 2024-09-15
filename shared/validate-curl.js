"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCurlSyntax = exports.validateUnsupportedOptions = exports.validateMissingVariables = void 0;
const http_resources_1 = require("./http-resources");
const utils_1 = require("./utils");
const ip_1 = __importDefault(require("ip"));
const _constants_1 = require("./constants/constants-on-electron");
const lodash_1 = __importDefault(require("lodash"));
const globalVariables = [
    {
        key: 'res_body',
        source: 'manual',
    },
    {
        key: 'res_headers',
        source: 'manual',
    },
];
const validateMissingVariables = ({ parts, variables, }) => {
    const fullVariables = [...variables, ...globalVariables];
    const errors = parts.flatMap((part) => {
        if (!['variable', 'escaped-variable'].includes(part.type)) {
            return [];
        }
        const isMissing = !(0, utils_1.findVariableFromCurlPartValue)({
            value: part.value,
            variables: fullVariables,
        });
        if (!isMissing) {
            return [];
        }
        return {
            variable: part.value,
            variableIndex: part.index,
            line: part.line,
            column: part.column,
        };
    });
    return errors;
};
exports.validateMissingVariables = validateMissingVariables;
const validateUnsupportedOptions = ({ parts, }) => {
    const errors = parts.flatMap((part) => {
        if (part.type !== 'option') {
            return [];
        }
        const isUnsupported = !http_resources_1.curlKeys.includes(part.value);
        if (!isUnsupported) {
            return [];
        }
        return {
            option: part.value,
            optionIndex: part.index,
            line: part.line,
            column: part.column,
        };
    });
    return errors;
};
exports.validateUnsupportedOptions = validateUnsupportedOptions;
const validateCurlSyntax = ({ parts }) => {
    const filteredParts = parts.filter((part) => [
        'variable',
        'escaped-variable',
        'value',
        'option',
        'curl',
        'space',
        'newline',
        'backslash-newline',
    ].includes(part.type));
    const { errorParts } = filteredParts.reduce((acc, part) => {
        if (part.type === 'curl') {
            return {
                lastPart: part,
                lastNonDelimiterPart: part,
                curlExisted: true,
                curlUrlExisted: false,
                errorParts: acc.errorParts,
            };
        }
        if (['value', 'variable', 'escaped-variable', 'option'].includes(part.type) &&
            !acc.curlExisted) {
            return {
                lastPart: part,
                lastNonDelimiterPart: part,
                curlExisted: acc.curlExisted,
                curlUrlExisted: acc.curlUrlExisted,
                errorParts: [
                    ...acc.errorParts,
                    {
                        ...part,
                        errorMessage: 'curl command is missing',
                    },
                ],
            };
        }
        if (!acc.lastPart) {
            return {
                lastPart: part,
                lastNonDelimiterPart: part,
                curlExisted: acc.curlExisted,
                curlUrlExisted: acc.curlUrlExisted,
                errorParts: [],
            };
        }
        if (part.type === 'value' &&
            ['space', 'newline', 'backslash-newline'].includes(acc.lastPart?.type)) {
            if (!acc.curlUrlExisted) {
                if (['curl', 'value'].includes(acc.lastNonDelimiterPart?.type)) {
                    const unsupportedLocalUrl = lodash_1.default.attempt(() => {
                        const url = new URL(part.value);
                        const hostname = url?.hostname;
                        const isPrivateIp = lodash_1.default.attempt(() => ip_1.default.isPrivate(hostname || '')) === true;
                        return (_constants_1.PLATFORM === 'browser' &&
                            (isPrivateIp || hostname === 'localhost'));
                    }) === true;
                    return {
                        lastPart: part,
                        lastNonDelimiterPart: part,
                        curlExisted: acc.curlExisted,
                        curlUrlExisted: true,
                        errorParts: acc.errorParts.concat(!unsupportedLocalUrl
                            ? []
                            : [
                                {
                                    ...part,
                                    errorMessage: 'Local IP addresses could not be used due to restrictions from browser. Please download the desktop app to use Local IP addresses.',
                                },
                            ]),
                    };
                }
            }
            else if (acc.lastNonDelimiterPart?.type === 'value') {
                return {
                    lastPart: part,
                    lastNonDelimiterPart: part,
                    curlExisted: acc.curlExisted,
                    curlUrlExisted: acc.curlUrlExisted,
                    errorParts: [
                        ...acc.errorParts,
                        { ...part, errorMessage: 'multiple URLs are not supported' },
                    ],
                };
            }
        }
        if (['space', 'newline', 'backslash-newline'].includes(part.type)) {
            return {
                lastPart: part,
                lastNonDelimiterPart: acc.lastNonDelimiterPart,
                curlExisted: acc.curlExisted,
                curlUrlExisted: acc.curlUrlExisted,
                errorParts: acc.errorParts,
            };
        }
        return {
            lastPart: part,
            lastNonDelimiterPart: part,
            curlExisted: acc.curlExisted,
            curlUrlExisted: acc.curlUrlExisted,
            errorParts: acc.errorParts,
        };
    }, {
        lastPart: undefined,
        lastNonDelimiterPart: undefined,
        curlExisted: false,
        curlUrlExisted: false,
        errorParts: [],
    });
    return errorParts;
};
exports.validateCurlSyntax = validateCurlSyntax;
//# sourceMappingURL=validate-curl.js.map