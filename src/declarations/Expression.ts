import {
  JSXEmptyExpression,
  CallExpressionArgument,
} from "@typescript-eslint/types/dist/generated/ast-spec";
import { AST_NODE_TYPES as ANT } from "@typescript-eslint/typescript-estree";
import { analyzeJSXElement } from "./JSXElement";
import { addChildren } from "../vertices/AddChildren";
import { FileNode } from "../types/FileNode";
import { ComponentNode } from "../types/ComponentNode";
import { analyzeBlockStatement } from "./BlockStatement";

export const analyzeExpression = (
  fileNode: FileNode,
  componentNode?: ComponentNode,
  expression?: JSXEmptyExpression | CallExpressionArgument | null,
  config?: {
    isDefaultExport?: boolean;
    isExport?: boolean;
    variableName?: string;
  }
) => {
  const isDefaultExport = Boolean(config?.isDefaultExport);
  const isExport = Boolean(config?.isExport);
  const variableName = config?.variableName;

  if (!expression) {
    return;
  }

  if (process.env.debugLevel === "all") {
    console.log("NODE", expression.type, Boolean(componentNode));
  }

  switch (expression.type) {
    case ANT.JSXElement:
      analyzeJSXElement(fileNode, componentNode, expression);
      addChildren(fileNode, componentNode, expression);

      // analyzeJSXElement(fileNode, componentNode, expression);
      // analyzeChildrenJSXElement(parentNode, elm)
      break;
    case ANT.JSXFragment:
      analyzeJSXElement(fileNode, componentNode, expression);
      break;
    case ANT.SpreadElement:
    case ANT.AwaitExpression:
      analyzeExpression(fileNode, componentNode, expression.argument);
      break;
    case ANT.ArrayExpression:
      for (const childExpression of expression.elements) {
        analyzeExpression(fileNode, componentNode, childExpression);
      }
      break;
    case ANT.AssignmentExpression:
    case ANT.LogicalExpression:
      analyzeExpression(fileNode, componentNode, expression.right);
      break;
    case ANT.CallExpression:
      for (const argument of expression.arguments) {
        analyzeExpression(fileNode, componentNode, argument, config);
      }
      break;
    case ANT.ChainExpression:
      analyzeExpression(fileNode, componentNode, expression.expression);
      break;
    case ANT.ClassExpression:
      // console.log(expression); // ???
      break;
    case ANT.ImportExpression:
      analyzeExpression(fileNode, componentNode, expression.attributes);
      break;
    case ANT.MemberExpression:
      analyzeExpression(fileNode, componentNode, expression.object);
      break;
    case ANT.NewExpression:
      for (const argument of expression.arguments) {
        analyzeExpression(fileNode, componentNode, argument);
      }
      analyzeExpression(fileNode, componentNode, expression.callee);
      break;
    case ANT.ObjectExpression:
      for (const property of expression.properties) {
        if (property.type === ANT.Property) {
          if (
            property.value.type === ANT.FunctionExpression ||
            property.value.type === ANT.ArrowFunctionExpression
          ) {
            analyzeExpression(fileNode, componentNode, property.value);
          }
          if (property.value.type === ANT.JSXElement) {
            analyzeJSXElement(fileNode, componentNode, property.value);
            addChildren(fileNode, componentNode, property.value);
          }
        }
      }
      break;
    case ANT.SequenceExpression:
    case ANT.TemplateLiteral:
      for (const childExpression of expression.expressions) {
        analyzeExpression(fileNode, componentNode, childExpression);
      }
      break;
    case ANT.TaggedTemplateExpression:
      for (const childExpression of expression.quasi.expressions) {
        analyzeExpression(fileNode, componentNode, childExpression);
      }
      break;
    case ANT.ConditionalExpression:
      analyzeExpression(fileNode, componentNode, expression.consequent);
      analyzeExpression(fileNode, componentNode, expression.alternate);
      break;
    case ANT.ArrowFunctionExpression:
    case ANT.FunctionExpression:
      if (variableName) {
        const node = new ComponentNode(
          variableName,
          fileNode,
          ANT.FunctionDeclaration,
          expression.loc
        );

        node.setExport(isExport);
        node.setDefaultExport(isDefaultExport);
        node.setParent(componentNode);
        node.setBody(expression.body);

        if (!componentNode) {
          fileNode.children.push(node);
        } else {
          componentNode.children.push(node);
        }
      } else if(expression.body.type === ANT.BlockStatement) {
        analyzeBlockStatement(fileNode, componentNode, expression.body);
      } else {
        analyzeExpression(fileNode, componentNode, expression.body);
      }
      break;
  }
};
