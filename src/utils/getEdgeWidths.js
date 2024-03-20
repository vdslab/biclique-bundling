const getEdgeWidths = (bipartitesForMiss) => {
  const edgeWidths = [];
  let prevInfo;
  const maxDepth = bipartitesForMiss.length
    ? Math.abs(bipartitesForMiss.at(-1).depth) + 1
    : 0;
  for (let depth = 0; depth < maxDepth; depth++) {
    const edgeInfo = {};
    let bipartiteNumber = 0;
    let prevBipartiteNumber = 0;
    for (let i = 0; i < bipartitesForMiss.length; i++) {
      if (Math.abs(bipartitesForMiss[i].depth) !== depth) continue;
      const maximalNodes = bipartitesForMiss[i].maximalNodes;
      const bipartite = bipartitesForMiss[i].bipartite;
      // depth >= 1からedgeWidthesを用いる

      // 上エッジ
      for (let left = 0; left < bipartite.length; left++) {
        for (let j = 0; j < maximalNodes.length; j++) {
          const node = maximalNodes[j];
          let edgeCount = 0;
          if (!node.left.includes(left)) continue;
          for (const right of node.right) {
            if (!bipartite[left][right]) continue;
            const weight = depth
              ? prevInfo[[left, right, prevBipartiteNumber].join(",")]
              : 1;
            edgeCount += bipartite[left][right] * weight;
          }
          if (depth === maxDepth - 1) {
            edgeWidths.push(edgeCount);
          }
          edgeInfo[[left, j, bipartiteNumber].join(",")] = edgeCount;
        }
      }
      bipartiteNumber++;

      // 下エッジ
      for (let j = 0; j < maximalNodes.length; j++) {
        const node = maximalNodes[j];
        for (const right of node.right) {
          let edgeCount = 0;
          for (const left of node.left) {
            if (!bipartite[left][right]) continue;
            const weight = depth
              ? prevInfo[[left, right, prevBipartiteNumber].join(",")]
              : 1;
            edgeCount += bipartite[left][right] * weight;
          }
          edgeInfo[[j, right, bipartiteNumber].join(",")] = edgeCount;
          if (depth === maxDepth - 1) {
            edgeWidths.push(edgeCount);
          }
        }
      }
      bipartiteNumber++;
      prevBipartiteNumber++;
    }
    // console.log(edgeInfo);
    prevInfo = Object.assign({}, edgeInfo);
  }

  return edgeWidths;
};

export default getEdgeWidths;
