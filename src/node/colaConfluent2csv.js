import colaConfluent from "../logic/colaConfluent.js";
import fs from "fs";

try {
  fs.readdir(
    "public/random/json",
    function (err, files) {
      if (err) throw err;
      console.log(files);

      for (let path of files) {
        path = "public/random/json/" + path;
        const bipartite = JSON.parse(fs.readFileSync(path, "utf-8"));
        const csvData = [
          ["param", "depth", "cross", "cross_bary", "weightedCross",  "weightedCross_bary", "percentage"],
        ];

      for(let depth = 2; depth <= 3; depth++) {
        for (let param = 70; param <= 100; param += 10) {
          let cross1 = 0;
          let weightedCross1 = 0;
          {
            const { cross, weightedCross } =
            colaConfluent(bipartite, param / 100, depth, false);
            cross1 = cross;
            weightedCross1 = weightedCross;
          }
          
          let cross2 = 0;
          let weightedCross2 = 0;
          {
            const { cross, weightedCross } =
            colaConfluent(bipartite, param / 100, depth, true);
            cross2 = cross;
            weightedCross2 = weightedCross;
          }     

          if(weightedCross1 < 0.1) continue;
          let elem = [
            param / 100,
            depth,
            cross1,
            cross2,
            weightedCross1,
            weightedCross2,
            weightedCross2/weightedCross1
          ];

          csvData.push(elem);
        }
      }

        const csvContent = csvData.map((row) => row.join(",")).join("\n");
        fs.writeFile(
          `public/random/csv/${path.split("/")[3]}.csv`,
          csvContent,
          (error) => {
            if (error) {
              console.error(
                "CSVファイルの作成中にエラーが発生しました:",
                error
              );
            } else {
              console.log("CSVファイルが作成されました。");
            }
          }
        );
      }
    }
  );
} catch (e) {
  console.error(e);
}
