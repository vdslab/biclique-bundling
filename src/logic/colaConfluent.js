import * as d3 from "d3";
import * as cola from "webcola";
import Confluent from "./../utils/confluent.js";
import { getQuasiBicliqueCover } from "./../utils/getBicliqueCover.js";
import { makeGraphForCola } from "./../utils/makeGraphForCola.js";
import getEdgeWidths from "./../utils/getEdgeWidths.js";
import { getColaBipartiteCross } from "./../utils/getBipartiteCross.js";
import { setCrossConstraint } from "./../utils/constraints.js";
import { getMissConnectionCount } from "./../utils/getMissingEdgeColors.js";

const colaConfluent = (bipartite, param, maxDepth, isBaryWeighted) => {
  const lastLayer = 2 ** maxDepth;
  const cf = new Confluent(getQuasiBicliqueCover, param, maxDepth);
  cf.build(bipartite);

  const { edgeWidths, midNodeWidths } = getEdgeWidths(
    cf.bipartitesForMiss,
    cf.bipartitesAll
  );

  // .error(edgeWidths, midNodeWidths);
  // .error(cf);

  const width = 2650;
  const height = 2000;
  const d3cola = cola.d3adaptor(d3).linkDistance(300).size([width, height]);
  const layerGap = maxDepth > 0 ? 250 : 500;
  const graph = makeGraphForCola(cf, layerGap);

  // 重み付きエッジ交差数
  // const weightedCross = setColaConstraint(d3cola, graph, midNodeWidths, lastLayer);
  const weightedCross = setCrossConstraint(
    bipartite,
    cf.bipartites,
    cf.layeredNodes,
    graph,
    midNodeWidths,
    edgeWidths,
    lastLayer,
    isBaryWeighted,
    d3cola,
    maxDepth
  );

  // stress最小化
  d3cola
    .nodes(graph.nodes)
    .links(graph.edges)
    .constraints(graph.constraints)
    .symmetricDiffLinkLengths(50)
    .start(30, 40, 50);

  // console.error("here", graph, edgeWidths);
  // console.error(edgeWidths)

  // エッジ交差数
  const cross = getColaBipartiteCross(cf.bipartites, graph.nodes);

  // 中間ノード数
  const midNodesCount = cf.midNodesCount;

  // エッジ数
  const totalEdgeCount = graph.edges.length;

  // 損失数
  const { missConnectCount, missConnectRatio } = getMissConnectionCount(
    bipartite,
    cf.bipartitesForMissConnect
  );

  // パラメター、交差数、エッジ数、中間ノード数、誤差数のログ
  console.log("param", param);
  console.log("cross", cross);
  console.log("weighted cross", weightedCross);
  console.log("edge number", totalEdgeCount);
  console.log("mid node", midNodesCount);
  // console.log("graph data", graph);
  // console.log("color", cf.bipartitesForColor);
  // console.log(edgePaths);

  // console.log("missssssssssssssssssssssssssss", missConnectCount);
  // console.log(cf.bipartitesAll, cf.bipartitesForMissConnect);

  return {
    graph: structuredClone(graph),
    cross,
    weightedCross,
    totalEdgeCount,
    midNodesCount,
    edgeWidths,
    midNodeWidths,
    missConnectCount,
    missConnectRatio,
  };
};

export default colaConfluent;
