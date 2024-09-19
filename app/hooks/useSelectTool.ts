import { useRef, useCallback } from "react";
import { useSVGStore } from "@/lib/store/useSVGStore";

export const useSelectTool = () => {
  const selectedChildren = useSVGStore((state) => state.selectedChildren);
  const selectByBox = useSVGStore((state) => state.selectByBox);
  const selectByPoint = useSVGStore((state) => state.selectByPoint);
  const svg = useSVGStore((state) => state.svg);
  const dragStartPointRef = useRef<Point | null>(null);

  const drawSelectionBox = useCallback(
    (
      canvas: HTMLCanvasElement,
      startX: number,
      startY: number,
      endX: number,
      endY: number
    ) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.globalAlpha = 0.5;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#d9eaf6";
      ctx.fillRect(startX, startY, endX - startX, endY - startY);

      ctx.strokeStyle = "#6bacfd";
      ctx.lineWidth = 1;
      ctx.strokeRect(startX, startY, endX - startX, endY - startY);

      ctx.globalAlpha = 1;
    },
    []
  );

  return {
    normal: {
      mousedown: (e: MouseEvent) => {
        dragStartPointRef.current = { x: e.offsetX, y: e.offsetY };
      },
      mousemove: (e: MouseEvent) => {
        if (!dragStartPointRef.current) return;

        const canvas = e.target as HTMLCanvasElement;
        const { x: startX, y: startY } = dragStartPointRef.current;
        drawSelectionBox(canvas, startX, startY, e.offsetX, e.offsetY);
      },
      mouseup: (e: MouseEvent) => {
        if (!dragStartPointRef.current) return;

        const canvas = e.target as HTMLCanvasElement;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        const { x: startX, y: startY } = dragStartPointRef.current;
        const endX = e.offsetX;
        const endY = e.offsetY;

        if (Math.abs(endX - startX) < 5 && Math.abs(endY - startY) < 5) {
          selectByPoint({ x: endX, y: endY }, ctx!);
        } else {
          selectByBox({
            topLeft: { x: Math.min(startX, endX), y: Math.min(startY, endY) },
            bottomRight: {
              x: Math.max(startX, endX),
              y: Math.max(startY, endY),
            },
          });
        }

        dragStartPointRef.current = null;
      },
    },
    edit: {
      mousedown: (e: MouseEvent) => {
        console.log("edit mouseDown");
      },
      mousemove: (e: MouseEvent) => {},
      mouseup: (e: MouseEvent) => {
        console.log("edit mouseUp");
      },
    },
  };
};
