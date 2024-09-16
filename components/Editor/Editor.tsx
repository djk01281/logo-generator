"use client";
import { useEffect } from "react";
import RenderCanvas from "./RenderCanvas";
import UICanvas from "./UICanvas";
import { useSVGStore } from "@/lib/store/useSVGStore";
import { tagToString } from "@/lib/utils/svg";

export default function Editor() {
  const setSVG = useSVGStore((state) => state.setSVG);

  useEffect(() => {
    const svg = {
      children: [
        {
          type: "path",
          segments: [
            {
              type: "M",
              point: { x: 100, y: 100 },
            },
            {
              type: "L",
              point: { x: 200, y: 200 },
            },
          ],
          bounds: null,
          style: {
            fill: "red",
            stroke: "black",
            strokeWidth: 1,
            opacity: 1,
          },
          transform: {},
          path2d: new Path2D(
            tagToString({
              type: "path",
              segments: [
                {
                  type: "M",
                  point: { x: 100, y: 100 },
                },
                {
                  type: "L",
                  point: { x: 200, y: 200 },
                },
              ],
            } as PathTag)
          ),
        } as PathTag,
      ],
    };
    setSVG(svg);
  }, []);

  return (
    <div>
      <>
        <UICanvas />
        <RenderCanvas />
      </>
    </div>
  );
}
