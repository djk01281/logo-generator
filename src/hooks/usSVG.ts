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
    if (svg === null) return;
    if (selected === null) return;
    const { pathIndex, pointIndex, segmentIndex } = selected;
    const newSVG: SVG = svg.map((path, i) => {
      if (i !== pathIndex) return path;
      return {
        ...path,
        d: path.d.map((segment, j) => {
          if (j !== segmentIndex) return segment;
          segment.data[pointIndex] = to;
          return segment;
        }),
      };
    });
    setSVG(newSVG);
  };

  return { svg, setSVG, setSelected, moveSelected };
};
