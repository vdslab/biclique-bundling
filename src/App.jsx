import "./App.css";
import useColaConfluent from "./hooks/useColaConfluent";
import { useState } from "react";
import * as d3 from "d3";

function App() {
  const width = 4000;
  const height = 3000;
  const fontSize = 36;

  const [param, setParam] = useState(-1.0);
  const [rangeParam, setRangeParam] = useState(param);
  const [maxDepth, setMaxDepth] = useState(1);
  const [isMidShow, setIsMidShow] = useState(false);
  const [isFCLD, setIsFCLD] = useState(true);

  const [url, setUrl] = useState("public/random/json/random_7_7_75_2.json");
  const [displayUrl, setDisplayUrl] = useState(url);

  const { paths, nodes, nodeLabels, crossCount, weightedCrossCount } =
    useColaConfluent(param, url, maxDepth, fontSize, isFCLD);

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

        <div>
          <input
            type="checkbox"
            id="fcld"
            checked={isFCLD}
            onChange={() => {
              setIsFCLD(!isFCLD);
            }}
          />
          <label htmlFor="fcld">FCLDを表示</label>
        </div>
      </div>

      <svg width={width} height={height} style={{ border: "solid 1px" }}>
        {paths?.map((path, key) => {
          console.log(path);
          return (
            <path
              key={key}
              d={isFCLD ? path.path.d : path.path}
              stroke={path.color || d3.schemeSet2[7]}
              strokeWidth={Number(maxDepth) && isFCLD ? 0.2 : 2}
              fill={isFCLD ? "silver" : "transparent"}
              opacity={0.75}
            />
          );
        })}

        <g>
          {nodes?.map((node, key) => {
            return (
              <>
                <text
                  key={key}
                  style={{ border: "solid" }}
                  x={node.x}
                  y={node.y}
                  fontSize={
                    isMidShow ? fontSize : nodeLabels[key].isShow ? fontSize : 0
                  }
                  fontFamily={"monospace"}
                  fontWeight={"bold"}
                  fill="black"
                >
                  {nodeLabels[key]["label"]}
                </text>

                {nodeLabels[key].isShow && (
                  <rect
                    key={key}
                    x={node.x - fontSize / 4.5}
                    y={node.y - fontSize / 1.2}
                    width={
                      String(nodeLabels[key]["label"]).length * fontSize -
                      ((String(nodeLabels[key]["label"]).length - 1) *
                        fontSize) /
                        2.5
                    }
                    height={fontSize}
                    stroke="black"
                    fill="transparent"
                    strokeWidth="0.5"
                  />
                )}
              </>
            );
          })}
        </g>
      </svg>
    </>
  );
}

export default App;
