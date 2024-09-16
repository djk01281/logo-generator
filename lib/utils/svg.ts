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

export { drawSVG, tagToString };
