import genKey from "./getKey";
import { getMaximalNodes } from "./getNodes";

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
          M[u] = M[u] + 1;
        } else {
          M[u] = 1;
        }
      }
    }
  }

  console.error(Cand)

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

    if (S.length > 1 && T.length > 1 && (S.length + T.length > 2)) {
      SMaximalCandNodes.push(S);
      TMaximalCandNodes.push(T);
    }
  }

  //fillterNonMaximal*/
  console.error(SMaximalCandNodes, TMaximalCandNodes)
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

  console.error(maximalObjs)
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

export default getMuQuasiBiclique;
