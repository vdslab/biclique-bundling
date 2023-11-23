/**
 入力：二部グラフ配列
 出力:グラフG_Eの隣接リスト(Object)
**/

export const convertG2Ge = (G) => {
  let nodeNumber = 0;
  const Ge = {};
  const edges = [];
  const edge2Node = new Map();
  for (let i = 0; i < G.length; i++) {
    for (let j = 0; j < G[i].length; j++) {
      if (!G[i][j]) continue;
      //Geのノード作成
      Ge[nodeNumber] = [];
      edge2Node.set(i + "," + j, nodeNumber);
      nodeNumber++;
      edges.push({ row: i, col: j });
    }
  }

  console.log(edge2Node);

  for (let i = 0; i < edges.length; i++) {
    const iG = edges[i]["row"];
    const jG = edges[i]["col"];
    for (let j = i + 1; j < edges.length; j++) {
      const iGe = edges[j]["row"];
      const jGe = edges[j]["col"];

      //vertex-jointならpass;
      if (iG === iGe || jG === jGe) continue;

      const rowDiff = iGe - iG;
      const colDiff = jGe - jG;
      if (G[iG + rowDiff][jG] && G[iG][jG + colDiff]) continue;

      //通過した(iG, jG)と(iGe, jGe)は結ぶ
      console.log(iG, jG, iGe, jGe);
      console.log(edge2Node.get(iG + "," + jG), edge2Node.get(iGe + "," + jGe));
      Ge[edge2Node.get(iG + "," + jG)].push(edge2Node.get(iGe + "," + jGe));
      Ge[edge2Node.get(iGe + "," + jGe)].push(edge2Node.get(iG + "," + jG));
    }
  }

  console.log(Ge);

  return Ge;
};


export const getBicliqueCover = (G) => {
    const SS = [];
    const RLF = (G) => {
        if(!Object.entries(G).length) return;

        const S = [];
        let maxDegNode = -1;
        let maxNum = -1;
        for(const [key, neighbors] of Object.entries(G)) {
            if(neighbors.length > maxNum) {
                maxDegNode = Number(key);
                maxNum = neighbors.length;
            }
        }

        console.log(maxDegNode);
        const U1 = new Set();
        const U2 = new Set();
        S.push(maxDegNode);

        for(let i = 0; i < S.length; i++) {
            for(const u2 of G[S[i]]) {
                U2.add(u2);
            }
        }

        console.log(U2);
        for(const [key] of Object.entries(G)) {
            if(U2.has(Number(key)) || maxDegNode === Number(key) ) continue;
            U1.add(Number(key))
        }

        console.log(U1);
        //U1から選ぶでSに入れる；

        while(U1.size) {
            // U2にmaxの接続で選ぶ
            let maxCount = -1;
            const cand = []
            for(const u1 of U1) {
                let count = 0
                for(const node of G[u1]) {
                    if(!U2.has(node)) continue;
                    count ++;
                }
                if(count >= maxCount) {
                    cand.push(u1);
                    maxCount = count;
                } else {
                    cand.clear();
                }
            }

            console.log("cand", cand);

            for(const c of cand) {
                S.push(c);
                U1.delete(c);

                for(const n of G[c]) {
                    U2.add(n);
                }
            }

            console.log("S", S)
            console.log("U1", U1);
        }

        console.log("S", S);

        //グラフからSを取り除く
        for(const s of S) {
            delete G[s];
            for(let [key, nei] of Object.entries(G)) {
                console.log(key ,s, nei)
                nei = nei.filter(ele => ele !== s);
                console.log(key, s, nei)
                G[key] = nei;
                console.log("##########")
            }
        }

        SS.push(S);
        console.log(G, S, SS)
        RLF(G);

    };

    RLF(G);
}
