type side = "top" | "bottom" | "left" | "right";

type Point = {
  x: number;
  y: number;
};

type Dimension = {
  width: number;
  height: number;
};

type Bounds = {
  topLeft: Point;
  bottomRight: Point;
};

type StyleAttributes = {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
};

type TransformAttributes = {
  translate: Point;
  scale: Point;
  rotate: number;
};

interface Shape {
  bounds: Bounds | null;
  style: StyleAttributes;
  transform: TransformAttributes;
  path2d: Path2D | null;
}

type PathSegment =
  | { type: "M" | "L"; point: Point }
  | { type: "C"; control1: Point; control2: Point; end: Point }
  | {
      type: "A";
      rx: number;
      ry: number;
      angle: number;
      largeArcFlag: boolean;
      sweepFlag: boolean;
      end: Point;
    }
  | { type: "Z" };

interface PathTag extends Shape {
  type: "path";
  segments: PathSegment[];
}

interface ElipseTag extends Shape {
  type: "ellipse";
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

interface TextTag extends Shape {
  type: "text";
  x: number;
  y: number;
  text: string;
}

type SVGChildTag = PathTag | ElipseTag | TextTag;

type SVGRootElement = {
  width?: number;
  height?: number;
  viewBox?: string;
  children: SVGChildTag[];
};
