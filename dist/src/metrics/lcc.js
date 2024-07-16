"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLCC = void 0;
const getLCC = (graph, v) => {
    const vertices = graph.successors(v) || [];
    return vertices.length;
};
exports.getLCC = getLCC;
//# sourceMappingURL=lcc.js.map