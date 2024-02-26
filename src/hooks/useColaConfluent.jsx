import { useEffect, useState } from "react";
import colaConfluent from "../logic/colaConfluent";

/*
 confluent drawingに対しての準バイクリークが妥当がどうか
 depth = 1は普通の準バイクリークによるエッジバンドリングである。
 depth = 1 と depth >= 2のdrawing結果で比較する→ depth > 2でdepth=1と上下ノードが同じようにリンクしているならばアルゴリズムは妥当

*/
const useColaConfluent = (param, url, maxDepth) => {
  const [paths, setPaths] = useState([]);
  const [crossCount, setCrossCount] = useState(0);
  const [midNodes, setMidNodes] = useState([]);
  const [midNodesOrders, setMidNodesOrders] = useState();

  useEffect(() => {
    (async () => {
      const res = await fetch(url);
      const bipartite = await res.json();

      const {
        cross,
        leftNodesOrder,
        midNodesOrders,
        rightNodesOrder,
        edgePaths,
        graph,
        edgeColors,
      } = colaConfluent(bipartite, param, maxDepth, true);

      setCrossCount(cross);
      setMidNodes(graph.nodes);
      setPaths(
        edgePaths.map((path, key) => {
          if (key < edgeColors.length) {
            return { path, color: edgeColors[key] };
          } else {
            return { path, color: "silver" };
          }
        })
      );
      setMidNodesOrders(
        [leftNodesOrder, midNodesOrders.flat(), rightNodesOrder].flat()
      );
    })();
  }, [param, url, maxDepth]);

  return {
    paths,
    midNodes,
    midNodesOrders,
    crossCount,
  };
};

export default useColaConfluent;
