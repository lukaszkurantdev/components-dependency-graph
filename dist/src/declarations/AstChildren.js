"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeAstChildren = void 0;
const typescript_estree_1 = require("@typescript-eslint/typescript-estree");
const Expression_1 = require("./Expression");
const BlockStatement_1 = require("./BlockStatement");
const analyzeAstChildren = (fileNode) => {
    let children = fileNode.children;
    const analyzedChildren = new Map();
    while (children.length) {
        let newChildren = [];
        for (const child of children) {
            if (!analyzedChildren.has(child.getUniqueId())) {
                analyzedChildren.set(child.getUniqueId(), true);
            }
            else {
                continue;
            }
            if (child.body?.type === typescript_estree_1.AST_NODE_TYPES.ClassBody) {
                for (const element of child.body.body) {
                    if (element.type === typescript_estree_1.AST_NODE_TYPES.MethodDefinition) {
                        if (element.value.body?.type === typescript_estree_1.AST_NODE_TYPES.BlockStatement) {
                            (0, BlockStatement_1.analyzeBlockStatement)(fileNode, child, element.value.body);
                        }
                    }
                }
            }
            else if (child.body?.type === typescript_estree_1.AST_NODE_TYPES.BlockStatement) {
                (0, BlockStatement_1.analyzeBlockStatement)(fileNode, child, child.body);
            }
            else {
                (0, Expression_1.analyzeExpression)(fileNode, child, child.body);
            }
            newChildren.push(...child.children);
        }
        children = newChildren;
    }
};
exports.analyzeAstChildren = analyzeAstChildren;
//# sourceMappingURL=AstChildren.js.map