import { useState } from "react";

export const useSVG = (initial: SVG | null) => {
  const [svg, setSVG] = useState<SVG | null>(initial);

  const changeSubSVGOffset = (index: number, offset: Point) => {
    if (svg === null) return;
    const subSVG = svg[index];
    if (!subSVG) return;

    const newSVG = [...svg];
    newSVG[index] = {
      ...subSVG,
      offset,
    };
    setSVG(newSVG);
  };

  // Only works on Paths and Texts
  // const changePoint = (
  //   index: number,
  //   segmentIndex: number,
  //   pointIndex: number,
  //   offset: Point,
  // ) => {
  //   if (svg === null) return;
  //   const subSVG = svg[index];
  //   if (!subSVG) return;
  //   if (subSVG.tag !== "text" && subSVG.tag !== "path") return;

  //   const segment = subSVG.shape.d[segmentIndex];
  //   if (!segment) return;
  //   const point = segment.data[pointIndex];
  // };

  return { svg, setSVG, changeSubSVGOffset };
};
