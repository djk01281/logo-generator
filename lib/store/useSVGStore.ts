import { create } from "zustand";
import {
  createPath2D,
  calculateBounds,
  isIntersecting,
  svgStringToTags,
} from "@/lib/utils/svg";

type SVGStore = {
  svg: SVGRootElement;
  setSVG: (svgString: string) => void;
  updateChildTransform: (index: number, transform: TransformAttributes) => void;
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
  svg: { children: [], width: 0, height: 0, viewBox: "" },
  setSVG: (svgString: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, "image/svg+xml");
    const svgElement = doc.querySelector("svg");

    if (svgElement) {
      const width = svgElement.getAttribute("width");
      const height = svgElement.getAttribute("height");
      const viewBox = svgElement.getAttribute("viewBox");

      const children = svgStringToTags(svgString).map((child) => ({
        ...child,
        transform: child.transform || {
          translate: { x: 0, y: 0 },
          scale: { x: 1, y: 1 },
          rotate: 0,
        },
      }));

      set({
        svg: {
          children,
          width: width ? parseInt(width) : 0,
          height: height ? parseInt(height) : 0,
          viewBox: viewBox || "",
        },
      });
    }
  },
  updateChildTransform: (index, newTransform) => {
    set((state) => ({
      svg: {
        ...state.svg,
        children: state.svg.children.map((child, i) =>
          i === index
            ? {
                ...child,
                transform: newTransform,
                bounds: calculateBounds({
                  ...child,
                  transform: newTransform,
                } as SVGChildTag),
              }
            : child
        ),
      },
    }));
  },
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
      if (bounds && isIntersecting(bounds, selectionBox)) {
        acc.push(index);
      }
      return acc;
    }, [] as number[]);
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
