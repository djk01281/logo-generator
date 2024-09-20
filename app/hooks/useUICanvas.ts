import { useSVGStore } from "@/lib/store/useSVGStore";
import { useCallback, useEffect } from "react";
import { calculateBounds } from "@/lib/utils/svg";

export const useUICanvas = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const svg = useSVGStore((state) => state.svg);
  const selectedChildren = useSVGStore((state) => state.selectedChildren);

  const applyTransform = useCallback(
    (point: { x: number; y: number }, transform: TransformAttributes) => {
      const { x, y } = point;
      const { translate, scale, rotate } = transform;

      const tx = x * scale.x + translate.x;
      const ty = y * scale.y + translate.y;

      const cos = Math.cos(rotate);
      const sin = Math.sin(rotate);
      const rx = tx * cos - ty * sin;
      const ry = tx * sin + ty * cos;

      return { x: rx, y: ry };
    },
    []
  );

  const drawBoundingBox = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (selectedChildren.length === 0) return;

    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;

    selectedChildren.forEach((index) => {
      const child = svg.children[index];
      if (!child) return;

      const bounds = child.bounds || calculateBounds(child);
      const { topLeft, bottomRight } = bounds;

      const globalTopLeft = applyTransform(topLeft, child.transform);
      const globalBottomRight = applyTransform(bottomRight, child.transform);

      minX = Math.min(minX, globalTopLeft.x, globalBottomRight.x);
      minY = Math.min(minY, globalTopLeft.y, globalBottomRight.y);
      maxX = Math.max(maxX, globalTopLeft.x, globalBottomRight.x);
      maxY = Math.max(maxY, globalTopLeft.y, globalBottomRight.y);
    });

    ctx.strokeStyle = "#0b99ff";
    ctx.lineWidth = 2;
    ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);

    const cornerSize = 4;
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#0b99ff";
    [
      [minX, minY],
      [maxX, minY],
      [minX, maxY],
      [maxX, maxY],
    ].forEach(([x, y]) => {
      ctx.strokeRect(
        x - cornerSize / 2,
        y - cornerSize / 2,
        cornerSize,
        cornerSize
      );
    });
  }, [canvasRef, selectedChildren, svg, applyTransform]);

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
  }, [drawBoundingBox, strokeSelectedChildren]);

  return { applyTransform };
};
