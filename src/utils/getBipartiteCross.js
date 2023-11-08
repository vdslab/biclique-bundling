const getBipartiteCross = (bipartite) => {
  let count = 0;

  const edges = new Array();
  for (let i = 0; i < bipartite.length; i++) {
    for (let j = 0; j < bipartite[i].length; j++) {
      if (!bipartite[i][j]) continue;
      edges.push({ left: i, right: j });
    }
  }

  for (let i = 0; i < edges.length; i++) {
    for (let j = i; j < edges.length; j++) {
      // 3      5                              3  0
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

export default getBipartiteCross;
