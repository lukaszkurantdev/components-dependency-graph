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
exports.directoryBasedAnalyze = exports.fileBasedAnalyze = void 0;
const typescript_estree_1 = require("@typescript-eslint/typescript-estree");
const fs = __importStar(require("node:fs"));
const generateDiagram_1 = require("./src/utils/generateDiagram");
const AstBodyDeclaration_1 = require("./src/declarations/AstBodyDeclaration");
const AstChildren_1 = require("./src/declarations/AstChildren");
const Config_1 = require("./src/types/Config");
const FileNode_1 = require("./src/types/FileNode");
const getFilesList_1 = require("./src/utils/getFilesList");
const nodePath = __importStar(require("node:path"));
const getAbstractSyntaxTree = (filePath) => {
    try {
        const code = fs.readFileSync(filePath).toString();
        return (0, typescript_estree_1.parse)(code, { jsx: true, loc: true, loggerFn: false });
    }
    catch (err) {
        return null;
    }
};
const analyze = (fileNode) => {
    const config = Config_1.GlobalConfig.getInstance();
    const { path: relativePath } = fileNode;
    const path = nodePath.normalize(relativePath);
    if (config.isFileAnalyzed(path)) {
        return;
    }
    config.setFileAsAnalyzed(path);
    const abstractSyntaxTree = getAbstractSyntaxTree(path);
    if (!abstractSyntaxTree) {
        return;
    }
    (0, AstBodyDeclaration_1.analyzeAstBodyDeclaration)(fileNode, abstractSyntaxTree.body);
    (0, AstChildren_1.analyzeAstChildren)(fileNode);
    for (const dependency of fileNode.dependencies) {
        if (dependency.isUsed) {
            analyze(dependency);
        }
    }
};
const fileBasedAnalyze = (filePath, config = {}) => {
    Config_1.GlobalConfig.clear();
    Config_1.GlobalConfig.getInstance(config);
    const rootNode = new FileNode_1.FileNode(filePath);
    rootNode.setAsUsed();
    analyze(rootNode);
    return (0, generateDiagram_1.generateGraphDiagram)(rootNode);
};
exports.fileBasedAnalyze = fileBasedAnalyze;
const directoryBasedAnalyze = (catalogPath, config = {}) => {
    Config_1.GlobalConfig.clear();
    Config_1.GlobalConfig.getInstance(config);
    const results = [];
    const files = (0, getFilesList_1.getFilesList)(catalogPath);
    for (let filePath of files) {
        const rootNode = new FileNode_1.FileNode(filePath);
        rootNode.setAsUsed();
        analyze(rootNode);
        results.push(...(0, generateDiagram_1.generateGraphDiagram)(rootNode));
    }
    return [...new Set(results)];
};
exports.directoryBasedAnalyze = directoryBasedAnalyze;
//# sourceMappingURL=ComponentGraphAnalyzer.js.map