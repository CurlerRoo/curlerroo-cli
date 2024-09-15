"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WEB_APP_URL = exports.ENDPOINT1 = exports.ENDPOINT0 = exports.IN_MEMORY_FILE_SYSTEM_DEFAULT_FILE_PATH = exports.ENABLE_TELEMETRY_FEATURE = exports.CURLERROO_FILE_EXTENSION = exports.PRIVACY_POLICY_VERSION = exports.TERMS_OF_SERVICE_VERSION = exports.APP_VERSION = exports.COLORS = exports.THEME = exports.NOT_ANY_BREAKLINE_ESCAPE_CHAR_REGEX = exports.ANY_BREAKLINE_ESCAPE_CHAR_REGEX = exports.BREAKLINE_ESCAPE_CHAR = void 0;
exports.BREAKLINE_ESCAPE_CHAR = '\\';
const WINDOWS_ESCAPE_CHAR_REGEX = '`';
const OTHER_ESCAPE_CHAR_REGEX = '\\\\';
exports.ANY_BREAKLINE_ESCAPE_CHAR_REGEX = `[${WINDOWS_ESCAPE_CHAR_REGEX}${OTHER_ESCAPE_CHAR_REGEX}]`;
exports.NOT_ANY_BREAKLINE_ESCAPE_CHAR_REGEX = `[^${WINDOWS_ESCAPE_CHAR_REGEX}${OTHER_ESCAPE_CHAR_REGEX}]`;
exports.THEME = 'LIGHT_MODE';
exports.COLORS = {
    LIGHT_MODE: {
        BLUE: '0550ae',
        GREEN: '1f883d',
        RED: 'CF222E',
        BACKGROUND: 'E8E8E8',
        BACKGROUND_HIGHLIGHT: 'D8D8D8',
        GREY0: '666666',
        GREY: '888888',
        GREY1: 'aaaaaa',
        GREY2: 'c8c8c8',
        GREY3: 'e8e8e8',
        MID_BLUE: '007bff',
        BLACK_EAL: '444444',
        AZURE: '1890ff',
        PASTEL_GREY: 'cccccc',
        WHITE: 'ffffff',
        YELLOW: 'FFEA00',
    },
    DARK_MODE: {
        BLUE: '0550ae',
        GREEN: '1f883d',
        RED: 'CF222E',
        BACKGROUND: 'E8E8E8',
        BACKGROUND_HIGHLIGHT: 'D8D8D8',
        GREY0: '666666',
        GREY: '888888',
        GREY1: 'aaaaaa',
        GREY2: 'c8c8c8',
        GREY3: 'e8e8e8',
        MID_BLUE: '007bff',
        BLACK_EAL: '444444',
        AZURE: '1890ff',
        PASTEL_GREY: 'cccccc',
        WHITE: 'ffffff',
        YELLOW: 'FFEA00',
    },
};
exports.APP_VERSION = '0.2.2';
exports.TERMS_OF_SERVICE_VERSION = '0.0.1';
exports.PRIVACY_POLICY_VERSION = '0.0.1';
exports.CURLERROO_FILE_EXTENSION = 'crr';
exports.ENABLE_TELEMETRY_FEATURE = false;
exports.IN_MEMORY_FILE_SYSTEM_DEFAULT_FILE_PATH = '/requests/new-file.crr';
exports.ENDPOINT0 = 'https://api.curlerroo.com';
exports.ENDPOINT1 = 'https://api-asia.curlerroo.com';
exports.WEB_APP_URL = 'https://app.curlerroo.com';
//# sourceMappingURL=constants.js.map