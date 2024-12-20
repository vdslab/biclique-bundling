import {
  getConfluentCrossCount,
  getConfluentWeightedCrossCount,
} from "../utils/getBipartiteCross.js";

export const setColaConstraint = (d3cola, graph, midNodeWidths, lastLayer) => {
  d3cola
    .nodes(graph.nodes)
    .links(graph.edges)
    .constraints(graph.constraints)
    .symmetricDiffLinkLengths(40) // ノードの数によって増やす
    .start(30, 40, 50);

  // 制約の再追加
  const sortedNodes = structuredClone(graph.nodes).sort((a, b) => {
    return a.x - b.x;
  });

  const nodeOrders = [];
  for (let i = 0; i < lastLayer + 1; i++) {
    nodeOrders.push([]);
  }

  for (const node of sortedNodes) {
    nodeOrders[node.layer].push(node.label);
  }

  // console.error("setColaConstraint in nodeOrders", nodeOrders);

  let Id = 0;
  // console.log(nodeOrders);
  nodeOrders.forEach((nodes, key) => {
    for (let i = 0; i < nodes.length - 1; i++) {
      const gap =
        (midNodeWidths[key][nodes[i]] + midNodeWidths[key][nodes[i + 1]]) / 1.5;
      graph.constraints.push({
        left: nodes[i] + Id,
        right: nodes[i + 1] + Id,
        gap,
        axis: "x",
      });
    }
    Id += nodes.length;
  });

  return 0;
};

export const setCrossConstraint = (
  bipartite,
  bipartites,
  layeredNodes,
  graph,
  midNodeWidths,
  edgeWidths,
  lastLayer,
  isBaryWeighted,
  maxDepth,
  fontSize
) => {
  const leftNodeNumber = bipartite.length;
  const rightNodeNumber = bipartite[0].length;
  const midLayerNumber = layeredNodes.length;

  // //左右中間ノードの順序を初期化
  const leftNodesOrder = new Array();
  const rightNodesOrder = new Array();
  const midNodesOrders = new Array(); // 中間ノードの層と同じサイズ

  // [0, 1, 2, ...]
  for (let i = 0; i < leftNodeNumber; i++) {
    leftNodesOrder.push(i);
  }

  // [0, 1, 2, ...]
  for (let i = 0; i < rightNodeNumber; i++) {
    rightNodesOrder.push(i);
  }

  // [[0, 1, 2, ...],  [0, 1, 2, ...], ...]
  for (let i = 0; i < midLayerNumber; i++) {
    const midNodesOrder = new Array();
    for (let j = 0; j < layeredNodes[i].maximalNodes.length; j++) {
      midNodesOrder.push(j);
    }
    midNodesOrders.push(midNodesOrder);
  }

  // 制約の再追加
  const sortedNodes = structuredClone(graph.nodes).sort((a, b) => {
    return a.x - b.x;
  });

  let nodeOrders = [];
  for (let i = 0; i < lastLayer + 1; i++) {
    nodeOrders.push([]);
  }

  for (const node of sortedNodes) {
    nodeOrders[node.layer].push(node.label);
  }

  let count = isBaryWeighted
    ? getConfluentWeightedCrossCount(bipartites, nodeOrders, edgeWidths)
    : getConfluentCrossCount(bipartites, nodeOrders);
  // console.error("cross count initial: ", count);
  // console.error(structuredClone(nodeOrders));

  const edge2Width = {};
  // console.error(edgeWidths, graph.edges);
  edgeWidths.forEach((width, index) => {
    const edges = graph.edges[index];
    const key = [
      edges["sourceLabel"],
      edges["targetLabel"],
      edges["bipartiteIdx"],
    ].join(",");
    // console.error(edges, key, width);
    edge2Width[key] = width;
  });
  // console.error(edgeWidths)
  // console.error(edge2Width);
  //左から右
  let fromLeft = true;

  for (;;) {
    const CopyNodeOrders = structuredClone(nodeOrders);
    if (fromLeft) {
      for (let k = 0; k < bipartites.length; k++) {
        const bipartite = bipartites[k].bipartite;

        const leftSideNodesNumber = bipartite.length;
        const rightSideNodesNumber = bipartite[0].length;

        const sum = new Array();
        for (let v = 0; v < rightSideNodesNumber; v++) {
          let degree = 0;
          let ouh = 0;
          for (let u = 0; u < leftSideNodesNumber; u++) {
            if (!bipartite[u][v]) continue;
            const width = isBaryWeighted ? edge2Width[[u, v, k].join(",")] : 1;
            degree += width;
            ouh += width * CopyNodeOrders[k].indexOf(u);
          }

          sum.push(ouh / degree);
        }

        CopyNodeOrders[k + 1].sort((a, b) => {
          if (sum[a] !== sum[b]) {
            return sum[a] - sum[b];
          } else {
            return a - b;
          }
        });

        //console.error()
      }
    } else {
      for (let k = bipartites.length - 1; k >= 0; k--) {
        const bipartite = bipartites[k].bipartite;

        const leftSideNodesNumber = bipartite.length;
        const rightSideNodesNumber = bipartite[0].length;

        const sum = new Array();
        for (let v = 0; v < leftSideNodesNumber; v++) {
          let degree = 0;
          let ouh = 0;
          for (let u = 0; u < rightSideNodesNumber; u++) {
            if (!bipartite[v][u]) continue;
            const width = isBaryWeighted ? edge2Width[[v, u, k].join(",")] : 1;
            degree += width;
            ouh += width * CopyNodeOrders[k + 1].indexOf(u);
          }
          // console.error(ouh, degree, 'sitaaaaaaaaaaaaa')
          sum.push(ouh / degree);
        }

        CopyNodeOrders[k].sort((a, b) => {
          if (sum[a] !== sum[b]) {
            return sum[a] - sum[b];
          } else {
            return a - b;
          }
        });
      }
    }

    fromLeft = !fromLeft;
    const newCount = isBaryWeighted
      ? getConfluentWeightedCrossCount(bipartites, CopyNodeOrders, edgeWidths)
      : getConfluentCrossCount(bipartites, CopyNodeOrders);
    console.error(newCount);
    //console.error("old cross count: ", count, nodeOrders, bipartites);
    // console.error("new cross count: ", newCount, CopyNodeOrders, bipartites);
    // console.error("----------------------------------------------");

    if (count <= newCount) {
      // console.error(
      //   "result weight: ",
      //   getConfluentWeightedCrossCount(bipartites, nodeOrders, edgeWidths)
      // );
      // console.error(bipartites, nodeOrders, edgeWidths);
      break;
    }

    count = newCount;
    nodeOrders = CopyNodeOrders.slice();
  }

  console.error(
    getConfluentWeightedCrossCount(bipartites, nodeOrders, edgeWidths),
    getConfluentCrossCount(bipartites, nodeOrders)
  );

  let Id = 0;
  console.error("node", nodeOrders);
  nodeOrders.forEach((nodes, key) => {
    for (let i = 0; i < nodes.length - 1; i++) {
      let gap = +maxDepth
        ? (midNodeWidths[key][nodes[i]] + midNodeWidths[key][nodes[i + 1]]) /
            2 +
          30
        : 30;

      if (key === 0 || key === lastLayer) {
        const width1 =
          String(nodes[i]).length * fontSize -
          ((String(nodes[i]).length - 1) * fontSize) / 2.5;

        const width2 =
          String(nodes[i + 1]).length * fontSize -
          ((String(nodes[i + 1]).length - 1) * fontSize) / 2.5;

        const labelGap = (width1 + width2) / 2 + 10;
        gap = Math.max(gap, labelGap);
      }

      graph.constraints.push({
        left: nodes[i] + Id,
        right: nodes[i + 1] + Id,
        type: "separation",
        gap,
        axis: "x",
      });
    }
    Id += nodes.length;
  });

  return count;
};
