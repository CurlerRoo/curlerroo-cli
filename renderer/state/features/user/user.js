"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.setWordWrappingInEditor = exports.reset = exports.allowAnalytics = exports.acceptTerms = exports.userSlice = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const _constants_1 = require("../../../../shared/constants/constants-on-electron");
const initialState = {
    wordWrappingInEditor: true,
};
exports.userSlice = (0, toolkit_1.createSlice)({
    name: 'user',
    initialState,
    reducers: {
        acceptTerms: (state) => {
            state.acceptedTermsOfServiceVersion = _constants_1.TERMS_OF_SERVICE_VERSION;
            state.acceptedPrivacyPolicyVersion = _constants_1.PRIVACY_POLICY_VERSION;
        },
        allowAnalytics: (state, { payload }) => {
            state.allowedAnalytics = payload;
        },
        reset: () => initialState,
        setWordWrappingInEditor: (state, { payload }) => {
            state.wordWrappingInEditor = payload;
        },
    },
});
_a = exports.userSlice.actions, exports.acceptTerms = _a.acceptTerms, exports.allowAnalytics = _a.allowAnalytics, exports.reset = _a.reset, exports.setWordWrappingInEditor = _a.setWordWrappingInEditor;
exports.default = exports.userSlice.reducer;
//# sourceMappingURL=user.js.map