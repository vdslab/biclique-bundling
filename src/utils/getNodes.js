import { isEqual, isSuperset } from "./set_calc";

export const getAllEnumNodes = (nodeNumber) => {
  const allEnumNodes = new Array();
  for (let bit = 0; bit < 1 << nodeNumber; bit++) {
    const nodeSet = new Array();
    for (let i = 0; i < nodeNumber; i++) {
      if (bit & (1 << i)) {
        nodeSet.push(i);
      }
    }
    allEnumNodes.push(nodeSet);
  }

  return allEnumNodes;
};

export const getMaximalCandNodes = (
  bipartiteMatrix,
  leftAllEnumNodes,
  rightAllEnumNodes,
  gamma
) => {
  const leftMaximalCandNodes = new Array();
  const rightMaxmalCandNodes = new Array();

  for (const leftNodeSet of leftAllEnumNodes) {
    for (const rightNodeSet of rightAllEnumNodes) {
      const leftNodeSetNumber = leftNodeSet.length;
      const rightNodeSetNumber = rightNodeSet.length;

      if (leftNodeSetNumber < 2 && rightNodeSetNumber < 2) {
        continue;
      }

      let edgeNumber = 0;

      for (const l of leftNodeSet) {
        for (const r of rightNodeSet) {
          if (bipartiteMatrix[l][r]) {
            edgeNumber++;
          }
        }
      }

      if (edgeNumber >= gamma * leftNodeSetNumber * rightNodeSetNumber) {
        leftMaximalCandNodes.push(leftNodeSet);
        rightMaxmalCandNodes.push(rightNodeSet);
      }
    }
  }

  return [leftMaximalCandNodes, rightMaxmalCandNodes];
};

export const getMaximalNodes = (
  leftMaximalCandNodes,
  rightMaximalCandNodes
) => {
  const leftMaximalNodes = new Array();
  const rightMaximalNodes = new Array();

  if (leftMaximalCandNodes.length !== rightMaximalCandNodes.length) {
    throw new Error("Invalid");
  }

  for (let i = 0; i < leftMaximalCandNodes.length; i++) {
    const leftMaximalCandNodeSet = new Set(leftMaximalCandNodes[i]);
    const rightMaximalCandNodeSet = new Set(rightMaximalCandNodes[i]);

    let isMaximal = true;

    for (let k = 0; k < leftMaximalCandNodes.length; k++) {
      const lleftMaximalCandNodeSet = new Set(leftMaximalCandNodes[k]);
      const rrightMaximalCandNodeSet = new Set(rightMaximalCandNodes[k]);

      if (
        isEqual(leftMaximalCandNodeSet, lleftMaximalCandNodeSet) &&
        isEqual(rightMaximalCandNodeSet, rrightMaximalCandNodeSet)
      ) {
        continue;
      }

      if (
        isSuperset(lleftMaximalCandNodeSet, leftMaximalCandNodeSet) &&
        isSuperset(rrightMaximalCandNodeSet, rightMaximalCandNodeSet)
      ) {
        isMaximal = false;
        break;
      }
    }

    if (isMaximal) {
      console.log("Maximal******************");
      console.log(leftMaximalCandNodeSet);
      console.log(rightMaximalCandNodeSet);

      leftMaximalNodes.push([...leftMaximalCandNodeSet]);
      rightMaximalNodes.push([...rightMaximalCandNodeSet]);
    }
  }

  return [leftMaximalNodes, rightMaximalNodes];
};
