"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = exports.GlobalConfig = void 0;
class GlobalConfig {
    static instance;
    static getInstance(rawConfig) {
        if (!this.instance) {
            this.instance = new Config(rawConfig?.pathAliases, rawConfig?.rootPath, rawConfig?.generateGraphWithFilesPaths, rawConfig?.excludeDirectoriesWithNameContains, rawConfig?.excludeFilesContains);
        }
        return this.instance;
    }
    static clear() {
        this.instance = undefined;
    }
}
exports.GlobalConfig = GlobalConfig;
class Config {
    pathAliases;
    rootPath;
    generateGraphWithFilesPath;
    excludeDirectoriesWithNameContains;
    excludeFilesContains;
    analyzedFilesMap = new Map();
    constructor(pathAliases = {}, rootPath = "", generateGraphWithFilesPath = false, excludeDirectoriesWithNameContains = [], excludeFilesContains = []) {
        this.pathAliases = pathAliases;
        this.rootPath = rootPath;
        this.generateGraphWithFilesPath = generateGraphWithFilesPath;
        this.excludeDirectoriesWithNameContains = excludeDirectoriesWithNameContains;
        this.excludeFilesContains = excludeFilesContains;
    }
    isFileAnalyzed(path) {
        return this.analyzedFilesMap.has(path);
    }
    setFileAsAnalyzed(path) {
        this.analyzedFilesMap.set(path, true);
    }
}
exports.Config = Config;
//# sourceMappingURL=Config.js.map