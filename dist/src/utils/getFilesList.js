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
exports.getFilesList = void 0;
const fs = __importStar(require("node:fs"));
const nodePath = __importStar(require("node:path"));
const FileExtensions_1 = require("../constants/FileExtensions");
const Config_1 = require("../types/Config");
const getFilesList = (catalogPath) => {
    let files = [];
    const { excludeDirectoriesWithNameContains, excludeFilesContains } = Config_1.GlobalConfig.getInstance();
    function throughDirectory(directory) {
        for (const file of fs.readdirSync(directory)) {
            const absolute = nodePath.join(directory, file);
            if (fs.statSync(absolute).isDirectory() &&
                !excludeDirectoriesWithNameContains.includes(nodePath.basename(absolute))) {
                throughDirectory(absolute);
            }
            else {
                files.push(absolute);
            }
        }
    }
    throughDirectory(catalogPath);
    files = files.filter((item) => {
        let correctExtension = false;
        for (let extension of FileExtensions_1.EXTENSIONS_TO_ANALYZE) {
            if (item.endsWith(extension)) {
                correctExtension = true;
                break;
            }
        }
        let correctName = true;
        for (let fileContain of excludeFilesContains) {
            if (item.includes(fileContain)) {
                correctName = false;
                break;
            }
        }
        return correctExtension && correctName;
    });
    return files;
};
exports.getFilesList = getFilesList;
//# sourceMappingURL=getFilesList.js.map