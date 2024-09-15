"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeScript = void 0;
// import acron from 'acorn'; will not work on production
const acorn = __importStar(require("acorn"));
const quickjs_emscripten_1 = require("quickjs-emscripten");
const get_value_by_path_1 = require("./get-value-by-path");
const _executeScript = async (scriptText) => {
    const vm = (await (0, quickjs_emscripten_1.getQuickJS)()).newContext();
    const result = vm.evalCode(scriptText);
    if (result.error) {
        const error = vm.dump(result.error);
        throw new Error(error.message);
    }
    const value = vm.dump(result.value);
    return value;
};
const isValidJSON = (str) => {
    try {
        JSON.parse(str);
        return true;
    }
    catch (e) {
        return false;
    }
};
const executeScript = async ({ resBody, postScript, existingVariables, }) => {
    const preScript = `
    const getByPath = ${get_value_by_path_1.getValueByPath.toString()}
    const json_body = (path) => {
      const json = ${resBody && isValidJSON(resBody) ? resBody : null};
      return getByPath(json, path);
    };
    ${(existingVariables || [])
        ?.map(({ key, value }) => {
        return `var ${key} = ${JSON.stringify(value)};`;
    })
        .join('\n')}
  `;
    const ast = acorn.parse(postScript, {
        ecmaVersion: 2021,
    });
    const declarations = ast.body
        .filter((m) => m.type === 'VariableDeclaration')
        // @ts-ignore
        .flatMap((m) => m.declarations)
        .map((m) => m.id.name);
    const appendScripts = `JSON.stringify({
    ${declarations.join(',')}
  });`;
    const finalScript = `${preScript};\n${postScript};\n${appendScripts}`;
    const variables = await _executeScript(finalScript).then((m) => JSON.parse(m));
    return {
        variables: Object.entries(variables).map(([key, value]) => ({
            key,
            value,
            source: 'manual',
        })),
    };
};
exports.executeScript = executeScript;
//# sourceMappingURL=execute-script.js.map