"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getICD = void 0;
const getICD = (graph, v) => {
    const vertices = new Set();
    let predecessors = [v];
    let newPredecessors = [];
    while (predecessors.length) {
        for (let predecessor of predecessors) {
            if (!vertices.has(predecessor)) {
                vertices.add(predecessor);
                const children = graph.predecessors(predecessor) || [];
                newPredecessors.push(...children);
            }
        }
        predecessors = newPredecessors;
        newPredecessors = [];
    }
    return vertices.size - 1;
};
exports.getICD = getICD;
//# sourceMappingURL=icd.js.map