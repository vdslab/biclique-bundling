import { useEffect, useState } from "react";
import genKey from "../utils/getKey";

import { getMaximalNodes } from "../utils/getNodes";
/*
  アルゴリズム
  1. maximal バイクリークを行う
  2. 左右中間ノードの順序を初期化する
  3. OLCMで左右中間ノードの順序を最適化する => ノードの順番が決まる
  4. 1-3でやったことを再帰的に行う
  5. 最後に中間ノードのy座標を決定する
  */

const useConfluent = (mu) => {
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

      console.error("leftBipartite", leftBipartite);
      console.error("rightBipartite", rightBipartite);

      // 左中ノードを重心法でソート
      const sum_left_mid = new Array();
      for (let i = 0; i < leftNodeNumber; i++) {
        let degree = 0;
        let ouh = 0;
        for (let j = 0; j < midNodeNumber; j++) {
          if (!leftBipartite[i][j]) continue;
          degree++;
          ouh += leftNodesOrder[j];
        }
        sum_left_mid.push(degree / ouh);
      }

      midNodesOrder.sort((a, b) => {
        return sum_left_mid[a] - sum_left_mid[b];
      });

      /*
      成果物
      leftNodesOrder
      rightNodesOrder
      midNodesOrder

      leftBipartite
      rightBipartite
      */
    })();
  }, []);
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

    console.log("wertyddgffsd", key, S, T);
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
