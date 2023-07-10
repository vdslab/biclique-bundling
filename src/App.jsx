import "./App.css";
import useMaximalGammaQuasiBicliqueByBruteForce from "./hooks/useMaximalGammaQuasiBicliqueByBruteForce";
import useMuQuasiBiclique from "./hooks/useMuQuasiBiclique";
import usePaths from "./hooks/usePaths";

function App() {
  const gamma = 0.7;
  const nodeRadius = 4;

  const leftX = 300;
  const leftY = 10;

  const rightX = 700;
  const rightY = 10;

  const step = 60;
  const { bipartiteMatrix, maximalNodes } = useMuQuasiBiclique(gamma);
  const { paths, lines, leftNodes, rightNodes, midNodes } = usePaths(
    bipartiteMatrix,
    maximalNodes,
    leftX,
    leftY,
    rightX,
    rightY,
    step
  );

  return (
    <>
      {console.log("Render APP")}
      <p>γ:{gamma}</p>

      <svg width="1000" height="500" style={{ border: "solid 1px" }}>
        <g>
          {paths?.map((path, key) => {
            return (
              <path
                d={path}
                stroke="silver"
                strokeWidth="1.8"
                fill="transparent"
                opacity={0.9}
              />
            );
          })}

          {lines?.map((line, key) => {
            return (
              <path
                d={line}
                stroke="silver"
                strokeWidth="1.3"
                fill="transparent"
                opacity={0.7}
              />
            );
          })}
        </g>
        <g>
          {leftNodes?.map((node, key) => {
            console.log(leftNodes);
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
