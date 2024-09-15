"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.reset = exports.resetCheckForUpdatesProcess = exports.setLastCheckedForUpdatesVersion = exports.updatesSlice = exports.quitAndInstallUpdates = exports.getDownloadUpdatesProgress = exports.downloadUpdates = exports.checkForUpdates = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const _services_1 = require("../../../services/services-on-cli");
exports.checkForUpdates = (0, toolkit_1.createAsyncThunk)('updates/checkForUpdates', () => {
    return _services_1.Services.checkForUpdates();
});
exports.downloadUpdates = (0, toolkit_1.createAsyncThunk)('updates/downloadUpdates', async () => {
    await _services_1.Services.downloadUpdates();
});
exports.getDownloadUpdatesProgress = (0, toolkit_1.createAsyncThunk)('updates/updateDownloadProgress', async () => {
    const progress = await _services_1.Services.getDownloadUpdatesProgress();
    if (!progress) {
        return {
            percent: 0,
        };
    }
    return {
        percent: progress.percent,
    };
});
exports.quitAndInstallUpdates = (0, toolkit_1.createAsyncThunk)('updates/quitAndInstallUpdates', async () => {
    await _services_1.Services.quitAndInstall();
});
const initialState = {
    updateStatus: 'idle',
    downloadUpdatesProgress: {
        percent: 0,
    },
};
exports.updatesSlice = (0, toolkit_1.createSlice)({
    name: 'updates',
    initialState,
    reducers: {
        setLastCheckedForUpdatesVersion: (state, action) => {
            state.lastCheckedForUpdatesVersion = action.payload;
        },
        resetCheckForUpdatesProcess: (state) => {
            state.updateStatus = 'idle';
            state.downloadUpdatesProgress = {
                percent: 0,
            };
        },
        reset: () => initialState,
    },
    extraReducers: (builder) => {
        builder.addCase(exports.checkForUpdates.pending, (state) => {
            state.updateStatus = 'checking';
        });
        builder.addCase(exports.checkForUpdates.fulfilled, (state) => {
            state.updateStatus = 'idle';
            state.downloadUpdatesProgress = {
                percent: 0,
            };
        });
        builder.addCase(exports.checkForUpdates.rejected, (state) => {
            state.updateStatus = 'idle';
            state.downloadUpdatesProgress = {
                percent: 0,
            };
        });
        builder.addCase(exports.downloadUpdates.pending, (state) => {
            state.updateStatus = 'downloading';
        });
        builder.addCase(exports.downloadUpdates.fulfilled, (state) => {
            state.updateStatus = 'downloaded';
        });
        builder.addCase(exports.downloadUpdates.rejected, (state) => {
            state.updateStatus = 'idle';
            state.downloadUpdatesProgress = {
                percent: 0,
            };
        });
        builder.addCase(exports.getDownloadUpdatesProgress.fulfilled, (state, action) => {
            state.downloadUpdatesProgress = action.payload;
        });
        builder.addCase(exports.quitAndInstallUpdates.pending, (state) => {
            state.updateStatus = 'idle';
            state.downloadUpdatesProgress = {
                percent: 0,
            };
        });
        builder.addCase(exports.quitAndInstallUpdates.fulfilled, (state) => {
            state.updateStatus = 'idle';
            state.downloadUpdatesProgress = {
                percent: 0,
            };
        });
        builder.addCase(exports.quitAndInstallUpdates.rejected, (state) => {
            state.updateStatus = 'idle';
            state.downloadUpdatesProgress = {
                percent: 0,
            };
        });
    },
});
_a = exports.updatesSlice.actions, exports.setLastCheckedForUpdatesVersion = _a.setLastCheckedForUpdatesVersion, exports.resetCheckForUpdatesProcess = _a.resetCheckForUpdatesProcess, exports.reset = _a.reset;
exports.default = exports.updatesSlice.reducer;
//# sourceMappingURL=updates.js.map