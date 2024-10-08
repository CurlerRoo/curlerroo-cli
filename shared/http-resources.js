"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentTypes = exports.methods = exports.forwardeds = exports.authenticationSchemes = exports.tes = exports.headers = exports.contentSecurityPolicies = exports.connections = exports.cacheControls = exports.acceptLanguages = exports.acceptEncoding = exports.curlKeys = exports.curlKeysWithoutValues = exports.curlKeysWithValues = void 0;
exports.curlKeysWithValues = [
    '--url', // TODO: prevent multiple urls from being used
    '--url-query',
    '-u',
    '--user',
    '-H',
    '--header',
    '-b',
    '--cookie',
    '-c',
    '--cookie-jar',
    '-d',
    '--data',
    '--data-raw',
    '--data-urlencode',
    '--data-binary',
    '--data-ascii',
    '-F',
    '--form',
    '-X',
    '--request',
    '--max-redirs',
    '-A',
    '--user-agent',
    '-m',
    '--max-time',
    '--connect-timeout',
    '--dns-ipv4-addr',
    '--dns-ipv6-addr',
    '--dns-servers',
    '--doh-url',
    '--engine',
    '--form-string',
    '--ftp-account',
    '--hostpubmd5',
    '--hostpubsha256',
    '--interface',
    '--json', // TODO: support it in the ASAP
    '--keepalive-time',
    '--key',
    '--key-type',
    '--krb',
    '--limit-rate',
    '--local-port',
    '--max-filesize',
    '--noproxy',
    '--oauth2-bearer',
    '--pass',
    '--pinnedpubkey',
    '--proto',
    '--proto-default',
    '--proto-redir',
    '-x',
    '--proxy',
    '--proxy-header',
    '--proxy-service-name',
    '-U',
    '--proxy-user',
    '--proxy1.0',
    '--pubkey',
    '-r',
    '--range',
    '-e',
    '--referer',
    '--resolve',
    // '--retry', TODO: support it in the future
    // '--retry-delay', TODO: support it in the future
    // '--retry-max-time', TODO: support it in the future
    '--service-name', // TODO: ? what is it
    '-Y',
    '--speed-limit',
    '-y',
    '--speed-time',
    '-z',
    '--time-cond',
    '--tls-max',
    '--tlsauthtype',
    '--tlspassword',
    '--tlsuser',
    '-T',
    '--upload-file',
    // '--variable', TODO: support it in the future
];
exports.curlKeysWithoutValues = [
    '-G',
    '--get',
    '-L',
    '--location',
    '--location-trusted',
    '--compressed',
    '--basic',
    '--digest',
    '--ntlm',
    '--ntlm-wb',
    '--compressed-ssh',
    '--no-compressed',
    '--doh-cert-status',
    '--doh-insecure',
    '--false-start',
    '-g',
    '--globoff',
    '--no-globoff',
    '-0',
    '--http1.0',
    '--http1.1',
    '--http2',
    '--http2-prior-knowledge',
    '--http3',
    '--http3-only',
    '--ignore-content-length',
    '-k',
    '--insecure',
    '-4',
    '--ipv4',
    '-6',
    '--ipv6',
    '--no-alpn',
    '--no-keepalive',
    '--no-sessionid',
    '--path-as-is',
    '--post301',
    '--post302',
    '--post303',
    '--proxy-anyauth',
    '--proxy-basic',
    '--proxy-digest',
    '--proxy-negotiate',
    '--proxy-ntlm',
    '-p',
    '--proxytunnel',
    '--raw',
    '--sasl-ir',
    '--ssl',
    '--ssl-allow-beast',
    '--ssl-no-revoke',
    '--ssl-reqd',
    '-1',
    '--tlsv1',
    '--tlsv1.0',
    '--tlsv1.1',
    '--tlsv1.2',
    '--tlsv1.3',
    '--tr-encoding',
];
exports.curlKeys = [...exports.curlKeysWithValues, ...exports.curlKeysWithoutValues];
exports.acceptEncoding = [
    'gzip',
    'compress',
    'deflate',
    'br',
    'identity',
    '*',
];
exports.acceptLanguages = [
    'en-US',
    'en-GB',
    'fr-FR',
    'de-DE',
    'es-ES',
    'it-IT',
    'pt-BR',
    'ru-RU',
    'zh-CN',
    'zh-TW',
    'ar-SA',
    'hi-IN',
    'tr-TR',
    'nl-NL',
    'sv-SE',
    'pl-PL',
    'uk-UA',
    'vi-VN',
    'da-DK',
    'fi-FI',
    'el-GR',
    'hu-HU',
    'no-NO',
    'cs-CZ',
    'sk-SK',
    'id-ID',
    'ms-MY',
    'ro-RO',
    'bg-BG',
    'hr-HR',
    'sr-RS',
    'sl-SI',
    'et-EE',
    'lv-LV',
    'lt-LT',
    'he-IL',
    'ur-PK',
    'fa-IR',
    'bn-BD',
    'ta-IN',
    'ml-IN',
    'gu-IN',
    'pa-IN',
    'kn-IN',
    'mr-IN',
    'te-IN',
    'ne-NP',
    'si-LK',
    'th-TH',
    'km-KH',
    'mn-MN',
    'ja-JP',
    'ko-KR',
    'tl-PH',
    'en-CA',
    'fr-CA',
    'es-MX',
    'pt-PT',
    'de-AT',
    'de-CH',
    'it-CH',
];
exports.cacheControls = [
    'no-cache',
    'no-store',
    'max-age=',
    'max-stale=',
    'min-fresh=',
    'no-transform',
    'only-if-cached',
    'cache-extension',
];
exports.connections = ['keep-alive', 'close'];
exports.contentSecurityPolicies = [
    'base-uri',
    'child-src',
    'connect-src',
    'default-src',
    'font-src',
    'form-action',
    'frame-ancestors',
    'frame-src',
    'img-src',
    'manifest-src',
    'media-src',
    'object-src',
    'prefetch-src',
    'script-src',
    'script-src-elem',
    'script-src-attr',
    'style-src',
    'style-src-elem',
    'style-src-attr',
    'worker-src',
    'block-all-mixed-content',
    'disown-opener',
    'referrer',
    'reflected-xss',
    'require-sri-for',
    'sandbox',
    'upgrade-insecure-requests',
];
exports.headers = [
    'A-IM',
    'Accept',
    'Accept-Charset',
    'Accept-Encoding',
    'Accept-Language',
    'Accept-Datetime',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers',
    'Authorization',
    'Cache-Control',
    'Connection',
    'Content-Length',
    'Content-Type',
    'Content-Security-Policy',
    'Cookie',
    'Date',
    'Expect',
    'Forwarded',
    'From',
    'Host',
    'If-Match',
    'If-Modified-Since',
    'If-None-Match',
    'If-Range',
    'If-Unmodified-Since',
    'Max-Forwards',
    'Origin',
    'Pragma',
    'Proxy-Authorization',
    'Range',
    'Referer',
    'TE',
    'User-Agent',
    'Upgrade',
    'Via',
    'Warning',
    'Dnt',
    'X-Requested-With',
    'X-CSRF-Token',
];
exports.tes = ['compress', 'deflate', 'gzip', 'trailers'];
exports.authenticationSchemes = [
    'Basic',
    'Bearer',
    'Digest',
    'HOBA',
    'Mutual',
    'Negotiate',
    'OAuth',
    'SCRAM-SHA-1',
    'SCRAM-SHA-256',
    'vapid',
];
exports.forwardeds = [
    'by=',
    'for=',
    'host=',
    'proto=',
    'proto-version=',
    'url=',
];
exports.methods = [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'OPTIONS',
    'HEAD',
    'TRACE',
    'CONNECT',
];
exports.contentTypes = [
    'audio/aac',
    'application/x-abiword',
    'application/x-freearc',
    'image/avif',
    'video/x-msvideo',
    'application/vnd.amazon.ebook',
    'application/octet-stream',
    'image/bmp',
    'application/x-bzip',
    'application/x-bzip2',
    'application/x-cdf',
    'application/x-csh',
    'text/css',
    'text/csv',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-fontobject',
    'application/epub+zip',
    'application/gzip',
    'image/gif',
    'text/html',
    'image/vnd.microsoft.icon',
    'text/calendar',
    'application/java-archive',
    'image/jpeg',
    'text/javascript',
    'application/json',
    'application/ld+json',
    'audio/midi',
    'audio/x-midi',
    'text/javascript',
    'audio/mpeg',
    'video/mp4',
    'video/mpeg',
    'application/vnd.apple.installer+xml',
    'application/vnd.oasis.opendocument.presentation',
    'application/vnd.oasis.opendocument.spreadsheet',
    'application/vnd.oasis.opendocument.text',
    'audio/ogg',
    'video/ogg',
    'application/ogg',
    'audio/opus',
    'font/otf',
    'image/png',
    'application/pdf',
    'application/x-httpd-php',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.rar',
    'application/rtf',
    'application/x-sh',
    'image/svg+xml',
    'application/x-tar',
    'image/tiff',
    'video/mp2t',
    'font/ttf',
    'text/plain',
    'application/vnd.visio',
    'audio/wav',
    'audio/webm',
    'video/webm',
    'image/webp',
    'font/woff',
    'font/woff2',
    'application/xhtml+xml',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/xml',
    'text/xml',
    'application/atom+xml',
    'application/xml',
    'application/vnd.mozilla.xul+xml',
    'application/zip',
    'video/3gpp',
    'audio/3gpp',
    'video/3gpp2',
    'audio/3gpp2',
    'application/x-7z-compressed',
];
//# sourceMappingURL=http-resources.js.map