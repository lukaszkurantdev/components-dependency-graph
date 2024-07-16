import { Graph } from "@dagrejs/graphlib";

export const getICD = (graph: Graph, v: string) => {
  const vertices = new Set<string>();

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
