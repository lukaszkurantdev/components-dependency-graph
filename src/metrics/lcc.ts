import { Graph } from "@dagrejs/graphlib";

export const getLCC = (graph: Graph, v: string) => {
  const vertices = graph.successors(v) || [];
  return vertices.length;
};
