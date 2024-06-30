"use client";

import { useSVG } from "~/hooks/usSVG";
import { FC } from "react";
import { useState, useRef } from "react";
import { parsePath, absolutize, normalize } from "path-data-parser";
import { MousePointer2, Pointer } from "lucide-react";

interface ToolBoxProps {
  handleToolChange: (tool: Tool) => void;
  tool: Tool;
}

const ToolBox: FC<ToolBoxProps> = ({ handleToolChange, tool }) => {
  return (
    <div className="flex h-full items-center gap-1 rounded-md bg-white p-1 shadow-md">
      <div
        className={`flex h-[30px] w-[30px] items-center justify-center rounded-md ${
          tool === "select" ? "bg-violet-400 text-white" : ""
        }  hover:bg-violet-400 hover:text-white`}
        onClick={() => handleToolChange("select")}
      >
        <MousePointer2 className="h-[20px] w-[20px] stroke-[1px]" />
      </div>

      <div className="h-[28px] w-[1px] bg-[#f3f5f7]"></div>

      <div
        className={`flex h-[30px] w-[30px] items-center justify-center rounded-md pt-1  ${
          tool === "hand" ? "bg-violet-400 text-white" : ""
        } hover:bg-violet-400 hover:text-white`}
        onClick={() => handleToolChange("hand")}
      >
        <Pointer className="h-[20px] w-[20px] stroke-1" />
      </div>
    </div>
  );
};

export default ToolBox;
