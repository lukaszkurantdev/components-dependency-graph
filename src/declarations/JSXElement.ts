import {
  JSXElement,
  JSXFragment,
} from "@typescript-eslint/types/dist/generated/ast-spec";
import { AST_NODE_TYPES as ANT } from "@typescript-eslint/typescript-estree";
import { analyzeExpression } from "./Expression";
import { ComponentNode } from "../types/ComponentNode";
import { FileNode } from "../types/FileNode";

export const analyzeJSXElement = (
  fileNode: FileNode,
  componentNode?: ComponentNode,
  element?: JSXElement | JSXFragment | null
) => {
  if (!element) {
    return;
  }

  if (process.env.debugLevel === "all") {
    console.log("NODE", element.type);
  }

  if (element.type === ANT.JSXElement) {
    for (const childElement of element.openingElement.attributes) {
      if (childElement.type === ANT.JSXAttribute) {
        switch (childElement.value?.type) {
          case ANT.JSXElement:
            analyzeExpression(fileNode, componentNode, childElement.value);
            break;
          case ANT.JSXExpressionContainer:
          case ANT.JSXSpreadChild:
            analyzeExpression(
              fileNode,
              componentNode,
              childElement.value.expression
            );
            break;
        }
      }
    }
  }

  for (const childElement of element.children) {
    switch (childElement.type) {
      case ANT.JSXElement:
      case ANT.JSXFragment:
        analyzeExpression(fileNode, componentNode, childElement);
        break;
      case ANT.JSXExpressionContainer:
      case ANT.JSXSpreadChild:
        analyzeExpression(fileNode, componentNode, childElement.expression);
        break;
    }
  }
};
