import { useState, useEffect } from "react";

const useBiclique = ({param}) => {
    useEffect(() => {

        const maximalNodes = getMaximalNodes(param, "mu-quasi");

        const  { paths, lines, leftNodes, rightNodes, midNodes } =
        getPathsAndNodes();

    }, []);


}

export default useBiclique;
