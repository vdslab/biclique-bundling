import colaConfluent from "../logic/colaConfluent.js";
import fs from "fs";

const instanceNum = 30;
try {
    fs.readdir(
      "public/random-exp/json",
      {recursive : true, withFileTypes: true}
      ,
      function (err, files) {
        if (err) throw err;
        const output = [];
        for(let depth = 1; depth <= 1; depth++) {
          for(let param = 70; param <= 100; param += 10) {

            let [cnt, crossVal, edgeVal, midVal, missVal] = [0, 0, 0, 0, 0];
            for(const file of files) {
              if(!file.isFile()) continue;
              console.log(file.path + "/" + file.name);

              const bipartite = JSON.parse(fs.readFileSync(file.path + "/" + file.name, "utf-8"));
              const { cross, totalEdgeCount, midNodesCount, missingEdges } =
              colaConfluent(bipartite, param / 100, depth, true);

              crossVal += cross;
              edgeVal += totalEdgeCount;
              midVal += midNodesCount;
              missVal += missingEdges;

              if(++cnt < instanceNum) continue;
              console.log("===================================================");

              file.path
              crossVal /= instanceNum;
              edgeVal /= instanceNum;
              midVal /= instanceNum;
              missVal /= instanceNum;

              output.push({
                input : {
                  left: file.path.split("/")[3].split('_')[0],
                  right: file.path.split("/")[3].split('_')[1],
                  prob: file.path.split("/")[4],
                  param,
                  depth,
                },
                output: {
                  cross: crossVal,
                  edge: edgeVal,
                  mid: midVal,
                  miss: missVal
                }
              });

              crossVal = 0;
              edgeVal = 0;
              midVal = 0;
              missVal = 0;
              cnt = 0;
            }
          }
        }
        fs.writeFileSync('public/random-exp/json/output_95.json', JSON.stringify(output, null, 2));
      }
    );

  } catch (e) {
    console.error(e);
  }
