import { useEffect, useCallback, useRef } from "react";
import BaseCanvas from "./BaseCanvas";
import { useSVGStore } from "@/lib/store/useSVGStore";
import { drawSVG } from "@/lib/utils/svg";

export default function RenderCanvas() {
  const { svg, selectedChildren } = useSVGStore();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleCanvasReady = useCallback((canvas: HTMLCanvasElement) => {
    canvasRef.current = canvas;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    console.log(svg);
    if (!svg || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSVG(ctx, svg);
  }, [svg, selectedChildren]);

  return <BaseCanvas onCanvasReady={handleCanvasReady} />;
}
