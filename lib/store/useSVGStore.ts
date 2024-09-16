import { create } from "zustand";

type SVGStore = {
  svg: SVGRootElement;
  setSVG: (svg: SVGRootElement) => void;
  deleteChildren: (array: number[]) => void;
  moveChildren: (array: number[], offset: { x: number; y: number }) => void;
  selectedChildren: number[];
  setSelectedChildren: (selectedChildren: number[]) => void;
};
export const useSVGStore = create<SVGStore>((set) => ({
  svg: {
    children: [],
  },
  setSVG: (svg) => set({ svg }),
  deleteChildren: (array) => {
    set((state) => {
      const children = state.svg.children.filter((_, i) => !array.includes(i));
      return {
        svg: {
          ...state.svg,
          children,
        },
      };
    });
  },
  moveChildren: (array, offset) => {
    set((state) => {
      const children = state.svg.children.map((child, i) => {
        if (!array.includes(i)) return child;

        const newChild = { ...child };
        newChild.transform.translate = {
          x: newChild.transform.translate.x + offset.x,
          y: newChild.transform.translate.y + offset.y,
        };
        return newChild;
      });
      return {
        svg: {
          ...state.svg,
          children,
        },
      };
    });
  },
  selectedChildren: [],
  setSelectedChildren: (selectedChildren) => set({ selectedChildren }),
}));
