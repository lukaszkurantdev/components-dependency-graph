"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addChildren = void 0;
const typescript_estree_1 = require("@typescript-eslint/typescript-estree");
const addChildren = (fileNode, componentNode, element) => {
    if (!element) {
        return;
    }
    const { openingElement: { name }, } = element;
    switch (name.type) {
        case typescript_estree_1.AST_NODE_TYPES.JSXIdentifier:
            setAsUsed(name.name, fileNode, componentNode);
            break;
        case typescript_estree_1.AST_NODE_TYPES.JSXMemberExpression:
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
exports.addChildren = addChildren;
const addChildToComponentNode = (componentNode, child) => {
    if (componentNode) {
        componentNode.setUsedAsComponent();
        componentNode.addChildren(child);
    }
};
const setAsUsed = (element, fileNode, componentNode) => {
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
        if (importName === element) {
            parentImport.setUsedAsComponent();
            if (parentImport.dependency) {
                parentImport.dependency.setAsUsed();
            }
            if (componentNode) {
                componentNode.setUsedAsComponent();
                if (!componentNode.importedItems.includes(parentImport)) {
                    componentNode.addImportedItem(parentImport);
                }
            }
            return;
        }
    }
};
//# sourceMappingURL=AddChildren.js.map