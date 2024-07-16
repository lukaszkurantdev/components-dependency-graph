import { FileNode } from "./FileNode";
import { GraphNode } from "./GraphNode";
import { ImportedItem } from "./ImportedItem";
import {
  SourceLocation,
  BlockStatement,
  Expression,
  ClassBody,
} from "@typescript-eslint/types/dist/generated/ast-spec";
import { AST_NODE_TYPES as ANT } from "@typescript-eslint/typescript-estree";
import * as nodePath from "node:path";

type ComponentNodeType =
  | ANT.ImportDefaultSpecifier
  | ANT.ImportNamespaceSpecifier
  | ANT.ImportSpecifier
  | ANT.FunctionDeclaration
  | ANT.FunctionExpression
  | ANT.ArrowFunctionExpression
  | ANT.VariableDeclarator
  | ANT.ClassDeclaration;

type ComponentNodeBodyType = BlockStatement | Expression | ClassBody;

export class ComponentNode extends GraphNode {
  public isUsedAsComponent: boolean = true;
  public isExport: boolean = false;
  public isDefaultExport: boolean = false;

  public body?: ComponentNodeBodyType;
  public parent?: ComponentNode;

  constructor(
    public title: string,
    public fileNode: FileNode,
    public astType: ComponentNodeType,
    public loc: SourceLocation
  ) {
    super();
  }

  setUsedAsComponent() {
    this.isUsedAsComponent = true;
  }

  setExport(value: boolean) {
    this.isUsedAsComponent = value;
  }

  setDefaultExport(value: boolean) {
    this.isUsedAsComponent = value;
  }

  setParent(parent: ComponentNode | undefined) {
    this.parent = parent;
  }

  setBody(body: ComponentNodeBodyType) {
    this.body = body;
  }

  getNormalizedFilePath() {
    return nodePath.normalize(this.fileNode.path);
  }

  #getLocalId() {
    return this.title + "_" + this.getNormalizedFilePath();
  }

  getUniqueId() {
    const id = [this.#getLocalId()];
    let parent = this.parent;

    while (parent) {
      id.push(parent.#getLocalId());
      parent = parent.parent;
    }

    return id.join(",");
  }
}
