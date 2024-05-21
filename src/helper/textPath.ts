function bezierCurve(
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point,
  nPoints: number,
): Point[] {
  const points: Point[] = [];
  for (let i = 0; i < nPoints; i++) {
    const t = i / (nPoints - 1);
    const x =
      (1 - t) ** 3 * p0.x +
      3 * (1 - t) ** 2 * t * p1.x +
      3 * (1 - t) * t ** 2 * p2.x +
      t ** 3 * p3.x;
    const y =
      (1 - t) ** 3 * p0.y +
      3 * (1 - t) ** 2 * t * p1.y +
      3 * (1 - t) * t ** 2 * p2.y +
      t ** 3 * p3.y;
    points.push({ x, y });
  }
  return points;
}

export default function textPath(
  text: string,
  curve: Point[],
  draw: (letter: string, x: number, y: number) => void,
) {
  const n = text.length;
  const points = bezierCurve(curve[0]!, curve[1]!, curve[2]!, curve[3]!, n);
  console.log(points);
  points.forEach((point, i) => {
    const letter = text[i];
    draw(letter!, point.x, point.y);
  });
}
