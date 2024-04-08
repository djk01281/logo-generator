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

type AbsoluteSegment = {
  key: string;
  data: Point[];
};

const Tools = {
  draw: "draw",
  hand: "hand",
  select: "select",
};

type Tool = keyof typeof Tools;
