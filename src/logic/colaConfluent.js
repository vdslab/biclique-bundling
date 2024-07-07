import * as d3 from "d3";
import * as cola from "webcola";
import Confluent from "./../utils/confluent.js";
import { getQuasiBicliqueCover } from "./../utils/getBicliqueCover.js";
import { makeGraphForCola } from "./../utils/makeGraphForCola.js";
import getEdgeWidths from "./../utils/getEdgeWidths";
import { getColaBipartiteCross } from "./../utils/getBipartiteCross.js";
import getEdgeEndPos from "./../utils/getEdgeEndPos.js";
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
  // バイクリークカバーの計算
  const lastLayer = 2 ** maxDepth;
  const cf = new Confluent(getQuasiBicliqueCover, param, maxDepth);
  cf.build(bipartite);

  const layerGap = 250;
  const { edgeWidths, midNodeWidths } = getEdgeWidths(
    cf.bipartitesForMiss,
    cf.bipartitesAll
  );

  console.error(midNodeWidths);
  console.error(cf);

  // 座標決定process
  const width = 2000;
  const height = 1500;
  const d3cola = cola.d3adaptor(d3).linkDistance(300).size([width, height]);

  // stress最小化
  const graph = makeGraphForCola(cf, layerGap);
  setColaConstraint(d3cola, graph, midNodeWidths, lastLayer);
  // setCrossConstraint(bipartite, cf.bipartites, cf.layeredNodes, graph, midNodeWidths);

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
  const lineGenerator = d3.line();
  const linkGenerator = d3.linkVertical();
  let edgePaths = [];
  if (maxDepth > 0) {
    const { edgeAt, edgeR, edgeL } = getEdgeEndPos(
      graph,
      edgeWidths,
      midNodeWidths
    );
    edgePaths = edgeAt.map((edge, key) => {
      const d =
        linkGenerator(edgeL[key]) +
        " " +
        trimPathM(
          lineGenerator([
            [edgeL[key]["target"][0], edgeL[key]["target"][1]],
            [edgeR[key]["target"][0], edgeR[key]["target"][1]],
          ])
        ) +
        " " +
        trimPathM(
          linkGenerator({
            source: edgeR[key]["target"],
            target: edgeR[key]["source"],
          })
        ) +
        " z";
      return {
        widthd: linkGenerator(edge),
        d,
      };
    });
  } else {
    edgePaths = graph.edges.map((edge) => {
      return {
        d: lineGenerator([
          [edge.source.x, edge.source.y],
          [edge.target.x, edge.target.y],
        ]),
      };
    });
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
    edgePaths,
    graph: structuredClone(graph),
    cross,
    totalEdgeCount,
    midNodesCount,
    edgeWidths,
  };
};

const trimPathM = (path) => {
  for (let i = 1; i < path.length; i++) {
    if (path[i].match(/[A-Z]/)) {
      return path.substring(i);
    }
  }
  return path;
};

export default colaConfluent;
