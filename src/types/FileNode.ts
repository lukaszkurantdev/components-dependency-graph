import { GraphNode } from "./GraphNode";

export class FileNode extends GraphNode {
  public isUsed: boolean = true;
  public dependencies: FileNode[] = [];

  constructor(public path: string) {
    super();
  }

  setAsUsed() {
    this.isUsed = true;
  }

  addDependency(dependency: FileNode) {
    this.dependencies.push(dependency);
  }
}
