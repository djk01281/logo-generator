import { create } from "zustand";

// toolStore for the tool state and event handling
export type ToolType = "upload" | "select" | "pen" | "shape" | "text" | "ai";

type ToolStore = {
  tool: ToolType;
  setTool: (tool: ToolType) => void;
};

export const useToolStore = create<ToolStore>((set) => ({
  tool: "select",
  setTool: (tool) => set({ tool }),
}));
