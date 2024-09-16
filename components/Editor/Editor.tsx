"use client";
import { useEffect } from "react";
import RenderCanvas from "./RenderCanvas";
import UICanvas from "./UICanvas";
import { useSVGStore } from "@/lib/store/useSVGStore";
import { tagToString, svgStringToTags } from "@/lib/utils/svg";

export default function Editor() {
  const setSVG = useSVGStore((state) => state.setSVG);

  useEffect(() => {
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">
      <path fill="red" stroke="red" stroke-width="1" d="M100 100 L200 200" />
    </svg>`;

    const tags = svgStringToTags(svgString);
    setSVG({
      children: tags,
    });
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
