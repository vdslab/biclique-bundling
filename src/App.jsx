import { useState, useEffect } from "react";
import "./App.css";
import * as d3 from "d3";

import { isEqual, isSuperset } from "./utils/set_calc";
import { sumCordinates, objectOnePropertytoProgression } from "./utils/calc";

function App() {
  const [paths, setPaths] = useState([]);
  const [leftNodes, setLeftNodes] = useState([]);
  const [rightNodes, setRightNodes] = useState([]);
  const [midNodes, setMidNodes] = useState([]);
  const gamma = 1.0;
  const nodeRadius = 4;

  useEffect(() => {
    const linkGenerator = d3.linkHorizontal();
    const lineGenerator = d3
      .line()
      .x((d) => d.x)
      .y((d) => d.y);

    const bipartiteMatrix = [
      [1, 1, 1, 1, 0],
      [1, 1, 1, 1, 0],
      [1, 1, 1, 1, 0],
    ];

    const leftX = 300;
    const leftY = 100;

    const rightX = 700;
    const rightY = 100;

    const stepY = 80;

    const leftNodeNumber = bipartiteMatrix.length;
    const rightNodeNumber = bipartiteMatrix[0].length;

    const lefts = objectOnePropertytoProgression(
      leftNodeNumber,
      stepY,
      leftX,
      leftY
    );

    const rights = objectOnePropertytoProgression(
      rightNodeNumber,
      stepY,
      rightX,
      rightY
    );

    console.log(lefts, rights);
    console.log(Array(leftNodeNumber));

    const midNodesCopy = new Array();

    const outputPaths = new Array();

    setLeftNodes(lefts);
    setRightNodes(rights);

    console.log(bipartiteMatrix);

    const leftAllEmumNodes = new Array();
    const rightAllEnumNodes = new Array();

    for (let bit = 0; bit < 1 << leftNodeNumber; bit++) {
      const nodeSet = new Array();
      for (let i = 0; i < leftNodeNumber; i++) {
        if (bit & (1 << i)) {
          nodeSet.push(i);
        }
      }
      leftAllEmumNodes.push(nodeSet);
    }

    for (let bit = 0; bit < 1 << rightNodeNumber; bit++) {
      const nodeSet = new Array();
      for (let i = 0; i < rightNodeNumber; i++) {
        if (bit & (1 << i)) {
          nodeSet.push(i);
        }
      }
      rightAllEnumNodes.push(nodeSet);
    }

    //console.log(leftAllEmumNodes);
    //console.log(rightAllEnumNodes);

    const leftMaximalCandNodes = new Array();
    const rightMaxmalCandNodes = new Array();

    for (const leftNodeSet of leftAllEmumNodes) {
      for (const rightNodeSet of rightAllEnumNodes) {
        const leftNodeSetNumber = leftNodeSet.length;
        const rightNodeSetNumber = rightNodeSet.length;

        if (leftNodeSetNumber < 2 || rightNodeSetNumber < 2) {
          continue;
        }

        let edgeNumber = 0;

        for (const l of leftNodeSet) {
          for (const r of rightNodeSet) {
            if (bipartiteMatrix[l][r]) {
              edgeNumber++;
            }
          }
        }

        if (edgeNumber >= gamma * leftNodeSetNumber * rightNodeSetNumber) {
          leftMaximalCandNodes.push(leftNodeSet);
          rightMaxmalCandNodes.push(rightNodeSet);
        }
      }
    }

    /*console.log(leftMaximalCandNodes);
    console.log(rightMaxmalCandNodes);
    console.log([leftMaximalCandNodes, rightMaxmalCandNodes])
    console.log(isEqual(new Set([1, 4, 7]) ,  new Set([4, 3, 7])));*/
    let cc = 0;
    for (let i = 0; i < leftMaximalCandNodes.length; i++) {
      const leftMaximalCandNodeSet = new Set(leftMaximalCandNodes[i]);
      const rightMaximalCandNodeSet = new Set(rightMaxmalCandNodes[i]);

      let isMaximal = true;

      for (let k = 0; k < leftMaximalCandNodes.length; k++) {
        const lleftMaximalCandNodeSet = new Set(leftMaximalCandNodes[k]);
        const rrightMaximalCandNodeSet = new Set(rightMaxmalCandNodes[k]);

        if (
          isEqual(leftMaximalCandNodeSet, lleftMaximalCandNodeSet) &&
          isEqual(rightMaximalCandNodeSet, rrightMaximalCandNodeSet)
        ) {
          continue;
        }

        if (
          isSuperset(lleftMaximalCandNodeSet, leftMaximalCandNodeSet) &&
          isSuperset(rrightMaximalCandNodeSet, rightMaximalCandNodeSet)
        ) {
          isMaximal = false;
          break;
        }
      }

      if (isMaximal) {
        console.log("Maximal******************");
        console.log(leftMaximalCandNodeSet);
        console.log(rightMaximalCandNodeSet);

        const pathData = new Array();
        const midX = (rightX + leftX) / 2;
        const midY =
          (sumCordinates(lefts, [...leftMaximalCandNodeSet]) +
            sumCordinates(rights, [...rightMaximalCandNodeSet])) /
          (leftMaximalCandNodeSet.size + rightMaximalCandNodeSet.size);

        console.log(midX, midY);
        midNodesCopy.push({ x: midX, y: midY });

        for (const l of [...leftMaximalCandNodeSet]) {
          //source:
          //[lefts[l].x,lefts[l].y]

          //target:
          //[midX, midY]
          outputPaths.push({
            source: [lefts[l].x, lefts[l].y],
            target: [midX, midY],
          });
        }

        for (const r of [...rightMaximalCandNodeSet]) {
          outputPaths.push({
            source: [midX, midY],
            target: [rights[r].x, rights[r].y],
          });
        }
      }
    }

    console.log("missing", cc);

    console.log(midNodesCopy);
    setMidNodes(midNodesCopy);
    setPaths(
      outputPaths.map((d) => {
        return linkGenerator(d);
      })
    );
  }, []);

  return (
    <>
      <p>γ:{gamma}</p>

      <svg width="1000" height="500" style={{ border: "solid 1px" }}>
        <g>
          {paths.map((path, key) => {
            return (
              <path
                d={path}
                stroke="silver"
                strokeWidth="1"
                fill="transparent"
              />
            );
          })}

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
        </g>
      </svg>
    </>
  );
}

export default App;
