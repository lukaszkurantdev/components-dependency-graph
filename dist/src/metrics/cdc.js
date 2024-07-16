"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCDC = void 0;
const graphlib_1 = require("@dagrejs/graphlib");
const getCDC = (graph, v) => {
    const cycles = graphlib_1.alg.findCycles(graph);
    let minLengthCycle = Number.MAX_VALUE;
    for (const cycle of cycles) {
        if (cycle.includes(v) && minLengthCycle > cycle.length) {
            minLengthCycle = cycle.length;
        }
    }
    if (minLengthCycle === Number.MAX_VALUE) {
        return 0;
    }
    else {
        return minLengthCycle;
    }
};
exports.getCDC = getCDC;
//# sourceMappingURL=cdc.js.map