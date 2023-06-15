import { useEffect, useState } from "react";
import {
  getAllEnumNodes,
  getMaximalCandNodes,
  getMaximalNodes,
} from "../utils/getNodes";

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
      const res = await fetch("/matrix_5_5_70.json");
      const matrixJson = await res.json();
      const bipartite = matrixJson["2"];
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
        if (!isIn(obj, MatrixClone)) continue;
        subMaximalObjs.push(obj);
      }

      console.log("FKDKFS", subMaximalObjs);
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

const isIn = (obj, bipartite) => {
  let d =
    obj.left.length * obj.right.length - obj.left.length - obj.right.length;
  const edgeDeleted = new Array();
  for (const left of obj.left) {
    for (const right of obj.right) {
      if (!bipartite[left][right]) {
        d--;
      } else {
        console.log("pov", left, right);
        //mtc[left][right] = 0;
        edgeDeleted.push({left: left, right: right});
      }
    }
  }

  console.error(obj, d);
  if (d >= 0) {
    edgeDeleted.forEach((edge) => {
      bipartite[edge.left][edge.right] = 0;
    });

    return true;
  } else {
    return false;
  }
};

export default useMaximalGammaQuasiBicliqueByBruteForce;
