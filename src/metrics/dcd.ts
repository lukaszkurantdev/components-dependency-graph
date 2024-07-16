import { Graph } from "@dagrejs/graphlib";

export const getDCD = (graph: Graph, v: string) => {
  const vertices = graph.predecessors(v) || [];
  
  return vertices.length;
};