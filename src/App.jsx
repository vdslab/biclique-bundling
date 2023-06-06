import "./App.css";
import useMaximalGammaQuasiBicliqueByBruteForce from "./hooks/useMaximalGammaQuasiBicliqueByBruteForce";
import usePaths from "./hooks/usePaths";

function App() {
  const gamma = 0.8;
  const nodeRadius = 4;

  const bipartiteMatrix = [
    [1, 1, 1, 0, 0],
    [1, 0, 0, 1, 1],
    [1, 1, 1, 0, 1],
  ];

  const leftX = 300;
  const leftY = 100;

  const rightX = 700;
  const rightY = 100;

  const step = 80;

  const { paths, leftNodes, rightNodes, midNodes } = usePaths(
    ...useMaximalGammaQuasiBicliqueByBruteForce(bipartiteMatrix, gamma),
    leftX,
    leftY,
    rightX,
    rightY,
    step,
    bipartiteMatrix.length,
    bipartiteMatrix[0].length,
  );

  return (
    <>
    {console.log("Render")}
      <p>γ:{gamma}</p>

      <svg width="1000" height="500" style={{ border: "solid 1px" }}>
        <g>
          {paths?.map((path, key) => {
            return (
              <path
                d={path}
                stroke="silver"
                strokeWidth="1"
                fill="transparent"
              />
            );
          })}

          {leftNodes?.map((node, key) => {
            console.log(leftNodes)
            return (
              <circle cx={node.x} cy={node.y} r={nodeRadius} fill="blue" />
            );
          })}

          {rightNodes?.map((node, key) => {
            return (
              <circle cx={node.x} cy={node.y} r={nodeRadius} fill="blue" />
            );
          })}

          {midNodes?.map((node, key) => {
            return (
              <circle cx={node.x} cy={node.y} r={0.7 * nodeRadius} fill="red" />
            );
          })}
        </g>
      </svg>
    </>
  );
}

export default App;
