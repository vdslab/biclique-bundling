const getBipartiteDensity = (bipartite) => {
  let edgeCount = 0;

  for (let i = 0; i < bipartite.length; i++) {
    for (let j = 0; j < bipartite[i].length; j++) {
      if (bipartite[i][j]) edgeCount++;
    }
  }

  return edgeCount / bipartite.length / bipartite[0].length;
};

export { getBipartiteDensity };
