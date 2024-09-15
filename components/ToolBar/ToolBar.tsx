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

type ToolBarProps = {
  side: side;
};

export default function ToolBar({ side }: ToolBarProps) {
  const tool = useToolStore((state) => state.tool);
  const setTool = useToolStore((state) => state.setTool);

  const handleToolClick = (toolType: ToolType) => {
    console.log("toolType", toolType);
    setTool(toolType);
  };

  return (
    <SideWrapper side={side}>
      <div className="bg-white rounded-lg border-[1px] border-gray-500 p-1 flex flex-row gap-1">
        <ToolButton
          onClick={() => handleToolClick("upload")}
          isActive={tool === "upload"}
        >
          <Upload size={20} strokeWidth={1} />
        </ToolButton>
        <ToolButton
          onClick={() => handleToolClick("select")}
          isActive={tool === "select"}
        >
          <MousePointer2 size={20} strokeWidth={1} />
        </ToolButton>
        <ToolButton
          onClick={() => handleToolClick("shape")}
          isActive={tool === "shape"}
        >
          <Shapes size={20} strokeWidth={1} />
        </ToolButton>
        <ToolButton
          onClick={() => handleToolClick("pen")}
          isActive={tool === "pen"}
        >
          <Pen size={20} strokeWidth={1} />
        </ToolButton>
        <ToolButton
          onClick={() => handleToolClick("text")}
          isActive={tool === "text"}
        >
          <Type size={20} strokeWidth={1} />
        </ToolButton>
        <ToolButton
          onClick={() => handleToolClick("ai")}
          isActive={tool === "ai"}
        >
          <Sparkles size={20} strokeWidth={1} />
        </ToolButton>
      </div>
    </SideWrapper>
  );
}
