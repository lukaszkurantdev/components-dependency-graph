import * as fs from "node:fs";
//@ts-ignore
import plantuml from "node-plantuml";
import { FileNode } from "../types/FileNode";
import { ComponentNode } from "../types/ComponentNode";
import { GlobalConfig } from "../types/Config";
import { Graph } from "@dagrejs/graphlib";
import { graphviz } from "node-graphviz";

const generateEdges = (
  node: FileNode,
  analyzedChildren: Map<string, boolean>
) => {
  let result: string[] = [];

  for (const child of node.children) {
    result.push(...generateComponentEdges(child, analyzedChildren));
  }

  for (const child of node.dependencies) {
    result.push(...generateEdges(child, analyzedChildren));
  }

  return result;
};

const generateComponentEdges = (
  node: ComponentNode,
  analyzedChildren: Map<string, boolean>
) => {
  let result: string[] = [];
  const { generateGraphWithFilesPath } = GlobalConfig.getInstance();

  if (!analyzedChildren.has(node.getUniqueId())) {
    analyzedChildren.set(node.getUniqueId(), true);
  } else {
    return result;
  }

  for (const child of node.importedItems) {
    if (generateGraphWithFilesPath) {
      result.push(
        `${node.title} (${node.fileNode.path}) -> ${child.name} (${child.dependency?.path})`
      );
    } else {
      result.push(`${node.title} -> ${child.name}`);
    }
  }

  for (const child of node.children) {
    if (generateGraphWithFilesPath) {
      result.push(
        `${node.title} (${node.fileNode.path}) -> ${child.title} (${child.fileNode.path})`
      );
    } else {
      result.push(`${node.title} -> ${child.title}`);
    }
    result.push(...generateComponentEdges(child, analyzedChildren));
  }

  return result;
};

export const generateGraphDiagram = (rootNode: FileNode) => {
  const analyzedChildren = new Map<string, boolean>();

  const diagram = generateEdges(rootNode, analyzedChildren);

  return [...new Set(diagram)];
};


export const generateGraphVizDiagram = async (edges: string[], path: string) => {
  let diagram = "";

  for (let edge of edges) {
    diagram += `\t${edge}\n`;
  }

  diagram = `digraph {\n${diagram}}`;

  const svg = await graphviz.dot(diagram, 'svg')
  fs.writeFileSync(`${path}/diagram.svg`, svg);

  return svg;
};


export const generateDagreGraph = (edges: string[]) => {
  const graph = new Graph({ directed: true });

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
