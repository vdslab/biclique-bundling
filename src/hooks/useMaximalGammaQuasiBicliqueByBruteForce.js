import { useEffect, useState } from "react";
import {
  getAllEnumNodes,
  getMaximalCandNodes,
  getMaximalNodes,
} from "../utils/getNodes";

const useMaximalGammaQuasiBicliqueByBruteForce = (gamma) => {
  const [maximalNodes, setMaximalNodes] = useState({});

  useEffect(() => {
    (async () => {
      console.log("MOOOOOOOoooo")
      const res = await fetch('./../../matrix_5_5_70.json');
      const matrixJson = await res.json();
      console.log("json", matrixJson);
      const bipartiteMatrix = matrixJson['4'];

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



      const maximalObjs = new Array();
      for(let i = 0; i < leftMaximalNodes.length; i++) {
        maximalObjs.push({left:leftMaximalNodes[i], right:rightMaximalNodes[i]});
      }

      console.log("UOOOOOO", maximalObjs);

      setMaximalNodes(maximalObjs);

      console.log("buru fini");

    })();
  }, []);

  return maximalNodes;
  /*return のスキーム
    [
      {left:[0, 1, 2], right:[1, 2]},
      {left:[0, 1, 2], right:[1, 2]},
      {left:[0, 0, 2], right:[, 2]},
    ]
  */
};

export default useMaximalGammaQuasiBicliqueByBruteForce;
