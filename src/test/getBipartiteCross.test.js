import { expect, test } from "vitest";
import getBipartiteCross from "./../utils/getBipartiteCross";

test("二部グラフの交差", () => {
  // "public/random/json/random_7_7_75_2.json"
  const bipartite1 = [
    [1, 0, 0, 0, 0, 0],
    [1, 1, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 1, 0],
    [1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1],
  ];
  const leftNodesOrder1 = [0, 1, 2, 3, 4, 5, 6];
  const rightNodesOrder1 = [1, 0, 2, 3, 4, 5];

  //   const bipartite5 = [
  //     [1, 1, 0, 0, 0, 0, 0, 0],

  //     [1, 0, 0, 0, 0, 0, 0, 0],

  //     [1, 0, 1, 0, 0, 0, 0, 0],

  //     [0, 0, 0, 1, 0, 0, 0, 0],

  //     [0, 0, 0, 0, 1, 0, 0, 0],

  //     [0, 0, 0, 0, 0, 1, 0, 0],

  //     [0, 0, 0, 0, 0, 0, 1, 0],
  //     [0, 0, 0, 0, 0, 0, 0, 1],
  //   ];
  const leftNodesOrder4 = [5, 0, 2, 1, 4, 6, 3];
  const rightNodesOrder4 = [6, 0, 1, 3, 2, 5, 7, 4];

  const bipartite4 = [
    [1, 1, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1],
  ];

  const bipartite2 = [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1],
    [0, 0, 1, 0, 0],
    [1, 0, 0, 0, 0],
    [0, 1, 0, 0, 0],
  ];
  const leftNodesOrder2 = [1, 0, 2, 3, 4, 5];
  const rightNodesOrder2 = [3, 0, 2, 4, 1];

  expect(getBipartiteCross(bipartite1, leftNodesOrder1, rightNodesOrder1)).toBe(
    4
  );
  expect(getBipartiteCross(bipartite2, leftNodesOrder2, rightNodesOrder2)).toBe(
    8
  );
  expect(getBipartiteCross(bipartite4, leftNodesOrder4, rightNodesOrder4)).toBe(
    1
  );
  //   expect(getBipartiteCross(bipartite5)).toBe(0);
});
