import { expect, test } from "vitest";
import getBipartiteCross from "./../utils/getBipartiteCross";

test("二部グラフの交差", () => {
  const bipartite1 = [
    [1, 0, 0, 0, 0, 0],
    [1, 1, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 1, 0],
    [1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1],
  ];

  const bipartite2 = [
    [1, 1, 0, 0, 0, 0, 0, 0],

    [1, 0, 0, 0, 0, 0, 0, 0],

    [1, 0, 1, 0, 0, 0, 0, 0],

    [0, 0, 0, 1, 0, 0, 0, 0],

    [0, 0, 0, 0, 1, 0, 0, 0],

    [0, 0, 0, 0, 0, 1, 0, 0],

    [0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1],
  ];

  const bipartite3 = [
    [1, 1, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1],
  ];

  const bipartite4 = [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1],
    [0, 0, 1, 0, 0],
    [1, 0, 0, 0, 0],
    [0, 1, 0, 0, 0],
  ];

  expect(getBipartiteCross(bipartite1)).toBe(4);
  expect(getBipartiteCross(bipartite2)).toBe(2);
  expect(getBipartiteCross(bipartite3)).toBe(0);
  expect(getBipartiteCross(bipartite4)).toBe(14);
});
