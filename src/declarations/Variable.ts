import {
  LetOrConstOrVarDeclarator,
  UsingInForOfDeclarator,
  UsingInNomalConextDeclarator,
} from "@typescript-eslint/types/dist/generated/ast-spec";
import { AST_NODE_TYPES as ANT } from "@typescript-eslint/typescript-estree";
import { analyzeExpression } from "./Expression";
import { FileNode } from "../types/FileNode";
import { ComponentNode } from "../types/ComponentNode";

export const analyzeVariableDeclaration = (
  fileNode: FileNode,
  componentNode?: ComponentNode,
  declaration?:
    | LetOrConstOrVarDeclarator
    | UsingInForOfDeclarator
    | UsingInNomalConextDeclarator,
  config?: {
    isDefaultExport?: boolean;
    isExport?: boolean;
    variableName?: string;
  }
) => {
  if (!declaration) {
    return;
  }



  if (declaration.id.type !== ANT.Identifier) {
    return;
  }

  if (
    declaration.init?.type === ANT.CallExpression
  ) {
    analyzeExpression(fileNode, componentNode, declaration.init, config);
    return;
  }

  if(declaration.init?.type === ANT.TSAsExpression) {
    analyzeExpression(fileNode, componentNode, declaration.init.expression, config);
  }

  if (
    declaration.init?.type !== ANT.ArrowFunctionExpression &&
    declaration.init?.type !== ANT.FunctionExpression
  ) {
    // ?
    return;
  }

  if (declaration.init.body.type === ANT.JSXElement) {
    // TODO:
    // probably analyze JSXElement with add new child
  }

  analyzeExpression(fileNode, componentNode, declaration.init, config);
};
