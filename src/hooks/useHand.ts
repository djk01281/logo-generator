import { useEffect, useRef, useState } from "react";

export const useHand = (
  onPan: ({ ctx, currentPoint, prevPoint }: Pan) => void,
  onZoom: ({ ctx, scaleX, scaleY }: Zoom) => void,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  tool: Tool,
) => {
  const [mouseDown, setMouseDown] = useState(false);
  const prevPoint = useRef<null | Point>(null);

  const onMouseDown = () => {
    setMouseDown(true);
  };

  const handOnWheelMove = (event: React.WheelEvent<HTMLCanvasElement>) => {
    if (tool !== "hand") return;
    event.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scale = event.deltaY < 0 ? 0.1 : -0.1;
    onZoom({ ctx, scaleX: scale, scaleY: scale });
  };

  const handMouseMoveHandler = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!mouseDown) return;
    if (tool === "select") {
      return;
    }

    if (tool === "hand") {
      const currentPoint = computePointInCanvas(e);

      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx || !currentPoint) return;

      onPan({ ctx, currentPoint, prevPoint: prevPoint.current });
      prevPoint.current = currentPoint; // Assuming prevPoint is null for this example
    }
  };

  const computePointInCanvas = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return { x, y };
  };

  const handMouseUpHandler = () => {
    setMouseDown(false);
    prevPoint.current = null;
  };

  return {
    onMouseDown,
    mouseDown,
    handMouseMoveHandler,
    handMouseUpHandler,
    handOnWheelMove,
  };
};
