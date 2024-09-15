"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCellName = exports.forceRefocusActiveCell = exports.setCursorPosition = exports.reset = exports.setSearchClickedAt = exports.addFile = exports.clearVariables = exports.deleteVariable = exports.addVariable = exports.cancelSend = exports.clearOutputs = exports.setActiveDocument = exports.setFilePath = exports.setActiveCellIndex = exports.appendToCellPostScript = exports.updateCell = exports.removeCell = exports.addCell = exports.moveCellDown = exports.moveCellUp = exports.setFormattedBody = exports.activeDocumentSlice = exports.sendAllCurls = exports.setExecutingAllCells = exports.validateCellAndSendCurl = exports.sendCurl = exports.executePostScript = exports.executePreScript = exports.saveActiveDocument = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const lodash_1 = __importDefault(require("lodash"));
const bluebird_1 = __importDefault(require("bluebird"));
const uuid_1 = require("uuid");
const _services_1 = require("../../../services/services-on-cli");
const get_curl_parts_1 = require("../../../../shared/get-curl-parts");
const validate_curl_1 = require("../../../../shared/validate-curl");
exports.saveActiveDocument = (0, toolkit_1.createAsyncThunk)('activeDocument/saveActiveDocument', async (__, thunkAPI) => {
    const state = thunkAPI.getState().activeDocument;
    if (!state) {
        throw new Error('No active document');
    }
    if (!state.filePath) {
        throw new Error('No file path');
    }
    await _services_1.Services.writeFile(state.filePath, {
        id: state.id,
        shared_id: state.shared_id,
        cells: state.cells,
        version: state.version,
        globalVariables: state.globalVariables,
        type: 'notebook',
        executingAllCells: state.executingAllCells,
    });
});
exports.executePreScript = (0, toolkit_1.createAsyncThunk)('activeDocument/executePreScript', async ({ cellIndex }, thunkAPI) => {
    const state = thunkAPI.getState().activeDocument;
    if (!state) {
        throw new Error('No active document');
    }
    const cell = state.cells[cellIndex];
    if (!cell.pre_scripts_enabled) {
        return {
            variables: [],
        };
    }
    return _services_1.Services.executeScript({
        postScript: cell.pre_scripts.join('\n'),
        resBody: '',
        resHeaders: {},
    });
});
exports.executePostScript = (0, toolkit_1.createAsyncThunk)('activeDocument/executePostScript', async ({ cellIndex, bodyText }, thunkAPI) => {
    const state = thunkAPI.getState().activeDocument;
    if (!state) {
        throw new Error('No active document');
    }
    const cell = state.cells[cellIndex];
    if (!cell.post_scripts_enabled) {
        return {
            variables: [],
        };
    }
    return _services_1.Services.executeScript({
        postScript: cell.post_scripts.join('\n'),
        resBody: bodyText,
        resHeaders: {},
    });
});
exports.sendCurl = (0, toolkit_1.createAsyncThunk)('activeDocument/sendCurl', async ({ cellIndex, selectedDirectory }, thunkAPI) => {
    const state = thunkAPI.getState().activeDocument;
    if (!state) {
        throw new Error('No active document');
    }
    const { variables: preScriptVariables } = await thunkAPI
        .dispatch((0, exports.executePreScript)({ cellIndex }))
        .unwrap();
    const cell = state.cells[cellIndex];
    const responses = await Promise.race([
        _services_1.Services.sendCurl({
            curlRequest: cell.source.join('\n'),
            variables: (0, lodash_1.default)([...preScriptVariables, ...state.globalVariables])
                .uniqBy('key')
                .value(),
            selectedDirectory,
        }).catch((error) => {
            throw new Error(error.message?.replace(`Error invoking remote method 'dialog:sendCurl': `, ''));
        }),
        new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(new Error('Request timed out'));
            }, 30000);
        }),
    ])
        .then((responses) => responses)
        .then((responses) => responses.map((response) => {
        return {
            ...response,
            bodyFilePath: response.bodyFilePath,
            bodyText: response.body,
        };
    }));
    if (!state) {
        throw new Error('No active document');
    }
    const bodyText = lodash_1.default.last(responses)?.bodyText;
    if (bodyText) {
        await thunkAPI
            .dispatch((0, exports.executePostScript)({ cellIndex, bodyText }))
            .unwrap()
            .catch(() => {
            return {
                variables: [],
            };
        });
    }
    return {
        responses,
    };
});
exports.validateCellAndSendCurl = (0, toolkit_1.createAsyncThunk)('activeDocument/validateCellAndSendCurl', async ({ cellIndex, selectedDirectory }, thunkAPI) => {
    const state = thunkAPI.getState().activeDocument;
    if (!state) {
        throw new Error('No active document');
    }
    const cell = state.cells[cellIndex];
    const curlParts = (0, get_curl_parts_1.getCurlParts)(cell.source.join('\n'));
    const curlValidationResult = (0, validate_curl_1.validateCurlSyntax)({ parts: curlParts });
    if (curlValidationResult.length > 0) {
        throw new Error(curlValidationResult[0].errorMessage);
    }
    const { responses } = await thunkAPI
        .dispatch((0, exports.sendCurl)({ cellIndex, selectedDirectory }))
        .unwrap();
    return {
        responses,
    };
});
exports.setExecutingAllCells = (0, toolkit_1.createAsyncThunk)('activeDocument/setExecutingAllCells', async (executingAllCells, thunkAPI) => {
    const state = thunkAPI.getState().activeDocument;
    if (!state) {
        throw new Error('No active document');
    }
    return executingAllCells;
});
exports.sendAllCurls = (0, toolkit_1.createAsyncThunk)('activeDocument/sendAllCurls', async ({ selectedDirectory }, thunkAPI) => {
    const state = thunkAPI.getState().activeDocument;
    if (!state) {
        throw new Error('No active document');
    }
    await thunkAPI.dispatch((0, exports.setExecutingAllCells)(true));
    await bluebird_1.default.mapSeries(state.cells, async (cell, cellIndex) => {
        const filePathHasNotChanged = thunkAPI.getState().activeDocument?.filePath === state.filePath;
        const executingAllCells = thunkAPI.getState().activeDocument?.executingAllCells;
        if (cell.cell_type === 'curl' &&
            executingAllCells &&
            filePathHasNotChanged) {
            await thunkAPI.dispatch((0, exports.sendCurl)({ cellIndex, selectedDirectory }));
        }
    });
});
const initialState = {
    id: (0, uuid_1.v4)(),
    shared_id: undefined,
    version: 2,
    executingAllCells: false,
    cells: [
        {
            id: (0, uuid_1.v4)(),
            cell_type: 'curl',
            cursor_position: {
                lineNumber: 1,
                column: 1,
                offset: 0,
            },
            execution_count: 0,
            metadata: {
                collapsed: false,
                jupyter: {
                    source_hidden: false,
                },
            },
            outputs: [
                {
                    protocol: '',
                    bodyFilePath: '',
                    bodyBase64: '',
                    body: [''],
                    headers: {},
                    status: 0,
                    responseDate: 0,
                    formattedBody: '',
                },
            ],
            source: [''],
            pre_scripts_enabled: false,
            pre_scripts: [''],
            post_scripts_enabled: false,
            post_scripts: [''],
            send_status: 'idle',
        },
    ],
    filePath: null,
    globalVariables: [],
    activeCellIndex: 0,
};
exports.activeDocumentSlice = (0, toolkit_1.createSlice)({
    name: 'activeDocument',
    initialState,
    reducers: {
        setCellName: (state, action) => {
            if (!state) {
                throw new Error('No active document');
            }
            state.cells[action.payload.cellIndex].name = action.payload.name;
        },
        forceRefocusActiveCell: (state) => {
            if (!state) {
                throw new Error('No active document');
            }
            state.forceRefocusActiveCell = Math.random();
        },
        setFormattedBody: (state, action) => {
            if (!state) {
                throw new Error('No active document');
            }
            const cell = state.cells[action.payload.cellIndex];
            const lastOutput = lodash_1.default.last(cell.outputs);
            if (!lastOutput) {
                return;
            }
            lastOutput.formattedBody = action.payload.formattedBody;
        },
        moveCellUp: (state, action) => {
            if (!state) {
                throw new Error('No active document');
            }
            if (action.payload === 0) {
                return;
            }
            const cell = state.cells[action.payload];
            state.cells.splice(action.payload, 1);
            state.cells.splice(action.payload - 1, 0, cell);
            if (state.activeCellIndex === action.payload) {
                state.activeCellIndex = action.payload - 1;
            }
            else if (state.activeCellIndex === action.payload - 1) {
                state.activeCellIndex = action.payload;
            }
        },
        moveCellDown: (state, action) => {
            if (!state) {
                throw new Error('No active document');
            }
            if (action.payload === state.cells.length - 1) {
                return;
            }
            const cell = state.cells[action.payload];
            state.cells.splice(action.payload, 1);
            state.cells.splice(action.payload + 1, 0, cell);
            if (state.activeCellIndex === action.payload) {
                state.activeCellIndex = action.payload + 1;
            }
            else if (state.activeCellIndex === action.payload + 1) {
                state.activeCellIndex = action.payload;
            }
        },
        setActiveCellIndex: (state, action) => {
            if (!state) {
                throw new Error('No active document');
            }
            state.activeCellIndex = action.payload;
        },
        addCell: (state, action) => {
            if (!state) {
                throw new Error('No active document');
            }
            // add cell at index
            state.cells.splice(action.payload.cellIndex, 0, action.payload.cell);
            state.activeCellIndex = action.payload.cellIndex;
        },
        removeCell: (state, action) => {
            if (!state) {
                throw new Error('No active document');
            }
            if (action.payload === state.cells.length - 1) {
                state.activeCellIndex = action.payload - 1;
            }
            state.cells.splice(action.payload, 1);
        },
        updateCell: (state, action) => {
            if (!state) {
                throw new Error('No active document');
            }
            state.cells[action.payload.cellIndex] = action.payload.cell;
        },
        appendToCellPostScript: (state, action) => {
            if (!state) {
                throw new Error('No active document');
            }
            if (!state.cells[action.payload.cellIndex].post_scripts.filter(Boolean)
                .length) {
                state.cells[action.payload.cellIndex].post_scripts = [
                    action.payload.postScript,
                ];
                state.cells[action.payload.cellIndex].post_scripts_enabled = true;
                return;
            }
            state.cells[action.payload.cellIndex].post_scripts.push(action.payload.postScript);
            state.cells[action.payload.cellIndex].post_scripts_enabled = true;
        },
        setFilePath: (state, action) => {
            if (!state) {
                throw new Error('No active document');
            }
            state.filePath = action.payload;
        },
        setActiveDocument: (state, action) => {
            return action.payload;
        },
        clearOutputs: (state, action) => {
            if (!state) {
                throw new Error('No active document');
            }
            state.cells[action.payload.cellIndex].send_status = 'idle';
            state.cells[action.payload.cellIndex].outputs = [
                {
                    protocol: '',
                    bodyFilePath: '',
                    bodyBase64: '',
                    body: [''],
                    headers: {},
                    status: 0,
                    responseDate: 0,
                    formattedBody: '',
                },
            ];
        },
        cancelSend: (state, action) => {
            if (!state) {
                throw new Error('No active document');
            }
            state.cells[action.payload.cellIndex].send_status = 'idle';
            state.cells[action.payload.cellIndex].sending_id = undefined;
            state.executingAllCells = false;
        },
        addVariable: (state, action) => {
            if (!state) {
                throw new Error('No active document');
            }
            if (action.payload.variable.key.startsWith('_')) {
                throw new Error('Cannot add variable starting with _');
            }
            state.globalVariables = (0, lodash_1.default)([
                action.payload.variable,
                ...state.globalVariables,
            ])
                .uniqBy('key')
                .sortBy('key')
                .value();
        },
        deleteVariable: (state, action) => {
            if (!state) {
                throw new Error('No active document');
            }
            state.globalVariables = lodash_1.default.filter(state.globalVariables, (variable) => variable.key !== action.payload.variable.key);
        },
        clearVariables: (state) => {
            if (!state) {
                throw new Error('No active document');
            }
            state.globalVariables = [];
        },
        addFile: (state, action) => {
            if (!state) {
                throw new Error('No active document');
            }
            const cell = state.cells[action.payload.cellIndex];
            cell.source = [...cell.source, `@${action.payload.filePath}`];
        },
        setSearchClickedAt: (state, action) => {
            if (!state) {
                throw new Error('No active document');
            }
            const cell = state.cells[action.payload.cellIndex];
            const lastOutput = lodash_1.default.last(cell.outputs);
            if (!lastOutput) {
                return;
            }
            lastOutput.searchClickedAt = action.payload.searchClickedAt;
        },
        reset: () => initialState,
        setCursorPosition: (state, action) => {
            if (!state) {
                throw new Error('No active document');
            }
            state.cells[action.payload.cellIndex].cursor_position =
                action.payload.cursorPosition;
        },
    },
    extraReducers: (builder) => {
        const sendCurlPending = (state, action) => {
            if (!state) {
                throw new Error('No active document');
            }
            state.activeCellIndex = action.meta.arg.cellIndex;
            const cell = state.cells[action.meta.arg.cellIndex];
            cell.send_status = 'sending';
            cell.sending_id = action.meta.requestId;
        };
        builder.addCase(exports.sendCurl.pending, sendCurlPending);
        builder.addCase(exports.validateCellAndSendCurl.pending, sendCurlPending);
        const sendCurlRejected = (state, action) => {
            if (!state) {
                throw new Error('No active document');
            }
            const cell = state.cells[action.meta.arg.cellIndex];
            if (cell.sending_id !== action.meta.requestId) {
                return;
            }
            cell.send_status = 'error';
            cell.sending_id = undefined;
            cell.outputs = [
                {
                    protocol: '',
                    bodyFilePath: '',
                    bodyBase64: '',
                    body: (action.error.message?.replace(`Error invoking remote method 'dialog:executeScript': `, '') || 'Error sending request').split('\n'),
                    formattedBody: '',
                    headers: {},
                    status: 0,
                    responseDate: 0,
                },
            ];
        };
        builder.addCase(exports.sendCurl.rejected, sendCurlRejected);
        builder.addCase(exports.validateCellAndSendCurl.rejected, sendCurlRejected);
        const sendCurlFulfilled = (state, action) => {
            (async () => {
                if (!state) {
                    throw new Error('No active document');
                }
                const cell = state.cells[action.meta.arg.cellIndex];
                if (cell.sending_id !== action.meta.requestId) {
                    return;
                }
                const { responses } = action.payload;
                cell.send_status = 'success';
                cell.sending_id = undefined;
                cell.outputs = responses.map((response) => ({
                    protocol: response.protocol,
                    bodyFilePath: response.bodyFilePath,
                    bodyBase64: response.bodyBase64,
                    body: response.bodyText.split('\n'),
                    formattedBody: '',
                    headers: response.headers,
                    status: response.status,
                    responseDate: Date.now(),
                }));
            })();
        };
        builder.addCase(exports.sendCurl.fulfilled, sendCurlFulfilled);
        builder.addCase(exports.validateCellAndSendCurl.fulfilled, sendCurlFulfilled);
        builder.addCase(exports.setExecutingAllCells.fulfilled, (state, action) => {
            if (!state) {
                throw new Error('No active document');
            }
            state.executingAllCells = action.payload;
        });
        builder.addCase(exports.executePreScript.fulfilled, (state, action) => {
            if (!state) {
                throw new Error('No active document');
            }
            state.globalVariables = (0, lodash_1.default)([
                ...action.payload.variables,
                ...state.globalVariables,
            ])
                .filter((variable) => !variable.key.startsWith('_'))
                .uniqBy('key')
                .sortBy('key')
                .value();
            state.cells[state.activeCellIndex].pre_scripts_error = '';
            state.cells[state.activeCellIndex].pre_scripts_status = 'success';
        });
        builder.addCase(exports.executePreScript.rejected, (state, action) => {
            if (!state) {
                throw new Error('No active document');
            }
            state.cells[state.activeCellIndex].pre_scripts_error =
                action.error.message?.replace(`Error invoking remote method 'dialog:executeScript': `, '');
            state.cells[state.activeCellIndex].pre_scripts_status = 'error';
        });
        builder.addCase(exports.executePreScript.pending, (state) => {
            if (!state) {
                throw new Error('No active document');
            }
            state.cells[state.activeCellIndex].pre_scripts_status = 'sending';
        });
        builder.addCase(exports.executePostScript.fulfilled, (state, action) => {
            if (!state) {
                throw new Error('No active document');
            }
            state.globalVariables = (0, lodash_1.default)([
                ...action.payload.variables,
                ...state.globalVariables,
            ])
                .filter((variable) => !variable.key.startsWith('_'))
                .uniqBy('key')
                .sortBy('key')
                .value();
            state.cells[state.activeCellIndex].post_scripts_error = '';
            state.cells[state.activeCellIndex].post_scripts_status = 'success';
        });
        builder.addCase(exports.executePostScript.rejected, (state, action) => {
            if (!state) {
                throw new Error('No active document');
            }
            state.cells[state.activeCellIndex].post_scripts_error =
                action.error.message?.replace(`Error invoking remote method 'dialog:executeScript': `, '');
            state.cells[state.activeCellIndex].post_scripts_status = 'error';
        });
        builder.addCase(exports.executePostScript.pending, (state) => {
            if (!state) {
                throw new Error('No active document');
            }
            state.cells[state.activeCellIndex].post_scripts_status = 'sending';
        });
    },
});
_a = exports.activeDocumentSlice.actions, exports.setFormattedBody = _a.setFormattedBody, exports.moveCellUp = _a.moveCellUp, exports.moveCellDown = _a.moveCellDown, exports.addCell = _a.addCell, exports.removeCell = _a.removeCell, exports.updateCell = _a.updateCell, exports.appendToCellPostScript = _a.appendToCellPostScript, exports.setActiveCellIndex = _a.setActiveCellIndex, exports.setFilePath = _a.setFilePath, exports.setActiveDocument = _a.setActiveDocument, exports.clearOutputs = _a.clearOutputs, exports.cancelSend = _a.cancelSend, exports.addVariable = _a.addVariable, exports.deleteVariable = _a.deleteVariable, exports.clearVariables = _a.clearVariables, exports.addFile = _a.addFile, exports.setSearchClickedAt = _a.setSearchClickedAt, exports.reset = _a.reset, exports.setCursorPosition = _a.setCursorPosition, exports.forceRefocusActiveCell = _a.forceRefocusActiveCell, exports.setCellName = _a.setCellName;
//# sourceMappingURL=active-document.js.map