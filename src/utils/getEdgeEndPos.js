const getEdgeEndPos = (graph, edgeWidths, lastLayer) => {
  let midNodeWidths = [];
  let midNodeElement = [];
  for (let i = 0; i < graph.nodes.length; i++) {
    const node = graph.nodes[i];
    if (node.layer === 0 || node.layer === lastLayer) continue;

    let sumWidth = 0;
    graph.edges.forEach((edge, key) => {
      if (edge.target.id === node.id) {
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
  console.log(midNodeWidths);

  const addXpos = new Array(graph.nodes.length);
  for (let i = 0; i < addXpos.length; i++) addXpos[i] = { src: 0, tar: 0 };

  const edgeAt = graph.edges.map((d) => {
    return {
      source: [d.source.x, d.source.y],
      target: [d.target.x, d.target.y],
    };
  });

  const srcNodes = graph.edges
    .map((d, key) => {
      const copy = structuredClone(d.source);
      copy.edgeId = key;
      return copy;
    })
    .sort((a, b) => a.x - b.x);

  const tarNodes = graph.edges
    .map((d, key) => {
      const copy = structuredClone(d.target);
      copy.edgeId = key;
      return copy;
    })
    .sort((a, b) => a.x - b.x);
  console.log(srcNodes, tarNodes);

  tarNodes.forEach((tarNode) => {
    const srcNode = graph.edges[tarNode.edgeId].source;

    const addPos =
      -midNodeWidths[srcNode.layer][srcNode.label] / 2 +
      edgeWidths[tarNode.edgeId] / 2 +
      addXpos[srcNode.id].src;
    addXpos[srcNode.id].src += edgeWidths[tarNode.edgeId];

    if (srcNode.layer !== 0) edgeAt[tarNode.edgeId]["source"][0] += addPos;
  });

  srcNodes.forEach((srcNode) => {
    const tarNode = graph.edges[srcNode.edgeId].target;

    const addPos =
      -midNodeWidths[tarNode.layer][tarNode.label] / 2 +
      edgeWidths[srcNode.edgeId] / 2 +
      addXpos[tarNode.id].tar;
    addXpos[tarNode.id].tar += edgeWidths[srcNode.edgeId];

    if (tarNode.layer !== lastLayer)
      edgeAt[srcNode.edgeId]["target"][0] += addPos;
  });

  return edgeAt;
};

export default getEdgeEndPos;
