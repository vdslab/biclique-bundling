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
   - 中間ノードの位置調整
   - エッジの並び替え(OLCM, MLCM)
   - バイクリークを選択するアルゴリズムが正しいか検証(または変えてみる)
   - 別のデータで試してみる

  todo:
  - layeredNodes.maximalNodesとbipartiteを中間ノード同士に対応させるようにする
  */

const layeredNodes = new Array();
const tmpBipartites = new Array();

const buildConfluent = (mu, bipartite, idx, step, depth) => {
  console.error(depth);

  const maximalNodes = getMuQuasiBiclique(mu, bipartite);
  depth = idx >= 0 ? Math.abs(depth) : -1 * Math.abs(depth);

  tmpBipartites.push({ h: idx, depth, bipartite });
  //最初のバイクリーク0は見逃す
  if (maximalNodes.length === 0 && step < 1) {
    return;
  }

  if (Math.abs(step) < 0.1) {
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
  console.error(maximalNodes);

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

  //

  console.error(
    "leftBipartile",
    step,
    getEdgeNum(leftBipartite),
    leftBipartite
  );
  console.error(
    "rightBipartile",
    step,
    getEdgeNum(rightBipartite),
    rightBipartite
  );
  // グローバル関数に格納する

  step = step / 2;
  buildConfluent(mu, leftBipartite, idx - step, step, Math.abs(depth) + 1);
  buildConfluent(mu, rightBipartite, idx + step, step, Math.abs(depth) + 1);
};

const getEdgeNum = (bipartite) => {
  let count = 0;
  let non = 0;
  for (let i = 0; i < bipartite.length; i++) {
    for (let j = 0; j < bipartite[i].length; j++) {
      if (bipartite[i][j]) {
        count++;
      } else {
        non++;
      }
    }
  }

  return {
    edge: count,
    nonEdge: non,
    all: count + non,
    arr: bipartite.length * bipartite[0].length,
  };
};

const getBipartites = (tmpBipartites) => {
  let maxDepth = -1;
  let minDepth = 100;
  for (const obj of tmpBipartites) {
    maxDepth = Math.max(maxDepth, obj.depth);
    minDepth = Math.min(minDepth, obj.depth);
  }

  const bipartites = new Array();
  for (const obj of tmpBipartites) {
    if (obj.depth === maxDepth || obj.depth === minDepth) {
      bipartites.push(obj);
    }
  }

  return bipartites;
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
      tmpBipartites.sort((a, b) => {
        return a.depth - b.depth;
      });

      console.error(tmpBipartites);
      console.error("layeredNodes", layeredNodes);
      console.error("layeredNodes.length", layeredNodes.length);

      //後からサイズ1のバイクリークを追加する
      //const maximalNodes = getMuQuasiBiclique(mu, bipartite);

      console.error(tmpBipartites);

      const bipartites = getBipartites(tmpBipartites);
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

      const rightX = 600;
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

      for (let k = 0; k < midsList.length; k += 2) {
        for (let i = 0; i < layeredNodes[k].maximalNodes.length; i++) {
          for (const l of layeredNodes[k].maximalNodes[i].left) {
            if (k === 0) {
              outputPaths.push({
                source: [lefts[l].x, lefts[l].y],
                target: [midsList[k][i].x, midsList[k][i].y],
              });
            } else {
              outputPaths.push({
                source: [midsList[k - 1][l].x, midsList[k - 1][l].y],
                target: [midsList[k][i].x, midsList[k][i].y],
              });
            }
          }

          for (const r of layeredNodes[k].maximalNodes[i].right) {
            if (k === midsList.length - 1) {
              outputPaths.push({
                source: [midsList[k][i].x, midsList[k][i].y],
                target: [rights[r].x, rights[r].y],
              });
            } else {
              outputPaths.push({
                source: [midsList[k][i].x, midsList[k][i].y],
                target: [midsList[k + 1][r].x, midsList[k + 1][r].y],
              });
            }
          }
        }
      }

      //console.error(midNodesCopy)

      //中間ノードとバイクリークのエッジ変数
      // const midNodesCopy = new Array();
      //   const outputPaths = new Array();
      //   for (let i = 0; i < midNodeNumber; i++) {
      //     const midIdx = midNodesOrder.indexOf(i);

      //     for (const l of maximalNodes[i].left) {
      //       const leftIdx = leftNodesOrder.indexOf(l);
      //       outputPaths.push({
      //         source: [lefts[leftIdx].x, lefts[leftIdx].y],
      //         target: [mids[midIdx].x, mids[midIdx].y],
      //       });
      //     }

      //     for (const r of maximalNodes[i].right) {
      //       const rightIdx = rightNodesOrder.indexOf(r);
      //       outputPaths.push({
      //         source: [mids[midIdx].x, mids[midIdx].y],
      //         target: [rights[rightIdx].x, rights[rightIdx].y],
      //       });
      //     }

      //     midNodesCopy.push({
      //       x: mids[midIdx].x,
      //       y: mids[midIdx].y,
      //     });
      //   }

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
