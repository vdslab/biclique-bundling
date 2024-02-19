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
  //const r = 7;

  useEffect(() => {
    const leftNodeNumber = bipartiteMatrix?.length;
    const rightNodeNumber = bipartiteMatrix[0]?.length;

    //左右中間ノードの順序を初期化
    const leftNodesOrder = new Array();
    const rightNodesOrder = new Array();
    const midNodesOrder = new Array();

    for (let i = 0; i < leftNodeNumber; i++) {
      leftNodesOrder.push(i);
    }

    for (let i = 0; i < rightNodeNumber; i++) {
      rightNodesOrder.push(i);
    }

    let midNodesCount = 0;
    for (let i = 0; i < maximalNodes.length; i++) {
      midNodesCount++;
    }

    for (let i = 0; i < leftNodeNumber; i++) {
      for (let j = 0; j < rightNodeNumber; j++) {
        if (!bipartiteMatrix[i][j]) continue;
        if (f(maximalNodes, i, j)) continue;
        midNodesCount++;
      }
    }

    for (let i = 0; i < midNodesCount; i++) {
      midNodesOrder.push(i);
    }
    const oneBiclusterNumber = midNodesCount - orderedMaximalNodes.length;

    // TODO: エッジ数1を含む中間ノードが左右のどのノードに繋がっているのかの変数を格納する
    // leftside = [{left: 0, right: 1}, {left: 1, right:2}]
    // rightside =  [{left: 0, right: 1}, {left: 1, right:2}]
    const leftSideEdge = new Array();
    const rightSideEdge = new Array();
    for (let i = 0; i < maximalNodes.length; i++) {
      for (const leftNode of maximalNodes[i].left) {
        leftSideEdge.push({ left: leftNode, right: i });
      }

      for (const rightNode of maximalNodes[i].right) {
        leftSideEdge.push({ left: i, right: rightNode });
      }
    }

    console.error(leftSideEdge, rightSideEdge);

    ///ここまで初期化

    // 左右ノードを重心法でソート
    // const fd = new Array();
    // for(let i = 0; i < rightNodeNumber; i++) {
    //   let degree = 0;
    //   let ouh = 0;
    //   for(let j = 0; j < leftNodeNumber; j++) {
    //     if(!bipartiteMatrix[i][j]) continue;
    //     degree ++;
    //     ouh += leftNodesOrder[j];
    //   }

    //   console.log(degree);
    //   console.log(ouh)
    //   fd.push(degree / ouh);
    // }

    // console.error(fd);
    // rightNodesOrder.sort((a, b) => {
    //   return fd[a] - fd[b]
    // });
    //ここで並び替えの処理
    // if(Array.isArray(maximalNodes)) {
    //   maximalNodes.sort((a, b) => {
    //     return (b.left.length + b.right.length) -  (a.left.length + a.right.length) ;
    //  })
    //  }

    //  console.error(maximalNodes);

    // let leftIdx = 0;
    // let rightIdx = 0;

    // const leftNodeMap = new Map();
    // const rightNodeMap = new Map();
    const orderedMaximalNodes = maximalNodes || [...maximalNodes];
    // 左右ノードの順番を貪欲を並び替える
    // for (let i = 0; i < maximalNodes.length; i++) {
    //   const leftNodes = maximalNodes[i].left;
    //   const rightNodes = maximalNodes[i].right;

    //   const leftObjs = new Array();
    //   for (const leftNodeNum of leftNodes) {
    //     if (!leftNodeMap.has(leftNodeNum)) {
    //       leftObjs.push(leftIdx);
    //       leftNodeMap.set(leftNodeNum, leftIdx++);
    //     } else {
    //       leftObjs.push(leftNodeMap.get(leftNodeNum));
    //     }
    //   }

    //   const rightObjs = new Array();
    //   for (const rightNodeNum of rightNodes) {
    //     if (!rightNodeMap.has(rightNodeNum)) {
    //       rightObjs.push(rightIdx);
    //       rightNodeMap.set(rightNodeNum, rightIdx++);
    //     } else {
    //       rightObjs.push(rightNodeMap.get(rightNodeNum));
    //     }
    //   }

    //   orderedMaximalNodes.push({ left: leftObjs, right: rightObjs });
    // }

    //初期化

    //左ノードの座標を決める
    const lefts = objectOnePropertytoProgression(
      leftNodeNumber,
      step,
      leftX,
      leftY
    );

    //右ノードを座標を決める
    const rights = objectOnePropertytoProgression(
      rightNodeNumber,
      step,
      rightX,
      rightY
    );

    setLeftNodes(lefts);
    setRightNodes(rights);

    //中間ノードとバイクリークのエッジ変数
    const midNodesCopy = new Array();
    const outputPaths = new Array();

    //const {} = placeNodesToMean();
    // ノード座標の平均値をおいている

    //左から右へ直線を通す
    //エッジ数1のバイクラスタとして見なす
    //中間層ノードは重ならないようにする
    const lineData = new Array();

    const midLayerHeight = oneBiclusterNumber + maximalNodes.length;
    const midX = (rightX + leftX) / 2;

    //sugiyama frameワークの順番割り当ては、y座標の平均値の数値順で行う
    //その後、具体的にy座標を求める

    const midOrderObjs = new Array();
    let midIdx = 0;
    for (let i = 0; i < orderedMaximalNodes.length; i++) {
      const midY =
        (sumCordinates(lefts, orderedMaximalNodes[i].left) +
          sumCordinates(rights, orderedMaximalNodes[i].right)) /
        (orderedMaximalNodes[i].left.length +
          orderedMaximalNodes[i].right.length);
      midOrderObjs.push({ order: midIdx++, pos: midY });
    }

    for (let left = 0; left < leftNodeNumber; left++) {
      for (let right = 0; right < rightNodeNumber; right++) {
        if (f(orderedMaximalNodes, left, right)) {
          continue;
        }
        if (!bipartiteMatrix[left][right]) continue;

        console.log(left, right);

        const midY = (lefts[left].y + rights[right].y) / 2;

        midOrderObjs.push({ order: midIdx++, pos: midY });
      }
    }

    //重心でソート
    console.error(midOrderObjs);
    midOrderObjs.sort((a, b) => {
      return a.pos - b.pos;
    });
    console.error(midOrderObjs);

    const midLayerH = 800;
    const midLayerStep = midLayerH / midLayerHeight + 2;
    midIdx = 0;

    /*
    todo
    計算量を減らす

    バイクリークのエッジやノードを描画する
    */
    for (let i = 0; i < orderedMaximalNodes.length; i++) {
      //midYを探す
      const midYOrder = midOrderObjs.find((element) => {
        if (element.order === midIdx) return true;
        return false;
      }).order;

      console.error(midYOrder);

      const midY = midLayerStep * (midYOrder + 1);
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

      midIdx++;
    }

    /***
    普通のエッジや描画する
    ***/
    for (let left = 0; left < leftNodeNumber; left++) {
      for (let right = 0; right < rightNodeNumber; right++) {
        if (f(orderedMaximalNodes, left, right)) {
          continue;
        }
        if (!bipartiteMatrix[left][right]) continue;

        const midYOrder = midOrderObjs.find((element) => {
          if (element.order === midIdx) return true;
          return false;
        }).order;

        const midY = midLayerStep * (midYOrder + 1);

        console.log(midX, midY);
        lineData.push({
          source: [lefts[left].x, lefts[left].y],
          target: [midX, midY],
        });
        lineData.push({
          source: [midX, midY],
          target: [rights[right].x, rights[right].y],
        });
        midIdx++;
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

/*
関数名を変更する

左右のノードがそれぞれ、一つの非自明バイクリークに含んでいるか
*/
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
