import { FileNode } from "./FileNode";

export class ImportedItem {
  public dependency: FileNode | undefined;
  public isDefaultImport: boolean = false;
  public isUsedAsComponent: boolean = false;

  constructor(public name: string, public alias: string | undefined) {}

  setDependency(dependency: FileNode | undefined) {
    this.dependency = dependency;
  }

  setDefaultImport(value: boolean) {
    this.isDefaultImport = value;
  }

  setUsedAsComponent() {
    this.isUsedAsComponent = true;
  }
}
