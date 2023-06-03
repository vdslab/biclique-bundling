import { useState, useEffect } from "react";
import "./App.css";
import * as d3 from "d3";

import { isEqual, isSuperset } from "./utils/set_calc";

const sumCordinates = (nodes, i) => {
  let sum = 0;
  console.log(nodes, i);
  for (const mx of i) {
    sum += nodes[mx].y;
  }

  return sum;
}

function App() {
  const [paths, setPaths] = useState([]);
  const [leftNodes, setLeftNodes] = useState([]);
  const [rightNodes, setRightNodes] = useState([]);

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

  const lineData = [
    { x: 10, y: 20 },
    { x: 100, y: 200 },
    { x: 200, y: 100 },
  ];

  useEffect(() => {
    const linkGenerator = d3.linkHorizontal();
    const lineGenerator = d3
      .line()
      .x((d) => d.x)
      .y((d) => d.y);

    const leftX = 100;
    const leftY = 100;

    const rightX = 500;
    const rigthY = 100;

    const rights = [
      { x: 600, y: 100 },
      { x: 600, y: 130 },
      { x: 600, y: 160 },
      { x: 600, y: 190 },
      { x: 600, y: 220 },
    ];

    const lefts = [
      { x: 400, y: 100 },
      { x: 400, y: 130 },
      { x: 400, y: 160 },
    ];

    const outputPaths = new Array();

    setLeftNodes(lefts);
    setRightNodes(rights);

    const bipartiteMatrix = [
      [1, 1, 1, 0, 0],
      [1, 0, 0, 1, 1],
      [1, 1, 1, 0, 1],
    ];

    console.log(bipartiteMatrix);

    const leftNodeNumber = bipartiteMatrix.length;
    const rightNodeNumber = bipartiteMatrix[0].length;

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

        if (edgeNumber >= 1.0 * leftNodeSetNumber * rightNodeSetNumber) {
          leftMaximalCandNodes.push(leftNodeSet);
          rightMaxmalCandNodes.push(rightNodeSet);
        }
      }
    }

    /*console.log(leftMaximalCandNodes);
    console.log(rightMaxmalCandNodes);
    console.log([leftMaximalCandNodes, rightMaxmalCandNodes])
    console.log(isEqual(new Set([1, 4, 7]) ,  new Set([4, 3, 7])));*/

    for (let i = 0; i < 15; i++) {
      const leftMaximalCandNodeSet = new Set(leftMaximalCandNodes[i]);
      const rightMaximalCandNodeSet = new Set(rightMaxmalCandNodes[i]);

      let isMaximal = true;

      for (let k = 0; k < 15; k++) {
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
        const midX = 500;
        const midY = ( sumCordinates(lefts, [...leftMaximalCandNodeSet]) +
         sumCordinates( rights ,[...rightMaximalCandNodeSet]) ) /
         (leftMaximalCandNodeSet.size + rightMaximalCandNodeSet.size);

         console.log(midX, midY);

         for(const l of [...leftMaximalCandNodeSet]) {
          //source:
          //[lefts[l].x,lefts[l].y]

          //target:
          //[midX, midY]
          outputPaths.push({source:[lefts[l].x,lefts[l].y], target:[midX, midY]});
         }

         for(const r of [...rightMaximalCandNodeSet]) {
          //source:
          //[lefts[l].x,lefts[l].y]

          //target:
          //[midX, midY]
          outputPaths.push({source:[midX, midY], target:[rights[r].x,rights[r].y]});
         }
      }
    }

    setPaths(
      outputPaths.map((d) => {
        return linkGenerator(d);
      })
    );
  }, []);

  return (
    <>
      <svg width="1000" height="1000" xmlns="http://www.w3.org/2000/svg">
        {paths.map((path, key) => {
          return (
            <path
              d={path}
              stroke="silver"
              stroke-width="1"
              fill="transparent"
            />
          );
        })}

        {leftNodes?.map((node, key) => {
          return <circle cx={node.x} cy={node.y} r="3" fill="blue" />;
        })}

        {rightNodes?.map((node, key) => {
          return <circle cx={node.x} cy={node.y} r="3" fill="blue" />;
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
      </svg>
    </>
  );
}

export default App;
