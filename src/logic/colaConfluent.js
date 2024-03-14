import * as d3 from "d3";
import * as cola from "webcola";
import Confluent from "./../utils/confluent.js";
import { getQuasiBicliqueCover } from "./../utils/getBicliqueCover.js";
import getMissingEdgeColors from "./../utils/getMissingEdgeColors.js";
import makeGraphForCola from "./../utils/makeGraphForCola.js";
import { getColaBipartiteCross } from "./../utils/getBipartiteCross.js";

const colaConfluent = (
  bipartite,
  param,
  maxDepth,
  hasEdgeColor = false,
  outputForExp = false
) => {
  // バイクリークカバーの計算
  /*
    テスト箇所1
    - 正しくバイクリークカバーを算出できているか
  */
  const cf = new Confluent(getQuasiBicliqueCover, param, maxDepth);
  cf.build(bipartite);
  console.log(cf.bipartitesForMiss);

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

  //グラフのデータと制約を作る
  //グラフのノードとエッジを作成
  /*
    テスト箇所2
    - ノード、エッジ、制約が適切に入っているか？
    - 目視で確認した方が早い
  */
  const graph = makeGraphForCola(cf);
  // console.log(graph);

  // 座標決定process
  const width = 2000;
  const height = 1000;
  const d3cola = cola.d3adaptor(d3).linkDistance(300).size([width, height]);

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
  // エッジの色付け
  const { edgeColors, missingEdges } = getMissingEdgeColors(
    graph,
    cf.bipartitesForColor,
    bipartite,
    maxDepth,
    hasEdgeColor
  );

  console.log(graph);

  const edgeWidthes = [];
  let prevInfo;
  for (let depth = 0; depth < maxDepth; depth++) {
    const edgeInfo = {};
    for (let i = 0; i < cf.bipartitesForMiss.length; i++) {
      if (Math.abs(cf.bipartitesForMiss[i].depth) !== depth) continue;
      const maximalNodes = cf.bipartitesForMiss[i].maximalNodes;
      const bipartite = cf.bipartitesForMiss[i].bipartite;
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
              ? prevInfo[[left, right, cf.bipartitesForMiss[i].depth].join(",")]
              : 1;
            edgeCount += bipartite[left][right] * weight;

              // console.log(
              //   "wei upper",
              //   bipartite[left][right],
              //   weight,
              //   [left, right, cf.bipartitesForMiss[i].depth].join(","),
              // );
            // leftからrightまでのエッジのカウントをプラス
          }
          if (depth === maxDepth - 1) {
            //console.log("u", left, j, edgeCount)
            edgeWidthes.push(edgeCount);
          }
          edgeInfo[[left, j, -(depth + 1)].join(",")] = edgeCount;
          //console.log(left, j, edgeCount, " ", -(depth + 1), i);
        }
      }

      // 下エッジ
      for (let j = 0; j < maximalNodes.length; j++) {
        const node = maximalNodes[j];
        for (const right of node.right) {
          let edgeCount = 0;
          for (const left of node.left) {
            if (!bipartite[left][right]) continue;
            const weight = depth ? prevInfo[[left,right, cf.bipartitesForMiss[i].depth].join(",")] : 1;
            edgeCount += bipartite[left][right] * weight;
            // if(j === 3 && right === 1 && depth === maxDepth - 1) {
            //   console.log(weight, edgeCount)
            // }


              // console.log(
              //   "wei under",
              //   bipartite[left][right],
              //   weight,
              //   [left,right, cf.bipartitesForMiss[i].depth].join(","),
              // );
            // leftからrightまでのエッジのカウントをプラス
          }
          //console.log(j, right, edgeCount, " ", depth + 1);
          edgeInfo[[j, right, depth + 1].join(",")] = edgeCount;
          if (depth === maxDepth - 1) {
            // console.log("d", j, right, edgeCount)
            edgeWidthes.push(edgeCount);
          }
        }
      }
    }
    console.log(edgeInfo);
    prevInfo = Object.assign({}, edgeInfo);
  }

  console.log(edgeWidthes);

  // graph.nodesを用いてedge-crossingをする
  //setCrossCount(getColaBipartiteCross(cf.bipartites, graph.nodes));
  /*
    テスト箇所4
      - エッジ交差数算出関数が正しいか
      - 中間ノード数が正しいか
      - エッジ数が正しいか
      - 損失数が正しいか
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

  const linkGenerator = d3.linkVertical();
  const edgePaths = graph.edges.map((d) => {
    return linkGenerator({
      source: [d.source.x, d.source.y],
      target: [d.target.x, d.target.y],
    });
  });

  // パラメター、交差数、エッジ数、中間ノード数、誤差数のログ
  console.log("param", param);
  console.log("cross", cross);
  console.log("edge number", totalEdgeCount);
  console.log("mid node", midNodesCount);
  console.log("missing", missingEdges);

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
    edgeWidthes,
  };
};

export default colaConfluent;
