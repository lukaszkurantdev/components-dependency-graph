import { ComponentNode } from "./ComponentNode";
import { ImportedItem } from "./ImportedItem";

export class GraphNode {
  public importedItems: ImportedItem[] = [];
  public children: ComponentNode[] = [];

  addImportedItem(importedItem: ImportedItem) {
    this.importedItems.push(importedItem);
  }

  addChildren(child: ComponentNode) {
    this.children.push(child);
  }
}
