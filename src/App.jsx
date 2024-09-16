import "./App.css";
import useColaConfluent from "./hooks/useColaConfluent";
import { useState } from "react";
import * as d3 from "d3";

function App() {
  const width = 3000;
  const height = 3000;
  const fontSize = 32;

  const [param, setParam] = useState(-1.0);
  const [rangeParam, setRangeParam] = useState(param);
  const [maxDepth, setMaxDepth] = useState(1);
  const [isMidShow, setIsMidShow] = useState(false);

  const [url, setUrl] = useState("public/random/json/random_7_7_75_2.json");
  const [displayUrl, setDisplayUrl] = useState(url);

  const { paths, nodes, nodeLabels, crossCount, weightedCrossCount } =
    useColaConfluent(param, url, maxDepth, fontSize);

  return (
    <>
      {console.log("Render APP")}
      <div>
        <p>param:{param}</p>
        <p>crossCount:{crossCount}</p>
        <p>weightedCross:{weightedCrossCount}</p>
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

        <div>
          <input
            type="checkbox"
            id="mid"
            checked={isMidShow}
            onChange={() => {
              setIsMidShow(!isMidShow);
            }}
          />
          <label htmlFor="mid">中間ノードを表示</label>
        </div>
      </div>

      <svg width={width} height={height} style={{ border: "solid 1px" }}>
        <g>
          {paths?.map((path, key) => {
            return (
              <path
                key={key}
                d={path.path.d}
                stroke={path.color || d3.schemeSet2[7]}
                strokeWidth={Number(maxDepth) ? 0.2 : 1}
                fill="silver"
                opacity={0.75}
              />
            );
          })}

          {nodes?.map((node, key) => {
            return (
              <text
                key={key}
                x={node.x}
                y={node.y}
                fontSize={
                  isMidShow ? fontSize : nodeLabels[key].isShow ? fontSize : 0
                }
                fill="black"
              >
                {nodeLabels[key]["label"]}
              </text>
            );
          })}
        </g>
      </svg>
    </>
  );
}

export default App;
