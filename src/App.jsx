import "./App.css";
import useMaximalGammaQuasiBicliqueByBruteForce from "./hooks/useMaximalGammaQuasiBicliqueByBruteForce";
import usePaths from "./hooks/usePaths";

function App() {
  const gamma = 0.8;
  const nodeRadius = 4;

  const leftX = 300;
  const leftY = 100;

  const rightX = 700;
  const rightY = 100;

  const step = 80;
  const { bipartiteMatrix, maximalNodes } =
    useMaximalGammaQuasiBicliqueByBruteForce(gamma);
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
                opacity={0.3}
              />
            );
          })}

          {lines?.map((line, key) => {
            return (
              <line
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="silver"
                strokeWidth="1.3"
                fill="transparent"
                opacity={0.3}
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
