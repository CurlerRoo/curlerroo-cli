"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.persistor = exports.createNewStore = exports.store = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const redux_persist_1 = require("redux-persist");
const _services_1 = require("../services/services-on-cli");
const active_document_1 = require("./features/documents/active-document");
const selected_directory_1 = require("./features/selected-directory/selected-directory");
const drag_1 = require("./features/drag/drag");
const user_1 = require("./features/user/user");
const updates_1 = require("./features/updates/updates");
const utils_1 = require("../../shared/utils");
const persistedSelectedDirectorySliceReducer = (0, redux_persist_1.persistReducer)({
    key: selected_directory_1.selectedDirectorySlice.name,
    storage: {
        getItem: (key) => _services_1.Services.get(key),
        setItem: (key, value) => _services_1.Services.set(key, value),
        removeItem: (key) => _services_1.Services.delete(key),
    },
}, selected_directory_1.selectedDirectorySlice.reducer);
const persistedUserSliceReducer = (0, redux_persist_1.persistReducer)({
    key: user_1.userSlice.name,
    storage: {
        getItem: (key) => _services_1.Services.get(key),
        setItem: (key, value) => _services_1.Services.set(key, value),
        removeItem: (key) => _services_1.Services.delete(key),
    },
}, user_1.userSlice.reducer);
const persistedUpdatesSliceReducer = (0, redux_persist_1.persistReducer)({
    key: updates_1.updatesSlice.name,
    storage: {
        getItem: (key) => _services_1.Services.get(key),
        setItem: (key, value) => _services_1.Services.set(key, value),
        removeItem: (key) => _services_1.Services.delete(key),
    },
}, updates_1.updatesSlice.reducer);
exports.store = (0, toolkit_1.configureStore)({
    reducer: {
        [active_document_1.activeDocumentSlice.name]: active_document_1.activeDocumentSlice.reducer,
        [selected_directory_1.selectedDirectorySlice.name]: persistedSelectedDirectorySliceReducer,
        [user_1.userSlice.name]: persistedUserSliceReducer,
        [drag_1.dragSlice.name]: drag_1.dragSlice.reducer,
        [updates_1.updatesSlice.name]: persistedUpdatesSliceReducer,
    },
    middleware: (getDefaultMiddleware) => {
        const middlewares = getDefaultMiddleware({
            serializableCheck: false,
        });
        // add logger
        middlewares.push((api) => (next) => (action) => {
            (0, utils_1.debugLog)('dispatching', action);
            return next(action);
        });
        return middlewares;
    },
});
const createNewStore = () => {
    return (0, toolkit_1.configureStore)({
        reducer: {
            [active_document_1.activeDocumentSlice.name]: active_document_1.activeDocumentSlice.reducer,
            [selected_directory_1.selectedDirectorySlice.name]: persistedSelectedDirectorySliceReducer,
            [user_1.userSlice.name]: persistedUserSliceReducer,
            [drag_1.dragSlice.name]: drag_1.dragSlice.reducer,
            [updates_1.updatesSlice.name]: persistedUpdatesSliceReducer,
        },
        middleware: (getDefaultMiddleware) => {
            const middlewares = getDefaultMiddleware({
                serializableCheck: false,
            });
            // add logger
            middlewares.push((api) => (next) => (action) => {
                (0, utils_1.debugLog)('dispatching', action);
                return next(action);
            });
            return middlewares;
        },
    });
};
exports.createNewStore = createNewStore;
exports.persistor = (0, redux_persist_1.persistStore)(exports.store);
// dispatch fixSelectedSubDirectoryOrFile every 5 seconds
// TODO: find a better way to do this
setInterval(() => {
    exports.store.dispatch((0, selected_directory_1.fixSelectedSubDirectoryOrFile)());
}, 5000);
//# sourceMappingURL=store.js.map