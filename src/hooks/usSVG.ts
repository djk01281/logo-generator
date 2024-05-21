import { useEffect, useRef, useState } from "react";

export const useSVG = (initial: SVG | null) => {
  type Edge = {
    pathIndex: number;
    segmentIndex: number;
    pointIndex: number;
  };

  const [svg, setSVG] = useState<SVG | null>(initial);

  const [selected, setSelected] = useState<Edge | null>(null);

  const moveSelected = (to: Point) => {
    // if (svg === null) return;
    // if (selected === null) return;
    // const { pathIndex, pointIndex, segmentIndex } = selected;
    // if(svg[pathIndex]?.tag === "text") return;
    // if(svg[pathIndex?.shape.
    // const newSVG =  [...svg]
    // newSVG[pathIndex]?.shape.d[segmentIndex].data[pointIndex] = to;
    // setSVG(newSVG)
    console.log("moveSelected", to);
  };

  return { svg, setSVG, setSelected, moveSelected };
};
