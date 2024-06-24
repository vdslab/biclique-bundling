import getMidNodeWidths from "./getMidNodeWidths.js";
import { makeGraphData } from "./makeGraphForCola.js";

const getEdgeWidths = (graph, bipartitesForMiss, bipartitesAll, lastLayer) => {
  const edgeWidths = [];
  let prevInfo;
  let prevMidNodeWidths = [];
  console.error(bipartitesForMiss);
  const maxDepth = bipartitesForMiss.length
    ? Math.abs(bipartitesForMiss.at(-1).depth) + 1
    : 0;
  const div = {};
  for (let depth = 0; depth < maxDepth; depth++) {
    const edgeInfo = {};
    let bipartiteNumber = 0;
    let prevBipartiteNumber = 0;
    for (let i = 0; i < bipartitesForMiss.length; i++) {
      if (Math.abs(bipartitesForMiss[i].depth) !== depth) continue;
      const maximalNodes = bipartitesForMiss[i].maximalNodes;
      const bipartite = bipartitesForMiss[i].bipartite;
      // depth >= 1からedgeWidthsを用いる

      if (depth) {
        for (let j = 0; j < bipartite.length; j++) {
          for (let k = 0; k < bipartite[j].length; k++) {
            if (!bipartite[j][k]) continue;
            for (let l = 0; l < maximalNodes.length; l++) {
              const nodes = maximalNodes[l];
              if (nodes.left.includes(j) && nodes.right.includes(k)) {
                div[[j, k, bipartitesForMiss[i].depth].join(",")] = div[
                  [j, k, bipartitesForMiss[i].depth].join(",")
                ]
                  ? div[[j, k, bipartitesForMiss[i].depth].join(",")] + 1
                  : 1;
              }
            }
          }
        }
      }
      // 上エッジ
      for (let left = 0; left < bipartite.length; left++) {
        for (let j = 0; j < maximalNodes.length; j++) {
          const node = maximalNodes[j];
          let edgeCount = 0;
          if (!node.left.includes(left)) continue;
          for (const right of node.right) {
            if (!bipartite[left][right]) continue;
            // console.error("ue " + prevBipartiteNumber);
            const weight = depth
              ? prevInfo[[left, right, prevBipartiteNumber].join(",")]
              : 1;
            edgeCount +=
              (bipartite[left][right] * weight) /
              (div[[left, right, bipartitesForMiss[i].depth].join(",")] || 1);
          }

          edgeWidths.push(edgeCount);

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
            //console.error("sita " + prevBipartiteNumber);
            const weight = depth
              ? prevInfo[[left, right, prevBipartiteNumber].join(",")]
              : 1;
            edgeCount +=
              (bipartite[left][right] * weight) /
              (div[[left, right, bipartitesForMiss[i].depth].join(",")] || 1);
          }
          edgeInfo[[j, right, bipartiteNumber].join(",")] = edgeCount;

          edgeWidths.push(edgeCount);
        }
      }
      bipartiteNumber++;
      prevBipartiteNumber++;
    }
    console.error("AHHHHHHHHHHHHHHHHHHHHHHHHHHHH ", edgeInfo);
    prevInfo = Object.assign({}, edgeInfo);

    const { nodes, edges } = makeGraphData(
      bipartitesAll.filter(
        (bipartite) => Math.abs(bipartite.depth) === depth + 1
      )
    );

    const curMidNodeWidths = getMidNodeWidths(
      nodes,
      edges,
      edgeWidths,
      2 ** (depth + 1)
    );

    console.error(nodes, edges);
    console.error("edgeWidths ", edgeWidths);
    console.error(
      "midNodeWidths  ",
      getMidNodeWidths(nodes, edges, edgeWidths, 2 ** (depth + 1))
    );

    for (let prev = 0; prev < prevMidNodeWidths.length; prev++) {
      const offset = (curMidNodeWidths.length - prevMidNodeWidths.length) / 2;
      const cur = prev + offset;

      for (let m = 0; m < prevMidNodeWidths[prev].length; m++) {
        curMidNodeWidths[cur][m] = prevMidNodeWidths[prev][m];
      }
    }

    while (depth < maxDepth - 1 && edgeWidths.length) {
      edgeWidths.pop();
    }

    prevMidNodeWidths = curMidNodeWidths;
  }

  console.error(prevMidNodeWidths);
  return { edgeWidths, midNodeWidths: prevMidNodeWidths };
};

export default getEdgeWidths;
