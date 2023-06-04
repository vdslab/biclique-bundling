export const sumCordinates = (nodes, i) => {
  let sum = 0;
  console.log(nodes, i);
  for (const mx of i) {
    sum += nodes[mx].y;
  }

  return sum;
};
