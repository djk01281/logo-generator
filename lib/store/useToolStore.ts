import { create } from "zustand";

export type ToolType = "upload" | "select" | "pen" | "shape" | "text" | "ai";

export type ToolMode = {
  upload: "normal";
  select: "normal" | "edit";
  pen: "normal";
  shape: "rectangle" | "ellipse" | "polygon";
  text: "normal";
  ai: "normal";
};

type ToolState = {
  currentTool: ToolType;
  mode: ToolMode[ToolType];
};

type ToolActions = {
  setCurrentTool: (tool: ToolType) => void;
  setMode: <T extends ToolType>(tool: T, mode: ToolMode[T]) => void;
};

type ToolStore = ToolState & ToolActions;

const initialModes: { [K in ToolType]: ToolMode[K] } = {
  upload: "normal",
  select: "normal",
  pen: "normal",
  shape: "rectangle",
  text: "normal",
  ai: "normal",
};

export const useToolStore = create<ToolStore>((set) => ({
  currentTool: "select",
  mode: initialModes["select"],
  setCurrentTool: (currentTool: ToolType) =>
    set({ currentTool, mode: initialModes[currentTool] }),
  setMode: (tool, mode) => set({ mode }),
}));
