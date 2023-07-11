export const sumCordinates = (nodes, i) => {
  let sum = 0;
  for (const mx of i) {
    sum += nodes[mx].y;
  }

  return sum;
};

export const objectOnePropertytoProgression = (ArrayNumber, step, x, y) => {
  return Array(ArrayNumber)
    .fill()
    .reduce((prev) => {
      const prevItem = prev.length > 0 ? prev.at(-1).y + step : y;
      const prevLabel = prev.length > 0 ? prev.at(-1).label + 1 : 1;
      return [...prev, { x, y: prevItem, label: prevLabel }];
    }, []);
};
