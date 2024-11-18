class Confluent {
  constructor(getBicliqueCover, param, maxDepth) {
    this.bipartites = new Array();
    this.bipartitesInfo = new Array();
    this.bipartitesAll = new Array();
    this.getBicliqueCover = getBicliqueCover;
    this.param = param;
    this.maxDepth = maxDepth;
    this.midNodesCount = 0;
  }

  build(bipartite) {
    this.#buildConfluent(bipartite);
    this.#afterBuildProcess();
  }

  #buildConfluent(bipartite, idx = 0, step = 1, depth = 0) {
    depth = idx >= 0 ? Math.abs(depth) : -1 * Math.abs(depth);
    this.bipartitesAll.push({
      h: idx,
      depth,
      bipartite,
    });

    if (Math.abs(depth) >= this.maxDepth) {
      return;
    }

    const maximalNodes = this.getBicliqueCover(bipartite, this.param);
    this.bipartitesInfo.push({
      h: idx,
      depth,
      bipartite,
      maximalNodes,
      step,
    });

    // 中間ノード数をカウントする
    this.midNodesCount += maximalNodes.length;
    const midNodeNumber = maximalNodes.length;

    // 上二部グラフの二次元配列を作成
    const leftNodeNumber = bipartite.length;
    const leftBipartite = new Array(leftNodeNumber);
    for (let i = 0; i < leftBipartite.length; i++) {
      const leftBipartiteElement = new Array(midNodeNumber).fill(0);
      for (let j = 0; j < midNodeNumber; j++) {
        if (maximalNodes[j].left.includes(i)) leftBipartiteElement[j] = 1;
      }
      leftBipartite[i] = leftBipartiteElement;
    }

    // 下二部グラフの二次元配列を作成
    const rightNodeNumber = bipartite[0].length;
    const rightBipartite = new Array(midNodeNumber);
    for (let i = 0; i < rightBipartite.length; i++) {
      const rightBipartiteElement = new Array(rightNodeNumber).fill(0);
      for (let j = 0; j < rightNodeNumber; j++) {
        if (maximalNodes[i].right.includes(j)) rightBipartiteElement[j] = 1;
      }
      rightBipartite[i] = rightBipartiteElement;
    }

    console.error("divided", leftBipartite, rightBipartite);
    console.error(maximalNodes);
    // leftBipartite, rightBipartite ok1
    // maximalNodes ok1
    step = step / 2;
    this.#buildConfluent(leftBipartite, idx - step, step, Math.abs(depth) + 1);
    this.#buildConfluent(rightBipartite, idx + step, step, Math.abs(depth) + 1);
  }

  // build実行したら必ずこの関数を実行する
  #afterBuildProcess() {
    this.bipartitesAll.sort((a, b) => a.h - b.h);
    this.bipartitesInfo.sort((a, b) => a.h - b.h);
    this.bipartites = structuredClone(this.bipartitesAll)
      .filter((bipartite) => Math.abs(bipartite.depth) === +this.maxDepth)
      .sort((a, b) => a.h - b.h);
  }
}

export default Confluent;
