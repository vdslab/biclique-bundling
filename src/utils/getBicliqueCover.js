
/**
 入力：二部グラフ配列
 出力:グラフG_Eの隣接リスト(Object)
**/

export const convertG2Ge = (G) => {
    let nodeNumber = 0;
    const Ge = {};
    const edges = [];
    const edge2Node = new Map();
    for(let i = 0; i < G.length; i++) {
        for(let j = 0; j < G[i].length; j++) {
            if(!G[i][j]) continue;
            //Geのノード作成
            Ge[nodeNumber] = [];
            edge2Node.set(i+","+j, nodeNumber);
            nodeNumber ++;
            edges.push({"row": i , "col": j});
        }
    }

    console.log( edge2Node);

    for(let i = 0; i < edges.length; i++) {
        const iG = edges[i]["row"];
        const jG = edges[i]["col"];
        for(let j = i + 1; j < edges.length; j++) {
            const iGe = edges[j]["row"];
            const jGe = edges[j]["col"];

            //vertex-jointならpass;
            if(iG === iGe || jG === jGe) continue;

            const rowDiff = iGe - iG;
            const colDiff = jGe - jG;
            if(G[iG + rowDiff][jG] && G[iG][jG + colDiff]) continue;

            //通過した(iG, jG)と(iGe, jGe)は結ぶ
            console.log(iG, jG, iGe, jGe)
            console.log(edge2Node.get(iG+","+jG), edge2Node.get(iGe+","+jGe));
            Ge[edge2Node.get(iG+","+jG)].push(edge2Node.get(iGe+","+jGe));
            Ge[edge2Node.get(iGe+","+jGe)].push(edge2Node.get(iG+","+jG));
        }
    }

    console.log(Ge);

    return Ge;
}


export const RLF = (G) => {

}

