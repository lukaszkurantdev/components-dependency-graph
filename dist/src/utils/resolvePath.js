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
exports.findAnalyzeFilePath = exports.getFinalPath = exports.resolvePath = void 0;
const path = __importStar(require("node:path"));
const fs = __importStar(require("node:fs"));
const Config_1 = require("../types/Config");
const FileExtensions_1 = require("../constants/FileExtensions");
const resolvePath = (filePath, parentNodePath) => {
    const config = Config_1.GlobalConfig.getInstance();
    const parentDir = path.dirname(parentNodePath);
    for (const aliasKey of Object.keys(config.pathAliases)) {
        if (filePath.startsWith(aliasKey)) {
            const statementDir = path.dirname(filePath.replace(aliasKey, config.pathAliases[aliasKey]));
            return `${config.rootPath}${statementDir}`;
        }
    }
    return `${parentDir}/${path.dirname(filePath)}`;
};
exports.resolvePath = resolvePath;
const getFinalPath = (filePath, parentNodePath) => {
    const fileName = path.basename(filePath);
    const dir = (0, exports.resolvePath)(filePath, parentNodePath);
    return (0, exports.findAnalyzeFilePath)(fileName, dir);
};
exports.getFinalPath = getFinalPath;
const findAnalyzeFilePath = (basePath, dir) => {
    for (const ext of FileExtensions_1.EXTENSIONS_TO_ANALYZE) {
        if (fs.existsSync(`${dir}/${basePath}${ext}`)) {
            return { filePath: `${dir}/${basePath}${ext}`, existsFile: true };
        }
        else if (fs.existsSync(`${dir}/${basePath}/index${ext}`)) {
            return { filePath: `${dir}/${basePath}/index${ext}`, existsFile: true };
        }
    }
    return { filePath: "", existsFile: false };
};
exports.findAnalyzeFilePath = findAnalyzeFilePath;
//# sourceMappingURL=resolvePath.js.map