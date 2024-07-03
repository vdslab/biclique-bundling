import "./App.css";
import useColaConfluent from "./hooks/useColaConfluent";
import { useState } from "react";
import * as d3 from "d3";

function App() {
  const width = 2300;
  const height = 3000;
  const fontSize = 14;

  const [param, setParam] = useState(-1.0);
  const [rangeParam, setRangeParam] = useState(param);
  const [maxDepth, setMaxDepth] = useState(1);

  const [url, setUrl] = useState("public/random/json/random_7_7_75_2.json");
  const [displayUrl, setDisplayUrl] = useState(url);

  const { paths, nodes, nodeLabels, crossCount } = useColaConfluent(
    param,
    url,
    maxDepth,
    fontSize
  );

  return (
    <>
      {console.log("Render APP")}
      <p>param:{param}</p>
      <p>crossCount:{crossCount}</p>
      <div>
        <p>{url}</p>
        <input
          type="text"
          style={{ width: "400px" }}
          value={displayUrl}
          onChange={(e) => setDisplayUrl(e.target.value)}
        />
        <button type="button" onClick={() => setUrl(displayUrl)}>
          データ適用
        </button>
      </div>
      <br />
      <span>depth:</span>
      <input
        type="number"
        min="0"
        max="10"
        value={maxDepth}
        onChange={(e) => setMaxDepth(e.target.value)}
      />
      <br />
      <input
        id="param_input"
        type="range"
        min="0"
        max="1.0"
        step="0.01"
        value={rangeParam}
        onChange={(e) => setRangeParam(e.target.value)}
      />
      <p>{param < 0 || param > 1.0 ? "default" : rangeParam}</p>
      <button type="button" onClick={() => setParam(rangeParam)}>
        パラメータ適用
      </button>
      <svg width={width} height={height} style={{ border: "solid 1px" }}>
        <g>
          {paths?.map((path, key) => {
            return (
              <g key={key}>
                <path
                  key={key}
                  d={path.path.d}
                  stroke={path.color || d3.schemeSet2[7]}
                  strokeWidth={0.2}
                  fill="silver"
                  opacity={0.7}
                />
              </g>
            );
          })}
        </g>

        <g>
          {nodes?.map((node, key) => {
            return (
              <text
                key={key}
                x={node.x}
                y={node.y}
                fontSize={fontSize}
                fill="black"
              >
                {
                  // nodeLabels[key].isShow &&
                  nodeLabels[key]["label"]
                }
              </text>
            );
          })}
        </g>
      </svg>
    </>
  );
}

export default App;
