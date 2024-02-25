import { getQuasiBicliqueCover } from "./../utils/getBicliqueCover.js";
import * as d3 from "d3";
import * as cola from "webcola";
import Confluent from "./../utils/confluent.js";
import { getColaBipartiteCross } from "./../utils/getBipartiteCross.js";

const colaConfluent = (bipartite, param, maxDepth, hasEdgeColor = false) => {
  // バイクリークカバーの計算
  /*
    テスト箇所1
    - 正しくバイクリークカバーを算出できているか
  */
  const cf = new Confluent(getQuasiBicliqueCover, param, maxDepth);
  cf.build(bipartite);
  cf.layeredNodes.sort((a, b) => {
    return a.h - b.h;
  });
  cf.bipartites.sort((a, b) => {
    return a.h - b.h;
  });

  const leftNodeNumber = bipartite.length;
  const rightNodeNumber = bipartite[0].length;
  const midLayerNumber = cf.layeredNodes.length;
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
    for (let j = 0; j < cf.layeredNodes[i].maximalNodes.length; j++) {
      midNodesOrder.push(j);
    }
    midNodesOrders.push(midNodesOrder);
  }

  // 座標決定process
  const width = 2000;
  const height = 1000;
  const d3cola = cola.d3adaptor(d3).linkDistance(300).size([width, height]);

  //グラフのデータと制約を作る
  //グラフのノードとエッジを作成
  /*
    テスト箇所2
    - ノード、エッジ、制約が適切に入っているか？
    - 目視で確認した方が早い
  */
  const graphEdges = new Array();
  const graphNodesSet = new Set();
  let pad = 0;
  for (let k = 0; k < cf.bipartites.length; k++) {
    const bipartite = cf.bipartites[k].bipartite;
    for (let i = 0; i < bipartite.length; i++) {
      for (let j = 0; j < bipartite[i].length; j++) {
        if (!bipartite[i][j]) continue;
        graphEdges.push({
          source: i + pad,
          target: j + pad + bipartite.length,
        });
        graphNodesSet.add({ id: i + pad, label: i, layer: k });
        graphNodesSet.add({
          id: j + pad + bipartite.length,
          label: j,
          layer: k + 1,
        });
      }
    }
    pad += bipartite.length;
  }

  const graphNodes = filterSameNodes(Array.from(graphNodesSet));

  // グラフの制約を追加
  const graphConstraints = new Array();
  let idx = 0;
  let prvIdx = 0;
  let curIdx = 0;
  for (let k = 0; k < cf.bipartites.length; k++) {
    const leftNodesNum = cf.bipartites[k].bipartite.length;
    const rightNodesNum = cf.bipartites[k].bipartite[0].length;
    const constraint = { type: "alignment", axis: "y" };
    const offsets = new Array();

    // 一番上
    if (k === 0) {
      const toffsets = new Array();
      const tconstraint = { type: "alignment", axis: "y" };
      for (let i = 0; i < leftNodesNum; i++) {
        toffsets.push({ node: String(idx++), offset: "0" });
      }

      tconstraint.offsets = toffsets;
      graphConstraints.push(tconstraint);

      curIdx = idx;
      graphConstraints.push({
        axis: "y",
        left: prvIdx,
        right: curIdx,
        gap: 100,
        equality: "true",
      });
      prvIdx = curIdx;
    }

    // 中央
    for (let i = 0; i < rightNodesNum; i++) {
      offsets.push({ node: String(idx++), offset: String(k + 1) });
    }
    constraint.offsets = offsets;
    graphConstraints.push(constraint);

    // 一番下
    if (k === cf.bipartites.length - 1) continue;
    curIdx = idx;
    graphConstraints.push({
      axis: "y",
      left: prvIdx,
      right: curIdx,
      gap: 100,
      equality: "true",
    });
    prvIdx = curIdx;
  }

  const graph = new Object();
  graph.nodes = graphNodes;
  graph.edges = graphEdges;
  graph.constraints = graphConstraints;
  // console.log(graph);

  // stress最小化
  d3cola
    .nodes(graph.nodes)
    .links(graph.edges)
    .constraints(graph.constraints)
    .symmetricDiffLinkLengths(30)
    .avoidOverlaps(true)
    .start(200, 200, 250);

  // 欠けているエッジに色を付ける
  /*
    テスト箇所3
    - 色付けが正しいか
    - エッジ損失率を調べる
  */
  // console.error("cover", cf.bicliqueCover);
  // console.error(cf.bipartites);
  // console.error(cf.bipartitesForColor);
  const cbipartites = cf.bipartitesForColor
    .filter((item) => {
      return Math.abs(item.depth) === maxDepth - 1;
    })
    .sort((a, b) => a.h - b.h);

  console.error("color", cbipartites, cf.bicliqueCover, cf.bipartitesForColor);
  console.error(graph);

  let missingEdges = 0;
  console.error(graph.edges);
  const edgeColorInterpolation = d3.interpolateRgbBasis(["red", "green"]);
  const edgeColors = [];
  if (hasEdgeColor && maxDepth > 0) {
    for (let i = 0; i < cbipartites.length; i++) {
      for (const edge of graph.edges) {
        const srcNode = edge["source"];
        const tarNode = edge["target"];

        if (Math.floor(srcNode["layer"] / 2) !== i) continue;

        if (srcNode["layer"] % 2 === 0) {
          let outVerticesCount = 0;
          const biclique = cbipartites[i]["maximalNodes"][tarNode["label"]];
          for (const rightNode of biclique["right"]) {
            if (cbipartites[i]["bipartite"][srcNode["label"]][rightNode]) {
              outVerticesCount++;
            }
          }
          edgeColors.push(
            edgeColorInterpolation(outVerticesCount / biclique["right"].length)
          );
          // 描画上のエッジ数 - 実際のエッジ数
          missingEdges += biclique["right"].length - outVerticesCount;
        } else {
          let outVerticesCount = 0;
          const biclique = cbipartites[i]["maximalNodes"][srcNode["label"]];

          for (const leftNode of biclique["left"]) {
            if (cbipartites[i]["bipartite"][leftNode][tarNode["label"]]) {
              outVerticesCount++;
            }
          }
          edgeColors.push(
            edgeColorInterpolation(outVerticesCount / biclique["left"].length)
          );
          // 描画上のエッジ数 - 実際のエッジ数
          missingEdges += biclique["left"].length - outVerticesCount;
        }
      }
    }
  }

  console.error(cbipartites, edgeColors);
  if (hasEdgeColor && maxDepth > 0) {
    missingEdges = 0;
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

        console.error(edge, cexternals);
        const iConnect = cexternals.length;
        let totalEdgesToi = 0;
        for (const c of cexternals) {
          if (bipartite[srcNode.label][c]) totalEdgesToi++;
        }
        missingEdges += iConnect - totalEdgesToi;
        edgeColors[i] = edgeColorInterpolation(totalEdgesToi / iConnect);
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
              // hotfix
              if (ed["target"]["layer"] !== 2) continue;
              console.error(ed);
              if (srcNodes.includes(ed["target"]["label"]))
                tarNodes.push(ed["source"]["label"]);
            }
          } else {
            cexternals.push(...srcNodes);
          }
        }

        console.error(edge, cexternals);
        const iConnect = cexternals.length;
        let totalEdgesToi = 0;
        for (const c of cexternals) {
          if (bipartite[c][tarNode.label]) totalEdgesToi++;
        }
        missingEdges += iConnect - totalEdgesToi;
        edgeColors[i] = edgeColorInterpolation(totalEdgesToi / iConnect);
      }
    });
  }

  // graph.nodesを用いてedge-crossingをする
  //setCrossCount(getColaBipartiteCross(cf.bipartites, graph.nodes));
  /*
    テスト箇所4
      - エッジ交差数算出関数が正しいか
      - 中間ノード算出関数が正しいか
  */
  // エッジ交差数
  const cross = getColaBipartiteCross(cf.bipartites, graph.nodes);

  // 中間ノード数
  const midNodesCount = cf.midNodesCount;

  // エッジ数
  const totalEdgeCount = graph.edges.length;
  //getConfluentEdgeCount(cbipartites);

  // 損失数
  // missingEdges;

  //const midNodes =  getColaMidNodesNumber();
  // console.error("pos", graph);
  // console.error(cf.bipartites);
  // console.error(cf.bicliqueCover);
  // console.error(cf.midNodesCount);
  // console.error(totalEdgeCount);
  // console.error(graph);

  const linkGenerator = d3.linkVertical();
  const edgePaths = graph.edges.map((d) => {
    return linkGenerator({
      source: [d.source.x, d.source.y],
      target: [d.target.x, d.target.y],
    });
  });

  console.error(param, cross, totalEdgeCount, midNodesCount, missingEdges);

  return {
    leftNodesOrder,
    midNodesOrders,
    rightNodesOrder,
    edgePaths,
    graph,
    edgeColors,
    cross,
    totalEdgeCount,
    midNodesCount,
    missingEdges,
  };
};

const filterSameNodes = (nodes) => {
  const res = new Array();

  for (let i = 0; i < nodes.length; i++) {
    let isSame = true;
    for (let j = i + 1; j < nodes.length; j++) {
      if (nodes[i].id === nodes[j].id && nodes[i].label === nodes[j].label)
        isSame = false;
    }
    if (isSame) res.push(nodes[i]);
  }

  return res.sort((a, b) => a.id - b.id);
};

// const getConfluentEdgeCount = (cbipartites) => {
//   let totalEdgeCount = 0;
//   for (const cbipartite of cbipartites) {
//     const maximalNodes = cbipartite["maximalNodes"];
//     maximalNodes.forEach((nodes) => {
//       totalEdgeCount += nodes["left"].length + nodes["right"].length;
//     });
//   }

//   return totalEdgeCount;
// };

export default colaConfluent;
