import getMidNodeWidths from "./getMidNodeWidths.js";
import { makeGraphData } from "./makeGraphForCola.js";

const getEdgeWidths = (bipartitesForMiss, bipartitesAll) => {
  const edgeMag = 1.5;
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
                // div[[j, k, bipartitesForMiss[i].depth].join(",")] = 1;
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

          if (depth === maxDepth - 1) {
            edgeWidths.push(edgeMag * edgeCount);
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
            //console.error("sita " + prevBipartiteNumber);
            const weight = depth
              ? prevInfo[[left, right, prevBipartiteNumber].join(",")]
              : 1;
            edgeCount +=
              (bipartite[left][right] * weight) /
              (div[[left, right, bipartitesForMiss[i].depth].join(",")] || 1);
          }
          edgeInfo[[j, right, bipartiteNumber].join(",")] = edgeCount;

          if (depth === maxDepth - 1) {
            edgeWidths.push(edgeMag * edgeCount);
          }
        }
      }
      bipartiteNumber++;
      prevBipartiteNumber++;
    }
    console.error("edgeInfo ", edgeInfo);
    prevInfo = Object.assign({}, edgeInfo);
  }

  const { nodes, edges } = makeGraphData(
    bipartitesAll.filter((bipartite) => Math.abs(bipartite.depth) === maxDepth)
  );

  const midNodeWidths = getMidNodeWidths(
    nodes,
    edges,
    edgeWidths,
    2 ** maxDepth
  );

  console.error(prevMidNodeWidths);
  return { edgeWidths, midNodeWidths };
};

export default getEdgeWidths;
