import * as d3 from "d3";
import getEdgeEndPos from "./getEdgeEndPos.js";

const getEdgePaths = (graph, edgeWidths, midNodeWidths, maxDepth) => {
  const lineGenerator = d3.line();
  const linkGenerator = d3.linkVertical();
  if (maxDepth > 0) {
    const { edgeAt, edgeR, edgeL } = getEdgeEndPos(
      graph,
      edgeWidths,
      midNodeWidths
    );
    return edgeAt.map((edge, key) => {
      const d =
        linkGenerator(edgeL[key]) +
        " " +
        trimPathM(
          lineGenerator([
            [edgeL[key]["target"][0], edgeL[key]["target"][1]],
            [edgeR[key]["target"][0], edgeR[key]["target"][1]],
          ])
        ) +
        " " +
        trimPathM(
          linkGenerator({
            source: edgeR[key]["target"],
            target: edgeR[key]["source"],
          })
        ) +
        " z";
      return {
        widthd: linkGenerator(edge),
        d,
      };
    });
  } else {
    return graph.edges.map((edge) => {
      return {
        d: lineGenerator([
          [edge.source.x, edge.source.y],
          [edge.target.x, edge.target.y],
        ]),
      };
    });
  }
};

const trimPathM = (path) => {
  for (let i = 1; i < path.length; i++) {
    if (path[i].match(/[A-Z]/)) {
      return path.substring(i);
    }
  }
  return path;
};

export default getEdgePaths;
