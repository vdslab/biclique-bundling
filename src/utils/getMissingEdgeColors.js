import * as d3 from "d3";
// 入力
/*
  graph.edges
  cbipartites
  edgeColorInterpolation
  bipartite
  */

// 出力
/*
  { edgeColors, missingEdges };
  */
const getMissingEdgeColors = (
  graph,
  cbipartites,
  bipartite,
  maxDepth,
  hasEdgeColor = true
) => {
  const edgeColorInterpolation = d3.interpolateRgbBasis(["red", "green"]);
  const edgeColors = Array(graph.edges.length).fill("silver");

  let missingEdges = 0;
  graph.edges.forEach((edge, i) => {
    const srcNode = edge["source"];
    const tarNode = edge["target"];
    if (srcNode.layer === 0) {
      // 上外側エッジ
      let cexternals = [];
      let tarNodes = [tarNode.label];

      for (let cidx = 0; cidx < cbipartites.length; cidx++) {
        const srcNodes = [];
        for (const tn of tarNodes) {
          srcNodes.push(...cbipartites[cidx].maximalNodes[tn].right);
        }

        if (cidx !== cbipartites.length - 1) {
          // srcNodes -> tarNodes
          tarNodes = [];
          for (const ed of graph.edges) {
            if (ed["source"]["layer"] !== 2 * (cidx + 1)) continue;
            if (srcNodes.includes(ed["source"]["label"]))
              tarNodes.push(ed["target"]["label"]);
          }
        } else {
          cexternals.push(...srcNodes);
        }
      }

      //.error(edge, cexternals);
      const iConnect = cexternals.length;
      let totalEdgesToi = 0;
      for (const c of cexternals) {
        if (bipartite[srcNode.label][c]) totalEdgesToi++;
      }
      missingEdges += iConnect - totalEdgesToi;
      console.error(srcNode.label, totalEdgesToi, iConnect);
      if (iConnect && hasEdgeColor) {
        edgeColors[i] = edgeColorInterpolation(totalEdgesToi / iConnect);
      }
    } else if (srcNode.layer === Math.pow(2, maxDepth) - 1) {
      // 下外側エッジ
      let cexternals = [];
      let tarNodes = [srcNode.label];

      for (let cidx = cbipartites.length - 1; cidx >= 0; cidx--) {
        const srcNodes = [];
        for (const tn of tarNodes) {
          srcNodes.push(...cbipartites[cidx].maximalNodes[tn].left);
        }

        if (cidx !== 0) {
          // srcNodes -> tarNodes
          tarNodes = [];
          for (const ed of graph.edges) {
            if (
              ed["target"]["layer"] !==
              Math.pow(2, maxDepth) - 2 * (cbipartites.length - cidx)
            )
              continue;
            //console.error(ed);
            if (srcNodes.includes(ed["target"]["label"]))
              tarNodes.push(ed["source"]["label"]);
          }
        } else {
          cexternals.push(...srcNodes);
        }
      }

      //console.error(edge, cexternals);
      const iConnect = cexternals.length;
      let totalEdgesToi = 0;
      for (const c of cexternals) {
        if (bipartite[c][tarNode.label]) totalEdgesToi++;
      }
      missingEdges += iConnect - totalEdgesToi;
      console.error(tarNode.label, totalEdgesToi, iConnect);
      if (iConnect && hasEdgeColor) {
        edgeColors[i] = edgeColorInterpolation(totalEdgesToi / iConnect);
      }
    } else {
      // 中間エッジ
      // missingEdgesを更新しない
      for (let cidx = 0; cidx < cbipartites.length; cidx++) {
        if (Math.floor(srcNode["layer"] / 2) !== cidx) continue;
        if (srcNode["layer"] % 2 === 0) {
          let outVerticesCount = 0;
          const biclique = cbipartites[cidx]["maximalNodes"][tarNode["label"]];
          for (const rightNode of biclique["right"]) {
            if (cbipartites[cidx]["bipartite"][srcNode["label"]][rightNode]) {
              outVerticesCount++;
            }
          }
          if (hasEdgeColor)
            edgeColors[i] = edgeColorInterpolation(
              outVerticesCount / biclique["right"].length
            );
        } else {
          let outVerticesCount = 0;
          const biclique = cbipartites[cidx]["maximalNodes"][srcNode["label"]];
          for (const leftNode of biclique["left"]) {
            if (cbipartites[cidx]["bipartite"][leftNode][tarNode["label"]]) {
              outVerticesCount++;
            }
          }
          if (hasEdgeColor)
            edgeColors[i] = edgeColorInterpolation(
              outVerticesCount / biclique["left"].length
            );
        }
      }
    }
  });

  return { edgeColors, missingEdges };
};

export const getMissConnectionCount = (bipartite, cbipartites) => {
  let missCount = 0;
  let edgeCount = 0;
  for (let leftIdx = 0; leftIdx < bipartite.length; leftIdx++) {
    let srcNodes = [leftIdx];
    for (let cidx = 0; cidx < cbipartites.length; cidx++) {
      const inBipartite = cbipartites[cidx].bipartite;
      const tarNodes = [];

      for (const srcNode of srcNodes) {
        inBipartite[srcNode].forEach((value, key) => {
          if (value) tarNodes.push(key);
        });
      }

      console.log(leftIdx, srcNodes);
      srcNodes = [...new Set(tarNodes)];

      if (cidx === cbipartites.length - 1) {
        console.log("connect node", leftIdx, srcNodes);
        console.log(
          srcNodes.length,
          bipartite[leftIdx].filter((item) => item === 1).length
        );
        missCount +=
          srcNodes.length -
          bipartite[leftIdx].filter((item) => item === 1).length;
      }
    }

    edgeCount += bipartite[leftIdx].filter((item) => item === 1).length;
  }

  console.log(
    "ratio",
    missCount / (edgeCount + missCount),
    missCount,
    edgeCount
  );
  return {
    missConnectCount: missCount,
    missConnectRatio: missCount / (edgeCount + missCount),
  };
};

export default getMissingEdgeColors;
