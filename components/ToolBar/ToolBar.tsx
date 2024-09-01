"use client";

import AITool from "./AITool";
import ModeTool from "./ModeTool";
import PenTool from "./PenTool";
import ShapeTool from "./ShapeTool";
import SideWrapper from "../Wrapper/SideWrapper";
import TextTool from "./TextTool";
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
      <div className="bg-white rounded-lg border-[1px] border-gray-500 p-2 flex flex-row gap-2">
        <ModeTool
          onClick={() => handleToolClick("select")}
          isActive={tool === "select"}
        />
        <AITool
          onClick={() => handleToolClick("ai")}
          isActive={tool === "ai"}
        />
        <ShapeTool
          onClick={() => handleToolClick("shape")}
          isActive={tool === "shape"}
        />
        <PenTool
          onClick={() => handleToolClick("pen")}
          isActive={tool === "pen"}
        />
        <TextTool
          onClick={() => handleToolClick("text")}
          isActive={tool === "text"}
        />
      </div>
    </SideWrapper>
  );
}
