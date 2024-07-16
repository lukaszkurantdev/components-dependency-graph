import { ClassDeclaration } from "@typescript-eslint/types/dist/generated/ast-spec";
import { AST_NODE_TYPES as ANT } from "@typescript-eslint/typescript-estree";
import { FileNode } from "../types/FileNode";
import { ComponentNode } from "../types/ComponentNode";

export const analyzeClassDeclaration = (
  fileNode: FileNode,
  componentNode?: ComponentNode,
  statement?: ClassDeclaration | null,
  config?: {  isDefaultExport?: boolean, isExport?: boolean}
) => {
  const isDefaultExport = Boolean(config?.isDefaultExport);
  const isExport = Boolean(config?.isExport);

  if (!statement) {
    return;
  }

  if (process.env.debugLevel === "all") {
    console.log("NODE", statement.id);
  }

  if(statement.id) {
    const node = new ComponentNode(
      statement.id.name,
      fileNode,
      ANT.ClassDeclaration,
      statement.loc
    )

    node.setExport(isExport);
    node.setDefaultExport(isDefaultExport);
    node.setParent(componentNode);
    node.setBody(statement.body);

    if(!componentNode) {
      fileNode.children.push(node);
    } else {
      componentNode.children.push(node);
    }
  }
};
