"use client";

import SideWrapper from "../Wrapper/SideWrapper";
import ToolButton from "./ToolButton";
import {
  Sparkles,
  MousePointer2,
  Type,
  Shapes,
  PenTool as Pen,
  Upload,
} from "lucide-react";
import { ToolType, useToolStore } from "@/lib/store/useToolStore";
import FileInput from "../FileInput";

type ToolBarProps = {
  side: side;
};

export default function ToolBar({ side }: ToolBarProps) {
  const currentTool = useToolStore((state) => state.currentTool);
  const setCurrentTool = useToolStore((state) => state.setCurrentTool);

  const handleToolClick = (toolType: ToolType) => {
    console.log("toolType", toolType);
    setCurrentTool(toolType);
  };

  return (
    <SideWrapper side={side}>
      <div className="bg-white rounded-lg border-[1px] border-gray-500 p-1 flex flex-row gap-1">
        <ToolButton
          onClick={() => handleToolClick("select")}
          isActive={currentTool === "select"}
        >
          <MousePointer2 size={20} strokeWidth={1} />
        </ToolButton>
        <ToolButton
          onClick={() => handleToolClick("shape")}
          isActive={currentTool === "shape"}
        >
          <Shapes size={20} strokeWidth={1} />
        </ToolButton>
        <ToolButton
          onClick={() => handleToolClick("pen")}
          isActive={currentTool === "pen"}
        >
          <Pen size={20} strokeWidth={1} />
        </ToolButton>
        <ToolButton
          onClick={() => handleToolClick("text")}
          isActive={currentTool === "text"}
        >
          <Type size={20} strokeWidth={1} />
        </ToolButton>
        <ToolButton
          onClick={() => handleToolClick("ai")}
          isActive={currentTool === "ai"}
        >
          <Sparkles size={20} strokeWidth={1} />
        </ToolButton>
        <ToolButton
          onClick={() => handleToolClick("upload")}
          isActive={currentTool === "upload"}
        >
          <Upload size={20} strokeWidth={1} />
        </ToolButton>
      </div>
    </SideWrapper>
  );
}
