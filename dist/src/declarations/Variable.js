"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeVariableDeclaration = void 0;
const typescript_estree_1 = require("@typescript-eslint/typescript-estree");
const Expression_1 = require("./Expression");
const analyzeVariableDeclaration = (fileNode, componentNode, declaration, config) => {
    if (!declaration) {
        return;
    }
    if (declaration.id.type !== typescript_estree_1.AST_NODE_TYPES.Identifier) {
        return;
    }
    if (declaration.init?.type === typescript_estree_1.AST_NODE_TYPES.CallExpression) {
        (0, Expression_1.analyzeExpression)(fileNode, componentNode, declaration.init, config);
        return;
    }
    if (declaration.init?.type === typescript_estree_1.AST_NODE_TYPES.TSAsExpression) {
        (0, Expression_1.analyzeExpression)(fileNode, componentNode, declaration.init.expression, config);
    }
    if (declaration.init?.type !== typescript_estree_1.AST_NODE_TYPES.ArrowFunctionExpression &&
        declaration.init?.type !== typescript_estree_1.AST_NODE_TYPES.FunctionExpression) {
        // ?
        return;
    }
    if (declaration.init.body.type === typescript_estree_1.AST_NODE_TYPES.JSXElement) {
        // TODO:
        // probably analyze JSXElement with add new child
    }
    (0, Expression_1.analyzeExpression)(fileNode, componentNode, declaration.init, config);
};
exports.analyzeVariableDeclaration = analyzeVariableDeclaration;
//# sourceMappingURL=Variable.js.map