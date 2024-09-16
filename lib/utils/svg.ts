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

export { drawSVG, tagToString, svgStringToTags };
