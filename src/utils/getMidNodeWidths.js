const getMidNodeWidths = (nodes, edges, edgeWidths, lastLayer) => {
  let midNodeWidths = [];
  let midNodeElement = [];
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.layer === 0 || node.layer === lastLayer) continue;

    let sumWidth = 0;
    edges.forEach((edge, key) => {
      if (edge.target === node.id) {
        sumWidth += edgeWidths[key];
      }
    });

    if (i > 0 && nodes[i - 1].layer > 0 && node.layer !== nodes[i - 1].layer) {
      midNodeWidths.push(midNodeElement);
      midNodeElement = [];
    }

    midNodeElement.push(sumWidth);
  }
  midNodeWidths.push(midNodeElement);
  midNodeWidths = [[], ...midNodeWidths, []];
  console.error(midNodeWidths);

  return midNodeWidths;
};

export default getMidNodeWidths;
