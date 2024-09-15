"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCurl = void 0;
const send_curl_on_local_1 = require("./send-curl-on-local");
const sendCurl = async ({ curlRequest, variables = [], selectedDirectory, }) => {
    return (0, send_curl_on_local_1.sendCurlOnLocal)({
        curlRequest,
        variables,
        selectedDirectory,
        assetsPath: '/home/hvh/Documents/Projects/CurlerRoo/src/assets',
    });
};
exports.sendCurl = sendCurl;
//# sourceMappingURL=send-curl-on-cli.js.map