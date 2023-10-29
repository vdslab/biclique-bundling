import "./App.css";
import useMaximalGammaQuasiBicliqueByBruteForce from "./hooks/useMaximalGammaQuasiBicliqueByBruteForce";
import useMuQuasiBiclique from "./hooks/useMuQuasiBiclique";
import usePaths from "./hooks/usePaths";
import useConfluent from "./hooks/useConfluent";
function App() {
  const width = 1300;
  const height = 3000;

  const param = 0.7;
  const nodeRadius = 4;

  // const leftX = 100;
  // const leftY = 10;

  // const rightX = 1100;
  // const rightY = 10;

  // const step = 40;
  // const { bipartiteMatrix, maximalNodes } = useMuQuasiBiclique(gamma);
  // const { paths, lines, leftNodes, rightNodes, midNodes } = usePaths(
  //   bipartiteMatrix,
  //   maximalNodes,
  //   leftX,
  //   leftY,
  //   rightX,
  //   rightY,
  //   step
  // );

  const {
    paths,
    lines,
    leftNodes,
    rightNodes,
    midNodes,
    leftNodesOrder,
    rightNodesOrder,
  } = useConfluent(0.7);

  return (
    <>
      {console.log("Render APP")}
      <p>γ:{param}</p>

      <svg width={width} height={height} style={{ border: "solid 1px" }}>
        <g>
          {paths?.map((path, key) => {
            return (
              <path
                d={path}
                stroke="silver"
                strokeWidth="0.7"
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
                strokeWidth="0.7"
                fill="transparent"
                opacity={0.7}
              />
            );
          })}
        </g>
        <g>
          {leftNodes?.map((node, key) => {
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

          {leftNodes?.map((node, key) => {
            return (
              <text x={node.x - 20} y={node.y + 20} font-size="25">
                {leftNodesOrder[key]}
              </text>
            );
          })}

          {rightNodes?.map((node, key) => {
            return (
              <text x={node.x + 10} y={node.y + 20} font-size="25">
                {rightNodesOrder[key]}
              </text>
            );
          })}
        </g>
      </svg>
    </>
  );
}

export default App;
