import { useState, useEffect} from "react";

const useMaxRect = (gamma) => {
  const [maximalNodes, setMaximalNodes] = useState({});
  const [bipartiteMatrix, setBipartiteMatrix] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await fetch("/matrix_5_5_70.json");
      const matrixJson = await res.json();
      const bipartiteMatrix = matrixJson["1"];

      const ec = new Array();
      setBipartiteMatrix(structuredClone(bipartiteMatrix));
      let F = [...bipartiteMatrix];
      let R = Array(bipartiteMatrix.length)
        .fill()
        .map((index, key) => {
          return key;
        });

      let EdgeNumber = 0;
      for(const vector of bipartiteMatrix) {
        for(const element of vector) {
          EdgeNumber += element;
        }
      }
      for (let i = 0; i < EdgeNumber; i++) {
        const S = new Array();
        let T = Array(bipartiteMatrix[0].length)
          .fill()
          .map((index, key) => {
            return key;
          });

        let Smax = [...S];
        let Tmax = [...T];

        R.sort((a, b) => {
          let anum = 0;
          let bnum = 0;

          for(const f of F) {
            anum += f;
          }

          for(const f of F) {
            bnum += f;
          }

          return anum > bnum;
        });

        for (const u of R) {
          //S <- S U {u}
          S.push(u);

          //T <- T AND tail(u)
          const TAndTail = new Array();
          for (const l of T) {
            if (!F[u][l]) continue;
            TAndTail.push(l);
          }
          T = [...TAndTail];

          if (d(S, T) > d(Smax, Tmax)) {
            Smax = [...S];
            Tmax = [...T];
          }
        }

        if (d(Smax, Tmax) >= 0) {
          //F <- F \ (Smax ×　Tmax);
          //append Smax ×　Tmax to ec

          for (const left of Smax) {
            for (const right of Tmax) {
              F[left][right] = 0;
            }
          }

          ec.push({ left: Smax, right: Tmax });
          R = [...U];
        } else {
          // remove first R
          R.shift();
        }

        if (R.length <= 0) {
          break;
        }
      }

      setMaximalNodes(ec);
    })();
  }, []);

  return {bipartiteMatrix, maximalNodes};
  /*return のスキーム
      [
        {left:[0, 1, 2], right:[1, 2]},
        {left:[0, 1, 2], right:[1, 2]},
        {left:[0, 0, 2], right:[, 2]},
      ]
    */
};

const d = () => {
  return 1;
}

export default useMaxRect;
