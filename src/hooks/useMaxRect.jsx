
const useMaxRect = (gamma) => {
    const [maximalNodes, setMaximalNodes] = useState({});

    useEffect(() => {
      (async () => {
        const res = await fetch('/matrix_5_5_70.json');
        const matrixJson = await res.json();
        const bipartiteMatrix = matrixJson['1'];

        const F = [...bipartiteMatrix];
        const R = Array(bipartiteMatrix.length).fill().map((index, key) => {
          return key;
        });

        const EdgeNumber = 15;
        for(let i = 0; i < EdgeNumber; i++) {
            const S = new Array();
            const T = Array(bipartiteMatrix[0].length).fill().map((index, key) => {
              return key;
            });

            let Smax = [...S];
            let Tmax = [...T];

            R.sort((a, b) => {

            });

            for(const u of R) {
              S.push(u);
              const TAndTail = Array();
              for(const l of T) {
                if(E[u][l]) {

                }
              }

              if(d(S, T) > d(Smax, Tmax)) {
                Smax = [...S];
                Tmax = [...T];
              }
            }

            if(d(Smax, Tmax) >= 0) {
              //F <- F \ (Smax ×　Tmax);
              //append Smax ×　Tmax to ec


              for(const left of Smax) {
                for(const right of Tmax) {
                  F[left][right] = 0;
                }
              }

              ec.push({ left:Smax, right:Tmax });
              R = [...U];
            } else {
              // remove first R
              R.shift();
            }

            if(R.length <= 0) {
              break;
            }
        }

        setMaximalNodes(ec);
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

  export default useMaxRect;
