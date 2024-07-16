"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeExpression = void 0;
const typescript_estree_1 = require("@typescript-eslint/typescript-estree");
const JSXElement_1 = require("./JSXElement");
const AddChildren_1 = require("../vertices/AddChildren");
const ComponentNode_1 = require("../types/ComponentNode");
const BlockStatement_1 = require("./BlockStatement");
const analyzeExpression = (fileNode, componentNode, expression, config) => {
    const isDefaultExport = Boolean(config?.isDefaultExport);
    const isExport = Boolean(config?.isExport);
    const variableName = config?.variableName;
    if (!expression) {
        return;
    }
    if (process.env.debugLevel === "all") {
        console.log("NODE", expression.type, Boolean(componentNode));
    }
    switch (expression.type) {
        case typescript_estree_1.AST_NODE_TYPES.JSXElement:
            (0, JSXElement_1.analyzeJSXElement)(fileNode, componentNode, expression);
            (0, AddChildren_1.addChildren)(fileNode, componentNode, expression);
            // analyzeJSXElement(fileNode, componentNode, expression);
            // analyzeChildrenJSXElement(parentNode, elm)
            break;
        case typescript_estree_1.AST_NODE_TYPES.JSXFragment:
            (0, JSXElement_1.analyzeJSXElement)(fileNode, componentNode, expression);
            break;
        case typescript_estree_1.AST_NODE_TYPES.SpreadElement:
        case typescript_estree_1.AST_NODE_TYPES.AwaitExpression:
            (0, exports.analyzeExpression)(fileNode, componentNode, expression.argument);
            break;
        case typescript_estree_1.AST_NODE_TYPES.ArrayExpression:
            for (const childExpression of expression.elements) {
                (0, exports.analyzeExpression)(fileNode, componentNode, childExpression);
            }
            break;
        case typescript_estree_1.AST_NODE_TYPES.AssignmentExpression:
        case typescript_estree_1.AST_NODE_TYPES.LogicalExpression:
            (0, exports.analyzeExpression)(fileNode, componentNode, expression.right);
            break;
        case typescript_estree_1.AST_NODE_TYPES.CallExpression:
            for (const argument of expression.arguments) {
                (0, exports.analyzeExpression)(fileNode, componentNode, argument, config);
            }
            break;
        case typescript_estree_1.AST_NODE_TYPES.ChainExpression:
            (0, exports.analyzeExpression)(fileNode, componentNode, expression.expression);
            break;
        case typescript_estree_1.AST_NODE_TYPES.ClassExpression:
            // console.log(expression); // ???
            break;
        case typescript_estree_1.AST_NODE_TYPES.ImportExpression:
            (0, exports.analyzeExpression)(fileNode, componentNode, expression.attributes);
            break;
        case typescript_estree_1.AST_NODE_TYPES.MemberExpression:
            (0, exports.analyzeExpression)(fileNode, componentNode, expression.object);
            break;
        case typescript_estree_1.AST_NODE_TYPES.NewExpression:
            for (const argument of expression.arguments) {
                (0, exports.analyzeExpression)(fileNode, componentNode, argument);
            }
            (0, exports.analyzeExpression)(fileNode, componentNode, expression.callee);
            break;
        case typescript_estree_1.AST_NODE_TYPES.ObjectExpression:
            for (const property of expression.properties) {
                if (property.type === typescript_estree_1.AST_NODE_TYPES.Property) {
                    if (property.value.type === typescript_estree_1.AST_NODE_TYPES.FunctionExpression ||
                        property.value.type === typescript_estree_1.AST_NODE_TYPES.ArrowFunctionExpression) {
                        (0, exports.analyzeExpression)(fileNode, componentNode, property.value);
                    }
                    if (property.value.type === typescript_estree_1.AST_NODE_TYPES.JSXElement) {
                        (0, JSXElement_1.analyzeJSXElement)(fileNode, componentNode, property.value);
                        (0, AddChildren_1.addChildren)(fileNode, componentNode, property.value);
                    }
                }
            }
            break;
        case typescript_estree_1.AST_NODE_TYPES.SequenceExpression:
        case typescript_estree_1.AST_NODE_TYPES.TemplateLiteral:
            for (const childExpression of expression.expressions) {
                (0, exports.analyzeExpression)(fileNode, componentNode, childExpression);
            }
            break;
        case typescript_estree_1.AST_NODE_TYPES.TaggedTemplateExpression:
            for (const childExpression of expression.quasi.expressions) {
                (0, exports.analyzeExpression)(fileNode, componentNode, childExpression);
            }
            break;
        case typescript_estree_1.AST_NODE_TYPES.ConditionalExpression:
            (0, exports.analyzeExpression)(fileNode, componentNode, expression.consequent);
            (0, exports.analyzeExpression)(fileNode, componentNode, expression.alternate);
            break;
        case typescript_estree_1.AST_NODE_TYPES.ArrowFunctionExpression:
        case typescript_estree_1.AST_NODE_TYPES.FunctionExpression:
            if (variableName) {
                const node = new ComponentNode_1.ComponentNode(variableName, fileNode, typescript_estree_1.AST_NODE_TYPES.FunctionDeclaration, expression.loc);
                node.setExport(isExport);
                node.setDefaultExport(isDefaultExport);
                node.setParent(componentNode);
                node.setBody(expression.body);
                if (!componentNode) {
                    fileNode.children.push(node);
                }
                else {
                    componentNode.children.push(node);
                }
            }
            else if (expression.body.type === typescript_estree_1.AST_NODE_TYPES.BlockStatement) {
                (0, BlockStatement_1.analyzeBlockStatement)(fileNode, componentNode, expression.body);
            }
            else {
                (0, exports.analyzeExpression)(fileNode, componentNode, expression.body);
            }
            break;
    }
};
exports.analyzeExpression = analyzeExpression;
//# sourceMappingURL=Expression.js.map