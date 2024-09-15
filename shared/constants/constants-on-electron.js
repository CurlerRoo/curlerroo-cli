"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENABLE_TERMS_OF_SERVICE_FEATURE = exports.PLATFORM = exports.USE_IN_MEMORY_FILE_SYSTEM = exports.ENABLE_UPDATE_FEATURE = exports.PATH_SEPARATOR = exports.OS = exports.TERMS_OF_SERVICE_VERSION = exports.PRIVACY_POLICY_VERSION = exports.NOT_ANY_BREAKLINE_ESCAPE_CHAR_REGEX = exports.IN_MEMORY_FILE_SYSTEM_DEFAULT_FILE_PATH = exports.ENABLE_TELEMETRY_FEATURE = exports.CURLERROO_FILE_EXTENSION = exports.THEME = exports.COLORS = exports.BREAKLINE_ESCAPE_CHAR = exports.APP_VERSION = exports.ANY_BREAKLINE_ESCAPE_CHAR_REGEX = void 0;
const constants_1 = require("./constants");
Object.defineProperty(exports, "ANY_BREAKLINE_ESCAPE_CHAR_REGEX", { enumerable: true, get: function () { return constants_1.ANY_BREAKLINE_ESCAPE_CHAR_REGEX; } });
Object.defineProperty(exports, "APP_VERSION", { enumerable: true, get: function () { return constants_1.APP_VERSION; } });
Object.defineProperty(exports, "BREAKLINE_ESCAPE_CHAR", { enumerable: true, get: function () { return constants_1.BREAKLINE_ESCAPE_CHAR; } });
Object.defineProperty(exports, "COLORS", { enumerable: true, get: function () { return constants_1.COLORS; } });
Object.defineProperty(exports, "THEME", { enumerable: true, get: function () { return constants_1.THEME; } });
Object.defineProperty(exports, "CURLERROO_FILE_EXTENSION", { enumerable: true, get: function () { return constants_1.CURLERROO_FILE_EXTENSION; } });
Object.defineProperty(exports, "ENABLE_TELEMETRY_FEATURE", { enumerable: true, get: function () { return constants_1.ENABLE_TELEMETRY_FEATURE; } });
Object.defineProperty(exports, "IN_MEMORY_FILE_SYSTEM_DEFAULT_FILE_PATH", { enumerable: true, get: function () { return constants_1.IN_MEMORY_FILE_SYSTEM_DEFAULT_FILE_PATH; } });
Object.defineProperty(exports, "NOT_ANY_BREAKLINE_ESCAPE_CHAR_REGEX", { enumerable: true, get: function () { return constants_1.NOT_ANY_BREAKLINE_ESCAPE_CHAR_REGEX; } });
Object.defineProperty(exports, "PRIVACY_POLICY_VERSION", { enumerable: true, get: function () { return constants_1.PRIVACY_POLICY_VERSION; } });
Object.defineProperty(exports, "TERMS_OF_SERVICE_VERSION", { enumerable: true, get: function () { return constants_1.TERMS_OF_SERVICE_VERSION; } });
exports.OS = (() => {
    if (global?.process?.platform) {
        return process.platform;
    }
    // @ts-ignore
    const platform = global?.navigator?.userAgentData.platform;
    if (platform === 'macOS') {
        return 'darwin';
    }
    if (platform === 'Linux') {
        return 'linux';
    }
    if (platform === 'Windows') {
        return 'win32';
    }
    throw new Error(`Unsupported platform: ${platform}`);
})();
exports.PATH_SEPARATOR = exports.OS === 'win32' ? '\\' : '/';
exports.ENABLE_UPDATE_FEATURE = true;
exports.USE_IN_MEMORY_FILE_SYSTEM = false;
exports.PLATFORM = 'electron';
exports.ENABLE_TERMS_OF_SERVICE_FEATURE = true;
//# sourceMappingURL=constants-on-electron.js.map