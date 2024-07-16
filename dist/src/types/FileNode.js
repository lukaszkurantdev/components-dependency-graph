"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileNode = void 0;
const GraphNode_1 = require("./GraphNode");
class FileNode extends GraphNode_1.GraphNode {
    path;
    isUsed = true;
    dependencies = [];
    constructor(path) {
        super();
        this.path = path;
    }
    setAsUsed() {
        this.isUsed = true;
    }
    addDependency(dependency) {
        this.dependencies.push(dependency);
    }
}
exports.FileNode = FileNode;
//# sourceMappingURL=FileNode.js.map