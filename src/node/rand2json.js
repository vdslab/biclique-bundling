import colaConfluent from "../logic/colaConfluent.js";
import fs from "fs";
const calcMean = (list) => {
  let ret = 0;
  for (const li of list) {
    ret += li;
  }
  return ret / list.length;
};

const calcMedian = (list) => {
  const li = list.toSorted((a, b) => a - b);
  if (li.length % 2) {
    return li[Math.floor(li.length / 2)];
  } else {
    return (li[li.length / 2] + li[li.length / 2 - 1]) / 2;
  }
};

const instanceNum = 30;
const output = [];
try {
  fs.readdir(
    "public/random-exp/json",
    { recursive: true, withFileTypes: true },
    function (err, files) {
      if (err) throw err;
      for (let depth = 3; depth <= 3; depth++) {
        for (let param = 65; param <= 100; param += 5) {
          let cnt = 0;
          let crossVals = new Array();
          let edgeVals = new Array();
          let midVals = new Array();
          let missVals = new Array();
          for (const file of files) {
            if (!file.isFile()) continue;
            console.log(
              param + " " + depth + " " + file.path + "/" + file.name
            );

            const bipartite = JSON.parse(
              fs.readFileSync(file.path + "/" + file.name, "utf-8")
            );
            const { cross, totalEdgeCount, midNodesCount, missingEdges } =
              colaConfluent(bipartite, param / 100, depth, true);

            crossVals.push(cross);
            edgeVals.push(totalEdgeCount);
            midVals.push(midNodesCount);
            missVals.push(missingEdges);
            cnt++;

            if (cnt < instanceNum) continue;
            console.log("===================================================");

            output.push({
              instanceNum,
              graph: {
                left: Number(file.path.split("/")[3].split("_")[0]),
                right: Number(file.path.split("/")[3].split("_")[1]),
                prob: Number(file.path.split("/")[4]),
              },
              input: {
                param,
                depth,
              },
              output: {
                cross: crossVals,
                edge: edgeVals,
                mid: midVals,
                miss: missVals,
              },
              stat: {
                cross: {
                  mean: calcMean(crossVals),
                  median: calcMedian(crossVals),
                  max: Math.max(...crossVals),
                  min: Math.min(...crossVals),
                },
                edge: {
                  mean: calcMean(edgeVals),
                  median: calcMedian(edgeVals),
                  max: Math.max(...edgeVals),
                  min: Math.min(...edgeVals),
                },
                mid: {
                  mean: calcMean(midVals),
                  median: calcMedian(midVals),
                  max: Math.max(...midVals),
                  min: Math.min(...midVals),
                },
                miss: {
                  mean: calcMean(missVals),
                  median: calcMedian(missVals),
                  max: Math.max(...missVals),
                  min: Math.min(...missVals),
                },
              },
            });

            // 新しい配列objectを作成
            cnt = 0;
            crossVals = new Array();
            edgeVals = new Array();
            midVals = new Array();
            missVals = new Array();
          }
        }
      }
      fs.writeFileSync(
        "public/random-exp/outputs_95_3.json",
        JSON.stringify(output, null, 2)
      );
    }
  );
} catch (e) {
  console.error(e);
  fs.writeFileSync(
    "public/random-exp/outputs_95_3.json",
    JSON.stringify(output, null, 2)
  );
}