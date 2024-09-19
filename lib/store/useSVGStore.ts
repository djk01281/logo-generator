import { create } from "zustand";
import { createPath2D, calculateBounds, isIntersecting } from "@/lib/utils/svg";

type SVGStore = {
  svg: SVGRootElement;
  setSVG: (svg: SVGRootElement) => void;
  deleteChildren: (array: number[]) => void;
  moveChildren: (array: number[], offset: Point) => void;
  selectedChildren: number[];
  setSelectedChildren: (selectedChildren: number[]) => void;
  getPath2D: (index: number) => Path2D | null;
  getBounds: (index: number) => Bounds | null;
  selectByBox: (selectionBox: Bounds) => void;
  selectByPoint: (point: Point, ctx: CanvasRenderingContext2D) => void;
};

export const useSVGStore = create<SVGStore>((set, get) => ({
  svg: { children: [] },
  setSVG: (svg) => set({ svg }),
  deleteChildren: (array) => {
    set((state) => ({
      svg: {
        ...state.svg,
        children: state.svg.children.filter((_, i) => !array.includes(i)),
      },
    }));
  },
  moveChildren: (array, offset) => {
    set((state) => ({
      svg: {
        ...state.svg,
        children: state.svg.children.map((child, i) =>
          array.includes(i)
            ? {
                ...child,
                transform: {
                  ...child.transform,
                  translate: {
                    x: child.transform.translate.x + offset.x,
                    y: child.transform.translate.y + offset.y,
                  },
                },
              }
            : child
        ),
      },
    }));
  },
  selectedChildren: [],
  setSelectedChildren: (selectedChildren) => set({ selectedChildren }),
  getPath2D: (index) => {
    const child = get().svg.children[index];
    if (!child) return null;
    return child.path2d || createPath2D(child);
  },
  getBounds: (index) => {
    const child = get().svg.children[index];
    if (!child) return null;
    return child.bounds || calculateBounds(child);
  },
  selectByBox: (selectionBox) => {
    const selectedIndices = get().svg.children.reduce((acc, _, index) => {
      const bounds = get().getBounds(index);

      console.log(bounds, selectionBox);
      if (bounds && isIntersecting(bounds, selectionBox)) {
        console.log("intersecting");
        acc.push(index);
      }
      return acc;
    }, [] as number[]);
    console.log("selectedIndices", selectedIndices);
    set({ selectedChildren: selectedIndices });
  },
  selectByPoint: (point, ctx) => {
    const selectedIndex = get().svg.children.findIndex((_, index) => {
      const path2D = get().getPath2D(index);
      return path2D && ctx.isPointInPath(path2D, point.x, point.y);
    });
    set({ selectedChildren: selectedIndex !== -1 ? [selectedIndex] : [] });
  },
}));
