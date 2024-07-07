import { getConfluentCross } from "../utils/getBipartiteCross";

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

  const insertedNodes = [];
  for (let i = 0; i < lastLayer + 1; i++) {
    insertedNodes.push([]);
  }

  for (const node of sortedNodes) {
    insertedNodes[node.layer].push(node);
  }

  console.error("setColaConstraint in insertedNodes", insertedNodes);

  for (const nodes of insertedNodes) {
    for (let i = 0; i < nodes.length - 1; i++) {
      const gap =
        (midNodeWidths[nodes[i].layer][nodes[i].label] +
          midNodeWidths[nodes[i].layer][nodes[i + 1].label]) /
        1.5;
      graph.constraints.push({
        left: nodes[i].id,
        right: nodes[i + 1].id,
        gap,
        axis: "x",
      });
    }
  }
};

export const setCrossConstraint = (
  bipartite,
  bipartites,
  layeredNodes,
  graph,
  midNodeWidths
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

  let count = 1e16;

  //左から右
  let fromLeft = true;
  for (;;) {
    if (fromLeft) {
      for (let k = 0; k < bipartites.length; k++) {
        const bipartite = bipartites[k].bipartite;

        const leftSideNodesNumber = bipartite.length;
        const rightSideNodesNumber = bipartite[0].length;

        const sum = new Array();
        for (let i = 0; i < rightSideNodesNumber; i++) {
          let degree = 0;
          let ouh = 0;
          for (let j = 0; j < leftSideNodesNumber; j++) {
            if (!bipartite[j][i]) continue;
            degree++;

            if (k !== 0) {
              ouh += midNodesOrders[k - 1].indexOf(j);
            } else {
              ouh += leftNodesOrder.indexOf(j);
            }
          }
          sum.push(ouh / degree);
        }

        if (k !== bipartites.length - 1) {
          midNodesOrders[k].sort((a, b) => {
            return sum[a] - sum[b];
          });
        } else {
          rightNodesOrder.sort((a, b) => {
            return sum[a] - sum[b];
          });
        }
      }
    } else {
      for (let k = bipartites.length - 1; k >= 0; k--) {
        const bipartite = bipartites[k].bipartite;

        const leftSideNodesNumber = bipartite.length;
        const rightSideNodesNumber = bipartite[0].length;

        const sum = new Array();
        for (let i = 0; i < leftSideNodesNumber; i++) {
          let degree = 0;
          let ouh = 0;
          for (let j = 0; j < rightSideNodesNumber; j++) {
            if (!bipartite[i][j]) continue;
            degree++;

            if (k !== bipartites.length - 1) {
              ouh += midNodesOrders[k].indexOf(j);
            } else {
              ouh += rightNodesOrder.indexOf(j);
            }
          }
          sum.push(ouh / degree);
        }

        if (k !== 0) {
          midNodesOrders[k - 1].sort((a, b) => {
            return sum[a] - sum[b];
          });
        } else {
          leftNodesOrder.sort((a, b) => {
            return sum[a] - sum[b];
          });
        }
      }
    }

    fromLeft = !fromLeft;
    const newCount = getConfluentCross(
      bipartites,
      leftNodesOrder,
      rightNodesOrder,
      midNodesOrders
    );
    if (count <= newCount) {
      break;
    }

    count = newCount;
    console.log(count);
  }

  const insertedNodes = [leftNodesOrder, ...midNodesOrders, rightNodesOrder];

  console.error("setCrossConstraint in insertedNodes", insertedNodes);
  let Id = 0;
  insertedNodes.forEach((nodes, key) => {
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
};
