import { useCallback } from "react";
import BaseCanvas from "./BaseCanvas";

export default function RenderCanvas() {
  const handleCanvasReady = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, 100, 100);

    return () => {};
  }, []);

  return <BaseCanvas onCanvasReady={handleCanvasReady} />;
}
