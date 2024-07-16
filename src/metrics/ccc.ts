import { Graph } from "@dagrejs/graphlib";

export const getCCC = (graph: Graph, v: string) => {
  const vertices = new Set<string>();

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
