import filterSameNodes from "./filterSameNodes.js";

export const makeGraphForCola = (cf, layerGap) => {
  const { nodes, edges } = makeGraphData(cf.bipartites);
  const { constraints } = makeConstraintData(cf.bipartites, layerGap);

  return {
    nodes,
    edges,
    constraints,
  };
};

export const makeGraphData = (bipartites) => {
  const graphEdges = new Array();
  const graphNodesSet = new Set();
  let pad = 0;
  for (let k = 0; k < bipartites.length; k++) {
    const bipartite = bipartites[k].bipartite;
    for (let i = 0; i < bipartite.length; i++) {
      for (let j = 0; j < bipartite[i].length; j++) {
        if (!bipartite[i][j]) continue;
        graphEdges.push({
          source: i + pad,
          target: j + pad + bipartite.length,
          sourceLabel: i,
          targetLabel: j,
          bipartiteIdx: k,
        });
        graphNodesSet.add({ id: i + pad, label: i, layer: k });
        graphNodesSet.add({
          id: j + pad + bipartite.length,
          label: j,
          layer: k + 1,
        });
      }
    }
    pad += bipartite.length;
  }
  const graphNodes = filterSameNodes(Array.from(graphNodesSet));

  return {
    nodes: graphNodes,
    edges: graphEdges,
  };
};

export const makeConstraintData = (bipartites, layerGap) => {
  const graphConstraints = new Array();
  let idx = 0;
  let prvIdx = 0;
  let curIdx = 0;
  for (let k = 0; k < bipartites.length; k++) {
    const leftNodesNum = bipartites[k].bipartite.length;
    const rightNodesNum = bipartites[k].bipartite[0].length;
    const constraint = { type: "alignment", axis: "y" };
    const offsets = new Array();

    // 一番上
    if (k === 0) {
      const toffsets = new Array();
      const tconstraint = { type: "alignment", axis: "y" };
      for (let i = 0; i < leftNodesNum; i++) {
        toffsets.push({ node: String(idx++), offset: "0" });
      }

      tconstraint.offsets = toffsets;
      graphConstraints.push(tconstraint);

      curIdx = idx;
      graphConstraints.push({
        axis: "y",
        left: prvIdx,
        right: curIdx,
        gap: layerGap,
        equality: "true",
      });
      prvIdx = curIdx;
    }

    // 中央
    for (let i = 0; i < rightNodesNum; i++) {
      offsets.push({ node: String(idx++), offset: String(k + 1) });
    }
    constraint.offsets = offsets;
    graphConstraints.push(constraint);

    // 一番下
    if (k === bipartites.length - 1) continue;
    curIdx = idx;
    graphConstraints.push({
      axis: "y",
      left: prvIdx,
      right: curIdx,
      gap: layerGap,
      equality: "true",
    });
    prvIdx = curIdx;
  }

  return {
    constraints: graphConstraints,
  };
};
