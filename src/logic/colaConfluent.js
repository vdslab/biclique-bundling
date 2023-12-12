import { getQuasiBicliqueCover } from "./../utils/getBicliqueCover.js";
import * as d3 from "d3";
import * as cola from "webcola";
import Confluent from "./../utils/confluent.js";
import { getColaBipartiteCross } from "./../utils/getBipartiteCross.js";

const colaConfluent = (bipartite, param, maxDepth, hasEdgeColor) => {
  const linkGenerator = d3.linkVertical();
  console.log(bipartite);

  const cf = new Confluent(getQuasiBicliqueCover, param, maxDepth);
  cf.build(bipartite, 0, 1, 0);
  cf.layeredNodes.sort((a, b) => {
    return a.h - b.h;
  });
  cf.bipartites.sort((a, b) => {
    return a.h - b.h;
  });

  const leftNodeNumber = bipartite.length;
  const rightNodeNumber = bipartite[0].length;
  const midLayerNumber = cf.layeredNodes.length;

  // //左右中間ノードの順序を初期化
  const leftNodesOrder = new Array();
  const rightNodesOrder = new Array();
  const midNodesOrders = new Array(); // 中間ノードの層と同じサイズ

  for (let i = 0; i < leftNodeNumber; i++) {
    leftNodesOrder.push(i);
  }

  for (let i = 0; i < rightNodeNumber; i++) {
    rightNodesOrder.push(i);
  }

  for (let i = 0; i < midLayerNumber; i++) {
    const midNodesOrder = new Array();
    for (let j = 0; j < cf.layeredNodes[i].maximalNodes.length; j++) {
      midNodesOrder.push(j);
    }
    midNodesOrders.push(midNodesOrder);
  }

  // 座標決定process
  const rightX = 2000;

  const d3cola = cola.d3adaptor(d3).linkDistance(200).size([rightX, 1000]);

  //グラフのデータと制約を作る

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
  console.error(graphNodes);
  const graphConstraints = new Array();
  let idx = 0;
  let prv = 0;
  let cur = 0;
  for (let k = 0; k < cf.bipartites.length; k++) {
    const leftNodesNum = cf.bipartites[k].bipartite.length;
    const rightNodesNum = cf.bipartites[k].bipartite[0].length;
    const constraint = { type: "alignment", axis: "y" };
    const offsets = new Array();

    if (k === 0) {
      const toffsets = new Array();
      const tconstraint = { type: "alignment", axis: "y" };
      for (let i = 0; i < leftNodesNum; i++) {
        toffsets.push({ node: String(idx++), offset: "0" });
      }

      tconstraint.offsets = toffsets;
      graphConstraints.push(tconstraint);

      cur = idx;
      graphConstraints.push({
        axis: "y",
        left: prv,
        right: cur,
        gap: 100,
        equality: "true",
      });
      prv = cur;
    }

    for (let i = 0; i < rightNodesNum; i++) {
      offsets.push({ node: String(idx++), offset: String(k + 1) });
    }
    constraint.offsets = offsets;
    graphConstraints.push(constraint);

    if (k === cf.bipartites.length - 1) continue;
    cur = idx;
    graphConstraints.push({
      axis: "y",
      left: prv,
      right: cur,
      gap: 100,
      equality: "true",
    });
    prv = cur;
  }

  const graph = new Object();
  graph.nodes = graphNodes;
  graph.edges = graphEdges;
  graph.constraints = graphConstraints;
  console.log(graph);
  d3cola
    .nodes(graph.nodes)
    .links(graph.edges)
    .constraints(graph.constraints)
    .symmetricDiffLinkLengths(30)
    .avoidOverlaps(true)
    .start(200, 200, 200);

  console.log(cf.bicliqueCover);
  const edgeColorInterpolation = d3.interpolateRgbBasis(["red", "green"]);
  const edgeColors = [];
  if (hasEdgeColor) {
    for (const edge of graph.edges) {
      const srcEdge = edge["source"];
      const tarEdge = edge["target"];

      if (srcEdge["layer"] === 0) {
        let outVerticesCount = 0;
        const biclique = cf.bicliqueCover[0]["maximalNodes"][tarEdge["label"]];

        for (const rightNode of biclique["right"]) {
          if (bipartite[srcEdge["label"]][rightNode]) {
            outVerticesCount++;
          }
        }

        console.log(
          outVerticesCount / biclique["right"].length,
          edgeColorInterpolation(outVerticesCount / biclique["right"].length)
        );
        edgeColors.push(
          edgeColorInterpolation(outVerticesCount / biclique["right"].length)
        );
      } else if (srcEdge["layer"] === 1) {
        let outVerticesCount = 0;
        const biclique = cf.bicliqueCover[0]["maximalNodes"][srcEdge["label"]];

        for (const leftNode of biclique["left"]) {
          if (bipartite[leftNode][tarEdge["label"]]) {
            outVerticesCount++;
          }
        }

        console.log(
          outVerticesCount / biclique["right"].length,
          edgeColorInterpolation(outVerticesCount / biclique["left"].length)
        );
        edgeColors.push(
          edgeColorInterpolation(outVerticesCount / biclique["left"].length)
        );
      }
    }
  }

  // graph.nodesを用いてedge-crossingをする
  //setCrossCount(getColaBipartiteCross(cf.bipartites, graph.nodes));
  const cross = getColaBipartiteCross(cf.bipartites, graph.nodes);
  console.error("pos", graph);
  console.error(cf.bipartites);
  console.error(cf.bicliqueCover);
  //setMidNodes(graph.nodes);

  const edgePaths = graph.edges.map((d) => {
    return linkGenerator({
      source: [d.source.x, d.source.y],
      target: [d.target.x, d.target.y],
    });
  });

  return {
    cross,
    leftNodesOrder,
    midNodesOrders,
    rightNodesOrder,
    edgePaths,
    graph,
    edgeColors,
  };
};

const filterSameNodes = (nodes) => {
  const res = new Array();

  for (let i = 0; i < nodes.length; i++) {
    let isSame = true;
    for (let j = i + 1; j < nodes.length; j++) {
      if (nodes[i].id === nodes[j].id && nodes[i].label === nodes[j].label)
        isSame = false;
    }
    if (isSame) res.push(nodes[i]);
  }

  return res.sort((a, b) => a.id - b.id);
};

export default colaConfluent;
