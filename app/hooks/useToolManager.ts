import { useEffect, useMemo } from "react";
import { ToolType, ToolMode, useToolStore } from "@/lib/store/useToolStore";
import { useSelectTool } from "./useSelectTool";
import { useUploadTool } from "./useUploadTool";
import { usePenTool } from "./usePenTool";
import { useShapeTool } from "./useShapeTool";
import { useTextTool } from "./useTextTool";
import { useAITool } from "./useAITool";

type ToolHooks = {
  [K in ToolType]: () => {
    [M in ToolMode[K]]: {
      [eventName: string]: (e: MouseEvent) => void;
    };
  };
};

const toolHooks: ToolHooks = {
  select: useSelectTool,
  upload: useUploadTool,
  pen: usePenTool,
  shape: useShapeTool,
  text: useTextTool,
  ai: useAITool,
};

export const useToolManager = (
  canvasRef: React.RefObject<HTMLCanvasElement>
) => {
  const { currentTool, mode } = useToolStore();

  const selectHandlers = useSelectTool();
  const uploadHandlers = useUploadTool();
  const penHandlers = usePenTool();
  const shapeHandlers = useShapeTool();
  const textHandlers = useTextTool();
  const aiHandlers = useAITool();

  const allHandlers = useMemo(
    () => ({
      select: selectHandlers,
      upload: uploadHandlers,
      pen: penHandlers,
      shape: shapeHandlers,
      text: textHandlers,
      ai: aiHandlers,
    }),
    [
      selectHandlers,
      uploadHandlers,
      penHandlers,
      shapeHandlers,
      textHandlers,
      aiHandlers,
    ]
  );

  const currentHandlers = useMemo(() => {
    if (!currentTool || !allHandlers[currentTool]) {
      return {};
    }
    const toolHandlers = allHandlers[currentTool];
    return (toolHandlers[mode as keyof typeof toolHandlers] || {}) as Record<
      string,
      (e: MouseEvent) => void
    >;
  }, [currentTool, mode, allHandlers]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    Object.entries(currentHandlers).forEach(([event, handler]) => {
      canvas.addEventListener(event, handler as EventListener);
    });

    return () => {
      Object.entries(currentHandlers).forEach(([event, handler]) => {
        canvas.removeEventListener(event, handler as EventListener);
      });
    };
  }, [canvasRef, currentHandlers]);

  return { currentTool };
};
