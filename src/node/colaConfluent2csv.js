import colaConfluent from "../logic/colaConfluent.js";
import fs from "fs";

try {
  const path = "public/random/json/random_20_20_84_1.json"
  const bipartite = JSON.parse(
    fs.readFileSync(path, "utf-8")
  );
  const csvData = [["param", "crossCount"]];
  for (let param = 50; param <= 100; param += 5) {
    const { cross } = colaConfluent(bipartite, param / 100, 1);
    csvData.push([param / 100, cross]);
  }

  const csvContent = csvData.map((row) => row.join(",")).join("\n");

  fs.writeFile(`public/csv/${path.split('/')[3]}.csv`, csvContent, (error) => {
    if (error) {
      console.error("CSVファイルの作成中にエラーが発生しました:", error);
    } else {
      console.log("CSVファイルが作成されました。");
    }
  });
} catch (e) {
  console.error(e);
}
