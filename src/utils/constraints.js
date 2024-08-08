import {
  getConfluentCrossCount,
  getConfluentWeightedCrossCount,
} from "../utils/getBipartiteCross";

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

  console.error("setColaConstraint in nodeOrders", nodeOrders);

  let Id = 0;
  console.log(nodeOrders);
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
  d3cola,
  lastLayer
) => {
  const leftNodeNumber = bipartite.length;
  const rightNodeNumber = bipartite[0].length;
  const midLayerNumber = layeredNodes.length;

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

  // nodeOrders = [leftNodesOrder, ...midNodesOrders, rightNodesOrder];

  let count = getConfluentWeightedCrossCount(
    bipartites,
    nodeOrders,
    edgeWidths
  );
  console.error("cross count initial: ", count);
  console.error(structuredClone(nodeOrders));

  const edge2Width = {};
  edgeWidths.forEach((width, index) => {
    const edges = graph.edges[index];
    const key = [
      edges["sourceLabel"],
      edges["targetLabel"],
      edges["bipartiteIdx"],
    ].join(",");
    console.error(edges, key, width);
    edge2Width[key] = width;
  });
  console.error(edge2Width);
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
            const width = edge2Width[[u, v, k].join(",")];
            degree += width;
            ouh += width * CopyNodeOrders[k].indexOf(u);
          }
          sum.push(ouh / degree);
        }

        console.error(sum);
        CopyNodeOrders[k + 1].sort((a, b) => {
          if (sum[a] !== sum[b]) {
            return sum[a] - sum[b];
          } else {
            return a - b;
          }
        });
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
            const width = edge2Width[[v, u, k].join(",")];
            degree += width;
            ouh += width * CopyNodeOrders[k + 1].indexOf(u);
          }
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
    const newCount = getConfluentWeightedCrossCount(
      bipartites,
      CopyNodeOrders,
      edgeWidths
    );
    console.error("old cross count: ", count, nodeOrders, bipartites);
    console.error("new cross count: ", newCount, CopyNodeOrders, bipartites);
    console.error("----------------------------------------------");
    if (count <= newCount) {
      console.error(
        "result weight: ",
        getConfluentWeightedCrossCount(bipartites, nodeOrders, edgeWidths)
      );
      console.error(bipartites, nodeOrders, edgeWidths);
      break;
    }

    count = newCount;
    nodeOrders = CopyNodeOrders.slice();
  }

  let Id = 0;
  nodeOrders.forEach((nodes, key) => {
    for (let i = 0; i < nodes.length - 1; i++) {
      console.error(key, nodes[i]);
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

  return count;
};
