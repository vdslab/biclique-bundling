import * as d3 from "d3";
import * as cola from "webcola";
import Confluent from "./../utils/confluent.js";
import { getQuasiBicliqueCover } from "./../utils/getBicliqueCover.js";
import { makeGraphForCola } from "./../utils/makeGraphForCola.js";
import getEdgeWidths from "./../utils/getEdgeWidths";
import { getColaBipartiteCross } from "./../utils/getBipartiteCross.js";
import getEdgePaths from "./../utils/getEdgePaths.js";
import {
  setColaConstraint,
  setCrossConstraint,
} from "./../utils/constraints.js";

const colaConfluent = (
  bipartite,
  param,
  maxDepth,
  hasEdgeColor = false,
  outputForExp = false
) => {
  const lastLayer = 2 ** maxDepth;
  const cf = new Confluent(getQuasiBicliqueCover, param, maxDepth);
  cf.build(bipartite);

  const { edgeWidths, midNodeWidths } = getEdgeWidths(
    cf.bipartitesForMiss,
    cf.bipartitesAll
  );

  console.error(edgeWidths, midNodeWidths);
  console.error(cf);

  // 座標決定process
  const width = 2750;
  const height = 1500;
  const d3cola = cola.d3adaptor(d3).linkDistance(300).size([width, height]);

  // stress最小化
  const layerGap = 150;
  const graph = makeGraphForCola(cf, layerGap);
  // setColaConstraint(d3cola, graph, midNodeWidths, lastLayer);
  // 重み付きエッジ交差数
  const weightedCross = setCrossConstraint(
    bipartite,
    cf.bipartites,
    cf.layeredNodes,
    graph,
    midNodeWidths,
    edgeWidths,
    d3cola,
    lastLayer
  );

  d3cola
    .nodes(graph.nodes)
    .links(graph.edges)
    .constraints(graph.constraints)
    .symmetricDiffLinkLengths(40)
    .start(30, 40, 50);

  console.error(graph);

  // エッジ交差数
  const cross = getColaBipartiteCross(cf.bipartites, graph.nodes);

  // 中間ノード数
  const midNodesCount = cf.midNodesCount;

  // エッジ数
  const totalEdgeCount = graph.edges.length;

  // 損失数
  // missingEdges;
  const edgePaths = getEdgePaths(graph, edgeWidths, midNodeWidths, maxDepth);

  // パラメター、交差数、エッジ数、中間ノード数、誤差数のログ
  console.log("param", param);
  console.log("cross", cross);
  console.log("edge number", totalEdgeCount);
  console.log("mid node", midNodesCount);
  console.log("graph data", graph);
  console.log("color", cf.bipartitesForColor);
  console.log(edgePaths);

  return {
    edgePaths,
    graph: structuredClone(graph),
    cross,
    weightedCross,
    totalEdgeCount,
    midNodesCount,
    edgeWidths,
  };
};

export default colaConfluent;
