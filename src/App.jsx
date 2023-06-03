import { useState, useEffect } from "react";
import "./App.css";
import * as d3 from "d3";

function App() {
  const [paths, setPaths] = useState([]);
  const data = [
    {
      source: [100, 120],
      target: [200, 200],
    },
    {
      source: [100, 140],
      target: [200, 200],
    },
    {
      source: [100, 150],
      target: [200, 200],
    },
    {
      source: [300, 120],
      target: [200, 200],
    },
    {
      source: [300, 140],
      target: [200, 200],
    },
    {
      source: [300, 150],
      target: [200, 200],
    },
  ];
  useEffect(() => {
    const linkGenerator = d3.linkHorizontal();

    setPaths(
      data.map((d) => {
        return linkGenerator(d);
      })
    );
  }, []);

  return (
    <>
      <svg width="1000" height="1000" xmlns="http://www.w3.org/2000/svg">
        {paths?.map((path, key) => {
          console.log(path);
          return (
            <path
              d={path}
              stroke="silver"
              stroke-width="2"
              fill="transparent"
            />
          );
        })}

        {data?.map((datum, key) => {
          return (
            <>
              <circle
                cx={datum.source[0]}
                cy={datum.source[1]}
                r="3"
                fill="blue"
              />

              <circle
                cx={datum.target[0]}
                cy={datum.target[1]}
                r="3"
                fill="blue"
              />
            </>
          );
        })}

        <circle cx={200} cy={200} r="20" fill="blue" />

        <circle cx={170} cy={90} r="20" fill="red" />

        <circle cx={230} cy={90} r="20" fill="red" />

        <circle cx={170} cy={90} r="9" fill="white" />

        <circle cx={230} cy={90} r="9" fill="white" />

        <line
          x1="200"
          y1="220"
          x2="200"
          y2="270"
          stroke="silver"
          stroke-width="2"
          fill="transparent"
        />

        <path
          d="M 90 270 C 110 250, 290 310, 310 270"
          stroke="silver"
          stroke-width="2"
          fill="transparent"
        />

        <path
          d="M 90 270 C 110 310, 290 350, 310 270"
          stroke="silver"
          stroke-width="2"
          fill="transparent"
        />
      </svg>
    </>
  );
}

export default App;
