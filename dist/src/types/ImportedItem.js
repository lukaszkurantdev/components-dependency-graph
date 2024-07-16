"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportedItem = void 0;
class ImportedItem {
    name;
    alias;
    dependency;
    isDefaultImport = false;
    isUsedAsComponent = false;
    constructor(name, alias) {
        this.name = name;
        this.alias = alias;
    }
    setDependency(dependency) {
        this.dependency = dependency;
    }
    setDefaultImport(value) {
        this.isDefaultImport = value;
    }
    setUsedAsComponent() {
        this.isUsedAsComponent = true;
    }
}
exports.ImportedItem = ImportedItem;
//# sourceMappingURL=ImportedItem.js.map