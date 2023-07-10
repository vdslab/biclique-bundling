import { useEffect, useState } from "react";
import { xxHash32 } from "js-xxhash";
import { getMaximalNodes } from "../utils/getNodes";

const genKey = (u) => {
  const seed = 43784;

  let str = "";
  for (const num of u) {
    const strnum = String(num);

    str += strnum.padStart(4, "0");
    console.log(strnum.padStart(4, "0"));
  }

  return xxHash32(str, seed);
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
  for (let idx = 0; idx < bipartite[u].length; idx++) {
    if (bipartite[u][idx]) {
      inV.push(idx);
    }
  }

  console.log("UOOOO", u, inV);
  return inV;
};

const useMuQuasiBiclique = (mu) => {
  const [maximalNodes, setMaximalNodes] = useState({});
  const [bipartiteMatrix, setBipartiteMatrix] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await fetch("public/random/json/random_5_5_70_1.json");
      //const matrixJson = await res.json();
      const bipartite = await res.json();
      setBipartiteMatrix(bipartite);

      //pre-preprocess
      const Cand = {};

      const Upper = [0, 1, 2, 3, 4];

      for (const u of Upper) {
        const T = outVertices(u, bipartite);
        const M = {};

        console.log(u, T, M);
        //Tからハッシュ値を生み出す
        const key = genKey(T);
        console.log(key);
        Cand[key] = { T, M };
      }

      console.log(Cand);
      console.log(Object.keys(Cand));

      for (const key of Object.keys(Cand)) {
        //double for
        const T = Cand[key].T;
        const M = Cand[key].M;

        console.log(T, M);

        for (const v of T) {
          for (const u of inVertices(v, bipartite)) {
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

      console.log("ffffffffffffffffffffffffffffffffffffff", maximalObjs);
      setMaximalNodes(maximalObjs);
    })();
  }, []);

  return { bipartiteMatrix, maximalNodes };
};

export default useMuQuasiBiclique;
