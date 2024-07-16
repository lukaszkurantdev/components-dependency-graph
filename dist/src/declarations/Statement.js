"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeStatement = void 0;
const typescript_estree_1 = require("@typescript-eslint/typescript-estree");
const FunctionDeclaration_1 = require("./FunctionDeclaration");
const BlockStatement_1 = require("./BlockStatement");
const Expression_1 = require("./Expression");
const analyzeStatement = (fileNode, componentNode, statement) => {
    if (!statement) {
        return;
    }
    switch (statement.type) {
        case typescript_estree_1.AST_NODE_TYPES.BlockStatement:
            (0, BlockStatement_1.analyzeBlockStatement)(fileNode, componentNode, statement);
            break;
        case typescript_estree_1.AST_NODE_TYPES.DoWhileStatement:
        case typescript_estree_1.AST_NODE_TYPES.ForInStatement:
        case typescript_estree_1.AST_NODE_TYPES.ForOfStatement:
        case typescript_estree_1.AST_NODE_TYPES.ForStatement:
        case typescript_estree_1.AST_NODE_TYPES.WhileStatement:
        case typescript_estree_1.AST_NODE_TYPES.WithStatement:
            (0, exports.analyzeStatement)(fileNode, componentNode, statement.body);
            break;
        case typescript_estree_1.AST_NODE_TYPES.FunctionDeclaration:
            (0, FunctionDeclaration_1.analyzeFunctionDeclaration)(fileNode, componentNode, statement);
            break;
        case typescript_estree_1.AST_NODE_TYPES.IfStatement:
            (0, exports.analyzeStatement)(fileNode, componentNode, statement.consequent);
            (0, exports.analyzeStatement)(fileNode, componentNode, statement.alternate);
            break;
        case typescript_estree_1.AST_NODE_TYPES.SwitchStatement:
            for (const caseExpression of statement.cases) {
                for (const consequent of caseExpression.consequent) {
                    (0, exports.analyzeStatement)(fileNode, componentNode, consequent);
                }
            }
            break;
        case typescript_estree_1.AST_NODE_TYPES.TryStatement:
            (0, BlockStatement_1.analyzeBlockStatement)(fileNode, componentNode, statement.block);
            (0, BlockStatement_1.analyzeBlockStatement)(fileNode, componentNode, statement.finalizer);
            (0, BlockStatement_1.analyzeBlockStatement)(fileNode, componentNode, statement.handler?.body);
            break;
        case typescript_estree_1.AST_NODE_TYPES.VariableDeclaration:
            for (const declaration of statement.declarations) {
                if (declaration.id.type === typescript_estree_1.AST_NODE_TYPES.ObjectPattern) {
                    for (const property of declaration.id.properties) {
                        if (property.value?.type === typescript_estree_1.AST_NODE_TYPES.AssignmentPattern) {
                            (0, Expression_1.analyzeExpression)(fileNode, componentNode, property.value.right);
                        }
                    }
                }
                (0, Expression_1.analyzeExpression)(fileNode, componentNode, declaration.init);
            }
            break;
        case typescript_estree_1.AST_NODE_TYPES.ReturnStatement:
            (0, Expression_1.analyzeExpression)(fileNode, componentNode, statement.argument);
            break;
        case typescript_estree_1.AST_NODE_TYPES.ExpressionStatement:
            (0, Expression_1.analyzeExpression)(fileNode, componentNode, statement.expression);
            break;
        case typescript_estree_1.AST_NODE_TYPES.ClassDeclaration:
            // TODO
            break;
    }
};
exports.analyzeStatement = analyzeStatement;
//# sourceMappingURL=Statement.js.map