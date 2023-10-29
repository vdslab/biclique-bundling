import { useEffect, useState } from "react";
import genKey from "../utils/getKey";

import { getMaximalNodes } from "../utils/getNodes";
import * as d3 from "d3";
import { objectOnePropertytoProgression, sumCordinates } from "../utils/calc";
/*
  アルゴリズム
  1. maximal バイクリークを行う
  2. 左右中間ノードの順序を初期化する
  3. OLCMで左右中間ノードの順序を最適化する => ノードの順番が決まる
  4. 1-3でやったことを再帰的に行う
  5. 最後に中間ノードのy座標を決定する
  */

const useConfluent = (mu) => {
  const [paths, setPaths] = useState([]);

  const [leftNodes, setLeftNodes] = useState([]);
  const [rightNodes, setRightNodes] = useState([]);
  const [midNodes, setMidNodes] = useState([]);
  const [leftNodesOrder, setLeftNodesOrder] = useState([]);
  const [rightNodesOrder, setRightNodesOrder] = useState([]);
  const linkGenerator = d3.linkHorizontal();
  useEffect(() => {
    (async () => {
      const res = await fetch("public/act-mooc/json/mooc_actions_200.json");
      const bipartite = await res.json();

      const maximalNodes = getMuQuasiBiclique(mu, bipartite);
      console.error(bipartite);
      console.error(maximalNodes);

      const leftNodeNumber = bipartite.length;
      const rightNodeNumber = bipartite[0].length;
      const midNodeNumber = maximalNodes.length;

      //左右中間ノードの順序を初期化
      const leftNodesOrder = new Array();
      const rightNodesOrder = new Array();
      const midNodesOrder = new Array();

      for (let i = 0; i < leftNodeNumber; i++) {
        leftNodesOrder.push(i);
      }

      for (let i = 0; i < rightNodeNumber; i++) {
        rightNodesOrder.push(i);
      }

      for (let i = 0; i < maximalNodes.length; i++) {
        midNodesOrder.push(i);
      }

      const leftBipartite = new Array(leftNodeNumber);
      const rightBipartite = new Array(midNodeNumber);
      console.error(midNodeNumber);

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

      console.error(
        "leftBipartite",
        leftBipartite,
        getMuQuasiBiclique(mu, leftBipartite)
      );
      console.error(
        "rightBipartite",
        rightBipartite,
        getMuQuasiBiclique(mu, rightBipartite)
      );

      // 左中ノードを重心法でソート
      const sumLeftMid = new Array();
      console.error(leftBipartite);
      for (let i = 0; i < midNodeNumber; i++) {
        let degree = 0;
        let ouh = 0;
        for (let j = 0; j < leftNodeNumber; j++) {
          if (!leftBipartite[j][i]) continue;
          degree++;
          ouh += leftNodesOrder[j];
        }
        sumLeftMid.push(ouh / degree);
      }

      midNodesOrder.sort((a, b) => {
        return sumLeftMid[a] - sumLeftMid[b];
      });

      console.error(midNodesOrder, sumLeftMid);

      const sumMidRight = new Array();
      for (let i = 0; i < rightNodeNumber; i++) {
        let degree = 0;
        let ouh = 0;
        for (let j = 0; j < midNodeNumber; j++) {
          if (!rightBipartite[j][i]) continue;
          degree++;
          ouh += midNodesOrder[j];
        }
        sumMidRight.push(ouh / degree);
      }

      rightNodesOrder.sort((a, b) => {
        return sumMidRight[a] - sumMidRight[b];
      });

      console.error(leftBipartite);
      console.error(rightBipartite);
      console.error(rightNodesOrder, sumMidRight);
      console.error("midNodeOrder", midNodesOrder);
      console.error("rightNodeOrder", rightNodesOrder);

      setLeftNodesOrder(leftNodesOrder);
      setRightNodesOrder(rightNodesOrder);

      /*
      成果物
      leftNodesOrder
      rightNodesOrder
      midNodesOrder

      leftBipartite
      rightBipartite
      */

      // 座標決定process
      const leftX = 100;
      const leftY = 10;

      const rightX = 1100;
      const rightY = 10;

      const midX = (leftX + rightX) / 2;

      const step = 40;
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

      const mids = objectOnePropertytoProgression(
        midNodeNumber,
        step,
        midX,
        rightY * 10
      );

      console.error(rights, maximalNodes);

      setLeftNodes(lefts);
      setRightNodes(rights);

      //中間ノードとバイクリークのエッジ変数
      const midNodesCopy = new Array();
      const outputPaths = new Array();
      for (let i = 0; i < midNodeNumber; i++) {
        const midIdx = midNodesOrder.indexOf(i);

        for (const l of maximalNodes[i].left) {
          const leftIdx = leftNodesOrder.indexOf(l);
          outputPaths.push({
            source: [lefts[leftIdx].x, lefts[leftIdx].y],
            target: [mids[midIdx].x, mids[midIdx].y],
          });
        }

        for (const r of maximalNodes[i].right) {
          const rightIdx = rightNodesOrder.indexOf(r);
          outputPaths.push({
            source: [mids[midIdx].x, mids[midIdx].y],
            target: [rights[rightIdx].x, rights[rightIdx].y],
          });
        }

        midNodesCopy.push({
          x: mids[midIdx].x,
          y: mids[midIdx].y,
        });
      }

      setMidNodes(midNodesCopy);
      setPaths(
        outputPaths.map((d) => {
          return linkGenerator(d);
        })
      );
    })();
  }, []);

  return {
    paths,
    leftNodes,
    rightNodes,
    midNodes,
    leftNodesOrder,
    rightNodesOrder,
  };
};

const getMuQuasiBiclique = (mu, bipartite) => {
  //pre-preprocess
  const Cand = {};

  const Upper = Array.from({ length: bipartite.length }, (_, i) => i);
  for (const u of Upper) {
    const T = outVertices(u, bipartite);
    const M = {};

    console.log(u, T, M);
    //Tからハッシュ値を生み出す
    const key = genKey(T);
    //console.log(key);
    Cand[key] = { T, M };
  }

  for (const key of Object.keys(Cand)) {
    //double for
    const T = Cand[key].T;
    const M = Cand[key].M;

    console.log(T, M);
    console.log(key);
    for (const v of T) {
      const inVer = inVertices(v, bipartite);
      for (const u of inVer) {
        if (u in M) {
          M[u] += 1;
        } else {
          M[u] = 0;
        }
      }
    }
  }

  //main process
  const SMaximalCandNodes = [];
  const TMaximalCandNodes = [];
  for (const key of Object.keys(Cand)) {
    const T = Cand[key].T;
    const M = Cand[key].M;

    const S = [];

    for (const u of Object.keys(M)) {
      if (M[u] >= mu * T.length) {
        S.push(Number(u));
      }
    }

    if (S.length > 1 && T.length > 1) {
      SMaximalCandNodes.push(S);
      TMaximalCandNodes.push(T);
    }
  }

  //fillterNonMaximal*/
  const [SMaximalNodes, TMaximalNodes] = getMaximalNodes(
    SMaximalCandNodes,
    TMaximalCandNodes
  );

  const maximalObjs = new Array();
  for (let i = 0; i < SMaximalNodes.length; i++) {
    maximalObjs.push({
      left: SMaximalNodes[i],
      right: TMaximalNodes[i],
    });
  }

  return maximalObjs;
};

const outVertices = (u, bipartite) => {
  const outV = [];
  for (let idx = 0; idx < bipartite[u].length; idx++) {
    if (bipartite[u][idx]) {
      outV.push(idx);
    }
  }
  return outV;
};

const inVertices = (u, bipartite) => {
  const inV = [];
  for (let idx = 0; idx < bipartite.length; idx++) {
    if (bipartite[idx][u]) {
      inV.push(idx);
    }
  }
  return inV;
};

const allIsIn = (maximalNodes, left, right) => {
  for (const node of maximalNodes) {
    const leftNodeSet = new Set(node.left);
    const rightNodeSet = new Set(node.right);

    if (leftNodeSet.has(left) && rightNodeSet.has(right)) {
      return true;
    }
  }

  return false;
};
export default useConfluent;
