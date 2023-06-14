import { useState, useEffect } from "react";
import { objectOnePropertytoProgression, sumCordinates } from "../utils/calc";
import * as d3 from "d3";
const usePaths = (
  bipartiteMatrix,
  maximalNodes,
  leftX,
  leftY,
  rightX,
  rightY,
  step
) => {
  const [paths, setPaths] = useState([]);
  const [lines, setLines] = useState([]);

  const [leftNodes, setLeftNodes] = useState([]);
  const [rightNodes, setRightNodes] = useState([]);
  const [midNodes, setMidNodes] = useState([]);

  const linkGenerator = d3.linkHorizontal();
  //const lineGenerator = d3.line().x(d => x(d.x)).y(d => y(d.y));;

  useEffect(() => {
    const leftNodeNumber = bipartiteMatrix?.length;
    const rightNodeNumber = bipartiteMatrix[0]?.length;

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

    //左から右へ直線を通す
    const lineData = new Array();

    for (let left = 0; left < leftNodeNumber; left++) {
      for (let right = 0; right < rightNodeNumber; right++) {
        if (f(maximalNodes, left, right)) {
          console.log("EEEEEEEEEEeeee")
          continue;
        }
        if (!bipartiteMatrix[left][right]) continue;

        console.log(left, right);
        lineData.push({
          x1: lefts[left].x,
          y1: lefts[left].y,
          x2: rights[right].x,
          y2: rights[right].y,
        });
      }
    }

    console.log(bipartiteMatrix);
    console.log("wooooooooooooooooooooooooooo", lineData);

    setMidNodes(midNodesCopy);
    setPaths(
      outputPaths.map((d) => {
        return linkGenerator(d);
      })
    );
    setLines(lineData);
  }, [maximalNodes]);

  return { paths, lines, leftNodes, rightNodes, midNodes };
};

const f = (maximalNodes, left, right) => {
  for(const node of maximalNodes) {
    const leftNodeSet = new Set(node.left);
    const rightNodeSet = new Set(node.right);

    if(leftNodeSet.has(left) && rightNodeSet.has(right)) {
      console.log("wewewewewwwwwwwwwwwwwwwwwwwwwwwwwwwww", left, right)
      return true;
    }
  };

  return false;
}
export default usePaths;
