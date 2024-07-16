import { JSXElement } from "@typescript-eslint/types/dist/generated/ast-spec";
import { AST_NODE_TYPES as ANT } from "@typescript-eslint/typescript-estree";
import { FileNode } from "../types/FileNode";
import { ComponentNode } from "../types/ComponentNode";

export const addChildren = (
  fileNode: FileNode,
  componentNode?: ComponentNode,
  element?: JSXElement | null
) => {
  if (!element) {
    return;
  }

  const {
    openingElement: { name },
  } = element;

  switch (name.type) {
    case ANT.JSXIdentifier:
      setAsUsed(name.name, fileNode, componentNode);
      break;
    case ANT.JSXMemberExpression:
      // Probably no possibility to get
      // if (name.object.type !== ANT.JSXIdentifier) {
      //   return;
      // }

      // if (name.property.type === ANT.JSXIdentifier) {
      //   setAsUsed(name.property.name, fileNode, componentNode);
      // }
      break;
  }
};


const addChildToComponentNode = (componentNode: ComponentNode | undefined, child: ComponentNode) => {
  if (componentNode) {
    componentNode.setUsedAsComponent();
    componentNode.addChildren(child)
  }
}

const setAsUsed = (
  element: string,
  fileNode: FileNode,
  componentNode?: ComponentNode
) => {
  let currentNode = componentNode?.parent;

  // Check currentNode children
  while (currentNode) {
    for (const child of currentNode.children) {
      if (child.title === element) {
        child.setUsedAsComponent();
        addChildToComponentNode(componentNode, child);
     
        return;
      }
    }

    currentNode = currentNode.parent;
  }

  // Check parent children
  for (const parentChild of fileNode.children) {
    if (parentChild.title === element) {
      parentChild.setUsedAsComponent();
      addChildToComponentNode(componentNode, parentChild);

      return;
    }
  }

  // Check importedItems
  for (const parentImport of fileNode.importedItems) {
    const importName = parentImport.alias || parentImport.name;

    if(importName === element) {
      parentImport.setUsedAsComponent();

      if(parentImport.dependency) {
        parentImport.dependency.setAsUsed();
      }

      if(componentNode) {
        componentNode.setUsedAsComponent();

        if(!componentNode.importedItems.includes(parentImport)) {
          componentNode.addImportedItem(parentImport);
        }
      }

      return;
    }
  }
};
