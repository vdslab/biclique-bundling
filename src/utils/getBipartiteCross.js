// 計算量O(n^2)
export const getBipartiteCross = (
  bipartite,
  leftNodesOrder,
  rightNodesOrder
) => {
  let count = 0;

  const edges = new Array();
  for (let i = 0; i < bipartite.length; i++) {
    for (let j = 0; j < bipartite[i].length; j++) {
      if (!bipartite[i][j]) continue;
      edges.push({
        left: leftNodesOrder.indexOf(i),
        right: rightNodesOrder.indexOf(j),
      });
    }
  }

  for (let i = 0; i < edges.length; i++) {
    for (let j = i; j < edges.length; j++) {
      if (edges[i].left < edges[j].left && edges[i].right > edges[j].right) {
        count++;
      } else if (
        edges[i].left > edges[j].left &&
        edges[i].right < edges[j].right
      ) {
        count++;
      }
    }
  }

  return count++;
};

// cola.jsで並び替えした用
// 座標からleftNodesOrderとrightNodesOrderを算出する
export const getColaBipartiteCross = (bipartites, nodes) => {
  console.log(bipartites, nodes);
  let crossCount = 0;
  let startIdx = 0;
  for (const obj of bipartites) {
    const bipartite = obj["bipartite"];

    const leftNodesNum = bipartite.length;
    const rightNodesNum = bipartite[0].length;
    const leftNodes = new Array();
    const rightNodes = new Array();

    for (let i = 0; i < leftNodesNum; i++) {
      leftNodes.push(nodes[i + startIdx]);
    }

    for (let i = 0; i < rightNodesNum; i++) {
      rightNodes.push(nodes[i + startIdx + leftNodesNum]);
    }

    leftNodes.sort((a, b) => a.x - b.x);
    rightNodes.sort((a, b) => a.x - b.x);
    const leftNodesOrder = new Array();
    const rightNodesOrder = new Array();

    for (let i = 0; i < leftNodesNum; i++) {
      leftNodesOrder.push(leftNodes[i]["label"]);
    }

    for (let i = 0; i < rightNodesNum; i++) {
      rightNodesOrder.push(rightNodes[i]["label"]);
    }

    console.log(leftNodesOrder, rightNodesOrder);

    crossCount += getBipartiteCross(bipartite, leftNodesOrder, rightNodesOrder);
    startIdx += bipartite.length;
  }

  return crossCount;
};

// sugiyama framework用の交差数算出関数
export const getConfluentCross = (
  bipartites,
  leftNodesOrder,
  rightNodesOrder,
  midNodesOrders
) => {
  let count = 0;
  for (let i = 0; i < bipartites.length; i++) {
    const bipartite = bipartites[i].bipartite;
    if (i === 0) {
      count += getBipartiteCross(bipartite, leftNodesOrder, midNodesOrders[i]);
    } else if (i === bipartites.length - 1) {
      count += getBipartiteCross(
        bipartite,
        midNodesOrders[i - 1],
        rightNodesOrder
      );
    } else {
      count += getBipartiteCross(
        bipartite,
        midNodesOrders[i - 1],
        midNodesOrders[i]
      );
    }
  }

  return count++;
};

export const getConfluentCrossCount = (bipartites, nodeOrders) => {
  let count = 0;

  for (let i = 0; i < bipartites.length; i++) {
    const bipartite = bipartites[i].bipartite;
    count += getBipartiteCross(bipartite, nodeOrders[i], nodeOrders[i + 1]);
  }

  return count;
};
