import { parse } from "@typescript-eslint/typescript-estree";
import * as fs from "node:fs";
import { generateGraphDiagram } from "./src/utils/generateDiagram";
import { analyzeAstBodyDeclaration } from "./src/declarations/AstBodyDeclaration";
import { analyzeAstChildren } from "./src/declarations/AstChildren";
import { GlobalConfig, RawConfig } from "./src/types/Config";
import { FileNode } from "./src/types/FileNode";
import { getFilesList } from "./src/utils/getFilesList";
import * as nodePath from "node:path";

const getAbstractSyntaxTree = (filePath: string) => {
  try {
    const code = fs.readFileSync(filePath).toString();

    return parse(code, { jsx: true, loc: true, loggerFn: false });
  } catch (err) {
    return null;
  }
};

const analyze = (fileNode: FileNode) => {
  const config = GlobalConfig.getInstance();
  const { path: relativePath } = fileNode;

  const path = nodePath.normalize(relativePath);
  
  if (config.isFileAnalyzed(path)) {
    return;
  }

  config.setFileAsAnalyzed(path);

  const abstractSyntaxTree = getAbstractSyntaxTree(path);

  if (!abstractSyntaxTree) {
    return;
  }

  analyzeAstBodyDeclaration(fileNode, abstractSyntaxTree.body);
  analyzeAstChildren(fileNode);

  for (const dependency of fileNode.dependencies) {
    if (dependency.isUsed) {
      analyze(dependency);
    }
  }
};

export const fileBasedAnalyze = (filePath: string, config: RawConfig = {}) => {
  GlobalConfig.getInstance(config);

  const rootNode = new FileNode(filePath);
  rootNode.setAsUsed();

  analyze(rootNode);

  return generateGraphDiagram(rootNode);
};

export const directoryBasedAnalyze = (
  catalogPath: string,
  config: RawConfig = {}
) => {
  GlobalConfig.getInstance(config);

  const results: string[] = [];
  const files = getFilesList(catalogPath);

  for (let filePath of files) {
    const rootNode = new FileNode(filePath);
    rootNode.setAsUsed();

    analyze(rootNode);

    results.push(...generateGraphDiagram(rootNode));
  }

  return [...new Set(results)];
};
