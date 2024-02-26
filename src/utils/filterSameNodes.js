const filterSameNodes = (nodes) => {
  const res = new Array();

  for (let i = 0; i < nodes.length; i++) {
    let isSame = true;
    for (let j = i + 1; j < nodes.length; j++) {
      if (nodes[i].id === nodes[j].id && nodes[i].label === nodes[j].label)
        isSame = false;
    }
    if (isSame) res.push(nodes[i]);
  }

  return res.sort((a, b) => a.id - b.id);
};

export default filterSameNodes;
