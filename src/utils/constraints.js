export const setColaConstraint = (d3cola, graph, midNodeWidths, lastLayer) => {
  d3cola
    .nodes(graph.nodes)
    .links(graph.edges)
    .constraints(graph.constraints)
    .symmetricDiffLinkLengths(40) // ノードの数によって増やす
    .start(30, 40, 50);

  // 制約の再追加
  const sortedNodes = structuredClone(graph.nodes).sort((a, b) => {
    return a.x - b.x;
  });

  const insertedNodes = [];
  for (let i = 0; i < lastLayer + 1; i++) {
    insertedNodes.push([]);
  }

  for (const node of sortedNodes) {
    insertedNodes[node.layer].push(node);
  }

  for (const nodes of insertedNodes) {
    for (let i = 0; i < nodes.length - 1; i++) {
      const gap =
        (midNodeWidths[nodes[i].layer][nodes[i].label] +
          midNodeWidths[nodes[i].layer][nodes[i + 1].label]) /
        1.5;
      graph.constraints.push({
        left: nodes[i].id,
        right: nodes[i + 1].id,
        gap,
        axis: "x",
      });
    }
  }
};

const setCrossConstraint = (d3cola, graph, midNodeWidths, lastLayer) => {};
