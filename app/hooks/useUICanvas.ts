import { useSVGStore } from "@/lib/store/useSVGStore";
import { useCallback, useEffect } from "react";
import { calculateBounds } from "@/lib/utils/svg";

export const useUICanvas = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const svg = useSVGStore((state) => state.svg);
  const selectedChildren = useSVGStore((state) => state.selectedChildren);

  const drawBoundingBox = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    selectedChildren.forEach((index) => {
      const child = svg.children[index];
      if (!child) return;

      const bounds = child.bounds || calculateBounds(child);
      ctx.strokeStyle = "#0b99ff";
      ctx.lineWidth = 1;

      ctx.save();

      ctx.translate(child.transform.translate.x, child.transform.translate.y);
      ctx.scale(child.transform.scale.x, child.transform.scale.y);
      ctx.rotate(child.transform.rotate);
      ctx.strokeRect(
        bounds.topLeft.x,
        bounds.topLeft.y,
        bounds.bottomRight.x - bounds.topLeft.x,
        bounds.bottomRight.y - bounds.topLeft.y
      );

      ctx.restore();
      console.log("drawing bounding box");
      console.log("bounds", bounds);
    });
  }, [canvasRef, selectedChildren, svg]);

  const strokeSelectedChildren = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    selectedChildren.forEach((index) => {
      const child = svg.children[index];
      if (!child) return;

      const path2d = child.path2d;
      if (!path2d) return;

      ctx.strokeStyle = "#0b99ff";
      ctx.lineWidth = 1;

      ctx.save();

      ctx.translate(child.transform.translate.x, child.transform.translate.y);
      ctx.scale(child.transform.scale.x, child.transform.scale.y);
      ctx.rotate(child.transform.rotate);
      ctx.stroke(path2d);

      ctx.restore();
    });
  }, [canvasRef, selectedChildren, svg]);

  useEffect(() => {
    drawBoundingBox();
    strokeSelectedChildren();
  }, [drawBoundingBox, selectedChildren, strokeSelectedChildren]);
};
