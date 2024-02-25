import { getQuasiBicliqueCover } from "./../utils/getBicliqueCover.js";
import * as d3 from "d3";
import * as cola from "webcola";
import Confluent from "./../utils/confluent.js";
import getMissingEdgeColors from "./../utils/getMissingEdgeColors.js";
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
  // console.error(cf.bipartitesForColor);
  const cbipartites = cf.bipartitesForColor
    .filter((item) => {
      return Math.abs(item.depth) === maxDepth - 1;
    })
    .sort((a, b) => a.h - b.h);
  // エッジの色付け
  const { edgeColors, missingEdges } = getMissingEdgeColors(
    graph,
    cbipartites,
    bipartite,
    maxDepth,
    hasEdgeColor
  );

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

  // パラメター、交差数、エッジ数、中間ノード数、誤差数
  console.log(param, cross, totalEdgeCount, midNodesCount, missingEdges);

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

export default colaConfluent;
