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
      Ge[edge2Node.get(iG + "," + jG)].push(edge2Node.get(iGe + "," + jGe));
      Ge[edge2Node.get(iGe + "," + jGe)].push(edge2Node.get(iG + "," + jG));
    }
  }

  console.log(Ge);
  return [Ge, edge2Node];
};

export const RLF = (G, depth) => {
  console.log("start");
  if (!Object.entries(G).length) return;
  console.log(G);
  console.log("YES");
  const S = [];
  let maxDegNode = -1;
  let maxNum = -1;
  for (const [key, neighbors] of Object.entries(G)) {
    console.log("huhu", key, neighbors);
    if (neighbors.length > maxNum) {
      maxDegNode = Number(key);
      maxNum = neighbors.length;
    }
  }

  //vertex-disjointを選ぶ
  console.log("max degree", maxDegNode);
  // if(depth === 1) {
  //   maxDegNode = 1;
  // }
  //maxDegNode = 0;
  const U1 = new Set();
  const U2 = new Set();
  S.push(maxDegNode);

  for (let i = 0; i < S.length; i++) {
    for (const u2 of G[S[i]]) {
      U2.add(u2);
    }
  }

  console.log("U2", U2);
  for (const [key] of Object.entries(G)) {
    if (U2.has(Number(key)) || maxDegNode === Number(key)) continue;
    U1.add(Number(key));
  }

  console.log("U1", U1);
  //U1から選ぶでSに入れる；

  while (U1.size) {
    // U2にmaxの接続で選ぶ
    let maxCount = -1;
    const candObj = [];
    const cand = [];
    for (const u1Element of U1) {
      let count = 0;
      for (const node of G[u1Element]) {
        if (U2.has(node)) {
          count++;
        }
      }

      maxCount = Math.max(maxCount, count);
      candObj.push({ u1: u1Element, count });
    }

    candObj.forEach((element) => {
      if (element.count === maxCount) {
        cand.push(element.u1);
      }
    });
    console.log("cand", cand, candObj);
    console.log("end");

    //candからU1に最小に繋がっているやつを選ぶ。
    //maxDegNodeとvertex-disjointのエッジを
    let minU1deg = 1e12;
    let disi;
    for (const cElement of cand) {
      let count = 0;
      for (const n of G[cElement]) {
        if (U1.has(n)) {
          count++;
        }
      }

      if (minU1deg > count) {
        minU1deg = count;
        disi = cElement;
      }
    }

    console.log("disi", disi);
    S.push(disi);
    U1.delete(disi);

    for (const n of G[disi]) {
      U2.add(n);
      U1.delete(n);
    }

    //console.log("S", S);
    //console.log("U1", U1);
  }

  console.log("S", depth, S);

  //グラフから頂点集合Sとそのエッジを取り除く
  for (const sElement of S) {
    delete G[sElement];
    for (let [key, neighbors] of Object.entries(G)) {
      neighbors = neighbors.filter((element) => element !== sElement);
      G[key] = neighbors;
    }
  }

  console.log(G);
  RLF(G, depth + 1);
};

export const getBicliqueCover = (g) => {
  const [G, edge2Node] = convertG2Ge(g);

  const coloredEdges = [];
  const RLF = (G) => {
    if (!Object.entries(G).length) return;

    const S = [];
    let maxDegNode = -1;
    let maxNum = -1;
    for (const [key, neighbors] of Object.entries(G)) {
      if (neighbors.length > maxNum) {
        maxDegNode = Number(key);
        maxNum = neighbors.length;
      }
    }

    console.log(maxDegNode);
    const U1 = new Set();
    const U2 = new Set();
    S.push(maxDegNode);

    for (let i = 0; i < S.length; i++) {
      for (const u2 of G[S[i]]) {
        U2.add(u2);
      }
    }

    console.log("U2", U2);
    for (const [key] of Object.entries(G)) {
      if (U2.has(Number(key)) || maxDegNode === Number(key)) continue;
      U1.add(Number(key));
    }

    console.log("U1", U1);
    //U1から選ぶでSに入れる；
    //U1からdisjointになるedgesを優先的に選ぶ

    while (U1.size) {
      // U2にmaxの接続で選ぶ
      let maxCount = -1;
      const candObj = [];
      const cand = [];
      for (const u1Element of U1) {
        let count = 0;
        for (const node of G[u1Element]) {
          if (U2.has(node)) {
            count++;
          }
        }

        maxCount = Math.max(maxCount, count);
        candObj.push({ u1: u1Element, count });
      }

      candObj.forEach((element) => {
        if (element.count === maxCount) {
          cand.push(element.u1);
        }
      });
      console.log("cand", cand, candObj);
      console.log("end");

      //candからU1に最小に繋がっているやつを選ぶ。
      let minU1deg = 1e12;
      let disi;
      for (const cElement of cand) {
        let count = 0;
        for (const n of G[cElement]) {
          if (U1.has(n)) {
            count++;
          }
        }

        if (minU1deg > count) {
          minU1deg = count;
          disi = cElement;
        }
      }

      let maxEdge;
      for (const e of edge2Node) {
        if (maxDegNode === e[1]) {
          maxEdge = e[0];
        }
      }

      const mac = maxEdge.split(",");
      for (const cElement of cand) {
        for (const e of edge2Node) {
          if (cElement === e[1]) {
            const tar = e[0].split(",");
            if (mac[0] !== tar[0] && mac[1] !== tar[1]) {
              disi = cElement;
            }
          }
        }
      }

      console.log("disi", disi);
      S.push(disi);
      U1.delete(disi);

      for (const n of G[disi]) {
        U2.add(n);
        U1.delete(n);
      }

      //console.log("S", S);
      //console.log("U1", U1);
    }

    console.log("S", S);

    //グラフからSを取り除く
    //グラフから頂点集合Sとそのエッジを取り除く
    for (const sElement of S) {
      delete G[sElement];
      for (let [key, neighbors] of Object.entries(G)) {
        neighbors = neighbors.filter((element) => element !== sElement);
        G[key] = neighbors;
      }
    }

    coloredEdges.push(S);
    console.log(G, S, coloredEdges);
    RLF(G);
  };

  //ここでRFLを実行する
  RLF(G);
  //coloredEdgesをconfluent drawing用にデータを変換してreturn
  return coloredEdges2bicliques(coloredEdges, edge2Node);
};

export const coloredEdges2bicliques = (coloredEdges,  edge2Node) => {
  const bicliques = [];
  for (let i = 0; i < coloredEdges.length; i++) {
    const bicliqueEdges = [];

    for (let j = 0; j < coloredEdges[i].length; j++) {
      edge2Node.forEach((GeNode, GEdge) => {
        if (GeNode === coloredEdges[i][j]) {
          bicliqueEdges.push(GEdge.split(","));
        }
      });
    }
    console.log(" bicliqueEdges", bicliqueEdges);

    const bicliqueObj = { left: [], right: [] };
    for (const edge of bicliqueEdges) {
      bicliqueObj["left"].push(Number(edge[0]));
      bicliqueObj["right"].push(Number(edge[1]));
    }
    console.log(bicliqueObj);
    //bicliqueObjの重複削除とソート
    bicliqueObj["left"] = Array.from(new Set(bicliqueObj["left"])).sort();
    bicliqueObj["right"] = Array.from(new Set(bicliqueObj["right"])).sort();
    bicliques.push(bicliqueObj);
  }

  console.log("coloredEdges", coloredEdges);
  console.error("bicliques", bicliques);
  return bicliques;
}
