"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeJSXElement = void 0;
const typescript_estree_1 = require("@typescript-eslint/typescript-estree");
const Expression_1 = require("./Expression");
const analyzeJSXElement = (fileNode, componentNode, element) => {
    if (!element) {
        return;
    }
    if (process.env.debugLevel === "all") {
        console.log("NODE", element.type);
    }
    if (element.type === typescript_estree_1.AST_NODE_TYPES.JSXElement) {
        for (const childElement of element.openingElement.attributes) {
            if (childElement.type === typescript_estree_1.AST_NODE_TYPES.JSXAttribute) {
                switch (childElement.value?.type) {
                    case typescript_estree_1.AST_NODE_TYPES.JSXElement:
                        (0, Expression_1.analyzeExpression)(fileNode, componentNode, childElement.value);
                        break;
                    case typescript_estree_1.AST_NODE_TYPES.JSXExpressionContainer:
                    case typescript_estree_1.AST_NODE_TYPES.JSXSpreadChild:
                        (0, Expression_1.analyzeExpression)(fileNode, componentNode, childElement.value.expression);
                        break;
                }
            }
        }
    }
    for (const childElement of element.children) {
        switch (childElement.type) {
            case typescript_estree_1.AST_NODE_TYPES.JSXElement:
            case typescript_estree_1.AST_NODE_TYPES.JSXFragment:
                (0, Expression_1.analyzeExpression)(fileNode, componentNode, childElement);
                break;
            case typescript_estree_1.AST_NODE_TYPES.JSXExpressionContainer:
            case typescript_estree_1.AST_NODE_TYPES.JSXSpreadChild:
                (0, Expression_1.analyzeExpression)(fileNode, componentNode, childElement.expression);
                break;
        }
    }
};
exports.analyzeJSXElement = analyzeJSXElement;
//# sourceMappingURL=JSXElement.js.map