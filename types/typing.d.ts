type Draw = {
  ctx: CanvasRenderingContext2D;
  currentPoint: Point;
  prevPoint: Point | null;
};

type Pan = {
  ctx: CanvasRenderingContext2D;
  currentPoint: Point;
  prevPoint: Point | null;
};

type Move = {
  ctx: CanvasRenderingContext2D;
  currentPoint: Point;
  prevPoint: Point | null;
};

type Select = {
  ctx: CanvasRenderingContext2D;
  currentPoint: Point;
  e: React.MouseEvent<HTMLCanvasElement>;
};

type Zoom = {
  ctx: CanvasRenderingContext2D;
  scaleX: number;
  scaleY: number;
};

type Hover = {
  ctx: CanvasRenderingContext2D;
  currentPoint: Point;
};

type Point = { x: number; y: number };

type Path = {
  d: AbsoluteSegment[];
  path2D: Path2D | null;
  fill: string;
  offset: Point;
  xMax: number;
  xMin: number;
  yMax: number;
  yMin: number;
  rotation: number;
};

type SVG = Path[];

type AbsoluteSegment =
  | {
      key: "M" | "L" | "C" | "Z";
      data: Point[];
    }
  | {
      key: "A";
      data: ArcParams;
    };

type ArcParams = {
  rx: number;
  ry: number;
  rotation: number;
  largeArcFlag: number;
  sweepFlag: number;
  dx: number;
  dy: number;
};

const Tools = {
  draw: "draw",
  hand: "hand",
  select: "select",
  add: "add",
};

type Tool = keyof typeof Tools;
