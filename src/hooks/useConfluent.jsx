import { useEffect, useState } from "react";
import getMuQuasiBiclique from "../utils/getMuQuasiBiclique";
import * as d3 from "d3";
import { objectOnePropertytoProgression } from "../utils/calc";
import { getConfluentCross } from "../utils/getBipartiteCross";
/*
  アルゴリズム
  1. maximal バイクリークを行う
  2. 左右中間ノードの順序を初期化する
  3. OLCMで左右中間ノードの順序を最適化する => ノードの順番が決まる
  4. 1-3でやったことを再帰的に行う
  5. 最後に中間ノードのy座標を決定する

  ## 再帰の後にノード順序の最適化を行う方法がある
  */

/*
  TODO:
   - サイズ1のバイクリークを含める o
   - エッジの並び替え(OLCM, MLCM)
   - 中間ノードの位置調整
   - mu-quasi-バイクリークを選択するアルゴリズムが正しいか検証 ほぼo（後はテストのみ）
   - バイクリークを選択するアルゴリズムを別のに試してみる
   - 別のデータで試してみる (ランダムデータの可視化) o
   - サイズ2以上のバイクリークを強調表示する
  todo:
  - layeredNodes.maximalNodesとbipartiteを中間ノード同士に対応させるようにする o
  */

const layeredNodes = new Array();
const bipartites = new Array();

const buildConfluent = (mu, bipartite, idx, step, depth) => {
  depth = idx >= 0 ? Math.abs(depth) : -1 * Math.abs(depth);
  let maximalNodes;
  if (depth <= 0) {
    maximalNodes = getMuQuasiBiclique(mu, bipartite, true);
  } else {
    maximalNodes = getMuQuasiBiclique(mu, bipartite, false);
  }

  //最初のバイクリーク0は見逃す
  if ((maximalNodes.length === 0 && step < 1) || Math.abs(depth) > 2) {
    console.error(idx, depth, bipartite);
    bipartites.push({ h: idx, depth, bipartite, maximalNodes, step });
    return;
  }

  const leftNodeNumber = bipartite.length;
  const rightNodeNumber = bipartite[0].length;

  const oneSizeBicluster = new Array();
  for (let leftIdx = 0; leftIdx < leftNodeNumber; leftIdx++) {
    for (let rightIdx = 0; rightIdx < rightNodeNumber; rightIdx++) {
      if (!bipartite[leftIdx][rightIdx]) continue;
      if (allIsIn(maximalNodes, leftIdx, rightIdx)) continue;
      oneSizeBicluster.push({ left: [leftIdx], right: [rightIdx] });
    }
  }
  maximalNodes.push(...oneSizeBicluster);

  // グローバル変数に格納
  layeredNodes.push({ h: idx, maximalNodes });

  const midNodeNumber = maximalNodes.length;

  //左右の二部グラフの初期化
  const leftBipartite = new Array(leftNodeNumber);
  const rightBipartite = new Array(midNodeNumber);

  for (let i = 0; i < leftBipartite.length; i++) {
    const leftBipartiteElement = new Array(midNodeNumber).fill(0);
    for (let j = 0; j < midNodeNumber; j++) {
      if (maximalNodes[j].left.includes(i)) leftBipartiteElement[j] = 1;
    }
    leftBipartite[i] = leftBipartiteElement;
  }

  for (let i = 0; i < rightBipartite.length; i++) {
    const rightBipartiteElement = new Array(rightNodeNumber).fill(0);
    for (let j = 0; j < rightNodeNumber; j++) {
      if (maximalNodes[i].right.includes(j)) rightBipartiteElement[j] = 1;
    }
    rightBipartite[i] = rightBipartiteElement;
  }

  console.error("leftBipartite", leftBipartite);
  console.error("rightBipartite", rightBipartite);
  console.error("maximal node", maximalNodes);
  // グローバル関数に格納する

  step = step / 2;

  buildConfluent(mu, rightBipartite, idx + step, step, Math.abs(depth) + 1);
  buildConfluent(mu, leftBipartite, idx - step, step, Math.abs(depth) + 1);
};

const linkGenerator = d3.linkHorizontal();
const useConfluent = (mu, url) => {
  const [paths, setPaths] = useState([]);
  const [leftNodes, setLeftNodes] = useState([]);
  const [rightNodes, setRightNodes] = useState([]);
  const [midNodes, setMidNodes] = useState([]);
  const [leftNodesOrder, setLeftNodesOrder] = useState([]);
  const [rightNodesOrder, setRightNodesOrder] = useState([]);
  const [midNodesOrders, setMidNodesOrders] = useState();
  const [crossCount, setCrossCount] = useState(0);

  useEffect(() => {
    (async () => {
      const res = await fetch(url);
      const bipartite = await res.json();

      buildConfluent(mu, bipartite, 0, 1, 0);
      // ここでmaximalNodesを再構築する
      bipartites.sort((a, b) => {
        return a.depth - b.depth;
      });

      layeredNodes.sort((a, b) => {
        return a.h - b.h;
      });

      console.error("bipartites", bipartites);
      console.error("layeredNodes", layeredNodes);
      console.error("layeredNodes.length", layeredNodes.length);

      //後からサイズ1のバイクリークを追加する
      //const maximalNodes = getMuQuasiBiclique(mu, bipartite);

      console.error(bipartites);

      bipartites.sort((a, b) => {
        return a.h - b.h;
      });
      console.error(bipartites);

      const leftNodeNumber = bipartite.length;
      const rightNodeNumber = bipartite[0].length;
      const midLayerNumber = layeredNodes.length;

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
        for (let j = 0; j < layeredNodes[i].maximalNodes.length; j++) {
          midNodesOrder.push(j);
        }
        midNodesOrders.push(midNodesOrder);
      }

      console.log("midNodesOrders", midNodesOrders);
      let count = 1e12;

      //左から右
      let fromLeft = true;
      while (true) {
        if (fromLeft) {
          for (let k = 0; k < bipartites.length; k++) {
            const bipartite = bipartites[k].bipartite;

            const leftSideNodesNumber = bipartite.length;
            const rightSideNodesNumber = bipartite[0].length;

            const sum = new Array();
            for (let i = 0; i < rightSideNodesNumber; i++) {
              let degree = 0;
              let ouh = 0;
              for (let j = 0; j < leftSideNodesNumber; j++) {
                if (!bipartite[j][i]) continue;
                degree++;

                if (k !== 0) {
                  ouh += midNodesOrders[k - 1].indexOf(j);
                } else {
                  ouh += leftNodesOrder.indexOf(j);
                }
              }
              sum.push(ouh / degree);
            }

            if (k !== bipartites.length - 1) {
              midNodesOrders[k].sort((a, b) => {
                return sum[a] - sum[b];
              });
            } else {
              rightNodesOrder.sort((a, b) => {
                return sum[a] - sum[b];
              });
            }
          }
        } else {
          for (let k = bipartites.length-1; k >= 0; k--) {
            const bipartite = bipartites[k].bipartite;

            const leftSideNodesNumber = bipartite.length;
            const rightSideNodesNumber = bipartite[0].length;

            const sum = new Array();
            for (let i = 0; i < leftSideNodesNumber; i++) {
              let degree = 0;
              let ouh = 0;
              for (let j = 0; j < rightSideNodesNumber; j++) {
                if (!bipartite[i][j]) continue;
                degree++;

                if (k !== bipartites.length-1) {
                  ouh += midNodesOrders[k].indexOf(j);
                } else {
                  ouh += rightNodesOrder.indexOf(j);
                }
              }
              sum.push(ouh / degree);
            }

            console.error
            if (k !== 0) {
              midNodesOrders[k - 1].sort((a, b) => {
                return sum[a] - sum[b];
              });
            } else {
              leftNodesOrder.sort((a, b) => {
                return sum[a] - sum[b];
              });
            }
          }
        }

        fromLeft = !fromLeft;
        const newCount = getConfluentCross(
          bipartites,
          leftNodesOrder,
          rightNodesOrder,
          midNodesOrders
        );
        if (count <= newCount) {
          setCrossCount(count);
          break;
        }

        count = newCount;
        console.log(count)
      }

      count = getConfluentCross(
        bipartites,
        leftNodesOrder,
        rightNodesOrder,
        midNodesOrders
      );

      console.log("leftNodesOrders", leftNodesOrder);
      console.log("midNodesOrders", midNodesOrders);
      console.log("rightNodesOrders", rightNodesOrder);


      setLeftNodesOrder(leftNodesOrder);
      setRightNodesOrder(rightNodesOrder);

      /*
      成果物
      (再帰用の引数)
      leftBipartite
      rightBipartite

      (座標決定に使う)
      maximalNodes
      leftNodesOrder
      rightNodesOrder
      midNodesOrder
      */

      // 座標決定process
      const leftX = 50;
      const leftY = 10;

      const rightX = 1250;
      const rightY = 10;

      const midX = (leftX + rightX) / 2;
      const midXs = new Array(layeredNodes.length);

      layeredNodes.forEach((obj, index) => {
        midXs[index] = midX + Math.abs(rightX - leftX) * (obj.h / 2);
      });

      midXs.sort((a, b) => {
        return a - b;
      });

      console.error(midXs, layeredNodes);

      console.error(midXs, layeredNodes);
      const step = 60;
      const lefts = objectOnePropertytoProgression(
        leftNodeNumber,
        step,
        leftX,
        leftY
      );

      //右ノードを座標を決める
      const rights = objectOnePropertytoProgression(
        rightNodeNumber,
        step,
        rightX,
        rightY
      );

      const midsList = new Array(midXs.length);
      for (let i = 0; i < midsList.length; i++) {
        midsList[i] = objectOnePropertytoProgression(
          layeredNodes[i].maximalNodes.length,
          step / 4,
          midXs[i],
          rightY * 15
        );
      }

      console.error("midsList", midsList);
      console.error(" layeredNodes", layeredNodes);
      console.error("bipartites", bipartites);
      setLeftNodes(lefts);
      setRightNodes(rights);

      const midNodesCopy = new Array();
      const outputPaths = new Array();
      for (let k = 0; k < midsList.length; k++) {
        for (let i = 0; i < layeredNodes[k].maximalNodes.length; i++) {
          midNodesCopy.push({
            x: midsList[k][i].x,
            y: midsList[k][i].y,
          });
        }
      }

      for (let k = 0; k < bipartites.length; k++) {
        const bipartite = bipartites[k].bipartite;

        for (let i = 0; i < bipartite.length; i++) {
          for (let j = 0; j < bipartite[i].length; j++) {
            if (!bipartite[i][j]) continue;

            const path = new Object();
            if (k === 0) {
              const leftIdx = leftNodesOrder.indexOf(i);
              const midjdx = midNodesOrders[k].indexOf(j);
              path["source"] = [lefts[leftIdx].x, lefts[leftIdx].y];
              path["target"] = [midsList[k][midjdx].x, midsList[k][midjdx].y];
            } else if (k === bipartites.length - 1) {
              const rightIdx = rightNodesOrder.indexOf(j);
              const midIdx = midNodesOrders[k - 1].indexOf(i);
              path["source"] = [
                midsList[k - 1][midIdx].x,
                midsList[k - 1][midIdx].y,
              ];
              path["target"] = [rights[rightIdx].x, rights[rightIdx].y];
            } else {
              const midJdx = midNodesOrders[k].indexOf(j);
              const midIdx = midNodesOrders[k - 1].indexOf(i);
              path["source"] = [
                midsList[k - 1][midIdx].x,
                midsList[k - 1][midIdx].y,
              ];
              path["target"] = [midsList[k][midJdx].x, midsList[k][midJdx].y];
            }

            if (Object.keys(path).length) {
              outputPaths.push(path);
            }
          }
        }
      }

      console.error(outputPaths);
      console.error(midNodesCopy);

      setMidNodes(midNodesCopy);
      setPaths(
        outputPaths.map((d) => {
          return linkGenerator(d);
        })
      );
      console.error(midNodesOrders);
      console.error(midNodesOrders.flat());
      setMidNodesOrders(midNodesOrders.flat());
    })();
  }, [mu, url]);

  return {
    paths,
    leftNodes,
    rightNodes,
    midNodes,
    leftNodesOrder,
    rightNodesOrder,
    midNodesOrders,
    crossCount,
  };
};

const allIsIn = (maximalBiclusterNodes, left, right) => {
  for (const bicluster of maximalBiclusterNodes) {
    const leftNodeSet = new Set(bicluster.left);
    const rightNodeSet = new Set(bicluster.right);

    if (leftNodeSet.has(left) && rightNodeSet.has(right)) {
      return true;
    }
  }

  return false;
};
export default useConfluent;
