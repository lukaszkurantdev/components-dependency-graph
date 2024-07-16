import * as path from "node:path";
import { AST_NODE_TYPES as ANT } from "@typescript-eslint/typescript-estree";
import {
  ImportDeclaration,
  ImportClause,
} from "@typescript-eslint/types/dist/generated/ast-spec";
import { getFinalPath } from "../utils/resolvePath";
import { FileNode } from "../types/FileNode";
import { ImportedItem } from "../types/ImportedItem";

export const analyzeImportDeclaration = (
  parentNode: FileNode,
  statement: ImportDeclaration
) => {
  if (process.env.debugLevel === "all") {
    console.log("NODE", statement.type);
  }

  const finalPath = getFinalPath(statement.source.value, parentNode.path)
  const fileName = path.basename(statement.source.value);

  let dependency: FileNode | undefined = undefined;

  if (finalPath.existsFile) {
    dependency = new FileNode(finalPath.filePath);
    parentNode.addDependency(dependency);
  }

  for (const specifier of statement.specifiers) {
    let title = "";
    let aliasTitle: string | undefined = undefined;

    const isImportDefault = isDefaultImport(specifier);

    if (isImportDefault) {
      // title = fileName;
      title = specifier.local.name;
    } else if (
      specifier.type === ANT.ImportSpecifier &&
      specifier.importKind === "value"
    ) {
      title = specifier.imported.name;
      aliasTitle = specifier.local.name;
    }

    if (title) {
      const importedItem = new ImportedItem(title, aliasTitle);
      importedItem.setDefaultImport(isImportDefault);
      importedItem.setDependency(dependency);

      parentNode.addImportedItem(importedItem);
    }
  }
};

const isDefaultImport = (specifier: ImportClause) => {
  return (
    specifier.type === ANT.ImportDefaultSpecifier &&
    specifier.local.type === ANT.Identifier
  );
};
