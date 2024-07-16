"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDCD = void 0;
const getDCD = (graph, v) => {
    const vertices = graph.predecessors(v) || [];
    return vertices.length;
};
exports.getDCD = getDCD;
//# sourceMappingURL=dcd.js.map