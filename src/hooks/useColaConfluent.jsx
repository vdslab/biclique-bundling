import { useEffect, useState } from "react";
import colaConfluent from "../logic/colaConfluent";
import { getBipartiteDensity } from "./../utils/getBipartiteDensity";
/*
 confluent drawingに対しての準バイクリークが妥当がどうか
 depth = 1は普通の準バイクリークによるエッジバンドリングである。
 depth = 1 と depth >= 2のdrawing結果で比較する→ depth > 2でdepth=1と上下ノードが同じようにリンクしているならばアルゴリズムは妥当

*/
const useColaConfluent = (param, url, maxDepth, fontSize) => {
  const [paths, setPaths] = useState([]);
  const [crossCount, setCrossCount] = useState(0);
  const [nodes, setNodes] = useState([]);
  const [nodeLabels, setNodeLabels] = useState();

  useEffect(() => {
    (async () => {
      const res = await fetch(url);
      const bipartite = await res.json();

      const parameter =
        param < 0 || param > 1.0
          ? (1.0 + getBipartiteDensity(bipartite)) / 2
          : param;

      const {
        cross,
        leftNodesOrder,
        midNodesOrders,
        rightNodesOrder,
        edgePaths,
        graph,
        edgeWidths,
      } = colaConfluent(bipartite, parameter, maxDepth, true);

      setCrossCount(cross);
      const nodeNumbers = [
        ...leftNodesOrder,
        ...midNodesOrders,
        ...rightNodesOrder,
      ].flat();

      // granph.nodesの座標を調整する
      setNodes(
        graph.nodes.map((node, key) => {
          // 上ノード
          const digitNum = String(node.label).length;
          if (key < leftNodesOrder.length) {
            node.x -= fontSize / (4 / digitNum);
            node.y -= fontSize / 3;
          }

          // 下ノード
          if (key > nodeNumbers.length - rightNodesOrder.length - 1) {
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
            key >= leftNodesOrder.length &&
            key <= nodeNumbers.length - rightNodesOrder.length - 1
          ) {
            return { label: nodeNumber, isShow: false };
          }
          return { label: nodeNumber, isShow: true };
        })
      );
    })();
  }, [param, url, maxDepth, fontSize]);

  return {
    paths,
    nodes,
    nodeLabels,
    crossCount,
  };
};

export default useColaConfluent;
