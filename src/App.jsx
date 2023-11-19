import "./App.css";
import useSugiyamaConfluent from "./hooks/useSugiyamaConfluent";
function App() {
  const width = 2300;
  const height = 3000;

  const param = 1.0;
  const nodeRadius = 4;

  const url = "public/random/json/random_7_7_75_1.json";

  const {
    paths,
    lines,
    leftNodes,
    rightNodes,
    midNodes,
    leftNodesOrder,
    rightNodesOrder,
    midNodesOrders,
    crossCount,
  } = useSugiyamaConfluent(param, url);

  return (
    <>
      {console.log("Render APP")}
      <p>param:{param}</p>
      <p>crossCount:{crossCount}</p>
      <svg width={width} height={height} style={{ border: "solid 1px" }}>
        <g>
          {paths?.map((path, key) => {
            return (
              <path
                key={key}
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
                key={key}
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
          {/* {leftNodes?.map((node, key) => {
            return (
              <circle
                key={key}
                cx={node.x}
                cy={node.y}
                r={nodeRadius}
                fill="blue"
              />
            );
          })}

          {rightNodes?.map((node, key) => {
            return (
              <circle
                key={key}
                cx={node.x}
                cy={node.y}
                r={nodeRadius}
                fill="blue"
              />
            );
          })} */}

          {midNodes?.map((node, key) => {
            return (
              <circle
                key={key}
                cx={node.x}
                cy={node.y}
                r={0.5 * nodeRadius}
                fill="red"
              />
            );
          })}

          {/* {leftNodes?.map((node, key) => {
            return (
              <text key={key} x={node.x - 12.5} y={node.y + 10} fontSize="25">
                {leftNodesOrder[key]}
              </text>
            );
          })}

          {rightNodes?.map((node, key) => {
            return (
              <text key={key} x={node.x - 12.5} y={node.y + 10} fontSize="25">
                {rightNodesOrder[key]}
              </text>
            );
          })} */}

          {midNodes?.map((node, key) => {
            return (
              <text key={key} x={node.x} y={node.y + 3.5} fontSize="10">
                {midNodesOrders[key]}
              </text>
            );
          })}
        </g>
      </svg>
    </>
  );
}

export default App;
