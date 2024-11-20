/**
 入力：二部グラフ配列
 出力:グラフG_Eの隣接リスト(Object)
**/

// convertG2Ge ok1
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

  for (let i = 0; i < edges.length; i++) {
    const iG = edges[i]["row"];
    const jG = edges[i]["col"];
    for (let j = i + 1; j < edges.length; j++) {
      const iGe = edges[j]["row"];
      const jGe = edges[j]["col"];

      //vertex-jointならpass;
      if (iG === iGe || jG === jGe) continue;

      // indeced P_4 or C^c_4
      // const rowDiff = iGe - iG;
      // const colDiff = jGe - jG;
      if (G[iGe][jG] && G[iG][jGe]) continue;

      //通過した(iG, jG)と(iGe, jGe)は結ぶ
      Ge[edge2Node.get(iG + "," + jG)].push(edge2Node.get(iGe + "," + jGe));
      Ge[edge2Node.get(iGe + "," + jGe)].push(edge2Node.get(iG + "," + jG));
    }
  }

  // console.error("hehe", Ge);
  return [Ge, edge2Node];
};

export const RLF = (G, depth) => {
  // console.log("start");
  if (!Object.entries(G).length) return;
  // console.log(G);
  // console.log("YES");
  const S = [];
  let maxDegNode = -1;
  let maxNum = -1;
  for (const [key, neighbors] of Object.entries(G)) {
    // console.log("huhu", key, neighbors);
    if (neighbors.length > maxNum) {
      maxDegNode = Number(key);
      maxNum = neighbors.length;
    }
  }

  //vertex-disjointを選ぶ
  // console.log("max degree", maxDegNode);
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

  // console.log("U2", U2);
  for (const [key] of Object.entries(G)) {
    if (U2.has(Number(key)) || maxDegNode === Number(key)) continue;
    U1.add(Number(key));
  }

  // console.log("U1", U1);
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
    // console.log("cand", cand, candObj);
    // console.log("end");

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

    // console.log("disi", disi);
    S.push(disi);
    U1.delete(disi);

    for (const n of G[disi]) {
      U2.add(n);
      U1.delete(n);
    }

    //// console.log("S", S);
    //// console.log("U1", U1);
  }

  // console.log("S", depth, S);

  //グラフから頂点集合Sとそのエッジを取り除く
  for (const sElement of S) {
    delete G[sElement];
    for (let [key, neighbors] of Object.entries(G)) {
      neighbors = neighbors.filter((element) => element !== sElement);
      G[key] = neighbors;
    }
  }

  // console.log(G);
  RLF(G, depth + 1);
};

export const getBicliqueCover = (g) => {
  const [G, edge2Node] = convertG2Ge(g);
  console.error("GG", G);

  const coloredEdges = [];

  //vertex-disjoint edgesをとる戦略
  //-[x] maxDegNodeを適当に決めて、U1からvertex-disjointをとる → 貪欲法なので最後のほうで偏ったバイクリークが見つかる
  //-[] とってきた結果が偏りがないmaxDegNodeを選ぶ →
  const RLF = (G) => {
    if (!Object.entries(G).length) return;

    const S = [];
    //maxDegNodeは複数の候補がある
    //vertex-disjointになるようなmaxDegNodeを選ぶ
    let maxDegNode = -1;
    let maxNum = -1;
    for (const [key, neighbors] of Object.entries(G)) {
      if (neighbors.length > maxNum) {
        maxDegNode = Number(key);
        maxNum = neighbors.length;
      }
    }

    // console.log(maxDegNode);
    const U1 = new Set();
    const U2 = new Set();
    S.push(maxDegNode);

    for (let i = 0; i < S.length; i++) {
      for (const u2 of G[S[i]]) {
        U2.add(u2);
      }
    }

    // console.log("U2", U2);
    for (const [key] of Object.entries(G)) {
      if (U2.has(Number(key)) || maxDegNode === Number(key)) continue;
      U1.add(Number(key));
    }

    // console.log("U1", U1);
    //U1から選ぶでSに入れる；
    //U1からdisjointになるedgesを優先的に選ぶ

    while (U1.size) {
      // U2にmaxの接続で選ぶ
      let maxCount = -1;
      const candObj = [];
      const cands = [];
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
          cands.push(element.u1);
        }
      });
      // console.log("cands", cands, candObj);
      // console.log("end");

      //candからU1に最小に繋がっているやつを選ぶ。
      let minU1deg = 1e12;
      let disi;
      for (const cElement of cands) {
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

      //candsからvertex-disjointなedgeを優先的に選択
      const mac = maxEdge.split(",");
      for (const cElement of cands) {
        for (const e of edge2Node) {
          if (cElement === e[1]) {
            const tar = e[0].split(",");
            if (mac[0] !== tar[0] && mac[1] !== tar[1]) {
              disi = cElement;
            }
          }
        }
      }

      // console.log("disi", disi);
      S.push(disi);
      U1.delete(disi);

      for (const n of G[disi]) {
        U2.add(n);
        U1.delete(n);
      }

      //// console.log("S", S);
      //// console.log("U1", U1);
    }

    // console.log("S", S);

    //グラフからSを取り除く
    //グラフから頂点集合Sとそのエッジを取り除く
    // console.log(
    //   "resultfssssssssssssssssssssss",
    //   S,
    //   coloredEdge2biclique(S, edge2Node),
    //   G
    // );
    for (const sElement of S) {
      delete G[sElement];
      for (let [key, neighbors] of Object.entries(G)) {
        neighbors = neighbors.filter((element) => element !== sElement);
        G[key] = neighbors;
      }
    }

    coloredEdges.push(S);
    // console.log(G, S, coloredEdges);

    RLF(G);
  };

  //ここでRFLを実行する
  RLF(G);
  //coloredEdgesをconfluent drawing用にデータを変換してreturn
  return coloredEdges2bicliques(coloredEdges, edge2Node);
};

export const getQuasiBicliqueCover = (g, param = 1.0) => {
  const [G, edge2Node] = convertG2Ge(g);

  const bipartiteNodes = { left: [], right: [] };
  for (let i = 0; i < g.length; i++) {
    bipartiteNodes["left"].push(i);
  }

  for (let i = 0; i < g[0].length; i++) {
    bipartiteNodes["right"].push(i);
  }

  const usedLeftNodes = [];
  const usedRightNodes = [];

  // 準バイクリークカバーの配列
  const quasiBicliques = [];

  // RLF part ok1
  // quasi part ok1
  const quasiRLF = (G, param, counter = 0) => {
    // グラフGが空だったらreturn
    if (!Object.entries(G).length) return;

    const S = [];
    //maxDegNodeは複数の候補がある
    //vertex-disjointになるようなmaxDegNodeを選ぶ
    let maxDegNode = -1;
    let maxNum = -1;
    for (const [key, neighbors] of Object.entries(G)) {
      if (neighbors.length > maxNum) {
        maxDegNode = Number(key);
        maxNum = neighbors.length;
      }
    }

    //console.log(maxDegNode);
    const U1 = new Set();
    const U2 = new Set();
    S.push(maxDegNode);

    for (let i = 0; i < S.length; i++) {
      for (const u2 of G[S[i]]) {
        U2.add(u2);
      }
    }

    //console.log("U2", U2);
    for (const [key] of Object.entries(G)) {
      if (U2.has(Number(key)) || maxDegNode === Number(key)) continue;
      U1.add(Number(key));
    }

    //console.log("U1", U1);
    //U1から選ぶでSに入れる；
    //U1からdisjointになるedgesを優先的に選ぶ
    console.error("FROU1", structuredClone(U1), counter);
    while (U1.size) {
      // U2にmaxの接続で選ぶ
      let maxCount = -1;
      const candObj = [];
      const cands = [];
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
          cands.push(element.u1);
        }
      });
      console.log("cands", cands, candObj, counter);
      //console.log("end");

      // U2への次数がmaxのノードが複数あった場合
      // candからU1に最小に繋がっているやつを選ぶ
      // この時点で候補ノードが一つでもaddNodeは必ず決定される
      // find v min deg_U1(v)
      let hack1, hack2;
      let minU1deg = 1e12;
      let addNode;
      for (const candNode of cands) {
        let count = 0;
        for (const n of G[candNode]) {
          if (U1.has(n)) {
            count++;
          }
        }

        if (minU1deg > count) {
          minU1deg = count;
          hack1 = candNode;
          addNode = candNode;
        }
      }
      console.error("hack1", addNode);

      // U2への次数がmaxのノードが複数あった場合
      // candsからSエッジからvertex-disjointなedgeを優先的に選択
      // この条件の方が優先される
      const Sedges = [];
      for (const e of edge2Node) {
        if (S.includes(e[1])) {
          const f = e[0].split(",");
          Sedges.push([+f[0], +f[1]]);
        }
      }

      console.error("Sedges", Sedges, counter);

      // Sのバイクリークからvertex-disjointなエッジを選ぶ
      if (Sedges.length > 0) {
        for (const candNode of cands) {
          for (const [edge, node] of edge2Node) {
            if (candNode !== node) continue;
            const candEdge = edge.split(",");

            let isDisjoint = true;
            for (const Sedge of Sedges) {
              if (+Sedge[0] === +candEdge[0] || +Sedge[1] === +candEdge[1]) {
                isDisjoint = false;
              }
            }

            if (isDisjoint) {
              addNode = candNode;
              hack2 = candNode;
            }
          }
        }
      }

      // console.error("hack2", addNode);

      // if(hack1 !== hack2 && hack2 !== undefined) {
      //   console.error("diff", hack1, hack2)
      // }
      // console.error("===================================");

      //console.log("disi", disi);
      S.push(addNode);
      U1.delete(addNode);

      for (const n of G[addNode]) {
        U2.add(n);
        U1.delete(n);
      }

      // console.error("Sdf", S, counter);
      //console.log("U1", U1);
    }

    // console.error("compf", S, counter);

    //console.log("S", S);

    // bipartiteNodes
    const addedCandNodes = []; // [{side: 'left', node:1},{side: 'right', node: 2} ]
    const deletedNode = structuredClone(S); // number[]
    const bicliqueNodes = coloredEdge2biclique(S, edge2Node); // {left: [0, 1, 2, 3], right: [1, 4, 5]}

    // console.log(bicliqueNodes, bipartiteNodes);
    //usedLeftNodes,usedRightNodesの配列にpushする
    for (const leftNode of bicliqueNodes["left"]) {
      usedLeftNodes.push(leftNode);
    }

    for (const rightNode of bicliqueNodes["right"]) {
      usedRightNodes.push(rightNode);
    }

    // バイクリークの追加する候補のノードを選択する
    for (let i = 0; i < bipartiteNodes["left"].length; i++) {
      if (bicliqueNodes["left"].includes(i)) continue;
      if (usedLeftNodes.includes(i)) continue;

      addedCandNodes.push({ side: "left", node: i });
    }

    for (let i = 0; i < bipartiteNodes["right"].length; i++) {
      if (bicliqueNodes["right"].includes(i)) continue;
      if (usedRightNodes.includes(i)) continue;

      addedCandNodes.push({ side: "right", node: i });
    }

    // bicliqueNodesの密度が高くなるようなノードを選択する
    // 貪欲的に密度が高くなるようなノードを選択しても、最終的な結果が最良であるか限らない
    console.log(S, bicliqueNodes, addedCandNodes, g);
    const addedNodes = [];
    const addedNodesNumber = [];
    for (;;) {
      let maxDensityNode;
      let maxDesity = -1.0;
      for (const addedNode of addedCandNodes) {
        // いれるノードに制限が必要
        // addedCandNodesから入れるノードをさらに絞る必要がある
        const bipartiteDensity = calcBipartiteDensity(
          bicliqueNodes,
          addedNode,
          g
        );

        const nodeNumber =
          addedNode["side"] === "left"
            ? "l" + addedNode["node"]
            : "r" + addedNode["node"];
        if (
          bipartiteDensity >= maxDesity &&
          !addedNodesNumber.includes(nodeNumber) &&
          isNeighbor(bicliqueNodes, addedNode, g)
        ) {
          maxDesity = bipartiteDensity;
          maxDensityNode = addedNode;
        }
      }

      // maxDesity = -1.0 -> ノードが追加されなかったとき
      if (maxDesity < param) {
        console.log(
          "densityr",
          calcBipartiteDensity(bicliqueNodes, undefined, g),
          maxDesity,
          param
        );
        break;
      } else {
        console.error("density log", maxDesity, bicliqueNodes);
      }

      // 追加するノードが存在するならば、追加する
      if (maxDensityNode) {
        bicliqueNodes[maxDensityNode["side"]].push(maxDensityNode["node"]);
        addedNodes.push(maxDensityNode);
        //addedNodesNumber.push(maxDensityNode["node"]);
        if (maxDensityNode["side"] === "left") {
          usedLeftNodes.push(maxDensityNode["node"]);
          addedNodesNumber.push("l" + maxDensityNode["node"]);
        } else {
          usedRightNodes.push(maxDensityNode["node"]);
          addedNodesNumber.push("r" + maxDensityNode["node"]);
        }
      }
    }

    // 準バイクリークの密度がparam未満だったら例外を投げる
    const bipartiteDensity = calcBipartiteDensity(bicliqueNodes, undefined, g);
    //console.error("SSS", counter, bicliqueNodes, bipartiteDensity);
    if (bipartiteDensity < param) {
      throw new Error("code error");
    }

    // 追加ノードをG_Eから削除する
    for (const addedNode of addedNodes) {
      edge2Node.forEach((GeNode, GEdge) => {
        const edge = GEdge.split(",");

        if (addedNode["side"] === "left") {
          if (
            Number(edge[0]) === addedNode["node"] &&
            bicliqueNodes["right"].includes(Number(edge[1]))
          ) {
            deletedNode.push(GeNode);
          }
        } else {
          if (
            Number(edge[1]) === addedNode["node"] &&
            bicliqueNodes["left"].includes(Number(edge[0]))
          ) {
            deletedNode.push(GeNode);
          }
        }
      });
    }
    //console.error(deletedNode);

    // 準バイクリークカバーの配列
    quasiBicliques.push(bicliqueNodes);

    //Sはエッジの配列
    //S.push(addedNode);
    //console.log("deleted", deletedNode);
    //console.error("added", addedNodes, param);
    //console.log("node2", edge2Node);
    //console.log(bicliqueNodes);

    //グラフからSを取り除く
    //グラフから頂点集合Sとそのエッジを取り除く
    //グラフからどう準バイクリークを取り除くか
    for (const sElement of deletedNode) {
      delete G[sElement];
      for (let [key, neighbors] of Object.entries(G)) {
        neighbors = neighbors.filter((element) => element !== sElement);
        G[key] = neighbors;
      }
    }

    quasiRLF(G, param, counter + 1);
  };
  //ここでRFLを実行する
  // console.error("Hasime");
  quasiRLF(G, param);
  //console.error("owari");
  //coloredEdgesをconfluent drawing用にデータを変換してreturn

  // バイクリーク内のindexをソート
  // エッジの端がずれるバグが発生
  quasiBicliques.forEach((biclique) => {
    biclique.left.sort((a, b) => a - b);
    biclique.right.sort((a, b) => a - b);
  });

  return quasiBicliques;
};

const coloredEdges2bicliques = (coloredEdges, edge2Node) => {
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
    //console.log(" bicliqueEdges", bicliqueEdges);

    const bicliqueObj = { left: [], right: [] };
    for (const edge of bicliqueEdges) {
      bicliqueObj["left"].push(Number(edge[0]));
      bicliqueObj["right"].push(Number(edge[1]));
    }
    //console.log(bicliqueObj);
    //bicliqueObjの重複削除とソート
    bicliqueObj["left"] = Array.from(new Set(bicliqueObj["left"])).sort();
    bicliqueObj["right"] = Array.from(new Set(bicliqueObj["right"])).sort();
    bicliques.push(bicliqueObj);
  }

  // console.log("coloredEdges", coloredEdges);
  // console.error("bicliques", bicliques);
  return bicliques;
};

// ok1
const coloredEdge2biclique = (coloredEdge, edge2Node) => {
  const bicliqueEdges = [];
  for (let i = 0; i < coloredEdge.length; i++) {
    edge2Node.forEach((GeNode, GEdge) => {
      if (GeNode === coloredEdge[i]) {
        bicliqueEdges.push(GEdge.split(","));
      }
    });
  }

  const bicliqueObj = { left: [], right: [] };
  for (const edge of bicliqueEdges) {
    bicliqueObj["left"].push(Number(edge[0]));
    bicliqueObj["right"].push(Number(edge[1]));
  }
  //console.log(bicliqueObj);
  //bicliqueObjの重複削除とソート
  bicliqueObj["left"] = Array.from(new Set(bicliqueObj["left"])).sort(
    (a, b) => a - b
  );
  bicliqueObj["right"] = Array.from(new Set(bicliqueObj["right"])).sort(
    (a, b) => a - b
  );
  return bicliqueObj;
};

// ok1
export const calcBipartiteDensity = (bicliqueNodes, addedNode, bipartite) => {
  let bipartiteEdgesCount = 0;

  const addedBicliqueNodes = structuredClone(bicliqueNodes);

  if (addedNode !== undefined)
    addedBicliqueNodes[addedNode["side"]].push(addedNode["node"]);
  //console.log(addedBicliqueNodes);

  for (const leftNode of addedBicliqueNodes["left"]) {
    for (const rightNode of addedBicliqueNodes["right"]) {
      if (!bipartite[leftNode][rightNode]) continue;
      bipartiteEdgesCount++;
    }
  }

  const bipartiteDensity =
    bipartiteEdgesCount /
    (addedBicliqueNodes["left"].length * addedBicliqueNodes["right"].length);
  // console.log(
  //   bipartiteEdgesCount,
  //   addedBicliqueNodes["left"],
  //   addedBicliqueNodes["right"],
  //   bipartiteDensity
  // );
  return bipartiteDensity;
};

// 追加するノードがバイクリーク内のノードと隣接しているか？ ok1
const isNeighbor = (bicliqueNodes, addedNode, g) => {
  if (addedNode.side === "right") {
    for (const left of bicliqueNodes["left"]) {
      if (g[left][addedNode.node]) return true;
    }
  } else {
    for (const right of bicliqueNodes["right"]) {
      if (g[addedNode.node][right]) return true;
    }
  }
  return false;
};
