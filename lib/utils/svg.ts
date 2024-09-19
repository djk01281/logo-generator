const drawSVG = (ctx: CanvasRenderingContext2D, svg: SVGRootElement) => {
  svg.children.forEach((child) => {
    const path2d = child.path2d;
    if (!path2d) return;

    ctx.save();
    ctx.fillStyle = child.style.fill?.toString()?.trim() || "transparent";
    ctx.strokeStyle = child.style.stroke?.toString()?.trim() || "transparent";
    ctx.lineWidth = child.style.strokeWidth || 1;
    ctx.globalAlpha = child.style.opacity || 1;

    const transform = child.transform;
    if (transform.translate) {
      ctx.translate(transform.translate.x, transform.translate.y);
    }
    if (transform.scale) {
      ctx.scale(transform.scale.x, transform.scale.y);
    }
    if (transform.rotate) {
      ctx.rotate(transform.rotate);
    }

    ctx.fill(path2d);
    ctx.stroke(path2d);
    ctx.restore();
  });
};

const tagToString = (tag: SVGChildTag) => {
  switch (tag.type) {
    case "path":
      return pathToString(tag);
    // case "ellipse":
    //   return ellipseToString(tag);
    // case "text":
    //   return textToString(tag);
  }
};

const pathToString = (tag: PathTag) => {
  return tag.segments
    .map((segment) => {
      switch (segment.type) {
        case "M":
          return `M ${segment.point.x} ${segment.point.y}`;
        case "L":
          return `L ${segment.point.x} ${segment.point.y}`;
        case "C":
          return `C ${segment.control1.x} ${segment.control1.y} ${segment.control2.x} ${segment.control2.y} ${segment.end.x} ${segment.end.y}`;
        case "A":
          return `A ${segment.rx} ${segment.ry} ${segment.angle} ${
            segment.largeArcFlag ? 1 : 0
          } ${segment.sweepFlag ? 1 : 0} ${segment.end.x} ${segment.end.y}`;
        case "Z":
          return `Z`;
      }
    })
    .join(" ");
};

const svgStringToTags = (str: string): SVGChildTag[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(str, "image/svg+xml");
  const svg = doc.querySelector("svg");
  if (!svg) return [];

  const children = Array.from(svg.children);
  return children.map((child) => {
    switch (child.tagName) {
      case "path":
        return pathTagFromElement(child as SVGPathElement);
      //   case "ellipse":
      //     return ellipseTagFromElement(child as SVGEllipseElement);
      //   case "text":
      //     return textTagFromElement(child as SVGTextElement);
      default:
        return {} as PathTag;
    }
  });
};

const pathTagFromElement = (element: SVGPathElement): PathTag => {
  const path2d = new Path2D(element.getAttribute("d") || "");
  const style = styleAttributesFromElement(element);
  const transform = transformAttributesFromElement(element);
  const segments = pathToSegments(element.getAttribute("d") || "");

  // TODO: Calculate bounds
  const bounds = null;
  return { type: "path", path2d, style, transform, segments, bounds };
};

const styleAttributesFromElement = (element: SVGPathElement) => {
  return {
    fill: element.getAttribute("fill") || "",
    stroke: element.getAttribute("stroke") || "1",
    strokeWidth: parseFloat(element.getAttribute("stroke-width") || "1") || 1,
    opacity: parseFloat(element.getAttribute("opacity") || "1") || 1,
  };
};

const transformAttributesFromElement = (element: SVGElement) => {
  const transform = {
    translate: { x: 0, y: 0 },
    scale: { x: 1, y: 1 },
    rotate: 0,
  };

  if (element.getAttribute("transform")) {
    const transformString = element.getAttribute("transform") || "";
    const translateMatch = transformString.match(/translate\(([^)]+)\)/);
    if (translateMatch) {
      const [x, y] = translateMatch[1].split(",");
      transform.translate = { x: parseFloat(x), y: parseFloat(y) };
    }

    const scaleMatch = transformString.match(/scale\(([^)]+)\)/);
    if (scaleMatch) {
      const [x, y] = scaleMatch[1].split(",");
      transform.scale = { x: parseFloat(x), y: parseFloat(y) };
    }

    const rotateMatch = transformString.match(/rotate\(([^)]+)\)/);
    if (rotateMatch) {
      transform.rotate = parseFloat(rotateMatch[1]);
    }
  }

  return transform;
};

const pathToSegments = (d: string): PathSegment[] => {
  const segments = d.match(/[A-Za-z][^A-Za-z]*/g) || [];

  return segments.map((segment): PathSegment => {
    const type = segment[0] as "M" | "L" | "C" | "A" | "Z";
    const values = segment.slice(1).trim().split(" ");

    switch (type) {
      case "M":
      case "L":
        return {
          type,
          point: {
            x: parseFloat(values[0]),
            y: parseFloat(values[1]),
          },
        };
      case "C":
        return {
          type,
          control1: {
            x: parseFloat(values[0]),
            y: parseFloat(values[1]),
          },
          control2: {
            x: parseFloat(values[2]),
            y: parseFloat(values[3]),
          },
          end: { x: parseFloat(values[4]), y: parseFloat(values[5]) },
        };
      case "A":
        return {
          type,
          rx: parseFloat(values[0]),
          ry: parseFloat(values[1]),
          angle: parseFloat(values[2]),
          largeArcFlag: values[3] === "1",
          sweepFlag: values[4] === "1",
          end: { x: parseFloat(values[5]), y: parseFloat(values[6]) },
        };
      case "Z":
        return { type };
    }
  });
};

const createPath2D = (shape: SVGChildTag): Path2D => {
  const path = new Path2D();

  if (shape.type === "path") {
    shape.segments.forEach((segment, index) => {
      switch (segment.type) {
        case "M":
          path.moveTo(segment.point.x, segment.point.y);
          break;
        case "L":
          path.lineTo(segment.point.x, segment.point.y);
          break;
        case "C":
          path.bezierCurveTo(
            segment.control1.x,
            segment.control1.y,
            segment.control2.x,
            segment.control2.y,
            segment.end.x,
            segment.end.y
          );
          break;
        case "A":
          //   const prev = index > 0 ? shape.segments[index - 1] : null;
          //   const start = prev
          //     ? prev.type === "A"
          //       ? prev.end
          //       : prev.point
          //     : { x: 0, y: 0 };
          //   approximateArcToBezier(path, start, segment);
          break;
        case "Z":
          path.closePath();
          break;
      }
    });
  } else if (shape.type === "ellipse") {
    path.ellipse(shape.cx, shape.cy, shape.rx, shape.ry, 0, 0, 2 * Math.PI);
  } else if (shape.type === "text") {
    path.rect(shape.x, shape.y, 100, 20);
  }

  const transformedPath = new Path2D();
  transformedPath.addPath(
    path,
    new DOMMatrix([
      shape.transform.scale.x,
      0,
      0,
      shape.transform.scale.y,
      shape.transform.translate.x,
      shape.transform.translate.y,
    ])
  );

  return transformedPath;
};

function approximateArcToBezier(
  path: Path2D,
  start: Point,
  arc: PathSegment & { type: "A" }
) {
  if (arc.rx === 0 || arc.ry === 0) {
    path.lineTo(arc.end.x, arc.end.y);
    return;
  }

  const curves = arcToBezierCurves(
    start.x,
    start.y,
    arc.rx,
    arc.ry,
    arc.angle * (Math.PI / 180),
    arc.largeArcFlag,
    arc.sweepFlag,
    arc.end.x,
    arc.end.y
  );

  curves.forEach((curve) => {
    path.bezierCurveTo(
      curve[2],
      curve[3],
      curve[4],
      curve[5],
      curve[6],
      curve[7]
    );
  });
}

function arcToBezierCurves(
  x1: number,
  y1: number,
  rx: number,
  ry: number,
  phi: number,
  fA: boolean,
  fS: boolean,
  x2: number,
  y2: number
): number[][] {
  const sinPhi = Math.sin(phi);
  const cosPhi = Math.cos(phi);

  const x1p = (cosPhi * (x1 - x2)) / 2 + (sinPhi * (y1 - y2)) / 2;
  const y1p = (-sinPhi * (x1 - x2)) / 2 + (cosPhi * (y1 - y2)) / 2;

  rx = Math.abs(rx);
  ry = Math.abs(ry);

  const lambda = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
  if (lambda > 1) {
    rx *= Math.sqrt(lambda);
    ry *= Math.sqrt(lambda);
  }

  const rxSq = rx * rx;
  const rySq = ry * ry;
  const x1pSq = x1p * x1p;
  const y1pSq = y1p * y1p;

  let radicant =
    (rxSq * rySq - rxSq * y1pSq - rySq * x1pSq) / (rxSq * y1pSq + rySq * x1pSq);
  if (radicant < 0) {
    radicant = 0;
  }
  radicant = Math.sqrt(radicant) * (fA === fS ? -1 : 1);

  const cxp = (radicant * rx * y1p) / ry;
  const cyp = (radicant * -ry * x1p) / rx;

  const cx = cosPhi * cxp - sinPhi * cyp + (x1 + x2) / 2;
  const cy = sinPhi * cxp + cosPhi * cyp + (y1 + y2) / 2;

  const theta1 = Math.atan2((y1p - cyp) / ry, (x1p - cxp) / rx);
  const deltaTheta = Math.atan2((-y1p - cyp) / ry, (-x1p - cxp) / rx) - theta1;

  const numSegments = Math.ceil(Math.abs(deltaTheta) / (Math.PI / 4));
  const deltaT = deltaTheta / numSegments;
  const t =
    ((8 / 3) * Math.sin(deltaT / 4) * Math.sin(deltaT / 4)) /
    Math.sin(deltaT / 2);

  const curves: number[][] = [];
  for (let i = 0; i < numSegments; i++) {
    const cosTheta1 = Math.cos(theta1 + i * deltaT);
    const sinTheta1 = Math.sin(theta1 + i * deltaT);
    const cosTheta2 = Math.cos(theta1 + (i + 1) * deltaT);
    const sinTheta2 = Math.sin(theta1 + (i + 1) * deltaT);

    curves.push([
      cosPhi * rx * cosTheta1 - sinPhi * ry * sinTheta1 + cx,
      sinPhi * rx * cosTheta1 + cosPhi * ry * sinTheta1 + cy,
      cosPhi * rx * (cosTheta1 - t * sinTheta1) -
        sinPhi * ry * (sinTheta1 + t * cosTheta1) +
        cx,
      sinPhi * rx * (cosTheta1 - t * sinTheta1) +
        cosPhi * ry * (sinTheta1 + t * cosTheta1) +
        cy,
      cosPhi * rx * (cosTheta2 + t * sinTheta2) -
        sinPhi * ry * (sinTheta2 - t * cosTheta2) +
        cx,
      sinPhi * rx * (cosTheta2 + t * sinTheta2) +
        cosPhi * ry * (sinTheta2 - t * cosTheta2) +
        cy,
      cosPhi * rx * cosTheta2 - sinPhi * ry * sinTheta2 + cx,
      sinPhi * rx * cosTheta2 + cosPhi * ry * sinTheta2 + cy,
    ]);
  }

  return curves;
}

const calculateBounds = (shape: SVGChildTag): Bounds => {
  let minX, minY, maxX, maxY;

  if (shape.type === "path") {
    const points = shape.segments.flatMap((s) =>
      s.type === "C"
        ? [s.control1, s.control2, s.end]
        : s.type === "A"
        ? [s.end]
        : s.type === "Z"
        ? []
        : [s.point]
    );
    minX = Math.min(...points.map((p) => p.x));
    minY = Math.min(...points.map((p) => p.y));
    maxX = Math.max(...points.map((p) => p.x));
    maxY = Math.max(...points.map((p) => p.y));
  } else if (shape.type === "ellipse") {
    minX = shape.cx - shape.rx;
    minY = shape.cy - shape.ry;
    maxX = shape.cx + shape.rx;
    maxY = shape.cy + shape.ry;
  } else if (shape.type === "text") {
    minX = shape.x;
    minY = shape.y;
    maxX = shape.x + 100;
    maxY = shape.y + 20;
  }

  const transform = shape.transform;
  return {
    topLeft: {
      x: minX! * transform.scale.x + transform.translate.x,
      y: minY! * transform.scale.y + transform.translate.y,
    },
    bottomRight: {
      x: maxX! * transform.scale.x + transform.translate.x,
      y: maxY! * transform.scale.y + transform.translate.y,
    },
  };
};

const isIntersecting = (bounds1: Bounds, bounds2: Bounds): boolean => {
  return !(
    bounds2.topLeft.x > bounds1.bottomRight.x ||
    bounds2.bottomRight.x < bounds1.topLeft.x ||
    bounds2.topLeft.y > bounds1.bottomRight.y ||
    bounds2.bottomRight.y < bounds1.topLeft.y
  );
};

export {
  drawSVG,
  tagToString,
  svgStringToTags,
  pathToString,
  pathTagFromElement,
  styleAttributesFromElement,
  transformAttributesFromElement,
  pathToSegments,
  createPath2D,
  calculateBounds,
  isIntersecting,
  approximateArcToBezier,
  arcToBezierCurves,
};
