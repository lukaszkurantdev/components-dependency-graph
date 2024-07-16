import {
  NamedExportDeclarations,
  DefaultExportDeclarations,
} from "@typescript-eslint/types/dist/generated/ast-spec";
import { AST_NODE_TYPES as ANT } from "@typescript-eslint/typescript-estree";
import { analyzeExpression } from "./Expression";
import { analyzeFunctionDeclaration } from "./FunctionDeclaration";
import { analyzeClassDeclaration } from "./ClassDeclaration";
import { FileNode } from "../types/FileNode";

export const analyzeNamedExportDeclaration = (
  fileNode: FileNode,
  declaration?: NamedExportDeclarations | DefaultExportDeclarations | null,
  config?: {isDefaultExport?: boolean, isExport?: boolean}
) => {
  if (!declaration) {
    return;
  }

  if (declaration?.type === ANT.FunctionDeclaration) {
    analyzeFunctionDeclaration(fileNode, undefined, declaration, config);
  }

  if (declaration?.type === ANT.ClassDeclaration) {
    analyzeClassDeclaration(fileNode, undefined, declaration, config);
  }

  if (declaration?.type === ANT.VariableDeclaration) {

    for (const child of declaration.declarations) {
      if (child.id.type === ANT.Identifier) {
        analyzeExpression(fileNode, undefined, child.init, {...config, variableName: child.id.name});
        // TODO
        // if (child.id.name === componentNode.title || componentNode.title === "") {
        //   if (child.init) {
        //     analyzeExpression(fileNode, componentNode, child.init);
        //   }
        // }
      }
    }
  }
};
