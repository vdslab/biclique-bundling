import { useEffect, useState } from "react";
import {
  getAllEnumNodes,
  getMaximalCandNodes,
  getMaximalNodes,
} from "../utils/getNodes";

import isReduceEdgeMaximal from "../utils/isReduceEdgeMaximal";
/* [[1,1,1,0,1]
,[1,1,1,0,0],
[1,1,0,0,0],
[0,0,1,0,1],
[1,1,1,1,0]]
*/
const useMaximalGammaQuasiBicliqueByBruteForce = (gamma) => {
  const [maximalNodes, setMaximalNodes] = useState([]);
  const [bipartiteMatrix, setBipartiteMatrix] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await fetch("public/random/json/random_5_5_70_1.json");
      //const matrixJson = await res.json();
      const bipartite = await res.json();
      console.log("FFFFFFFFFFFF", bipartite);

      let MatrixClone = [...bipartite];
      setBipartiteMatrix(structuredClone(MatrixClone));
      console.log(MatrixClone);
      console.log(bipartite);

      const leftNodeNumber = bipartite.length;
      const rightNodeNumber = bipartite[0].length;

      const leftAllEnumNodes = getAllEnumNodes(leftNodeNumber);
      const rightAllEnumNodes = getAllEnumNodes(rightNodeNumber);

      const [leftMaximalCandNodes, rightMaxmalCandNodes] = getMaximalCandNodes(
        bipartite,
        leftAllEnumNodes,
        rightAllEnumNodes,
        gamma
      );
      console.log("dfsdafdsfafdsdfsadfsa", leftMaximalCandNodes,rightMaxmalCandNodes)
      const [leftMaximalNodes, rightMaximalNodes] = getMaximalNodes(
        leftMaximalCandNodes,
        rightMaxmalCandNodes
      );

      const maximalObjs = new Array();
      for (let i = 0; i < leftMaximalNodes.length; i++) {
        maximalObjs.push({
          left: leftMaximalNodes[i],
          right: rightMaximalNodes[i],
        });
      }

      console.log("UOOOOOO", maximalObjs);

      //maximalから抽出
      //maxRect
      maximalObjs.sort((a, b) => {
        const aa = a.left.length * a.right.length;
        const bb = b.left.length * b.right.length;
        console.log(aa, bb);
        return -(bb - aa);
      });

      const subMaximalObjs = new Array();
      console.log(MatrixClone);
      for (const obj of maximalObjs) {
        console.log("FYUUUUUUUUUUUUUUU", MatrixClone);
        if (!isReduceEdgeMaximal(obj, MatrixClone)) continue;
        subMaximalObjs.push(obj);
      }

      console.error("Fgdfghsdftyrtegrfeftdsgfedsgdfs fdgsfgdgfdKDKFS", subMaximalObjs);
      setMaximalNodes(subMaximalObjs);

      console.log("buru fini");
    })();
  }, []);

  return { bipartiteMatrix, maximalNodes };
  /*return のスキーム
    [
      {left:[0, 1, 2], right:[1, 2]},
      {left:[0, 1, 2], right:[1, 2]},
      {left:[0, 0, 2], right:[, 2]},
    ]
  */
};

export default useMaximalGammaQuasiBicliqueByBruteForce;
