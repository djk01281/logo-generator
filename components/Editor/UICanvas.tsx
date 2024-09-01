import { useCallback } from "react";
import BaseCanvas from "./BaseCanvas";

export default function UICanvas() {
  const handleClick = useCallback(() => {
    console.log("mouse clicked");
  }, []);

  const handleCanvasReady = useCallback(
    (canvas: HTMLCanvasElement) => {
      canvas.addEventListener("click", handleClick);

      return () => {
        canvas.removeEventListener("click", handleClick);
      };
    },
    [handleClick]
  );

  return <BaseCanvas onCanvasReady={handleCanvasReady} zIndex={10} />;
}
