import { xxHash32 } from "js-xxhash";

const genKey = (u) => {
    const seed = 43784;

    let str = "";
    for (const num of u) {
      const strnum = String(num);

      str += strnum.padStart(4, "0");
    }

    return xxHash32(str, seed);
}

export default genKey;
