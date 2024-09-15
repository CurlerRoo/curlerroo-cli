"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.reset = exports.setSelectedSubDirectoryOrFile = exports.selectedDirectorySlice = exports.moveDirectoryOrFile = exports.duplicateDirectoryOrFile = exports.renameDirectoryOrFile = exports.deleteDirectoryOrFile = exports.fixSelectedSubDirectoryOrFile = exports.createFileWithContent = exports.createFile = exports.createDirectory = exports.selectDirectory = exports.loadDirectoryInfoFromPath = exports.loadDirectoryInfo = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const _services_1 = require("../../../services/services-on-cli");
const _constants_1 = require("../../../../shared/constants/constants-on-electron");
exports.loadDirectoryInfo = (0, toolkit_1.createAsyncThunk)('selectedDirectory/loadDirectoryInfo', async (_, thunkAPI) => {
    const { selectedDirectory } = thunkAPI.getState().selectedDirectory;
    if (!selectedDirectory) {
        throw new Error('selectedDirectory is undefined');
    }
    return _services_1.Services.getDirectoryInfo(selectedDirectory);
});
exports.loadDirectoryInfoFromPath = (0, toolkit_1.createAsyncThunk)('selectedDirectory/loadDirectoryInfoFromPath', async (path) => {
    return _services_1.Services.getDirectoryInfo(path);
});
exports.selectDirectory = (0, toolkit_1.createAsyncThunk)('selectedDirectory/selectDirectory', async (_, thunkAPI) => {
    const directoryPath = await _services_1.Services.selectDirectory();
    if (!directoryPath) {
        return undefined;
    }
    await thunkAPI.dispatch((0, exports.loadDirectoryInfoFromPath)(directoryPath));
    return directoryPath;
});
exports.createDirectory = (0, toolkit_1.createAsyncThunk)('selectedDirectory/createDirectory', async ({ path }, thunkAPI) => {
    if (path) {
        await _services_1.Services.createDirectory(path);
        await thunkAPI.dispatch((0, exports.loadDirectoryInfo)());
        return;
    }
    const { selectedSubDirectoryOrFile, selectedSubType } = thunkAPI.getState().selectedDirectory;
    if (!selectedSubDirectoryOrFile) {
        throw new Error('selectedSubDirectoryOrFile is undefined');
    }
    if (selectedSubType === 'directory') {
        await _services_1.Services.createDirectory(`${selectedSubDirectoryOrFile}/new-folder`);
    }
    else {
        await _services_1.Services.createDirectory(`${selectedSubDirectoryOrFile
            .split(_constants_1.PATH_SEPARATOR)
            .slice(0, -1)
            .join(_constants_1.PATH_SEPARATOR)}/new-folder`);
    }
    await thunkAPI.dispatch((0, exports.loadDirectoryInfo)());
});
exports.createFile = (0, toolkit_1.createAsyncThunk)('selectedDirectory/createFile', async (_, thunkAPI) => {
    const { selectedSubDirectoryOrFile, selectedSubType } = thunkAPI.getState().selectedDirectory;
    if (!selectedSubDirectoryOrFile) {
        throw new Error('selectedSubDirectoryOrFile is undefined');
    }
    const createResult = await (async () => {
        if (selectedSubType === 'directory') {
            return _services_1.Services.createFile(`${selectedSubDirectoryOrFile}/new-file.${_constants_1.CURLERROO_FILE_EXTENSION}`);
        }
        return _services_1.Services.createFile(`${selectedSubDirectoryOrFile
            .split(_constants_1.PATH_SEPARATOR)
            .slice(0, -1)
            .join(_constants_1.PATH_SEPARATOR)}/new-file.${_constants_1.CURLERROO_FILE_EXTENSION}`);
    })();
    await thunkAPI.dispatch((0, exports.loadDirectoryInfo)());
    return createResult;
});
exports.createFileWithContent = (0, toolkit_1.createAsyncThunk)('selectedDirectory/createFileWithContent', async ({ content, name }, thunkAPI) => {
    const { selectedSubDirectoryOrFile, selectedSubType } = thunkAPI.getState().selectedDirectory;
    if (!selectedSubDirectoryOrFile) {
        throw new Error('selectedSubDirectoryOrFile is undefined');
    }
    const filename = name || `new-file.${_constants_1.CURLERROO_FILE_EXTENSION}`;
    const createResult = await (async () => {
        if (selectedSubType === 'directory') {
            return _services_1.Services.createFile(`${selectedSubDirectoryOrFile}/${filename}`);
        }
        return _services_1.Services.createFile(`${selectedSubDirectoryOrFile
            .split(_constants_1.PATH_SEPARATOR)
            .slice(0, -1)
            .join(_constants_1.PATH_SEPARATOR)}/${filename}`);
    })();
    await thunkAPI.dispatch((0, exports.loadDirectoryInfo)());
    await _services_1.Services.writeFile(createResult.filePath, {
        id: content.id,
        shared_id: content.shared_id,
        cells: content.cells,
        version: content.version,
        globalVariables: content.globalVariables,
        type: 'notebook',
        executingAllCells: content.executingAllCells,
    });
    return createResult;
});
exports.fixSelectedSubDirectoryOrFile = (0, toolkit_1.createAsyncThunk)('selectedDirectory/fixSelectedSubDirectoryOrFile', async (_params, thunkAPI) => {
    const { selectedSubDirectoryOrFile, selectedDirectory, selectedSubType } = thunkAPI.getState().selectedDirectory;
    if (!selectedSubDirectoryOrFile || !selectedDirectory || !selectedSubType) {
        throw new Error('adfglkerhgd32');
    }
    const fixedPath = await _services_1.Services.fixSelectedSubDirectoryOrFile({
        selectedSubDirectoryOrFile,
        selectedDirectory,
        selectedSubType,
    });
    return fixedPath;
});
exports.deleteDirectoryOrFile = (0, toolkit_1.createAsyncThunk)('selectedDirectory/deleteDirectoryOrFile', async (path, thunkAPI) => {
    await _services_1.Services.deleteDirectoryOrFile(path);
    await thunkAPI.dispatch((0, exports.fixSelectedSubDirectoryOrFile)());
    await thunkAPI.dispatch((0, exports.loadDirectoryInfo)());
});
exports.renameDirectoryOrFile = (0, toolkit_1.createAsyncThunk)('selectedDirectory/renameDirectoryOrFile', async ({ oldPath, newPath }, thunkAPI) => {
    await _services_1.Services.renameDirectoryOrFile({
        oldPath,
        newPath,
    });
    await thunkAPI.dispatch((0, exports.fixSelectedSubDirectoryOrFile)());
    await thunkAPI.dispatch((0, exports.loadDirectoryInfo)());
});
exports.duplicateDirectoryOrFile = (0, toolkit_1.createAsyncThunk)('selectedDirectory/duplicateDirectoryOrFile', async (filePath, thunkAPI) => {
    await _services_1.Services.duplicateDirectoryOrFile(filePath);
    await thunkAPI.dispatch((0, exports.loadDirectoryInfo)());
});
exports.moveDirectoryOrFile = (0, toolkit_1.createAsyncThunk)('selectedDirectory/moveDirectoryOrFile', async ({ oldPath, newPath }, thunkAPI) => {
    await _services_1.Services.moveDirectoryOrFile({
        oldPath,
        newPath,
    });
    await thunkAPI.dispatch((0, exports.fixSelectedSubDirectoryOrFile)());
    await thunkAPI.dispatch((0, exports.loadDirectoryInfo)());
});
const initialState = {
    dragToDirectories: {},
    ...(_constants_1.USE_IN_MEMORY_FILE_SYSTEM
        ? {
            selectedDirectory: _constants_1.IN_MEMORY_FILE_SYSTEM_DEFAULT_FILE_PATH.split(_constants_1.PATH_SEPARATOR)
                .slice(0, -1)
                .join(_constants_1.PATH_SEPARATOR),
            selectedSubDirectoryOrFile: _constants_1.IN_MEMORY_FILE_SYSTEM_DEFAULT_FILE_PATH,
            selectedSubType: 'file',
        }
        : {}),
};
exports.selectedDirectorySlice = (0, toolkit_1.createSlice)({
    name: 'selectedDirectory',
    initialState,
    reducers: {
        setSelectedSubDirectoryOrFile: (state, action) => {
            state.selectedSubDirectoryOrFile = action.payload.path;
            state.selectedSubType = action.payload.type;
        },
        reset: () => initialState,
    },
    extraReducers: (builder) => {
        builder.addCase(exports.selectDirectory.fulfilled, (state, action) => {
            if (!action.payload) {
                return;
            }
            state.selectedDirectory = action.payload;
            state.selectedSubDirectoryOrFile = action.payload;
            state.selectedSubType = 'directory';
        });
        builder.addCase(exports.loadDirectoryInfo.fulfilled, (state, action) => {
            state.selectedDirectoryInfo = action.payload;
        });
        builder.addCase(exports.loadDirectoryInfoFromPath.fulfilled, (state, action) => {
            state.selectedDirectoryInfo = action.payload;
        });
        builder.addCase(exports.fixSelectedSubDirectoryOrFile.fulfilled, (state, action) => {
            state.selectedSubDirectoryOrFile =
                action.payload.selectedSubDirectoryOrFile;
            state.selectedSubType = action.payload.selectedSubType;
        });
    },
});
_a = exports.selectedDirectorySlice.actions, exports.setSelectedSubDirectoryOrFile = _a.setSelectedSubDirectoryOrFile, exports.reset = _a.reset;
exports.default = exports.selectedDirectorySlice.reducer;
//# sourceMappingURL=selected-directory.js.map