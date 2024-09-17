import { useEffect, useMemo, useRef } from "react";
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

  const allHandlers = useMemo(() => {
    return Object.fromEntries(
      Object.entries(toolHooks).map(([tool, hook]) => [tool, hook()])
    );
  }, []);

  const currentHandlers = useMemo(() => {
    return (
      allHandlers[currentTool]?.[
        mode as keyof (typeof allHandlers)[typeof currentTool]
      ] ?? {}
    );
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
