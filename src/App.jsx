import "./App.css";
import useColaConfluent from "./hooks/useColaConfluent";
import { useState } from "react";
import * as d3 from "d3";

function App() {
  const [width, setWidth] = useState(2400);
  const height = 1200;
  const fontSize = 36;

  const [param, setParam] = useState(-1.0);
  const [rangeParam, setRangeParam] = useState(param);
  const [maxDepth, setMaxDepth] = useState(1);
  const [isMidShow, setIsMidShow] = useState(false);
  const [isFCLD, setIsFCLD] = useState(true);

  const [url, setUrl] = useState("public/random/json/random_7_7_75_2.json");
  const [displayUrl, setDisplayUrl] = useState(url);

  const { paths, nodes, nodeLabels, crossCount, weightedCrossCount } =
    useColaConfluent(param, url, maxDepth, fontSize, isFCLD, width, height);

  function downloadSvgAsPng() {
    // svg要素を取得
    const svgNode = document.querySelector("svg");
    const svgText = new XMLSerializer().serializeToString(svgNode);
    console.log(svgText);
    const svgBlob = new Blob([svgText], {
      type: "image/svg+xml;charset=utf-8",
    });
    const svgUrl = URL.createObjectURL(svgBlob);

    // Imageオブジェクトを生成
    const im = new Image();

    // Imageの作成に少し時間がかかるため、addEventListnerで行う
    im.addEventListener("load", () => {
      const width = svgNode.getAttribute("width");
      const height = svgNode.getAttribute("height");

      // canvasを作成
      const cvs = document.createElement("canvas");
      cvs.setAttribute("width", width);
      cvs.setAttribute("height", height);
      const ctx = cvs.getContext("2d");

      // canvasに描画(背景は透過)
      ctx.drawImage(im, 0, 0, width, height);
      const imgUrl = cvs.toDataURL("image/png");

      // a要素を作ってダウンロード
      const a = document.createElement("a");
      a.href = imgUrl;
      a.download = `${url}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(svgUrl);
      URL.revokeObjectURL(imgUrl);
    });

    // Imageオブジェクトを、svgデータから作成
    im.src = svgUrl;
  }

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
        <span>width:</span>
        <input
          type="number"
          value={width}
          onChange={(e) => setWidth(e.target.value)}
        />
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

        <button
          onClick={() => {
            downloadSvgAsPng();
          }}
        >
          PNGとしてダウンロード
        </button>
      </div>

      <svg
        width={width}
        height={height}
        viewBox={`0, 0, ${width}, ${height}`}
        style={{ border: "solid 1px" }}
      >
        <g>
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

          {nodes?.map((node, key) => {
            return (
              <g key={key}>
                <text
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
                    x={node.x - fontSize / 4.5}
                    y={node.y - fontSize / 1.175}
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
              </g>
            );
          })}
        </g>
      </svg>
    </>
  );
}

export default App;
