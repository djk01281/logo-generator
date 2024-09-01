import { create } from "zustand";

// TODO: Figure out the svg typing, don't mess it up this time
type svgStore = {};

// toolStore for the tool state and event handling
export type ToolType = "select" | "pen" | "shape" | "text" | "ai";

type ToolStore = {
  tool: ToolType;
  setTool: (tool: ToolType) => void;
};

export const useToolStore = create<ToolStore>((set) => ({
  tool: "select",
  setTool: (tool) => set({ tool }),
}));
