import { useState, useRef, useCallback } from "react";
import { useSVGStore } from "@/lib/store/useSVGStore";

export const useSelectTool = () => {
  const [selectedElement, setSelectedElement] = useState<SVGElement | null>(
    null
  );
  const dragStartPointRef = useRef<{ x: number; y: number } | null>(null);

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

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#d9eaf6";
      ctx.fillRect(startX, startY, endX - startX, endY - startY);

      ctx.strokeStyle = "#6bacfd";
      ctx.lineWidth = 1;
      ctx.strokeRect(startX, startY, endX - startX, endY - startY);
    },
    []
  );

  return {
    normal: {
      mousedown: (e: MouseEvent) => {
        console.log("normal mouseDown", e.offsetX, e.offsetY);
        dragStartPointRef.current = { x: e.offsetX, y: e.offsetY };
      },
      mousemove: (e: MouseEvent) => {
        if (!dragStartPointRef.current) return;

        const canvas = e.target as HTMLCanvasElement;
        const { x: startX, y: startY } = dragStartPointRef.current;
        drawSelectionBox(canvas, startX, startY, e.offsetX, e.offsetY);
      },
      mouseup: (e: MouseEvent) => {
        console.log("normal mouseUp");
        dragStartPointRef.current = null;

        const canvas = e.target as HTMLCanvasElement;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        // TODO:: Select the elements
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
