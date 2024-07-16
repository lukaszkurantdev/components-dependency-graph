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
exports.generateDagreGraph = exports.generateGraphVizDiagram = exports.generateGraphDiagram = void 0;
const fs = __importStar(require("node:fs"));
const Config_1 = require("../types/Config");
const graphlib_1 = require("@dagrejs/graphlib");
const node_graphviz_1 = require("node-graphviz");
const generateEdges = (node, analyzedChildren) => {
    let result = [];
    for (const child of node.children) {
        result.push(...generateComponentEdges(child, analyzedChildren));
    }
    for (const child of node.dependencies) {
        result.push(...generateEdges(child, analyzedChildren));
    }
    return result;
};
const generateComponentEdges = (node, analyzedChildren) => {
    let result = [];
    const { generateGraphWithFilesPath } = Config_1.GlobalConfig.getInstance();
    if (!analyzedChildren.has(node.getUniqueId())) {
        analyzedChildren.set(node.getUniqueId(), true);
    }
    else {
        return result;
    }
    for (const child of node.importedItems) {
        if (generateGraphWithFilesPath) {
            result.push(`${node.title} (${node.fileNode.path}) -> ${child.name} (${child.dependency?.path})`);
        }
        else {
            result.push(`${node.title} -> ${child.name}`);
        }
    }
    for (const child of node.children) {
        if (generateGraphWithFilesPath) {
            result.push(`${node.title} (${node.fileNode.path}) -> ${child.title} (${child.fileNode.path})`);
        }
        else {
            result.push(`${node.title} -> ${child.title}`);
        }
        result.push(...generateComponentEdges(child, analyzedChildren));
    }
    return result;
};
const generateGraphDiagram = (rootNode) => {
    const analyzedChildren = new Map();
    const diagram = generateEdges(rootNode, analyzedChildren);
    return [...new Set(diagram)];
};
exports.generateGraphDiagram = generateGraphDiagram;
const generateGraphVizDiagram = async (edges, path) => {
    let diagram = "";
    for (let edge of edges) {
        diagram += `\t${edge}\n`;
    }
    diagram = `digraph {\n${diagram}}`;
    const svg = await node_graphviz_1.graphviz.dot(diagram, 'svg');
    fs.writeFileSync(`${path}/diagram.svg`, svg);
    return svg;
};
exports.generateGraphVizDiagram = generateGraphVizDiagram;
const generateDagreGraph = (edges) => {
    const graph = new graphlib_1.Graph({ directed: true });
    const instances = [
        ...new Set(edges.map((item) => item.split(" -> ")).flat()),
    ];
    graph.setNodes(instances);
    for (let edge of edges) {
        const vertices = edge.split(" -> ");
        graph.setEdge(vertices[0], vertices[1]);
    }
    return graph;
};
exports.generateDagreGraph = generateDagreGraph;
//# sourceMappingURL=generateDiagram.js.map