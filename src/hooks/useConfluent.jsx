import { useEffect, useState } from "react";
import getMuQuasiBiclique from "../utils/getMuQuasiBiclique";
import * as d3 from "d3";
import { objectOnePropertytoProgression } from "../utils/calc";
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
   - バイクリークを選択するアルゴリズムが正しいか検証(または変えてみる)
   - 別のデータで試してみる (ランダムデータの可視化) o

  todo:
  - layeredNodes.maximalNodesとbipartiteを中間ノード同士に対応させるようにする o
  */

const layeredNodes = new Array();
const bipartites = new Array();

const buildConfluent = (mu, bipartite, idx, step, depth) => {
  const maximalNodes = getMuQuasiBiclique(mu, bipartite);
  depth = idx >= 0 ? Math.abs(depth) : -1 * Math.abs(depth);

  //最初のバイクリーク0は見逃す
  if ((maximalNodes.length === 0 && step < 1) || Math.abs(depth) >= 4) {
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

  // グローバル関数に格納する

  step = step / 2;
  buildConfluent(mu, leftBipartite, idx - step, step, Math.abs(depth) + 1);
  buildConfluent(mu, rightBipartite, idx + step, step, Math.abs(depth) + 1);
};

const linkGenerator = d3.linkHorizontal();
const useConfluent = (mu, url) => {
  const [paths, setPaths] = useState([]);
  const [leftNodes, setLeftNodes] = useState([]);
  const [rightNodes, setRightNodes] = useState([]);
  const [midNodes, setMidNodes] = useState([]);
  const [leftNodesOrder, setLeftNodesOrder] = useState([]);
  const [rightNodesOrder, setRightNodesOrder] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await fetch(url);
      const bipartite = await res.json();

      buildConfluent(mu, bipartite, 0, 1, 0);
      bipartites.sort((a, b) => {
        return a.depth - b.depth;
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
      // const midNodeNumber = maximalNodes.length;

      // //左右中間ノードの順序を初期化
      // const leftNodesOrder = new Array();
      // const rightNodesOrder = new Array();
      // const midNodesOrder = new Array();

      // for (let i = 0; i < leftNodeNumber; i++) {
      //   leftNodesOrder.push(i);
      // }

      // for (let i = 0; i < rightNodeNumber; i++) {
      //   rightNodesOrder.push(i);
      // }

      // for (let i = 0; i < maximalNodes.length; i++) {
      //   midNodesOrder.push(i);
      // }

      // const leftBipartite = new Array(leftNodeNumber);
      // const rightBipartite = new Array(midNodeNumber);
      // console.error(midNodeNumber);

      // for (let i = 0; i < leftBipartite.length; i++) {
      //   const leftBipartiteElement = new Array(midNodeNumber).fill(0);
      //   for (let j = 0; j < midNodeNumber; j++) {
      //     if (maximalNodes[j].left.includes(i)) leftBipartiteElement[j] = 1;
      //   }
      //   leftBipartite[i] = leftBipartiteElement;
      // }

      // for (let i = 0; i < rightBipartite.length; i++) {
      //   const rightBipartiteElement = new Array(rightNodeNumber).fill(0);
      //   for (let j = 0; j < rightNodeNumber; j++) {
      //     if (maximalNodes[i].right.includes(j)) rightBipartiteElement[j] = 1;
      //   }
      //   rightBipartite[i] = rightBipartiteElement;
      // }

      // // 左中ノードを重心法でソート
      // const sumLeftMid = new Array();
      // console.error(leftBipartite);
      // for (let i = 0; i < midNodeNumber; i++) {
      //   let degree = 0;
      //   let ouh = 0;
      //   for (let j = 0; j < leftNodeNumber; j++) {
      //     if (!leftBipartite[j][i]) continue;
      //     degree++;
      //     ouh += leftNodesOrder.indexOf(j);
      //   }
      //   sumLeftMid.push(ouh / degree);
      // }
      // //   midNodesOrder.sort((a, b) => {
      // //     return sumLeftMid[a] - sumLeftMid[b];
      // //   });

      // console.error(midNodesOrder, sumLeftMid);

      // //中右ノードを重心法でソート
      // const sumMidRight = new Array();
      // for (let i = 0; i < rightNodeNumber; i++) {
      //   let degree = 0;
      //   let ouh = 0;
      //   for (let j = 0; j < midNodeNumber; j++) {
      //     if (!rightBipartite[j][i]) continue;
      //     degree++;
      //     ouh += midNodesOrder.indexOf(j);
      //   }
      //   sumMidRight.push(ouh / degree);
      // }
      // //   rightNodesOrder.sort((a, b) => {
      // //     return sumMidRight[a] - sumMidRight[b];
      // //   });

      // //中左ノードを重心法でソート
      // const sumMidLeft = new Array();
      // for (let i = 0; i < leftNodeNumber; i++) {
      //   let degree = 0;
      //   let ouh = 0;
      //   for (let j = 0; j < midNodeNumber; j++) {
      //     if (!leftBipartite[i][j]) continue;
      //     degree++;
      //     ouh += midNodesOrder.indexOf(j);
      //   }
      //   sumMidLeft.push(ouh / degree);
      // }
      // //   leftNodesOrder.sort((a, b) => {
      // //     return sumMidLeft[a] - sumMidLeft[b];
      // //   });

      // console.error(leftBipartite);
      // console.error(rightBipartite);
      // console.error(rightNodesOrder, sumMidRight);
      // console.error("leftNodesOrder", leftNodesOrder);
      // console.error("midNodeOrder", midNodesOrder);
      // console.error("rightNodeOrder", rightNodesOrder);

      // setLeftNodesOrder(leftNodesOrder);
      // setRightNodesOrder(rightNodesOrder);

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

      const rightX = 850;
      const rightY = 10;

      //layeredNodes.length = layeredNodes.length / 2;
      const midX = (leftX + rightX) / 2;
      const midXs = new Array(layeredNodes.length);

      layeredNodes.forEach((obj, index) => {
        midXs[index] = midX + Math.abs(rightX - leftX) * (obj.h / 2);
      });

      midXs.sort((a, b) => {
        return a - b;
      });

      console.error(midXs, layeredNodes);
      layeredNodes.sort((a, b) => {
        return a.h - b.h;
      });
      console.error(midXs, layeredNodes);
      const step = 30;
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
              path["source"] = [lefts[i].x, lefts[i].y];
              path["target"] = [midsList[k][j].x, midsList[k][j].y];
            } else if (k === bipartites.length - 1) {
              path["source"] = [midsList[k - 1][i].x, midsList[k - 1][i].y];
              path["target"] = [rights[j].x, rights[j].y];
            } else {
              path["source"] = [midsList[k - 1][i].x, midsList[k - 1][i].y];
              path["target"] = [midsList[k][j].x, midsList[k][j].y];
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
    })();
  }, [mu, url]);

  return {
    paths,
    leftNodes,
    rightNodes,
    midNodes,
    leftNodesOrder,
    rightNodesOrder,
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
