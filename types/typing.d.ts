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
};

type TextContent = {
  font: string;
  size: number;
  content: string;
  path2D: Path2D | null;
  d: AbsoluteSegment[];
};
type SVG = SubSVG[];

type SubSVG =
  | {
      shape: Path;
      tag: "path";
      fill: string;
      stroke: string;
      offset: Point;
      xMax: number;
      xMin: number;
      yMax: number;
      yMin: number;
      rotation: number;
    }
  | {
      shape: TextContent;
      tag: "text";
      fill: string;
      offset: Point;
      stroke: string;
      xMax: number;
      xMin: number;
      yMax: number;
      yMin: number;
      rotation: number;
    };

type SubPath = {
  tag: "path" | "text";
  info: Path | Text;
};

type AbsoluteSegment = Lineish | Arc;

type Lineish = {
  key: "M" | "L" | "C" | "Z";
  data: Point[];
};
type Arc = {
  key: "A";
  arcParams: ArcParams;
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
