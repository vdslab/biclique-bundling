import { useEffect, useState } from "react";
import {
  getAllEnumNodes,
  getMaximalCandNodes,
  getMaximalNodes,
} from "../utils/getNodes";

const useMaximalGammaQuasiBicliqueByBruteForce = (bipartiteMatrix, gamma) => {
  const [l, setL] = useState([]);
  const [r, setR] = useState([]);
  useEffect(() => {
    const leftNodeNumber = bipartiteMatrix.length;
    const rightNodeNumber = bipartiteMatrix[0].length;

    const leftAllEnumNodes = getAllEnumNodes(leftNodeNumber);
    const rightAllEnumNodes = getAllEnumNodes(rightNodeNumber);

    const [leftMaximalCandNodes, rightMaxmalCandNodes] = getMaximalCandNodes(
      bipartiteMatrix,
      leftAllEnumNodes,
      rightAllEnumNodes,
      gamma
    );

    const [leftMaximalNodes, rightMaximalNodes] = getMaximalNodes(
      leftMaximalCandNodes,
      rightMaxmalCandNodes
    );

    setL(leftMaximalNodes);
    setR(rightMaximalNodes);

    console.log(leftMaximalNodes);
    console.log(rightMaximalNodes);
    console.log("buru fini");
  }, []);

  return [l,r];
};

export default useMaximalGammaQuasiBicliqueByBruteForce;
