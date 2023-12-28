import colaConfluent from "../logic/colaConfluent.js";
import fs from "fs";

try {
  const path = "public/act-mooc/json/mooc_actions_200.json";
  const bipartite = JSON.parse(fs.readFileSync(path, "utf-8"));
  const csvData = [["param", "depth","crosscount", "edge", "midnode", "missingedges"]];
  for (let param = 10; param <= 100; param += 10) {
    const { cross, totalEdgeCount, midNodesCount, missingEdges } = colaConfluent(bipartite, param / 100, 1, true);
    csvData.push([param / 100, 1,cross, totalEdgeCount, midNodesCount, missingEdges]);
  }

  const csvContent = csvData.map((row) => row.join(",")).join("\n");
  fs.writeFile(`public/csv/${path.split("/")[3]}.csv`, csvContent, (error) => {
    if (error) {
      console.error("CSVファイルの作成中にエラーが発生しました:", error);
    } else {
      console.log("CSVファイルが作成されました。");
    }
  });
} catch (e) {
  console.error(e);
}
