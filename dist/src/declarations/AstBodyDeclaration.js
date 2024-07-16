"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeAstBodyDeclaration = void 0;
const typescript_estree_1 = require("@typescript-eslint/typescript-estree");
const ImportDeclaration_1 = require("./ImportDeclaration");
const FunctionDeclaration_1 = require("./FunctionDeclaration");
const Expression_1 = require("./Expression");
const ExportNamed_1 = require("./ExportNamed");
const ClassDeclaration_1 = require("./ClassDeclaration");
const Variable_1 = require("./Variable");
const analyzeAstBodyDeclaration = (fileNode, body) => {
    if (!body) {
        return;
    }
    for (const node of body) {
        switch (node.type) {
            case typescript_estree_1.AST_NODE_TYPES.ImportDeclaration:
                (0, ImportDeclaration_1.analyzeImportDeclaration)(fileNode, node);
                break;
            case typescript_estree_1.AST_NODE_TYPES.FunctionDeclaration:
                (0, FunctionDeclaration_1.analyzeFunctionDeclaration)(fileNode, undefined, node);
                break;
            case typescript_estree_1.AST_NODE_TYPES.ExpressionStatement:
                const { type } = node.expression;
                if (type === typescript_estree_1.AST_NODE_TYPES.CallExpression || type === typescript_estree_1.AST_NODE_TYPES.NewExpression) {
                    for (const argument of node.expression.arguments) {
                        (0, Expression_1.analyzeExpression)(fileNode, undefined, argument);
                    }
                }
                break;
            case typescript_estree_1.AST_NODE_TYPES.VariableDeclaration:
                for (const declaration of node.declarations) {
                    (0, Variable_1.analyzeVariableDeclaration)(fileNode, undefined, declaration, {
                        //@ts-ignore // TO DO
                        variableName: declaration.id.name,
                    });
                }
                break;
            case typescript_estree_1.AST_NODE_TYPES.ExportNamedDeclaration:
                (0, ExportNamed_1.analyzeNamedExportDeclaration)(fileNode, node.declaration, {
                    isExport: true,
                });
                break;
            case typescript_estree_1.AST_NODE_TYPES.ExportDefaultDeclaration:
                (0, ExportNamed_1.analyzeNamedExportDeclaration)(fileNode, node.declaration, {
                    isDefaultExport: true,
                });
                break;
            case typescript_estree_1.AST_NODE_TYPES.ClassDeclaration:
                (0, ClassDeclaration_1.analyzeClassDeclaration)(fileNode, undefined, node);
                break;
        }
    }
};
exports.analyzeAstBodyDeclaration = analyzeAstBodyDeclaration;
//# sourceMappingURL=AstBodyDeclaration.js.map