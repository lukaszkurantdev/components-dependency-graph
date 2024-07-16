"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphNode = void 0;
class GraphNode {
    importedItems = [];
    children = [];
    addImportedItem(importedItem) {
        this.importedItems.push(importedItem);
    }
    addChildren(child) {
        this.children.push(child);
    }
}
exports.GraphNode = GraphNode;
//# sourceMappingURL=GraphNode.js.map