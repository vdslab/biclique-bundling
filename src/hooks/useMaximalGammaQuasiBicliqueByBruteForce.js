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
  const [maximalNodes, setMaximalNodes] = useState({});

  useEffect(() => {
    (async () => {
      const res = await fetch('/matrix_5_5_70.json');
      const matrixJson = await res.json();
      const bipartiteMatrix = matrixJson['1'];
      let MatrixClone = [...bipartiteMatrix];
      console.log(MatrixClone)
      console.log(bipartiteMatrix);

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

      //maxRect
      maximalObjs.sort((a, b) => {

        const aa = a.left.length * a.right.length;
        const bb = b.left.length * b.right.length;
        console.log(aa, bb);
        return -(bb - aa);
      });


      const subMaximalObjs = new Array();
      console.log(MatrixClone);
      for(const obj of maximalObjs) {
        console.log(MatrixClone);
        if(!isIn(obj, MatrixClone)) continue;
        subMaximalObjs.push(obj);
      }

      console.log("FKDKFS", subMaximalObjs);
      setMaximalNodes(subMaximalObjs);

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

const isIn = (obj, bipartiteMatrix) => {
  let d = obj.left.length * obj.right.length - obj.left.length - obj.right.length;
  const mtc = [...bipartiteMatrix];
  console.log("moto", d);
  console.log("str", obj);
  for(const left of obj.left) {
    for(const right of obj.right) {
      if(!mtc[left][right]) {
        d --;
      } else {
        console.log("pov",left, right);
        mtc[left][right] = 0;
      }
    }
  }

  console.log("dddd", d);
  if(d > 0) {
    bipartiteMatrix = [...mtc];
    console.error("hoihoi");
    return true;
  } else {
    return false;
  }
}

export default useMaximalGammaQuasiBicliqueByBruteForce;
