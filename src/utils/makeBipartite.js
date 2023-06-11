/*
{
    5_5_90_01: [
        [1, 1, 1, 0, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 0, 1],
        [1, 1, 1, 1, 1],
        [1, 0, 1, 1, 1],
    ]
}
*/
import fs from "fs";

const leftNodeNumber = 5;
const rightNodeNumber = 5;
const prob = 0.7;
const outputJson = {};

for (let i = 0; i < 5; i++) {
  const matrix = new Array();
  for (let left = 0; left < leftNodeNumber; left++) {
    const nodes = new Array(rightNodeNumber);
    for (let right = 0; right < rightNodeNumber; right++) {
      nodes[right] = Math.random() < prob ? 1 : 0;
    }
    matrix.push(nodes);
  }

  outputJson[`${i + 1}`] = matrix;
}

console.log(JSON.stringify(outputJson));

fs.writeFileSync(
  "./../../public/matrix_5_5_70.json",
  JSON.stringify(outputJson)
);
