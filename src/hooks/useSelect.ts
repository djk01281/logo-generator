import { on } from "events";
import { useEffect, useRef, useState } from "react";

export const useSelect = (
  onMove: ({ ctx, currentPoint, prevPoint }: Move) => void,
  onHover: ({ ctx, currentPoint }: Hover) => void,
  onSelect: ({ ctx, currentPoint, e }: Select) => void,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  tool: Tool,
) => {
  const [selectMouseDown, setSelectMouseDown] = useState(false);
  const prevPoint = useRef<null | Point>(null);

  const onSelectMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setSelectMouseDown(true);

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const currentPoint = computePointInCanvas(e);
    if (!currentPoint) return;
    onSelect({ ctx, currentPoint, e });
  };

  const onSelectMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool !== "select") return;

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const currentPoint = computePointInCanvas(e);
    if (!currentPoint) return;

    if (selectMouseDown) {
      //   console.log("onSelectMouseMoveDown");
      onMove({ ctx, currentPoint, prevPoint: prevPoint.current });
      prevPoint.current = currentPoint;
      if (!currentPoint) return;
    } else {
      onHover({ ctx, currentPoint });
    }
  };

  const computePointInCanvas = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return { x, y };
  };

  const onSelectMouseUp = () => {
    setSelectMouseDown(false);
    prevPoint.current = null;
  };

  return {
    onSelectMouseUp,
    setSelectMouseDown,
    onSelectMouseDown,
    onSelectMouseMove,
    selectMouseDown,
  };
};
