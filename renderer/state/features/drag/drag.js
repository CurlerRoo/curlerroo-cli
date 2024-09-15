"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.reset = exports.removeDragToCells = exports.addDragToCells = exports.setDragFromDirectory = exports.removeDragToDirectories = exports.addDragToDirectories = exports.dragSlice = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const initialState = {
    dragToDirectories: {},
    dragToCells: {},
};
exports.dragSlice = (0, toolkit_1.createSlice)({
    name: 'drag',
    initialState,
    reducers: {
        setDragFromDirectory: (state, action) => {
            state.dragFromDirectory = action.payload;
            // reset dragToDirectories when dragFromDirectory is set
            state.dragToDirectories = {};
            state.dragToCells = {};
        },
        addDragToDirectories: (state, action) => {
            state.dragToDirectories = {
                ...state.dragToDirectories,
                [action.payload]: (state.dragToDirectories?.[action.payload] ?? 0) + 1,
            };
        },
        removeDragToDirectories: (state, action) => {
            if (!state.dragToDirectories) {
                return;
            }
            state.dragToDirectories = {
                ...state.dragToDirectories,
                [action.payload]: state.dragToDirectories[action.payload] - 1,
            };
        },
        addDragToCells: (state, action) => {
            state.dragToCells = {
                ...state.dragToCells,
                [action.payload]: (state.dragToCells?.[action.payload] ?? 0) + 1,
            };
        },
        removeDragToCells: (state, action) => {
            if (!state.dragToCells) {
                return;
            }
            state.dragToCells = {
                ...state.dragToCells,
                [action.payload]: state.dragToCells[action.payload] - 1,
            };
        },
        reset: () => initialState,
    },
});
_a = exports.dragSlice.actions, exports.addDragToDirectories = _a.addDragToDirectories, exports.removeDragToDirectories = _a.removeDragToDirectories, exports.setDragFromDirectory = _a.setDragFromDirectory, exports.addDragToCells = _a.addDragToCells, exports.removeDragToCells = _a.removeDragToCells, exports.reset = _a.reset;
exports.default = exports.dragSlice.reducer;
//# sourceMappingURL=drag.js.map