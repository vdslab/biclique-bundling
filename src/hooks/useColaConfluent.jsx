import { useEffect, useState, useRef } from "react";
import colaConfluent from "../logic/colaConfluent";
import { getBipartiteDensity } from "./../utils/getBipartiteDensity";
import { getEdgePaths, getNodeLinkPath } from "./../utils/getEdgePaths.js";
/*
 confluent drawingに対しての準バイクリークが妥当がどうか
 depth = 1は普通の準バイクリークによるエッジバンドリングである。
 depth = 1 と depth >= 2のdrawing結果で比較する→ depth > 2でdepth=1と上下ノードが同じようにリンクしているならばアルゴリズムは妥当

*/
const useColaConfluent = (param, url, maxDepth, fontSize, isFCLD) => {
  const [paths, setPaths] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [nodeLabels, setNodeLabels] = useState([]);
  const weightedCrossCount = useRef(0);
  const crossCount = useRef(0);

  useEffect(() => {
    (async () => {
      const res = await fetch(url);
      const bipartite = await res.json();

      const dense = getBipartiteDensity(bipartite);

      const parameter = param < 0 || param > 1.0 ? (1.0 + dense) / 2 : param;

      console.log("densf",parameter, dense);

      const { cross, weightedCross, midNodeWidths, graph, edgeWidths } =
        colaConfluent(bipartite, parameter, maxDepth, isFCLD);

      const edgePaths = isFCLD
        ? getEdgePaths(graph, edgeWidths, midNodeWidths, maxDepth)
        : getNodeLinkPath(graph, maxDepth);

      console.log(edgePaths);

      weightedCrossCount.current = weightedCross;
      crossCount.current = cross;

      const leftNodeIds = new Array();
      const rightNodeIds = new Array();
      const midNodeIds = new Array();

      for (let i = 0; i < bipartite.length; i++) {
        leftNodeIds.push(i);
      }

      for (let i = 0; i < bipartite[0].length; i++) {
        rightNodeIds.push(i);
      }

      for (let i = 0; i < graph.nodes.length; i++) {
        if (
          graph.nodes[i].layer === 0 ||
          graph.nodes[i].layer === 2 ** maxDepth
        )
          continue;
        midNodeIds.push(graph.nodes[i].label);
      }

      const nodeNumbers = [...leftNodeIds, ...midNodeIds, ...rightNodeIds];

      // granph.nodesの座標を調整する
      setNodes(
        graph.nodes.map((node, key) => {
          // 上ノード
          const digitNum = String(node.label).length;
          if (key < leftNodeIds.length) {
            node.x -= fontSize / (4 / digitNum);
            node.y -= fontSize / 3;
          }

          // 下ノード
          if (key > nodeNumbers.length - rightNodeIds.length - 1) {
            node.x -= fontSize / (4 / digitNum);
            node.y += fontSize / 1;
          }

          return node;
        })
      );
      setPaths(
        edgePaths.map((path, key) => {
          return { path, width: edgeWidths[key] };
        })
      );

      setNodeLabels(
        nodeNumbers.map((nodeNumber, key) => {
          if (
            key >= leftNodeIds.length &&
            key <= nodeNumbers.length - rightNodeIds.length - 1
          ) {
            return { label: nodeNumber, isShow: false };
          }
          return { label: nodeNumber, isShow: true };
        })
      );
    })();
  }, [param, url, maxDepth, fontSize, isFCLD]);

  return {
    paths,
    nodes,
    nodeLabels,
    crossCount: crossCount.current,
    weightedCrossCount: weightedCrossCount.current,
  };
};

export default useColaConfluent;
