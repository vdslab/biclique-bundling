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
