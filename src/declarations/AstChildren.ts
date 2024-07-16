import { AST_NODE_TYPES as ANT } from "@typescript-eslint/typescript-estree";
import { analyzeExpression } from "./Expression";
import { analyzeBlockStatement } from "./BlockStatement";
import { FileNode } from "../types/FileNode";
import { ComponentNode } from "../types/ComponentNode";

export const analyzeAstChildren = (fileNode: FileNode) => {
  let children = fileNode.children;

  const analyzedChildren = new Map<string, boolean>();

  while (children.length) {
    let newChildren = [];

    for (const child of children) {
      if(!analyzedChildren.has(child.getUniqueId())) {
        analyzedChildren.set(child.getUniqueId(), true)
      } else {
        continue;
      }

      if (child.body?.type === ANT.ClassBody) {
        for (const element of child.body.body) {
          if (element.type === ANT.MethodDefinition) {
            if (element.value.body?.type === ANT.BlockStatement) {
              analyzeBlockStatement(fileNode, child, element.value.body);
            }
          }
        }
      } else if (child.body?.type === ANT.BlockStatement) {
        analyzeBlockStatement(fileNode, child, child.body);
      } else {
        analyzeExpression(fileNode, child, child.body);
      }
      newChildren.push(...child.children);
    }

    children = newChildren;
  }


};
