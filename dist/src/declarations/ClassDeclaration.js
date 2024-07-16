"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeClassDeclaration = void 0;
const typescript_estree_1 = require("@typescript-eslint/typescript-estree");
const ComponentNode_1 = require("../types/ComponentNode");
const analyzeClassDeclaration = (fileNode, componentNode, statement, config) => {
    const isDefaultExport = Boolean(config?.isDefaultExport);
    const isExport = Boolean(config?.isExport);
    if (!statement) {
        return;
    }
    if (process.env.debugLevel === "all") {
        console.log("NODE", statement.id);
    }
    if (statement.id) {
        const node = new ComponentNode_1.ComponentNode(statement.id.name, fileNode, typescript_estree_1.AST_NODE_TYPES.ClassDeclaration, statement.loc);
        node.setExport(isExport);
        node.setDefaultExport(isDefaultExport);
        node.setParent(componentNode);
        node.setBody(statement.body);
        if (!componentNode) {
            fileNode.children.push(node);
        }
        else {
            componentNode.children.push(node);
        }
    }
};
exports.analyzeClassDeclaration = analyzeClassDeclaration;
//# sourceMappingURL=ClassDeclaration.js.map