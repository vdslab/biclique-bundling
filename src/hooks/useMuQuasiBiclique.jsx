import { useEffect, useState } from "react";
import {
  getAllEnumNodes,
  getMaximalCandNodes,
  getMaximalNodes,
} from "../utils/getNodes";
import { object } from "prop-types";

const useMuQuasiBiclique = (mu) => {
  useEffect(() => {
    (async () => {
        const res = await fetch("/matrix_5_5_70.json");
        const matrixJson = await res.json();
        const bipartite = matrixJson["2"];

        //pre-preprocess
        const Cand = {};

        const Upper = [0, 1, 2, 3, 4];

        for(const u of Upper) {
            const T = outVertices(u);
            const M = {};
            const key = getkey();
            C[key] = {T, M};
        }

        for(const key of object.keys(C)) {
            //double for
        }

        //main process

        //fillterNonMaximal

    })();
  }, []);
};

export default useMuQuasiBiclique;
