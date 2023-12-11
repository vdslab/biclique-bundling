import colaConfluent from "../logic/colaConfluent.js";
import fs from "fs";

try {
  const bipartite = JSON.parse(
    fs.readFileSync("public/random/json/random_20_20_79_1.json", "utf-8")
  );

  const csvData = [["param", "crossCount"]];
  for (let param = 50; param <= 100; param += 5) {

    const { cross } = colaConfluent(bipartite, param / 100, 1);
    csvData.push([param / 100, cross]);
  }

  const csvContent = csvData.map((row) => row.join(",")).join("\n");

  fs.writeFile("public/csv/output1.csv", csvContent, (error) => {
    if (error) {
      console.error("CSVファイルの作成中にエラーが発生しました:", error);
    } else {
      console.log("CSVファイルが作成されました。");
    }
  });
} catch (e) {
  console.error(e);
}
