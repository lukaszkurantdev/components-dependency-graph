import { alg, Graph } from "@dagrejs/graphlib";

export const getCDC = (graph: Graph, v: string) => {
  const cycles = alg.findCycles(graph);

  let minLengthCycle = Number.MAX_VALUE;

  for (const cycle of cycles) {
    if (cycle.includes(v) && minLengthCycle > cycle.length) {
      minLengthCycle = cycle.length;
    }
  }

  if (minLengthCycle === Number.MAX_VALUE) {
    return 0;
  } else {
    return minLengthCycle;
  }
};
