import { create } from "zustand";

export type ToolType = "upload" | "select" | "pen" | "shape" | "text" | "ai";

type ToolStore = {
  currentTool: ToolType;
  setCurrentTool: (tool: ToolType) => void;
};

export const useToolStore = create<ToolStore>((set) => ({
  currentTool: "select",
  setCurrentTool: (currentTool) => set({ currentTool }),
}));
