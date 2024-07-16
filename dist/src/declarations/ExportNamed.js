"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeNamedExportDeclaration = void 0;
const typescript_estree_1 = require("@typescript-eslint/typescript-estree");
const Expression_1 = require("./Expression");
const FunctionDeclaration_1 = require("./FunctionDeclaration");
const ClassDeclaration_1 = require("./ClassDeclaration");
const analyzeNamedExportDeclaration = (fileNode, declaration, config) => {
    if (!declaration) {
        return;
    }
    if (declaration?.type === typescript_estree_1.AST_NODE_TYPES.FunctionDeclaration) {
        (0, FunctionDeclaration_1.analyzeFunctionDeclaration)(fileNode, undefined, declaration, config);
    }
    if (declaration?.type === typescript_estree_1.AST_NODE_TYPES.ClassDeclaration) {
        (0, ClassDeclaration_1.analyzeClassDeclaration)(fileNode, undefined, declaration, config);
    }
    if (declaration?.type === typescript_estree_1.AST_NODE_TYPES.VariableDeclaration) {
        for (const child of declaration.declarations) {
            if (child.id.type === typescript_estree_1.AST_NODE_TYPES.Identifier) {
                (0, Expression_1.analyzeExpression)(fileNode, undefined, child.init, { ...config, variableName: child.id.name });
                // TODO
                // if (child.id.name === componentNode.title || componentNode.title === "") {
                //   if (child.init) {
                //     analyzeExpression(fileNode, componentNode, child.init);
                //   }
                // }
            }
        }
    }
};
exports.analyzeNamedExportDeclaration = analyzeNamedExportDeclaration;
//# sourceMappingURL=ExportNamed.js.map