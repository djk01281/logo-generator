"use client";

import SideWrapper from "../Wrapper/SideWrapper";
import ToolButton from "./ToolButton";
import { Sparkles } from "lucide-react";
import { MousePointer2 } from "lucide-react";
import { Type } from "lucide-react";
import { Shapes } from "lucide-react";
import { PenTool as Pen } from "lucide-react";
import { ToolType, useToolStore } from "@/app/lib/store";

type ToolBarProps = {
  side: side;
};

export default function ToolBar({ side }: ToolBarProps) {
  const tool = useToolStore((state) => state.tool);
  const setTool = useToolStore((state) => state.setTool);

  const handleToolClick = (toolType: ToolType) => {
    setTool(toolType);
  };

  return (
    <SideWrapper side={side}>
      <div className="bg-white rounded-lg border-[1px] border-gray-500 p-1 flex flex-row gap-1">
        <ToolButton
          onClick={() => handleToolClick("select")}
          isActive={tool === "select"}
          Icon={MousePointer2}
        />
        <ToolButton
          onClick={() => handleToolClick("shape")}
          isActive={tool === "shape"}
          Icon={Shapes}
        />
        <ToolButton
          onClick={() => handleToolClick("pen")}
          isActive={tool === "pen"}
          Icon={Pen}
        />
        <ToolButton
          onClick={() => handleToolClick("text")}
          isActive={tool === "text"}
          Icon={Type}
        />
        <ToolButton
          onClick={() => handleToolClick("ai")}
          isActive={tool === "ai"}
          Icon={Sparkles}
        />
      </div>
    </SideWrapper>
  );
}
