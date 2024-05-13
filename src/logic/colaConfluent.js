import * as d3 from "d3";
import * as cola from "webcola";
import Confluent from "./../utils/confluent.js";
import { getQuasiBicliqueCover } from "./../utils/getBicliqueCover.js";
import getMissingEdgeColors from "./../utils/getMissingEdgeColors.js";
import makeGraphForCola from "./../utils/makeGraphForCola.js";
import getEdgeWidths from "./../utils/getEdgeWidths";
import { getColaBipartiteCross } from "./../utils/getBipartiteCross.js";
import getEdgeEndPos from "./../utils/getEdgeEndPos.js";

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
  const lastLayer = 2 ** maxDepth;
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
  const edgeWidths = getEdgeWidths(cf.bipartitesForMiss);
  const { graph, midNodeWidths } = makeGraphForCola(cf, edgeWidths, lastLayer);

  //const midNodeWidths = getMidNodeWidths(graph, edgeWidths, lastLayer);
  //console.error(midNodeWidths);
  // console.error(edgeWidths);
  console.error(graph);

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
  const { missingEdges } = getMissingEdgeColors(
    graph,
    cf.bipartitesForColor,
    bipartite,
    maxDepth,
    hasEdgeColor
  );
  const edgeColors = [];
  console.log(edgeWidths);

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

  let edgePaths = [];
  if (maxDepth > 0) {
    const linkGenerator = d3.linkVertical();
    const edgeAt = getEdgeEndPos(graph, edgeWidths, midNodeWidths, lastLayer);
    edgePaths = edgeAt.map((edge) => linkGenerator(edge));
  } else {
    const lineGenerator = d3.line();
    edgePaths = graph.edges.map((edge) =>
      lineGenerator([
        [edge.source.x, edge.source.y],
        [edge.target.x, edge.target.y],
      ])
    );
  }

  // パラメター、交差数、エッジ数、中間ノード数、誤差数のログ
  console.log("param", param);
  console.log("cross", cross);
  console.log("edge number", totalEdgeCount);
  console.log("mid node", midNodesCount);
  console.log("missing", missingEdges);
  console.log("graph data", graph);
  console.log("color", cf.bipartitesForColor);
  console.log(edgePaths);

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
    edgeWidths,
  };
};

export default colaConfluent;
