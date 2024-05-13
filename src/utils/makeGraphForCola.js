import filterSameNodes from "./filterSameNodes.js";
import getMidNodeWidths from "./getMidNodeWidths.js";

const makeGraphForCola = (cf, edgeWidths, lastLayer) => {
  const graphEdges = new Array();
  const graphNodesSet = new Set();
  let pad = 0;
  for (let k = 0; k < cf.bipartites.length; k++) {
    const bipartite = cf.bipartites[k].bipartite;
    for (let i = 0; i < bipartite.length; i++) {
      for (let j = 0; j < bipartite[i].length; j++) {
        if (!bipartite[i][j]) continue;
        graphEdges.push({
          source: i + pad,
          target: j + pad + bipartite.length,
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

  // グラフの制約を追加
  const graphConstraints = new Array();
  let idx = 0;
  let prvIdx = 0;
  let curIdx = 0;
  let layerGap = 100;
  for (let k = 0; k < cf.bipartites.length; k++) {
    const leftNodesNum = cf.bipartites[k].bipartite.length;
    const rightNodesNum = cf.bipartites[k].bipartite[0].length;
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
    if (k === cf.bipartites.length - 1) continue;
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

  const midNodeWidths = getMidNodeWidths(
    graphNodes,
    graphEdges,
    edgeWidths,
    lastLayer
  );

  // 分離制約を入れる
  console.error(graphNodes);
  for (let i = 0; i < graphNodes.length; i++) {
    for (let j = i + 1; j < graphNodes.length; j++) {
      if (graphNodes[i].layer === 0 || graphNodes[i].layer === lastLayer)
        continue;
      if (graphNodes[j].layer === 0 || graphNodes[j].layer === lastLayer)
        continue;
      console.error(graphNodes[i], graphNodes[j]);
      const gap =
        (midNodeWidths[graphNodes[i].layer][graphNodes[i].label] +
          midNodeWidths[graphNodes[j].layer][graphNodes[j].label]) /
          2 +
        10;
      graphConstraints.push({
        axis: "x",
        left: String(i),
        right: String(j),
        gap,
      });
      graphConstraints.push({
        axis: "x",
        left: String(j),
        right: String(i),
        gap,
      });
    }
  }

  console.error(graphConstraints);

  return {
    graph: {
      nodes: graphNodes,
      edges: graphEdges,
      constraints: graphConstraints,
    },
    midNodeWidths,
  };
};

export default makeGraphForCola;
