import { useState, useEffect } from "react";
import { objectOnePropertytoProgression, sumCordinates } from "../utils/calc";
import * as d3 from "d3";
const usePaths = (
  maximalNodes,
  leftX,
  leftY,
  rightX,
  rightY,
  step,
  leftNodeNumber,
  rightNodeNumber
) => {
  const [paths, setPaths] = useState([]);
  const [leftNodes, setLeftNodes] = useState([]);
  const [rightNodes, setRightNodes] = useState([]);
  const [midNodes, setMidNodes] = useState([]);
  const linkGenerator = d3.linkHorizontal();

  useEffect(() => {

    const lefts = objectOnePropertytoProgression(
      leftNodeNumber,
      step,
      leftX,
      leftY
    );

    const rights = objectOnePropertytoProgression(
      rightNodeNumber,
      step,
      rightX,
      rightY
    );

    console.log("pathss", rights, lefts);
    setLeftNodes(lefts);
    setRightNodes(rights);

    const midNodesCopy = new Array();
    const outputPaths = new Array();

    for (let i = 0; i < maximalNodes.length; i++) {
      const midX = (rightX + leftX) / 2;
      const midY =
        (sumCordinates(lefts, maximalNodes[i].left) +
          sumCordinates(rights, maximalNodes[i].right)) /
        (maximalNodes[i].left.length + maximalNodes[i].right.length);

      console.log(midX, midY);
      midNodesCopy.push({ x: midX, y: midY });

      for (const l of maximalNodes[i].left) {
        console.log("xxxxxxxx");
        outputPaths.push({
          source: [lefts[l].x, lefts[l].y],
          target: [midX, midY],
        });
      }

      for (const r of maximalNodes[i].right) {
        console.log("yyyyyyyy");
        outputPaths.push({
          source: [midX, midY],
          target: [rights[r].x, rights[r].y],
        });
      }
    }

    setMidNodes(midNodesCopy);
    setPaths(
      outputPaths.map((d) => {
        return linkGenerator(d);
      })
    );
  }, [maximalNodes]);

  return { paths, leftNodes, rightNodes, midNodes };
};

export default usePaths;
