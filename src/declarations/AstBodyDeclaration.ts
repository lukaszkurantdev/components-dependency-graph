import { ProgramStatement } from "@typescript-eslint/types/dist/generated/ast-spec";
import { AST_NODE_TYPES as ANT } from "@typescript-eslint/typescript-estree";
import { analyzeImportDeclaration } from "./ImportDeclaration";
import { analyzeFunctionDeclaration } from "./FunctionDeclaration";
import { analyzeExpression } from "./Expression";
import { analyzeNamedExportDeclaration } from "./ExportNamed";
import { analyzeClassDeclaration } from "./ClassDeclaration";
import { analyzeVariableDeclaration } from "./Variable";
import { FileNode } from "../types/FileNode";

export const analyzeAstBodyDeclaration = (
  fileNode: FileNode,
  body?: ProgramStatement[] | null
) => {
  if (!body) {
    return;
  }

  for (const node of body) {
    switch (node.type) {
      case ANT.ImportDeclaration:
        analyzeImportDeclaration(fileNode, node);
        break;

      case ANT.FunctionDeclaration:
        analyzeFunctionDeclaration(fileNode, undefined, node);
        break;

      case ANT.ExpressionStatement:
        const { type } = node.expression;
        if (type === ANT.CallExpression || type === ANT.NewExpression) {
          for (const argument of node.expression.arguments) {
            analyzeExpression(fileNode, undefined, argument);
          }
        }
        break;

      case ANT.VariableDeclaration:
        for (const declaration of node.declarations) {
          analyzeVariableDeclaration(fileNode, undefined, declaration, {
            //@ts-ignore // TO DO
            variableName: declaration.id.name,
          });
        }
        break;

      case ANT.ExportNamedDeclaration:
        analyzeNamedExportDeclaration(fileNode, node.declaration, {
          isExport: true,
        });
        break;
      case ANT.ExportDefaultDeclaration:
        analyzeNamedExportDeclaration(fileNode, node.declaration, {
          isDefaultExport: true,
        });
        break;
      case ANT.ClassDeclaration:
        analyzeClassDeclaration(fileNode, undefined, node);
        break;
    }
  }
};
