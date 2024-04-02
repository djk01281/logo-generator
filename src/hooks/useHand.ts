import { useEffect, useRef, useState } from "react";

interface useHandProps {}
export const useHand = (
  onPan: ({ ctx, currentPoint, prevPoint }: Pan) => void,
  onZoom: ({ ctx, scaleX, scaleY }: Zoom) => void,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  tool: Tool
) => {
  const [mouseDown, setMouseDown] = useState(false);
  const prevPoint = useRef<null | Point>(null);

  const onMouseDown = () => {
    setMouseDown(true);
  };

  const onWheelMove = (event: WheelEvent) => {
    if (tool !== "hand") return;
    event.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scale = event.deltaY < 0 ? 1.1 : 0.9;
    onZoom({ ctx, scaleX: scale, scaleY: scale });
  };

  const mouseMoveHandler = (e: MouseEvent) => {
    if (!mouseDown) return;
    if (tool === "select") {
    }

    if (tool === "hand") {
      const currentPoint = computePointInCanvas(e);

      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx || !currentPoint) return;

      onPan({ ctx, currentPoint, prevPoint: prevPoint.current });
      prevPoint.current = currentPoint; // Assuming prevPoint is null for this example
    }
  };

  const computePointInCanvas = (e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return { x, y };
  };

  const mouseUpHandler = () => {
    setMouseDown(false);
    prevPoint.current = null;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("mousemove", mouseMoveHandler);
      window.addEventListener("mouseup", mouseUpHandler);
      canvas.addEventListener("wheel", onWheelMove);

      return () => {
        canvas.removeEventListener("mousemove", mouseMoveHandler);
        window.removeEventListener("mouseup", mouseUpHandler);
        canvas.removeEventListener("wheel", onWheelMove);
      };
    }
  }, [onPan, onZoom]);

  return { onMouseDown, mouseDown };
};
