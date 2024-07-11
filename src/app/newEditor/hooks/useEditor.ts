import { useEffect, useRef, useState } from "react";

export const useEditor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const uiRef = useRef<HTMLCanvasElement>(null);

  const [selectedPaths, setSelectedPaths] = useState<SVG[]>([]);

  const select = (point: Point) => {
    let selected = "none";

    return selected;
  };
  return { canvasRef, uiRef };
};
