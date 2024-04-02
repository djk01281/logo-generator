import { useEffect, useRef, useState } from "react";

export const useDraw = (
  onDraw: ({ ctx, currentPoint, prevPoint }: Draw) => void
) => {
  const [mouseDown, setMouseDown] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prevPoint = useRef<null | Point>(null);

  const onMouseDown = () => {
    setMouseDown(true);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handler = (e: MouseEvent) => {
    if (!mouseDown) return;

    const currentPoint = computePointInCanvas(e);

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !currentPoint) return;

    onDraw({ ctx, currentPoint, prevPoint: prevPoint.current });
    prevPoint.current = currentPoint; // Assuming prevPoint is null for this example
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
      canvas.addEventListener("mousemove", handler);
      window.addEventListener("mouseup", mouseUpHandler);

      return () => {
        canvas.removeEventListener("mousemove", handler);
        window.removeEventListener("mouseup", mouseUpHandler);
      };
    }
  }, [onDraw]);

  return { canvasRef, onMouseDown, clear };
};
