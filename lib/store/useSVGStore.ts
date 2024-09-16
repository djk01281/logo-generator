import { create } from "zustand";
import { tagToString } from "../utils/svg";

type SVGStore = {
  svg: SVGRootElement;
  setSVG: (svg: SVGRootElement) => void;
  deleteSVG: (index: number) => void;
  updateSVG: (index: number, svg: SVGChildTag) => void;
};

export const useSVGStore = create<SVGStore>((set) => ({
  svg: {
    children: [],
  },
  setSVG: (svg) => set({ svg }),
  deleteSVG: (index) => {
    set((state) => {
      const children = state.svg.children.filter((_, i) => i !== index);
      return {
        svg: {
          ...state.svg,
          children,
        },
      };
    });
  },
  updateSVG: (index, svg) => {
    set((state) => {
      const children = state.svg.children.map((child, i) =>
        i === index ? svg : child
      );
      return {
        svg: {
          ...state.svg,
          children,
        },
      };
    });
  },
}));
