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

    //ここで並び替えの処理
    // if(Array.isArray(maximalNodes)) {
    //   maximalNodes.sort((a, b) => {
    //     return (b.left.length + b.right.length) -  (a.left.length + a.right.length) ;
    //  })
    //  }

    //  console.error(maximalNodes);

    let leftIdx = 0;
    let rightIdx = 0;

    const leftNodeMap = new Map();
    const rightNodeMap = new Map();
    let orderedMaximalNodes = new Array();
    for (let i = 0; i < maximalNodes.length; i++) {
      const leftNodes = maximalNodes[i].left;
      const rightNodes = maximalNodes[i].right;

      const leftObjs = new Array();
      for (const leftNodeNum of leftNodes) {
        if (!leftNodeMap.has(leftNodeNum)) {
          leftObjs.push(leftIdx);
          leftNodeMap.set(leftNodeNum, leftIdx++);
        } else {
          leftObjs.push(leftNodeMap.get(leftNodeNum));
        }
      }

      const rightObjs = new Array();
      for (const rightNodeNum of rightNodes) {
        if (!rightNodeMap.has(rightNodeNum)) {
          rightObjs.push(rightIdx);
          rightNodeMap.set(rightNodeNum, rightIdx++);
        } else {
          rightObjs.push(rightNodeMap.get(rightNodeNum));
        }
      }

      orderedMaximalNodes.push({ left: leftObjs, right: rightObjs });
    }

    console.error(orderedMaximalNodes);
    //orderedMaximalNodes = maximalNodes || [...maximalNodes];

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
    // for (let i = 0; i < maximalNodes.length; i++) {
    //   const midX = (rightX + leftX) / 2;

    //   const midY =
    //     (sumCordinates(lefts, orderedMaximalNodes[i].left) +
    //       sumCordinates(rights, orderedMaximalNodes[i].right)) /
    //     (orderedMaximalNodes[i].left.length +
    //       orderedMaximalNodes[i].right.length);

    //   console.log(midX, midY);
    //   midNodesCopy.push({ x: midX, y: midY });

    //   for (const l of orderedMaximalNodes[i].left) {
    //     console.log("xxxxxxxx");
    //     outputPaths.push({
    //       source: [lefts[l].x, lefts[l].y],
    //       target: [midX, midY],
    //     });
    //   }

    //   for (const r of orderedMaximalNodes[i].right) {
    //     console.log("yyyyyyyy");
    //     outputPaths.push({
    //       source: [midX, midY],
    //       target: [rights[r].x, rights[r].y],
    //     });
    //   }
    // }

    //左から右へ直線を通す
    //エッジ数1のバイクラスタとして見なす
    //中間層ノードは重ならないようにする
    const lineData = new Array();
    let oneBiclusterNumber = 0;
    for (let left = 0; left < leftNodeNumber; left++) {
      for (let right = 0; right < rightNodeNumber; right++) {
        if (f(orderedMaximalNodes, left, right)) {
          continue;
        }
        if (!bipartiteMatrix[left][right]) continue;

        console.log(left, right);
        //const midX = (lefts[left].x + rights[right].x) / 2;
        //const midY = (lefts[left].y + rights[right].y) / 2;
        oneBiclusterNumber++;

        //console.log(midX, midY);
        // lineData.push({
        //   source: [lefts[left].x, lefts[left].y],
        //   target: [midX, midY],
        // });
        // lineData.push({
        //   source: [midX, midY],
        //   target: [rights[right].x, rights[right].y],
        // });
      }
    }

    console.log(bipartiteMatrix);
    console.log("wooooooooooooooooooooooooooo", lineData);

    const midLayerHeight = oneBiclusterNumber + maximalNodes.length;
    const midX = (rightX + leftX) / 2;

    //sugiyama frameワークの順番割り当ては、y座標の平均値の数値順で行う
    //その後、具体的にy座標を求める

    const midOrderObjs = new Array();
    let midIdx = 0
    for(let i = 0; i < maximalNodes.length; i++) {
      const midY =
         (sumCordinates(lefts, orderedMaximalNodes[i].left) +
           sumCordinates(rights, orderedMaximalNodes[i].right)) /
         (orderedMaximalNodes[i].left.length +
           orderedMaximalNodes[i].right.length);
      midOrderObjs.push({order:midIdx++,  pos:midY});
    }

    for (let left = 0; left < leftNodeNumber; left++) {
      for (let right = 0; right < rightNodeNumber; right++) {
        if (f(orderedMaximalNodes, left, right)) {
          continue;
        }
        if (!bipartiteMatrix[left][right]) continue;

        console.log(left, right);

        const midY = (lefts[left].y + rights[right].y) / 2;

        midOrderObjs.push({order:midIdx++,  pos:midY});
      }
    }

    console.error(midOrderObjs);
    midOrderObjs.sort((a, b) => {
      return a.pos - b.pos;
    });
    console.error(midOrderObjs);

    const midLayerH = 400;
    const midLayerStep = midLayerH / midLayerHeight;

    midIdx = 0;
    //todo
    //計算量を減らす
    for(let i = 0; i < maximalNodes.length; i++) {

      //midYを探す
      console.log("KKKKKKKKKKKKKKKKKKKKKKKKKKKK");
      const midYOrder = midOrderObjs.find((element) => {
        if(element.order === midIdx) return true;
        return false;
      }).order;

      const midY = midLayerStep*(midYOrder + 1);
      console.log("YUOOOOOOOO" , midIdx, midY);
      midNodesCopy.push({ x: midX, y:  midY});


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

      midIdx ++;
    }

    for (let left = 0; left < leftNodeNumber; left++) {
      for (let right = 0; right < rightNodeNumber; right++) {
        if (f(orderedMaximalNodes, left, right)) {
          continue;
        }
        if (!bipartiteMatrix[left][right]) continue;

        const midYOrder = midOrderObjs.find((element) => {
          if(element.order === midIdx) return true;
          return false;
        }).order;

        const midY = midLayerStep*(midYOrder + 1);

        console.log(midX, midY);
        lineData.push({
          source: [lefts[left].x, lefts[left].y],
          target: [midX, midY],
        });
        lineData.push({
          source: [midX, midY],
          target: [rights[right].x, rights[right].y],
        });
        midIdx ++;
      }
    }
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
