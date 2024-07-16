import { BlockStatement } from "@typescript-eslint/types/dist/generated/ast-spec";

import { analyzeStatement } from "./Statement";
import { FileNode } from "../types/FileNode";
import { ComponentNode } from "../types/ComponentNode";

export const analyzeBlockStatement = (
  fileNode: FileNode,
  componentNode?: ComponentNode,
  statement?: BlockStatement | null,
) => {

  if (!statement) {
    return;
  }

  if (process.env.debugLevel === "all") {
    console.log("NODE", statement.type);
  }

  for (const child of statement.body) {
    analyzeStatement(fileNode, componentNode, child);
  }
};
