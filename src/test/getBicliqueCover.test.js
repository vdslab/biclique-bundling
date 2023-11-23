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
    getBicliqueCover(
      {
        '0': [ 5 ],
        '1': [ 5 ],
        '2': [ 3, 4 ],
        '3': [ 2, 5 ],
        '4': [ 2, 5 ],
        '5': [ 0, 1, 3, 4 ]
      }
    );
  });


});
