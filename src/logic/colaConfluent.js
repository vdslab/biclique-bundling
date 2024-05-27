import * as d3 from "d3";
import * as cola from "webcola";
import Confluent from "./../utils/confluent.js";
import { getQuasiBicliqueCover } from "./../utils/getBicliqueCover.js";
import { makeGraphForCola } from "./../utils/makeGraphForCola.js";
import getEdgeWidths from "./../utils/getEdgeWidths";
import { getColaBipartiteCross } from "./../utils/getBipartiteCross.js";
import getEdgeEndPos from "./../utils/getEdgeEndPos.js";

const colaConfluent = (
  bipartite,
  param,
  maxDepth,
  nodeRadius,
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

  const leftNodeNumber = bipartite.length;
  const rightNodeNumber = bipartite[0].length;
  const midLayerNumber = cf.layeredNodes.length;
  // 左右中間ノードの順序を初期化
  // ノードのラベル
  // 現状はインデックスがラベル

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
    テスト箇所1
  */

  /*
    テスト項目2
  */
  // ノードの数によって増やす
  const layerGap = 200;
  const graph = makeGraphForCola(cf, layerGap);
  const { edgeWidths, midNodeWidths } = getEdgeWidths(
    graph,
    cf.bipartitesForMiss,
    cf.bipartitesAll,
    lastLayer
  );

  console.error(cf);

  // 座標決定process
  const width = 2000;
  const height = 1500;
  const d3cola = cola.d3adaptor(d3).linkDistance(300).size([width, height]);

  // stress最小化
  d3cola
    .nodes(graph.nodes)
    .links(graph.edges)
    .constraints(graph.constraints)
    .symmetricDiffLinkLengths(40) // ノードの数によって増やす
    .start(30, 40, 50);

  // 制約の再追加
  const sortedNodes = structuredClone(graph.nodes).sort((a, b) => {
    return a.x - b.x;
  });

  const insertedNodes = [];
  for (let i = 0; i < lastLayer + 1; i++) {
    insertedNodes.push([]);
  }

  for (const node of sortedNodes) {
    insertedNodes[node.layer].push(node);
  }

  for (const nodes of insertedNodes) {
    for (let i = 0; i < nodes.length - 1; i++) {
      const gap =
        (nodes[i].layer !== 0 && nodes[i].layer !== lastLayer) ||
        (nodes[i + 1].layer !== 0 && nodes[i + 1].layer !== lastLayer)
          ? Math.max(
              (midNodeWidths[nodes[i].layer][nodes[i].label] +
                midNodeWidths[nodes[i + 1].layer][nodes[i + 1].label]) **
                1.1,
              nodeRadius * 4
            )
          : nodeRadius * 4;
      graph.constraints.push({
        left: nodes[i].id,
        right: nodes[i + 1].id,
        gap,
        axis: "x",
      });
    }
  }

  d3cola
    .nodes(graph.nodes)
    .links(graph.edges)
    .constraints(graph.constraints)
    .symmetricDiffLinkLengths(40)
    .start(30, 40, 50);

  // エッジ交差数
  const cross = getColaBipartiteCross(cf.bipartites, graph.nodes);

  // 中間ノード数
  const midNodesCount = cf.midNodesCount;

  // エッジ数
  const totalEdgeCount = graph.edges.length;

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
  console.log("graph data", graph);
  console.log("color", cf.bipartitesForColor);
  console.log(edgePaths);

  return {
    leftNodesOrder,
    midNodesOrders,
    rightNodesOrder,
    edgePaths,
    graph,
    cross,
    totalEdgeCount,
    midNodesCount,
    edgeWidths,
  };
};

export default colaConfluent;
