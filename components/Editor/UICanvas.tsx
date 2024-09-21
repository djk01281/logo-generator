import { useToolManager } from "@/app/hooks/useToolManager";
import BaseCanvas from "./BaseCanvas";
import { useRef, useCallback, useEffect } from "react";
import { useUICanvas } from "@/app/hooks/useUICanvas";
import { useSVGStore } from "@/lib/store/useSVGStore";
import { drawSVG } from "@/lib/utils/svg";

export default function UICanvas() {
  const uiCanvasRef = useRef<HTMLCanvasElement | null>(null);
  useToolManager(uiCanvasRef);
  useUICanvas(uiCanvasRef);
  // const { svg, selectedChildren } = useSVGStore();

  const handleCanvasReady = useCallback((canvas: HTMLCanvasElement) => {
    uiCanvasRef.current = canvas;
  }, []);

  // useEffect(() => {
  //   const canvas = uiCanvasRef.current;
  //   if (!svg || !canvas) return;

  //   const ctx = canvas.getContext("2d");
  //   if (!ctx) return;

  //   ctx.clearRect(0, 0, canvas.width, canvas.height);

  //   // only draw the selected children
  //   // NOTE: This will cover the elements that are not selected..
  //   // hmmmmmmmmmmm
  //   drawSVG(ctx, {
  //     ...svg,
  //     children: svg.children.filter((_, index) =>
  //       selectedChildren.includes(index)
  //     ),
  //   });
  // }, [svg, selectedChildren]);

  return <BaseCanvas onCanvasReady={handleCanvasReady} zIndex={10} />;
}
