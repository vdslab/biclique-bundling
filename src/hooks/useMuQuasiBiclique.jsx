import { useEffect, useState } from "react";

import { getMaximalNodes } from "../utils/getNodes";

import genKey from "../utils/getKey";

const outVertices = (u, bipartite) => {
  const outV = [];
  for (let idx = 0; idx < bipartite[u].length; idx++) {
    if (bipartite[u][idx]) {
      outV.push(idx);
    }
  }
  console.error(u,outV)
  return outV;
};

const inVertices = (u, bipartite) => {
  const inV = [];
  for(let idx = 0; idx < bipartite.length; idx++) {
    if(bipartite[idx][u]) {
      inV.push(idx);
    }
  }

  console.log(u ,inV);
  return inV;
};

const useMuQuasiBiclique = (mu) => {
  const [maximalNodes, setMaximalNodes] = useState({});
  const [bipartiteMatrix, setBipartiteMatrix] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await fetch("public/act-mooc/json/mooc_actions_100.json");
      //const matrixJson = await res.json();
      const bipartite = await res.json();
      setBipartiteMatrix(bipartite);

      //pre-preprocess
      const Cand = {};

      const Upper = Array.from({ length: bipartite.length }, (_, i) => i);
      console.log("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFf", Upper);
      for (const u of Upper) {
        const T = outVertices(u, bipartite);
        const M = {};

        console.log(u, T, M);
        //Tからハッシュ値を生み出す
        const key = genKey(T);
        //console.log(key);
        Cand[key] = { T, M };
      }

      console.log(Cand);
      console.error(Object.keys(Cand));

      for (const key of Object.keys(Cand)) {
        //double for
        const T = Cand[key].T;
        const M = Cand[key].M;

        console.log(T, M);
        console.log(key);
        for (const v of T) {
          const inVer = inVertices(v, bipartite);
          for (const u of inVer) {
            console.error("VVVVVVVVVVVVV", u, inVer);
            if (u in M) {
              M[u] += 1;
            } else {
              M[u] = 0;
            }
          }
        }
      }

      console.log("HOOOOOOO", Cand);

      //main process
      const K = {};
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
        if (S.length > 0 && T.length > 0) {
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

      console.log("mu-quisi output", maximalObjs);
      setMaximalNodes(maximalObjs);
    })();
  }, []);

  return { bipartiteMatrix, maximalNodes };
};

export default useMuQuasiBiclique;
