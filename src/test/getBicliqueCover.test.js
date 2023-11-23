import { expect, test, describe } from "vitest";
import { convertG2Ge, getBicliqueCover } from "./../utils/getBicliqueCover";

describe("GからG_Eの変換テスト", () => {
  test("K_2_2の変換", () => {
    convertG2Ge([
      [1, 1, 1],
      [1, 1, 0],
      [0, 0, 1],
    ]);
  });
});

describe("RLFテスト", () => {
  test("K_2_2の変換", () => {
    getBicliqueCover([
      [1, 1, 1],
      [1, 1, 0],
      [0, 0, 1],
    ]);
  });
});
