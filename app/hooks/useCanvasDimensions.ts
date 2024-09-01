import { useEffect, useState } from "react";

function useCanvasDimensions() {
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
    scale: 1,
  });

  useEffect(() => {
    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    setDimensions({
      width,
      height,
      scale: dpr,
    });

    return () => {};
  }, []);

  return dimensions;
}

export { useCanvasDimensions };
