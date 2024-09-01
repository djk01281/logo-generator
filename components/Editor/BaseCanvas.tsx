import React, { useEffect, useRef, useCallback } from "react";
import { useCanvasDimensions } from "@/app/hooks/useCanvasDimensions";

type BaseCanvasProps = {
  onCanvasReady?: (canvas: HTMLCanvasElement) => (() => void) | void;
  zIndex?: number;
};

const BaseCanvas: React.FC<BaseCanvasProps> = ({ onCanvasReady, zIndex }) => {
  const { width, height, scale } = useCanvasDimensions();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set the canvas size
    canvas.width = width * scale;
    canvas.height = height * scale;

    // Scale the context
    ctx.scale(scale, scale);

    // Call onCanvasReady if provided
    if (onCanvasReady) {
      return onCanvasReady(canvas);
    }
  }, [width, height, scale, onCanvasReady]);

  useEffect(() => {
    const cleanup = setupCanvas();
    return cleanup;
  }, [setupCanvas]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
      className={`absolute ${zIndex ? `z-${zIndex}` : ""}`}
    />
  );
};

export default React.memo(BaseCanvas);
