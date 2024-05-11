const getMidNodeWidths = (graph, edgeWidths, lastLayer) => {
  let midNodeWidths = [];
  let midNodeElement = [];
  for (let i = 0; i < graph.nodes.length; i++) {
    const node = graph.nodes[i];
    if (node.layer === 0 || node.layer === lastLayer) continue;

    let sumWidth = 0;
    graph.edges.forEach((edge, key) => {
      if (edge.target === node.id) {
        sumWidth += edgeWidths[key];
      }
    });

    if (
      i > 0 &&
      graph.nodes[i - 1].layer > 0 &&
      node.layer !== graph.nodes[i - 1].layer
    ) {
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
