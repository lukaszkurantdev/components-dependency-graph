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
exports.analyzeImportDeclaration = void 0;
const path = __importStar(require("node:path"));
const typescript_estree_1 = require("@typescript-eslint/typescript-estree");
const resolvePath_1 = require("../utils/resolvePath");
const FileNode_1 = require("../types/FileNode");
const ImportedItem_1 = require("../types/ImportedItem");
const analyzeImportDeclaration = (parentNode, statement) => {
    if (process.env.debugLevel === "all") {
        console.log("NODE", statement.type);
    }
    const finalPath = (0, resolvePath_1.getFinalPath)(statement.source.value, parentNode.path);
    const fileName = path.basename(statement.source.value);
    let dependency = undefined;
    if (finalPath.existsFile) {
        dependency = new FileNode_1.FileNode(finalPath.filePath);
        parentNode.addDependency(dependency);
    }
    for (const specifier of statement.specifiers) {
        let title = "";
        let aliasTitle = undefined;
        const isImportDefault = isDefaultImport(specifier);
        if (isImportDefault) {
            // title = fileName;
            title = specifier.local.name;
        }
        else if (specifier.type === typescript_estree_1.AST_NODE_TYPES.ImportSpecifier &&
            specifier.importKind === "value") {
            title = specifier.imported.name;
            aliasTitle = specifier.local.name;
        }
        if (title) {
            const importedItem = new ImportedItem_1.ImportedItem(title, aliasTitle);
            importedItem.setDefaultImport(isImportDefault);
            importedItem.setDependency(dependency);
            parentNode.addImportedItem(importedItem);
        }
    }
};
exports.analyzeImportDeclaration = analyzeImportDeclaration;
const isDefaultImport = (specifier) => {
    return (specifier.type === typescript_estree_1.AST_NODE_TYPES.ImportDefaultSpecifier &&
        specifier.local.type === typescript_estree_1.AST_NODE_TYPES.Identifier);
};
//# sourceMappingURL=ImportDeclaration.js.map