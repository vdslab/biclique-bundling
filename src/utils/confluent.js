class Confluent {
  constructor(getBicliqueCover) {
    this.layeredNodes = new Array();
    this.bipartites = new Array();
    this.getBicliqueCover = getBicliqueCover;
  }


  build(mu, bipartite, idx, step, depth) {
    depth = idx >= 0 ? Math.abs(depth) : -1 * Math.abs(depth);
    let maximalNodes;
    if (depth <= 0) {
      maximalNodes = this.getBicliqueCover(mu, bipartite, true);
    } else {
      maximalNodes = this.getBicliqueCover(mu, bipartite, false);
    }

    //最初のバイクリーク0は見逃す
    if ((maximalNodes.length === 0 && step < 1) || Math.abs(depth) > 3) {
      //console.error(idx, depth, bipartite);
      this.bipartites.push({ h: idx, depth, bipartite, maximalNodes, step });
      return;
    }

    const leftNodeNumber = bipartite.length;
    const rightNodeNumber = bipartite[0].length;

    const oneSizeBicluster = new Array();
    for (let leftIdx = 0; leftIdx < leftNodeNumber; leftIdx++) {
      for (let rightIdx = 0; rightIdx < rightNodeNumber; rightIdx++) {
        if (!bipartite[leftIdx][rightIdx]) continue;
        if (this.#allIsIn(maximalNodes, leftIdx, rightIdx)) continue;
        oneSizeBicluster.push({ left: [leftIdx], right: [rightIdx] });
      }
    }
    maximalNodes.push(...oneSizeBicluster);

    // グローバル変数に格納
    this.layeredNodes.push({ h: idx, maximalNodes });

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

    // console.error("leftBipartite", leftBipartite);
    // console.error("rightBipartite", rightBipartite);
    // console.error("maximal node", maximalNodes);
    // グローバル関数に格納する

    step = step / 2;

    this.build(mu, rightBipartite, idx + step, step, Math.abs(depth) + 1);
    this.build(mu, leftBipartite, idx - step, step, Math.abs(depth) + 1);
  }

  #allIsIn(maximalBiclusterNodes, left, right) {
    for (const bicluster of maximalBiclusterNodes) {
      const leftNodeSet = new Set(bicluster.left);
      const rightNodeSet = new Set(bicluster.right);

      if (leftNodeSet.has(left) && rightNodeSet.has(right)) {
        return true;
      }
    }

    return false;
  }
}

export default Confluent;


