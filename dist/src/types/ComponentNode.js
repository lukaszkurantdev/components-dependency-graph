"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentNode = void 0;
const GraphNode_1 = require("./GraphNode");
const nodePath = __importStar(require("node:path"));
class ComponentNode extends GraphNode_1.GraphNode {
    title;
    fileNode;
    astType;
    loc;
    isUsedAsComponent = true;
    isExport = false;
    isDefaultExport = false;
    body;
    parent;
    constructor(title, fileNode, astType, loc) {
        super();
        this.title = title;
        this.fileNode = fileNode;
        this.astType = astType;
        this.loc = loc;
    }
    setUsedAsComponent() {
        this.isUsedAsComponent = true;
    }
    setExport(value) {
        this.isUsedAsComponent = value;
    }
    setDefaultExport(value) {
        this.isUsedAsComponent = value;
    }
    setParent(parent) {
        this.parent = parent;
    }
    setBody(body) {
        this.body = body;
    }
    getNormalizedFilePath() {
        return nodePath.normalize(this.fileNode.path);
    }
    #getLocalId() {
        return this.title + "_" + this.getNormalizedFilePath();
    }
    getUniqueId() {
        const id = [this.#getLocalId()];
        let parent = this.parent;
        while (parent) {
            id.push(parent.#getLocalId());
            parent = parent.parent;
        }
        return id.join(",");
    }
}
exports.ComponentNode = ComponentNode;
//# sourceMappingURL=ComponentNode.js.map