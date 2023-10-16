import { useEffect, useState } from "react";
import { getPaths } from "../main/getPaths";
import muQuasi from "../main/muQuasi";

const useBiBundling = () => {
    const [paths, setPaths] = useState();
    const [lines, setLines] = useState();
    const [leftNodes, setLeftNodes] = useState();
    const [rightNodes, setRightNodes] = useState();
    const [midNodes, setMidNodes] = useState();

     useEffect(() => {
        (async () => {
            const res = await fetch("public/act-mooc/json/mooc_actions_100.json");
            const bipartite = await res.json();

            const mu = 0.7
            const { bipartiteMatrix, maximalNodes} = muQuasi(mu);

            const { paths, lines, leftNodes, rightNodes, midNodes } = getPaths(
                bipartiteMatrix,
                maximalNodes,
                leftX,
                leftY,
                rightX,
                rightY,
                step
            );

            setPaths(paths);
            setLines(lines);
            setLeftNodes(leftNodes);
            setRightNodes(rightNodes);
            setMidNodes(midNodes);
        })();
    }, []);
};

export default useBiBundling;
