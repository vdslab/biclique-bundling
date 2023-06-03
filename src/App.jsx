import { useState, useEffect } from "react";
import "./App.css";
import * as d3 from "d3";

function App() {
  const [path, setPath] = useState("");
  const [path1, setPath1] = useState("");
  useEffect(() => {
    const link = d3.linkHorizontal();

    console.log(
      link({
        source: [100, 100],
        target: [300, 300],
      })
    );

    setPath(
      link({
        source: [100, 100],
        target: [300, 300],
      })
    );

    setPath1(
      link({
        source: [100, 120],
        target: [300, 300],
      })
    );
  }, []);

  return (
    <>
      <svg width="1000" height="1000" xmlns="http://www.w3.org/2000/svg">
        <path d={path} stroke="black" fill="transparent" />
        <path d={path1} stroke="black" fill="transparent" />
      </svg>
    </>
  );
}

export default App;
