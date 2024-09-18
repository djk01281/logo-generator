import { useToolManager } from "@/app/hooks/useToolManager";
import BaseCanvas from "./BaseCanvas";
import { useRef, useCallback } from "react";

export default function UICanvas() {
  const uiCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const { currentTool } = useToolManager(uiCanvasRef);

  const handleCanvasReady = useCallback((canvas: HTMLCanvasElement) => {
    uiCanvasRef.current = canvas;
  }, []);

  return <BaseCanvas onCanvasReady={handleCanvasReady} zIndex={10} />;
}
