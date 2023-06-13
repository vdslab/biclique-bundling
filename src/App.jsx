import "./App.css";
import useMaximalGammaQuasiBicliqueByBruteForce from "./hooks/useMaximalGammaQuasiBicliqueByBruteForce";
import usePaths from "./hooks/usePaths";

function App() {
  const gamma = 1;
  const nodeRadius = 4;

  const leftX = 300;
  const leftY = 100;

  const rightX = 700;
  const rightY = 100;

  const step = 80;

  const { paths, leftNodes, rightNodes, midNodes } = usePaths(
    useMaximalGammaQuasiBicliqueByBruteForce(gamma),
    leftX,
    leftY,
    rightX,
    rightY,
    step,
    5,
    5
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
