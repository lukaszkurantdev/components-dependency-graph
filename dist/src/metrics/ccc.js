"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCCC = void 0;
const getCCC = (graph, v) => {
    const vertices = new Set();
    let successors = [v];
    let newSuccessors = [];
    while (successors.length) {
        for (let successor of successors) {
            if (!vertices.has(successor)) {
                vertices.add(successor);
                const children = graph.successors(successor) || [];
                newSuccessors.push(...children);
            }
        }
        successors = newSuccessors;
        newSuccessors = [];
    }
    return vertices.size - 1;
};
exports.getCCC = getCCC;
//# sourceMappingURL=ccc.js.map