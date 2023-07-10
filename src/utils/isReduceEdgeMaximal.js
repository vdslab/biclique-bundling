const isReduceEdgeMaximal = (obj, bipartite) => {
  let d =
    obj.left.length * obj.right.length - obj.left.length - obj.right.length;
  const edgeDeleted = new Array();
  for (const left of obj.left) {
    for (const right of obj.right) {
      if (!bipartite[left][right]) {
        d--;
      } else {
        console.log("pov", left, right);
        //mtc[left][right] = 0;
        edgeDeleted.push({ left: left, right: right });
      }
    }
  }

  console.error(obj, d);
  if (d >= 0) {
    edgeDeleted.forEach((edge) => {
      bipartite[edge.left][edge.right] = 0;
    });

    return true;
  } else {
    return false;
  }
};

export default isReduceEdgeMaximal;
