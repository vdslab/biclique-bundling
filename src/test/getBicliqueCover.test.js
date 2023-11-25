import { expect, test, describe } from "vitest";
import {
  convertG2Ge,
  getBicliqueCover,
  RLF,
} from "./../utils/getBicliqueCover";

// describe("GからG_Eの変換テスト", () => {
//   test("K_2_2の変換", () => {
//     // convertG2Ge([
//     //   [1, 1, 1],
//     //   [1, 1, 0],
//     //   [0, 0, 1],
//     // ]);
//   });
// });

describe("RLFテスト", () => {
  test("K_2_2の変換", () => {
    getBicliqueCover([
      [0, 1, 1, 1, 1],
      [1, 0, 1, 1, 1],
      [1, 1, 0, 1, 1],
      [1, 1, 1, 0, 1],
      [1, 1, 1, 1, 0]
    ]
    );
    console.log(
      "hasimasimasimasimasfimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasimasime"
    );

    //  const G = {
    //   '0':[1, 2, 3],
    //   '1':[0, 2, 3, 7],
    //   '2':[0, 1, 3],
    //   '3':[0, 1, 2, 8],
    //   '4':[6],
    //   '5':[7, 8],
    //   '6':[4, 8],
    //   '7':[1, 5],
    //   '8':[3, 5, 6],
    //  };

    //  console.log(G, Ge)

    // getBicliqueCover([
    //   [0, 0, 1, 0, 1],
    //   [1, 1, 1, 1, 0],
    //   [1, 1, 1, 0, 0],
    //   [1, 1, 0, 0, 0],
    // ]);
  });
});

/**
 * {
      '0':[1, 2, 3, 4, 6,  7, 9, 10],
      '1':[0, 2, 3, 4],
      '2':[0, 1, 3, 4, 8],
      '3':[0, 1, 2, 4],
      '4':[0, 1, 2, 3, 5, 9],
      '5':[4, 6, 7, 8, 9, 10],
      '6':[0, 5, 7, 9],
      '7':[0, 5, 9, 10],
      '8':[2, 5, 6],
      '9':[0, 4, 5, 6, 7],
      '10':[0, 5, 7]
     }
 */
/**[
      [0, 0, 1, 0, 1],
      [1, 1, 1, 1, 0],
      [1, 1, 1, 0, 0],
      [1, 1, 0, 0, 0],
    ] */
/*
t1:0 d=8
t2:1 d=4
t3:2 d=5
t4:3 d=4
t5:4 d=6

e1:5 d=6
e4:6 d=4
e6:7 d=4
e7:8 d=3
e10:9 d=5
e12:10 d=3
 */
/**
 {
  '0':[1, 2, 3, 4, 6,  8, 9, 10],
  '1':[0, 2, 3, 4],
  '2':[0, 1, 3, 4, 8],
  '3':[0, 1, 2, 4],
  '4':[0, 1, 2, 3, 5, 9],
  '5':[4, 6, 7, 8, 9, 10],
  '6':[0, 5, 7, 9],
  '7':[0, 5, 9, 10],
  '8':[2, 5, 6],
  '9':[0, 4, 5, 6, 7],
  '10':[0, 5, 7]
 }
 */

/*
t2:0
t3:1
t4:2
t5:3
e1:4
e4:5
e6:6
e7:7
e10:8
 */

/*
 {
  '0':[1, 2, 3],
  '1':[0, 2, 3, 7],
  '2':[0, 1, 3],
  '3:[0, 1, 2, 8],
  '4':[6],
  '5':[7, 8],
  '6':[4, 8],
  '7':[1, 5],
  '8':[3, 5, 6]
 }
 */
