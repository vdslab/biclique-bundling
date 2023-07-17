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
  const r = 7;

  useEffect(() => {
    const leftNodeNumber = bipartiteMatrix?.length;
    const rightNodeNumber = bipartiteMatrix[0]?.length;
    console.error(maximalNodes);

    //ここで並び替えの処理
    let leftIdx = 0;
    let rightIdx = 0;

    const leftNodeMap = new Map();
    const rightNodeMap = new Map();
    const orderedMaximalNodes = new Array();
    for(let i = 0; i < maximalNodes.length; i++) {
      const leftNodes = maximalNodes[i].left;
      const rightNodes = maximalNodes[i].right;

      const leftObjs = new Array();
      for(const leftNodeNum of leftNodes) {
        if(!leftNodeMap.has(leftNodeNum)) {
          leftObjs.push(leftIdx);
          leftNodeMap.set(leftNodeNum, leftIdx++);
        } else {
          leftObjs.push(leftNodeMap.get(leftNodeNum));
        }
      }

      const rightObjs = new Array();
      for(const rightNodeNum of rightNodes) {
        if(!rightNodeMap.has(rightNodeNum)) {
          rightObjs.push(rightIdx);
          rightNodeMap.set(rightNodeNum, rightIdx++);
        } else {
          rightObjs.push(rightNodeMap.get(rightNodeNum));
        }
      }

      orderedMaximalNodes.push({left: leftObjs, right: rightObjs});
    }

    console.error(orderedMaximalNodes);



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

    setLeftNodes(lefts);
    setRightNodes(rights);

    const midNodesCopy = new Array();
    const outputPaths = new Array();
    const midYSet = new Set();
    for (let i = 0; i < maximalNodes.length; i++) {
      const midX = (rightX + leftX) / 2;

      let midYCand =
        (sumCordinates(lefts, orderedMaximalNodes[i].left) +
          sumCordinates(rights, orderedMaximalNodes[i].right)) /
        (orderedMaximalNodes[i].left.length + orderedMaximalNodes[i].right.length);
      let midY;
      for (const v of midYSet) {
        if (Math.abs(v - midYCand) < 2 * r) {
          midYCand += step;
        }
      }

      midY = midYCand;
      midYSet.add(midY);

      console.log(midX, midY);
      midNodesCopy.push({ x: midX, y: midY });

      for (const l of orderedMaximalNodes[i].left) {
        console.log("xxxxxxxx");
        outputPaths.push({
          source: [lefts[l].x, lefts[l].y],
          target: [midX, midY],
        });
      }

      for (const r of orderedMaximalNodes[i].right) {
        console.log("yyyyyyyy");
        outputPaths.push({
          source: [midX, midY],
          target: [rights[r].x, rights[r].y],
        });
      }
    }

    //左から右へ直線を通す
    //エッジ数1のバイクラスタとして見なす
    //中間層ノードは重ならないようにする
    const lineData = new Array();

    for (let left = 0; left < leftNodeNumber; left++) {
      for (let right = 0; right < rightNodeNumber; right++) {
        if (f(maximalNodes, left, right)) {
          //console.log("EEEEEEEEEEeeee");
          continue;
        }
        if (!bipartiteMatrix[left][right]) continue;

        console.log(left, right);
        const midX = (lefts[left].x + rights[right].x) / 2;
        const midYCand = (lefts[left].y + rights[right].y) / 2;

        const midY = midYSet.has(midYCand) ? midYCand + step / 2 : midYCand;
        midYSet.add(midY);
        console.log(midX, midY);
        lineData.push({
          source: [lefts[left].x, lefts[left].y],
          target: [midX, midY],
        });
        lineData.push({
          source: [midX, midY],
          target: [rights[right].x, rights[right].y],
        });
      }
    }

    console.log(bipartiteMatrix);
    console.log("wooooooooooooooooooooooooooo", lineData);

    //ノードの並び替え
    //案1、バイクリークを近くに持ってくる(貪欲法)
    //案2、エッジ交差数が少なくなるように力任せで(計算量が高くなる)
    //案3、論文を読んで実装(DA)

    //貪欲法
    //バイクラスターが長い方でソートする(もしくは短い方)
    //バイクラスターのを上から被りがないように配置する
    //配置しようとしているノードが既に用いられている場合、そこにつなげる
    //バイクラスターに被りがないとき、 バイクラスターのエッジが交差しない

    setMidNodes(midNodesCopy);
    setPaths(
      outputPaths.map((d) => {
        return linkGenerator(d);
      })
    );
    setLines(
      lineData.map((d) => {
        return linkGenerator(d);
      })
    );
  }, [maximalNodes]);

  return { paths, lines, leftNodes, rightNodes, midNodes };
};

const f = (maximalNodes, left, right) => {
  for (const node of maximalNodes) {
    const leftNodeSet = new Set(node.left);
    const rightNodeSet = new Set(node.right);

    if (leftNodeSet.has(left) && rightNodeSet.has(right)) {
      return true;
    }
  }

  return false;
};
export default usePaths;
