import * as d3 from "d3";
import * as cola from "webcola";
import Confluent from "./../utils/confluent.js";
import { getQuasiBicliqueCover } from "./../utils/getBicliqueCover.js";
import getMissingEdgeColors from "./../utils/getMissingEdgeColors.js";
import makeGraphForCola from "./../utils/makeGraphForCola.js";
import getEdgeWidths from "./../utils/getEdgeWidths";
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
  const { missingEdges } = getMissingEdgeColors(
    graph,
    cf.bipartitesForColor,
    bipartite,
    maxDepth,
    hasEdgeColor
  );
  const edgeColors = [];
  const edgeWidthes = getEdgeWidths(cf.bipartitesForMiss);
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
  const lastLayer = 2 ** maxDepth;
  // 損失数
  // missingEdges;
  let midNodeWidths = [];
  let midNodeElement = [];
  for (let i = 0; i < graph.nodes.length; i++) {
    const node = graph.nodes[i];
    if (node.layer === 0 || node.layer === lastLayer) continue;

    let sumWidth = 0;
    graph.edges.forEach((edge, key) => {
      if (edge.target.id === node.id) {
        sumWidth += edgeWidthes[key];
      }
    });

    if (
      i > 0 &&
      graph.nodes[i - 1].layer > 0 &&
      node.layer !== graph.nodes[i - 1].layer
    ) {
      midNodeWidths.push(midNodeElement);
      midNodeElement = [];
    }

    midNodeElement.push(sumWidth);
  }
  midNodeWidths.push(midNodeElement);
  midNodeWidths = [[], ...midNodeWidths, []];
  console.log(midNodeWidths);

  const linkGenerator = d3.linkVertical();
  const pdd = new Array(graph.nodes.length).fill(0);
  const pdf = new Array(graph.nodes.length).fill(0);

  const edgePaths = graph.edges.map((d, key) => {
    let padSrc = 0;
    let padTar = 0;

    // here
    if (d.source.layer !== 0) {
      padSrc =
        -midNodeWidths[d.source.layer][d.source.label] / 2 +
        edgeWidthes[key] / 2 +
        pdf[d.source.id];
      pdf[d.source.id] += edgeWidthes[key];
    }

    if (d.target.layer !== lastLayer) {
      padTar =
        -midNodeWidths[d.target.layer][d.target.label] / 2 +
        edgeWidthes[key] / 2 +
        pdd[d.target.id];
      pdd[d.target.id] += edgeWidthes[key];
    }

    return linkGenerator({
      source: [d.source.x + padSrc, d.source.y],
      target: [d.target.x + padTar, d.target.y],
    });
  });

  // パラメター、交差数、エッジ数、中間ノード数、誤差数のログ
  console.log("param", param);
  console.log("cross", cross);
  console.log("edge number", totalEdgeCount);
  console.log("mid node", midNodesCount);
  console.log("missing", missingEdges);
  console.log("graph data", graph);
  console.log("color", cf.bipartitesForColor);

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
