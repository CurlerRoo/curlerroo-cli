"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCurlOnLocal = void 0;
const lodash_1 = __importDefault(require("lodash"));
const fs_1 = __importDefault(require("fs"));
const tmp_promise_1 = __importDefault(require("tmp-promise"));
const isbinaryfile_1 = require("isbinaryfile");
const format_curl_1 = require("../../shared/format-curl");
const get_curl_parts_1 = require("../../shared/get-curl-parts");
const parse_curl_response_1 = require("../../shared/parse-curl-response");
const exec_sh_1 = require("./exec-sh");
const utils_1 = require("../../shared/utils");
const sendCurlOnLocal = async ({ curlRequest, variables = [], selectedDirectory, assetsPath, }) => {
    const arch = process.arch === 'arm64' ? 'arm64' : 'amd64';
    const platform = process.platform === 'darwin' ? 'macos' : 'static';
    const curlReplacement = `${assetsPath}/curl-${platform}-${arch}-8.5.0/curl`;
    const bodyFilePath = await tmp_promise_1.default.file().then((m) => m.path);
    const finalizedCurlRequest = lodash_1.default.flow((req) => req.replace(/^[\s\n;]*/, '').replace(/[\s\n;]*$/, ''), (req) => {
        const parts = (0, get_curl_parts_1.getCurlParts)(req);
        return parts
            .map((part) => {
            if (part.type === 'variable') {
                const variable = (0, utils_1.findVariableFromCurlPartValue)({
                    value: part.value,
                    variables,
                });
                if (!variable) {
                    throw new Error(`Variable not found: ${part.value}`);
                }
                const stringValue = typeof variable.value === 'string'
                    ? variable.value
                    : JSON.stringify(variable.value);
                return {
                    type: 'value',
                    value: `'${stringValue}'`,
                };
            }
            if (part.type === 'escaped-variable') {
                const variable = (0, utils_1.findVariableFromCurlPartValue)({
                    value: part.value,
                    variables,
                });
                if (!variable) {
                    return part;
                }
                const stringValue = typeof variable.value === 'string'
                    ? variable.value
                    : JSON.stringify(variable.value);
                return {
                    type: 'value',
                    value: stringValue,
                };
            }
            return part;
        })
            .map((part) => part.value)
            .join('')
            .replaceAll("''", '');
    }, (req) => (0, format_curl_1.formatCurl)(req, {
        addOptions: {
            '-s': '',
            '-v': '',
            '--compressed': '',
            '--output': bodyFilePath
                // convert windows path to wsl path if needed
                .replace(/\\/g, '/')
                .replace(/^([A-Za-z]):/, (match, driveLetter) => {
                return `/mnt/${driveLetter.toLowerCase()}`;
            }),
        },
        removeComments: true,
    }), (req) => req.replace(/^curl/, curlReplacement))(curlRequest);
    (0, utils_1.debugLog)('HVH', 'finalizedCurlRequest', finalizedCurlRequest);
    const hasRequest = finalizedCurlRequest.startsWith(curlReplacement);
    const cdToSelectedDirectory = selectedDirectory
        ? `cd ${selectedDirectory};`
        : '';
    const promise = hasRequest
        ? (0, exec_sh_1.execShPromise)(`${cdToSelectedDirectory}${finalizedCurlRequest}`, true).catch((err) => {
            (0, utils_1.debugLog)('HVH', 'err', err);
            if (err.stderr.startsWith('curl:')) {
                throw new Error(err.stderr);
            }
            return err;
        })
        : Promise.resolve({ stdout: '', stderr: '' });
    const headers = await promise.then((res) => res.stderr?.trim());
    const isBinary = await (0, isbinaryfile_1.isBinaryFile)(bodyFilePath);
    const body = !isBinary
        ? await fs_1.default.promises
            .readFile(bodyFilePath)
            .then((data) => data.toString('utf-8'))
            .catch((e) => {
            (0, utils_1.debugLog)('error reading body', e);
            // there was exception, so there is body
            // just not able to read it
            return '';
        })
        : '';
    const responses = (0, parse_curl_response_1.parseCurlResponse)({
        headers,
        body,
        bodyFilePath: isBinary ? bodyFilePath : '',
        // it could handle bodyBase64, but since it would save the file to disk and make the file bigger
        // we don't want to do that
        bodyBase64: '',
    });
    return responses;
};
exports.sendCurlOnLocal = sendCurlOnLocal;
//# sourceMappingURL=send-curl-on-local.js.map