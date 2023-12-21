class Confluent {
  constructor(getBicliqueCover, param, maxDepth) {
    this.layeredNodes = new Array();
    this.bipartites = new Array();
    this.bipartitesForColor = new Array();
    this.getBicliqueCover = getBicliqueCover;
    this.param = param;
    this.maxDepth = maxDepth;
    this.bicliqueCover = new Array();
  }

  build(bipartite, idx, step, depth) {
    // /console.error("next", idx, bipartite);
    depth = idx >= 0 ? Math.abs(depth) : -1 * Math.abs(depth);
    const maximalNodes = this.getBicliqueCover(bipartite, this.param);
    console.error("mad", maximalNodes, idx);
    this.bipartitesForColor.push({
      h: idx,
      depth,
      bipartite,
      maximalNodes,
      step,
    });

    //最初のバイクリーク0は見逃す
    if (
      (maximalNodes.length === 0 && step < 1) ||
      Math.abs(depth) >= this.maxDepth
    ) {
      this.bipartites.push({ h: idx, depth, bipartite, maximalNodes, step });
      return;
    }

    this.bicliqueCover.push({ maximalNodes, h: idx });

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

    this.layeredNodes.push({ h: idx, maximalNodes });

    const midNodeNumber = maximalNodes.length;

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

    step = step / 2;

    this.build(rightBipartite, idx + step, step, Math.abs(depth) + 1);
    this.build(leftBipartite, idx - step, step, Math.abs(depth) + 1);
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
