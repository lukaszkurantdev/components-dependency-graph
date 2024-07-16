import { AST_NODE_TYPES as ANT } from "@typescript-eslint/typescript-estree";
import { Statement } from "@typescript-eslint/types/dist/generated/ast-spec";

import { analyzeFunctionDeclaration } from "./FunctionDeclaration";
import { analyzeBlockStatement } from "./BlockStatement";
import { analyzeExpression } from "./Expression";
import { FileNode } from "../types/FileNode";
import { ComponentNode } from "../types/ComponentNode";

export const analyzeStatement = (
  fileNode: FileNode,
  componentNode?: ComponentNode,
  statement?: Statement | null
) => {
  if (!statement) {
    return;
  }

  switch (statement.type) {
    case ANT.BlockStatement:
      analyzeBlockStatement(fileNode, componentNode, statement);
      break;
    case ANT.DoWhileStatement:
    case ANT.ForInStatement:
    case ANT.ForOfStatement:
    case ANT.ForStatement:
    case ANT.WhileStatement:
    case ANT.WithStatement:
      analyzeStatement(fileNode, componentNode, statement.body);
      break;
    case ANT.FunctionDeclaration:
      analyzeFunctionDeclaration(fileNode, componentNode, statement);
      break;
    case ANT.IfStatement:
      analyzeStatement(fileNode, componentNode, statement.consequent);
      analyzeStatement(fileNode, componentNode, statement.alternate);
      break;
    case ANT.SwitchStatement:
      for (const caseExpression of statement.cases) {
        for (const consequent of caseExpression.consequent) {
          analyzeStatement(fileNode, componentNode, consequent);
        }
      }
      break;
    case ANT.TryStatement:
      analyzeBlockStatement(fileNode, componentNode, statement.block);
      analyzeBlockStatement(fileNode, componentNode, statement.finalizer);
      analyzeBlockStatement(fileNode, componentNode, statement.handler?.body);
      break;
    case ANT.VariableDeclaration:
      for (const declaration of statement.declarations) {
        if (declaration.id.type === ANT.ObjectPattern) {
          for (const property of declaration.id.properties) {
            if (property.value?.type === ANT.AssignmentPattern) {
              analyzeExpression(fileNode, componentNode, property.value.right);
            }
          }
        }

        analyzeExpression(fileNode, componentNode, declaration.init);
      }
      break;
    case ANT.ReturnStatement:
      analyzeExpression(fileNode, componentNode, statement.argument);
      break;
    case ANT.ExpressionStatement:
      analyzeExpression(fileNode, componentNode, statement.expression);
      break;
    case ANT.ClassDeclaration:
      // TODO
      break;
  }
};
