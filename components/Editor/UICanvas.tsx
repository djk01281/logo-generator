import { useToolManager } from "@/app/hooks/useToolManager";
import BaseCanvas from "./BaseCanvas";
import { useRef, useCallback, use } from "react";
import { useUICanvas } from "@/app/hooks/useUICanvas";

export default function UICanvas() {
  const uiCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const { currentTool } = useToolManager(uiCanvasRef);
  useUICanvas(uiCanvasRef);

  const handleCanvasReady = useCallback((canvas: HTMLCanvasElement) => {
    uiCanvasRef.current = canvas;
  }, []);

  return <BaseCanvas onCanvasReady={handleCanvasReady} zIndex={10} />;
}
