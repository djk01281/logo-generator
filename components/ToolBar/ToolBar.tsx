"use client";
import { useRef } from "react";
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
import { svgStringToTags } from "@/lib/utils/svg";
import { useSVGStore } from "@/lib/store/useSVGStore";

type ToolBarProps = {
  side: side;
};

export default function ToolBar({ side }: ToolBarProps) {
  const currentTool = useToolStore((state) => state.currentTool);
  const setCurrentTool = useToolStore((state) => state.setCurrentTool);
  const setSVG = useSVGStore((state) => state.setSVG);

  const handleToolClick = (toolType: ToolType) => {
    console.log("toolType", toolType);
    setCurrentTool(toolType);
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // TODO: Think I need to scale the SVG to make it fit the canvas..
    const reader = new FileReader();
    reader.onload = (e) => {
      const svgString = e.target?.result as string;
      setSVG(svgString);
    };
    reader.readAsText(file);
    setCurrentTool("select");
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
          onClick={() => {
            handleFileInputClick();
            handleToolClick("upload");
          }}
          isActive={currentTool === "upload"}
        >
          <Upload size={20} strokeWidth={1} />
        </ToolButton>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileInputChange}
        />
      </div>
    </SideWrapper>
  );
}
