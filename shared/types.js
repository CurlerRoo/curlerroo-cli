"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.docOnDiskSchema = exports.docOnDiskCellSchema = exports.docSchema = exports.docCellSchema = void 0;
const zod_1 = require("zod");
exports.docCellSchema = zod_1.z.object({
    id: zod_1.z.string(),
    cell_type: zod_1.z.enum(['curl']),
    name: zod_1.z.string().optional(),
    cursor_position: zod_1.z.object({
        lineNumber: zod_1.z.number(),
        column: zod_1.z.number(),
        offset: zod_1.z.number(),
    }),
    execution_count: zod_1.z.union([zod_1.z.number(), zod_1.z.null()]),
    metadata: zod_1.z.object({
        collapsed: zod_1.z.boolean(),
        jupyter: zod_1.z.object({
            source_hidden: zod_1.z.boolean(),
        }),
    }),
    outputs: zod_1.z.array(zod_1.z.object({
        protocol: zod_1.z.string(),
        headers: zod_1.z.record(zod_1.z.string()),
        status: zod_1.z.number(),
        bodyFilePath: zod_1.z.string(),
        body: zod_1.z.array(zod_1.z.string()),
        bodyBase64: zod_1.z.string(),
        formattedBody: zod_1.z.string().default(''),
        searchClickedAt: zod_1.z.number().optional(),
        responseDate: zod_1.z.number().default(0),
    })),
    source: zod_1.z.array(zod_1.z.string()),
    pre_scripts_enabled: zod_1.z.boolean().default(false),
    pre_scripts: zod_1.z.array(zod_1.z.string()),
    post_scripts_enabled: zod_1.z.boolean().default(false),
    post_scripts: zod_1.z.array(zod_1.z.string()),
    send_status: zod_1.z.enum(['idle', 'sending', 'success', 'error']),
    sending_id: zod_1.z.string().optional(),
});
exports.docSchema = zod_1.z.object({
    id: zod_1.z.string(),
    shared_id: zod_1.z.string().uuid().optional(),
    version: zod_1.z.number().default(1),
    type: zod_1.z.literal('notebook'),
    executingAllCells: zod_1.z.boolean().default(false),
    cells: zod_1.z.array(exports.docCellSchema),
    globalVariables: zod_1.z.array(zod_1.z.object({
        key: zod_1.z.string(),
        value: zod_1.z.any(),
        source: zod_1.z.enum(['manual', 'response']),
    })),
});
exports.docOnDiskCellSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    name: zod_1.z.string().optional(),
    cell_type: zod_1.z.enum(['curl']),
    execution_count: zod_1.z.union([zod_1.z.number(), zod_1.z.null()]),
    metadata: zod_1.z.object({
        collapsed: zod_1.z.boolean(),
        jupyter: zod_1.z.object({
            source_hidden: zod_1.z.boolean(),
        }),
    }),
    outputs: zod_1.z.array(zod_1.z.object({
        protocol: zod_1.z.string(),
        headers: zod_1.z.record(zod_1.z.string()),
        status: zod_1.z.number(),
        bodyFilePath: zod_1.z.string().optional(),
        bodyBase64: zod_1.z.string().optional(),
        body: zod_1.z.array(zod_1.z.string()),
        responseDate: zod_1.z.number(),
    })),
    source: zod_1.z.array(zod_1.z.string()),
    pre_scripts_enabled: zod_1.z.boolean().default(false),
    pre_scripts: zod_1.z.array(zod_1.z.string()).default(['']),
    post_scripts_enabled: zod_1.z.boolean().default(false),
    post_scripts: zod_1.z.array(zod_1.z.string()),
    send_status: zod_1.z.enum(['idle', 'success', 'error']),
    sending_id: zod_1.z.string().optional(),
});
exports.docOnDiskSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    shared_id: zod_1.z.string().uuid().optional(),
    version: zod_1.z.number().default(1),
    type: zod_1.z.literal('notebook'),
    cells: zod_1.z.array(exports.docOnDiskCellSchema),
    globalVariables: zod_1.z.array(zod_1.z.object({
        key: zod_1.z.string(),
        value: zod_1.z.any(),
        source: zod_1.z.enum(['manual', 'response']),
    })),
});
//# sourceMappingURL=types.js.map