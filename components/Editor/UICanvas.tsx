import { useCallback, useRef } from "react";
import BaseCanvas from "./BaseCanvas";

export default function UICanvas() {
  const dragStartPointRef = useRef<{ x: number; y: number } | null>(null);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    console.log("Click", e.offsetX, e.offsetY);
    dragStartPointRef.current = { x: e.offsetX, y: e.offsetY };
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent, canvas: HTMLCanvasElement) => {
      if (!dragStartPointRef.current) return;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const { x: startX, y: startY } = dragStartPointRef.current;
      ctx.fillStyle = "#d9eaf6";
      ctx.fillRect(startX, startY, e.offsetX - startX, e.offsetY - startY);
    },
    []
  );

  const handleMouseUp = useCallback((canvas: HTMLCanvasElement) => {
    console.log("Mouse up");
    dragStartPointRef.current = null;

    // clear the rectangle
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  const handleCanvasReady = useCallback(
    (canvas: HTMLCanvasElement) => {
      const mouseMoveHandler = (e: MouseEvent) => handleMouseMove(e, canvas);
      const mouseUpHandler = () => handleMouseUp(canvas);

      canvas.addEventListener("mousedown", handleMouseDown);
      canvas.addEventListener("mousemove", mouseMoveHandler);
      canvas.addEventListener("mouseup", mouseUpHandler);

      return () => {
        canvas.removeEventListener("mousedown", handleMouseDown);
        canvas.removeEventListener("mousemove", mouseMoveHandler);
        canvas.removeEventListener("mouseup", mouseUpHandler);
      };
    },
    [handleMouseDown, handleMouseMove, handleMouseUp]
  );

  return <BaseCanvas onCanvasReady={handleCanvasReady} zIndex={10} />;
}
