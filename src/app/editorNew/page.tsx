"use client";

import { useSVG } from "~/hooks/usSVG";
import { useHand } from "~/hooks/useHand";
import { useSelect } from "~/hooks/useSelect";
import { useState, useRef, useEffect } from "react";
import { parsePath, absolutize, normalize, serialize } from "path-data-parser";
import ToolBox from "./_components/ToolBox";
import Link from "next/link";
import { Just_Another_Hand } from "next/font/google";
import Generate from "./_components/Generate";
import SVGPathCommander from "svg-path-commander";
import { ChromePicker } from "react-color";
import { HexColorPicker } from "react-colorful";

const colorMap: Record<string, string> = {
  aliceblue: "#F0F8FF",
  antiquewhite: "#FAEBD7",
  aqua: "#00FFFF",
  aquamarine: "#7FFFD4",
  azure: "#F0FFFF",
  beige: "#F5F5DC",
  bisque: "#FFE4C4",
  black: "#000000",
  blanchedalmond: "#FFEBCD",
  blue: "#0000FF",
  blueviolet: "#8A2BE2",
  brown: "#A52A2A",
  burlywood: "#DEB887",
  cadetblue: "#5F9EA0",
  chartreuse: "#7FFF00",
  chocolate: "#D2691E",
  coral: "#FF7F50",
  cornflowerblue: "#6495ED",
  cornsilk: "#FFF8DC",
  crimson: "#DC143C",
  cyan: "#00FFFF",
  darkblue: "#00008B",
  darkcyan: "#008B8B",
  darkgoldenrod: "#B8860B",
  darkgray: "#A9A9A9",
  darkgreen: "#006400",
  darkgrey: "#A9A9A9",
  darkkhaki: "#BDB76B",
  darkmagenta: "#8B008B",
  darkolivegreen: "#556B2F",
  darkorange: "#FF8C00",
  darkorchid: "#9932CC",
  darkred: "#8B0000",
  darksalmon: "#E9967A",
  darkseagreen: "#8FBC8F",
  darkslateblue: "#483D8B",
  darkslategray: "#2F4F4F",
  darkslategrey: "#2F4F4F",
  darkturquoise: "#00CED1",
  darkviolet: "#9400D3",
  deeppink: "#FF1493",
  deepskyblue: "#00BFFF",
  dimgray: "#696969",
  dimgrey: "#696969",
  dodgerblue: "#1E90FF",
  firebrick: "#B22222",
  floralwhite: "#FFFAF0",
  forestgreen: "#228B22",
  fuchsia: "#FF00FF",
  gainsboro: "#DCDCDC",
  ghostwhite: "#F8F8FF",
  gold: "#FFD700",
  goldenrod: "#DAA520",
  gray: "#808080",
  grey: "#808080",
  green: "#008000",
  greenyellow: "#ADFF2F",
  honeydew: "#F0FFF0",
  hotpink: "#FF69B4",
  indianred: "#CD5C5C",
  indigo: "#4B0082",
  ivory: "#FFFFF0",
  khaki: "#F0E68C",
  lavender: "#E6E6FA",
  lavenderblush: "#FFF0F5",
  lawngreen: "#7CFC00",
  lemonchiffon: "#FFFACD",
  lightblue: "#ADD8E6",
  lightcoral: "#F08080",
  lightcyan: "#E0FFFF",
  lightgoldenrodyellow: "#FAFAD2",
  lightgray: "#D3D3D3",
  lightgreen: "#90EE90",
  lightgrey: "#D3D3D3",
  lightpink: "#FFB6C1",
  lightsalmon: "#FFA07A",
  lightseagreen: "#20B2AA",
  lightskyblue: "#87CEFA",
  lightslategray: "#778899",
  lightslategrey: "#778899",
  lightsteelblue: "#B0C4DE",
  lightyellow: "#FFFFE0",
  lime: "#00FF00",
  limegreen: "#32CD32",
  linen: "#FAF0E6",
  magenta: "#FF00FF",
  maroon: "#800000",
  mediumaquamarine: "#66CDAA",
  mediumblue: "#0000CD",
  mediumorchid: "#BA55D3",
  mediumpurple: "#9370DB",
  mediumseagreen: "#3CB371",
  mediumslateblue: "#7B68EE",
  mediumspringgreen: "#00FA9A",
  mediumturquoise: "#48D1CC",
  mediumvioletred: "#C71585",
  midnightblue: "#191970",
  mintcream: "#F5FFFA",
  mistyrose: "#FFE4E1",
  moccasin: "#FFE4B5",
  navajowhite: "#FFDEAD",
  navy: "#000080",
  oldlace: "#FDF5E6",
  olive: "#808000",
  olivedrab: "#6B8E23",
  orange: "#FFA500",
  orangered: "#FF4500",
  orchid: "#DA70D6",
  palegoldenrod: "#EEE8AA",
  palegreen: "#98FB98",
  paleturquoise: "#AFEEEE",
  palevioletred: "#DB7093",
  papayawhip: "#FFEFD5",
  peachpuff: "#FFDAB9",
  peru: "#CD853F",
  pink: "#FFC0CB",
  plum: "#DDA0DD",
  powderblue: "#B0E0E6",
  purple: "#800080",
  rebeccapurple: "#663399",
  red: "#FF0000",
  rosybrown: "#BC8F8F",
  royalblue: "#4169E1",
  saddlebrown: "#8B4513",
  salmon: "#FA8072",
  sandybrown: "#F4A460",
  seagreen: "#2E8B57",
  seashell: "#FFF5EE",
  sienna: "#A0522D",
  silver: "#C0C0C0",
  skyblue: "#87CEEB",
  slateblue: "#6A5ACD",
  slategray: "#708090",
  slategrey: "#708090",
  snow: "#FFFAFA",
  springgreen: "#00FF7F",
  steelblue: "#4682B4",
  tan: "#D2B48C",
  teal: "#008080",
  thistle: "#D8BFD8",
  tomato: "#FF6347",
  turquoise: "#40E0D0",
  violet: "#EE82EE",
  wheat: "#F5DEB3",
  white: "#FFFFFF",
  whitesmoke: "#F5F5F5",
  yellow: "#FFFF00",
  yellowgreen: "#9ACD32",
};
const just = Just_Another_Hand({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-just_another_hand",
});

export default function Editor() {
  const [tool, setTool] = useState<Tool>("select");
  const { svg, setSVG, setSelected, moveSelected } = useSVG(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const {
    onMouseDown,
    mouseDown,
    handMouseMoveHandler,
    handMouseUpHandler,
    handOnWheelMove,
  } = useHand(onPan, onZoom, canvasRef, tool);
  const {
    onSelectMouseDown,
    onSelectMouseUp,
    setMouseDown,
    onSelectMouseMove,
  } = useSelect(onMove, onHover, onSelect, canvasRef, tool);

  const [panOffset, setPanOffset] = useState<Point>({ x: 0, y: 0 });
  const [scale, setScale] = useState<Point>({ x: 1, y: 1 });

  const [point2Ds, setPoint2Ds] = useState<Path2D[]>([]);
  const [selectedPath, setSelectedPath] = useState<number | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
  const [selectedDraw, setSelectedDraw] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isRightClicked, setIsRightClicked] = useState<Point | null>(null);
  const [color, setColor] = useState<string>("#000000");

  // console.log(scale);

  const svgPathToStrig = (path: AbsoluteSegment[]) => {
    let pathString = "";
    path.forEach((segment) => {
      pathString += segment.key;
      segment.data.forEach((point) => {
        pathString += point.x + " " + point.y + " ";
      });
    });
    return pathString;
  };

  function onPan({ ctx, currentPoint, prevPoint }: Pan) {
    if (!prevPoint) return;
    const dx = currentPoint.x - prevPoint.x;
    const dy = currentPoint.y - prevPoint.y;
    setPanOffset({ x: panOffset.x + dx, y: panOffset.y + dy });

    clear();
    ctx.translate(dx, dy);
    clear();
    if (!svg) return;
    drawSVG(ctx, svg);
    drawSVGPoints(ctx, svg);
  }

  function onZoom({ ctx, scaleX, scaleY }: Zoom) {
    console.log("Zooming", scaleX, scaleY);
    const canvas = ctx.canvas;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const xOffSet = rect.width / 2;
    const yOffSet = rect.height / 2;
    setPanOffset({ x: panOffset.x * scaleX, y: panOffset.y * scaleY });
    setScale({ x: scale.x * (1 + scaleX), y: scale.x * (1 + scaleX) });
    ctx.translate(xOffSet, yOffSet);
    ctx.scale(1 + scaleX, 1 + scaleY);
    ctx.translate(-xOffSet, -yOffSet);

    clear();
    if (!svg) return;
    drawSVG(ctx, svg);
    drawSVGPoints(ctx, svg);
  }

  function onSelect({ ctx, currentPoint, e }: Select) {
    if (!svg) return;

    if (isEditing) {
      let continueFlag = true;
      if (selectedPath !== null) {
        point2Ds.some((point2D, i) => {
          if (ctx.isPointInPath(point2D, currentPoint.x, currentPoint.y)) {
            setSelectedPoint(i);
            console.log("Selected point", i);
            continueFlag = false;
            // e.stopPropagation();

            return true;
          } else {
            return false;
          }
        });
      }

      if (!continueFlag) return;
    }

    setSelectedPoint(null);
    let pathSelected = -1;

    //fix so that when a path is selected, you no longer search

    svg.some(({ path2D }, i) => {
      if (path2D === null) return false;
      if (ctx.isPointInPath(path2D, currentPoint.x, currentPoint.y)) {
        setSelectedPath((prev) => i);
        pathSelected = i;
        return true;
      } else {
        return false;
      }
    });

    if (pathSelected === -1) {
      setSelectedPath(null);
    } else {
      const selectedSvg = svg[pathSelected];
      if (selectedSvg?.path2D) {
        drawOutline(ctx, selectedSvg.path2D);
      }
    }

    console.log(pathSelected);
    setIsEditing(false);
    clear();
    drawSVG(ctx, svg);
    drawSVGPoints(ctx, svg);
    drawBoundingBox(ctx, pathSelected);
    setColor(svg[selectedPath!]?.fill ?? "#000000");
  }

  const drawSVG = (ctx: CanvasRenderingContext2D, svg: SVG) => {
    if (!svg) return;
    svg.map(({ path2D }, i) => {
      if (!path2D) return;
      ctx.fillStyle = svg[i]?.fill ?? "#000000";
      ctx.fill(path2D);
    });
  };

  const drawBoundingBox = (
    ctx: CanvasRenderingContext2D,
    pathSelected: number,
  ) => {
    if (!svg) return;
    if (pathSelected === -1) return;

    if (!svg) return;
    if (selectedPath === null) return;
    const selectedPathString = svgPathToStrig(svg[pathSelected]!.d);
    // const selectedPathBoxString = new SVGPathCommander(
    //   selectedPathString,
    // ).getBBox();
    // ctx.beginPath();
    // ctx.rect(
    //   selectedPathBoxString.x,
    //   selectedPathBoxString.y,
    //   selectedPathBoxString.width,
    //   selectedPathBoxString.height,
    // );
    // ctx.lineWidth = 2 * (1 / scale.x);
    // ctx.strokeStyle = "#3eadfd";
    // ctx.stroke();
    // ctx.closePath();
  };

  //Loop through the SVG, loop through paths, loop through segments, draw points as red dots
  const drawSVGPoints = (ctx: CanvasRenderingContext2D, svg: SVG) => {
    if (!svg) return;
    if (selectedPath === null) return;
    if (!isEditing) return;
    if (svg[selectedPath] === undefined || svg[selectedPath] === null) return;
    const selectedPathPath = svg[selectedPath];
    if (selectedPathPath === null || selectedPathPath === undefined) return;

    const { d, fill } = selectedPathPath;
    const newPoint2Ds: Path2D[] = [];
    d.map((segment) => {
      const { key, data } = segment;
      const endPoint = data[data.length - 1];
      if (!endPoint) return;

      const point2D = new Path2D();

      newPoint2Ds.push(point2D);
      ctx.fillStyle = "white";

      if (newPoint2Ds.length - 1 === selectedPoint) {
        ctx.fillStyle = "#3eadfd";
      }
      point2D.arc(endPoint.x, endPoint.y, 5 * (1 / scale.x), 0, 2 * Math.PI);
      ctx.fill(point2D);

      ctx.strokeStyle = "#3eadfd";
      ctx.stroke(point2D);
    });
    setPoint2Ds(newPoint2Ds);
  };

  const drawOutline = (ctx: CanvasRenderingContext2D, path: Path2D) => {
    ctx.strokeStyle = "#3eadfd";
    ctx.lineWidth = 2 * (1 / scale.x);
    ctx.stroke(path);
  };

  const onPathMove = (
    ctx: CanvasRenderingContext2D,
    path: Path2D,
    dx: number,
    dy: number,
  ) => {
    if (selectedPath === null) return;
    if (!svg) return;
    console.log("moving path");
    const newSVG = [...svg];
    const newPathPath = newSVG[selectedPath];
    if (newPathPath === undefined || newPathPath === null) return;
    const newD = newPathPath.d;
    newD.map((segment) => {
      segment.data.map((point) => {
        point.x += dx;
        point.y += dy;
        return point;
      });
    });

    type Segment = {
      key: string;
      data: number[];
    };
    const newPath: Segment[] = [];
    if (newSVG[selectedPath] === null || newSVG[selectedPath] === undefined)
      return;
    const newnewpath = newSVG[selectedPath];
    if (newnewpath === null || newnewpath === undefined) return;
    const newnewpathD = newnewpath.d;
    if (newnewpathD === null || newnewpathD === undefined) return;
    newnewpathD.map((segment) => {
      const data: number[] = [];
      const key = segment.key;
      segment.data.map((point) => {
        data.push(point.x, point.y);
      });

      newPath.push({ key: key, data: data });
    });

    //experiment with not rerendering

    const serialized = serialize(newPath);
    const newPath2D = new Path2D(serialized);
    // newSVG[selectedPath].path2D = newPath2D;
    // setSVG(newSVG);

    const svgSelectedPath = svg[selectedPath];
    if (svgSelectedPath === undefined) return;
    svgSelectedPath.path2D = newPath2D;

    clear();
    drawSVG(ctx, svg);
    drawSVGPoints(ctx, svg);
    drawBoundingBox(ctx, selectedPath);
    drawOutline(ctx, newPath2D);
  };

  const computePointInCanvas = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return { x, y };
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const converted = stringToSVGandPath2Ds(result);
      // console.log(result);
      setSVG(converted.svg);

      const svg = converted.svg;

      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;

      clear();
      drawSVG(ctx, svg);
      drawSVGPoints(ctx, svg);
    };
    reader.readAsText(file);
  };

  const onSVGComplete = (svgString: string) => {
    const converted = stringToSVGandPath2Ds(svgString);
    setSVG(converted.svg);

    const svg = converted.svg;

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    clear();
    drawSVG(ctx, svg);
    drawSVGPoints(ctx, svg);

    setSelectedDraw(null);
  };

  const stringToSVGandPath2Ds = (svgString: string): { svg: SVG } => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, "image/svg+xml");
    const paths = Array.from(doc.querySelectorAll("path"));
    const svg: SVG = paths.map((path) => {
      const dString = path.getAttribute("d");
      const transform = path.getAttribute("transform");
      let translateX = 0;
      let translateY = 0;
      const transformObject = {
        translate: [0, 0],
      };

      if (transform) {
        //get translate from the transform property
        const match = transform.match("translates*(s*([^,]+)s*,s*([^)]+)s*)");
        if (match !== null && match?.length === 4) {
          const x = parseFloat(match[2]!.slice(1));
          const y = parseFloat(match[3]!);
          translateX = x;
          translateY = y;
          transformObject.translate = [x, y];
        }
      }
      let path2D = null;
      if (dString) {
        const dStringWithTransform = new SVGPathCommander(dString)
          .transform(transformObject)
          .toString();
        const p = new Path2D(dStringWithTransform);
        path2D = p;
      }

      //right now the path2DsTemp does not take into account the transform property. Fix this.

      const dSegments = normalize(absolutize(parsePath(dString ?? "")));
      const d = dSegments.map((segment) => {
        const key = segment.key;

        if (key === "M" || key === "L") {
          return {
            key: key,
            data: [
              {
                x: segment.data[0]! + translateX,
                y: segment.data[1]! + translateY,
              },
            ],
          };
        }
        if (key === "Z") {
          return {
            key: key,
            data: [],
          };
        }

        //key is C
        else {
          return {
            key: key,
            data: [
              {
                x: segment.data[0]! + translateX,
                y: segment.data[1]! + translateY,
              },
              {
                x: segment.data[2]! + translateX,
                y: segment.data[3]! + translateY,
              },
              {
                x: segment.data[4]! + translateX,
                y: segment.data[5]! + translateY,
              },
            ],
          };
        }
      });
      const fill = path.getAttribute("fill") ?? "black";
      return { d, fill, path2D };
    });

    return { svg: svg };
  };

  function onHover({ ctx, currentPoint }: Hover) {
    if (!svg) return;
    if (!currentPoint) return;
    if (mouseDown) return;

    clear();
    drawSVG(ctx, svg);
    drawSVGPoints(ctx, svg);
    // drawBoundingBox(ctx, selectedPath);
    const newSVG = [...svg];
    newSVG.reverse().some(({ path2D }, i) => {
      if (!path2D) return false;
      if (ctx.isPointInPath(path2D, currentPoint.x, currentPoint.y)) {
        drawOutline(ctx, path2D);
        return true;
      } else {
        return false;
      }
    });

    if (!isEditing) return;
    point2Ds.some((point2D) => {
      if (ctx.isPointInPath(point2D, currentPoint.x, currentPoint.y)) {
        ctx.fillStyle = "#3eadfd";
        ctx.fill(point2D);
        return true;
      } else {
        return false;
      }
    });
  }

  function onPointMove(ctx: CanvasRenderingContext2D, dx: number, dy: number) {
    if (!svg) return;
    if (selectedPath === null) return;
    if (selectedPoint === null) return;

    const svgSelectedPath = svg[selectedPath];
    if (svgSelectedPath === undefined) return;

    const segment = svgSelectedPath.d[selectedPoint];
    segment?.data.forEach((point) => {
      point.x += dx;
      point.y += dy;
    });

    type Segment = {
      key: string;
      data: number[];
    };
    const newPath: Segment[] = [];

    svgSelectedPath.d.map((segment) => {
      const data: number[] = [];
      const key = segment.key;
      segment.data.map((point) => {
        data.push(point.x, point.y);
      });

      newPath.push({ key: key, data: data });
    });

    const newPath2D = new Path2D(serialize(newPath));
    svgSelectedPath.path2D = newPath2D;

    clear();
    drawSVG(ctx, svg);
    drawSVGPoints(ctx, svg);
  }

  const filePopUpRef = useRef<HTMLDivElement | null>(null);
  const aiPopUpRef = useRef<HTMLDivElement | null>(null);

  // useEffect(() => {
  //   document.addEventListener("click", (e) => {
  //     if (selectedDraw !== "null") {
  //       if (!filePopUpRef.current && !aiPopUpRef.current) return;
  //       if (
  //         filePopUpRef.current &&
  //         filePopUpRef.current.contains(e.target as Node)
  //       ) {
  //         return;
  //       }
  //       if (
  //         aiPopUpRef.current &&
  //         aiPopUpRef.current.contains(e.target as Node)
  //       ) {
  //         return;
  //       }
  //       setSelectedDraw(null);
  //     }
  //   });
  //   return () => {
  //     document.removeEventListener("click", (e) => {
  //       if (selectedDraw !== "null") {
  //         if (!filePopUpRef.current && !aiPopUpRef.current) return;
  //         if (
  //           filePopUpRef.current &&
  //           filePopUpRef.current.contains(e.target as Node)
  //         ) {
  //           return;
  //         }
  //         if (
  //           aiPopUpRef.current &&
  //           aiPopUpRef.current.contains(e.target as Node)
  //         ) {
  //           return;
  //         }
  //         console.log("Closing");
  //         setSelectedDraw(null);
  //       }
  //     });
  //   };
  // }, [selectedDraw]);

  //FIX : Point moves father than expected

  const colorPickerRef = useRef<HTMLDivElement | null>(null);

  function onMove({ ctx, currentPoint, prevPoint }: Move) {
    if (!svg) {
      console.log("No SVG");
      return;
    }
    if (selectedPath === null) {
      console.log("No selected path");
      return;
    }
    if (!prevPoint) {
      return;
    }

    if (selectedPoint !== null) {
      const dx = currentPoint.x - prevPoint.x;
      const dy = currentPoint.y - prevPoint.y;
      onPointMove(ctx, dx, dy);
      return;
    }

    const dx = currentPoint.x - prevPoint.x;
    const dy = currentPoint.y - prevPoint.y;
    const svgSelectedPath = svg[selectedPath];
    if (svgSelectedPath === undefined) return;
    const path = svgSelectedPath.path2D;
    if (!path) return;
    onPathMove(ctx, path, dx, dy);
  }

  const onDeletePath = () => {
    if (selectedPath === null) return;
    if (!svg) return;
    const newSVG = [...svg];
    newSVG.splice(selectedPath, 1);
    setSVG(newSVG);
    setSelectedPath(null);
    clear();

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    drawSVG(ctx, newSVG);
    drawSVGPoints(ctx, newSVG);
  };

  const onMouseDownWrapper = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool === "hand") {
      onMouseDown();
    }
    if (tool === "select") {
      onSelectMouseDown(e);
    }
    if (isRightClicked !== null) setIsRightClicked(null);
  };

  const onMouseUpWrapper = (e: React.MouseEvent<HTMLCanvasElement>) => {
    onSelectMouseUp();
    handMouseUpHandler();
    console.log("useSelect mouse up");
  };

  const onMouseMoveWrapper = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool === "select") {
      onSelectMouseMove(e);
    }
    if (tool === "hand") {
      handMouseMoveHandler(e);
    }
  };

  const onSelectRightClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (selectedPath === null) return;
    setIsRightClicked({ x: e.clientX, y: e.clientY });
  };

  const onRightClickWrapper = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    onSelectRightClick(e);
    onSelectMouseUp();
  };

  const top = "top-[" + isRightClicked?.y + "px]";
  const left = "left-[" + isRightClicked?.x + "px]";

  const [colorPicker, setColorPicker] = useState<boolean>(false);

  return (
    <div
      className=" flex h-screen w-screen items-center justify-center bg-[#F3F4F6]"
      onClick={(e) => {
        // if (colorPickerRef !== null) {
        //   return;
        // }
        // if (e.currentTarget === colorPickerRef.current) {
        //   return;
        // }
        setColorPicker(false);
        // setIsEditing(false);
        setSelectedDraw(null);
      }}
    >
      <div className=" flex h-full w-full flex-col">
        {isRightClicked !== null ? (
          <div
            className={`absolute z-20 flex w-36 flex-col gap-3 rounded-md bg-[#1e1e1e] p-4  text-xs font-light text-white shadow-md`}
            style={{
              position: "absolute",
              top: isRightClicked.y,
              left: isRightClicked.x,
            }}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setIsEditing(true);
                setIsRightClicked(null);
              }}
            >
              Edit
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onDeletePath();
                setIsRightClicked(null);
              }}
            >
              Delete
            </div>
          </div>
        ) : null}

        <div className="flex h-[80px]  w-full flex-none justify-between p-[20px]">
          <Link
            className={` ${just.className} z-10 flex items-center justify-center rounded-xl bg-red-400 px-2 pt-1 text-center text-[20px] leading-snug text-white`}
            href="/"
          >
            LOGOAI
          </Link>
          <div className="z-10 flex h-full flex-row items-center justify-center  gap-2 self-center rounded-md bg-white p-1.5 shadow-md">
            <div
              className={`relative h-[30px] w-[30px] hover:bg-violet-300 ${
                selectedDraw === "aiInput" ? "bg-violet-300" : ""
              } flex items-center justify-center rounded-md`}
              onClick={(e) => {
                setSelectedDraw("aiInput");
                e.stopPropagation();
              }}
              ref={aiPopUpRef}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke="black"
                // className="hover:stroke-white"
              >
                <path
                  d="M5.91165 3.16664C5.94923 3.09576 6.05077 3.09577 6.08835 3.16664L7.89127 6.56722C7.90064 6.5849 7.9151 6.59936 7.93278 6.60873L11.3334 8.41165C11.4042 8.44923 11.4042 8.55077 11.3334 8.58835L7.93278 10.3913C7.9151 10.4006 7.90064 10.4151 7.89127 10.4328L6.08835 13.8334C6.05077 13.9042 5.94923 13.9042 5.91165 13.8334L4.10873 10.4328C4.09936 10.4151 4.0849 10.4006 4.06722 10.3913L0.666643 8.58835C0.595765 8.55077 0.595765 8.44923 0.666643 8.41165L4.06722 6.60873C4.0849 6.59936 4.09936 6.5849 4.10873 6.56722L5.91165 3.16664Z"
                  stroke="inherit"
                ></path>
                <path
                  d="M15.5 3L13.5 0.5L11.5 3L13.5 5.5L15.5 3Z"
                  stroke="inherit"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M13.5 10.5V14.5M11.5 12.5H15.5"
                  stroke="inherit"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
              <>
                {selectedDraw === "aiInput" ? (
                  <div className="absolute left-0 top-full z-10 flex -translate-x-1.5 translate-y-6 items-center justify-center rounded-lg bg-white shadow-md">
                    <Generate onSVGComplete={onSVGComplete}></Generate>
                    <div
                      className="absolute right-0 top-0 flex h-[24px] w-[24px] items-center justify-center text-slate-300"
                      onClick={(e) => {
                        setSelectedDraw(null);
                        e.stopPropagation();
                      }}
                    >
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 16 16"
                        fill="grey"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          className="fillDefault fillActive"
                          d="M15.0996 13.6L9.39961 7.9L15.0996 2.2C15.4996 1.8 15.4996 1.2 15.0996 0.8C14.6996 0.4 14.0996 0.4 13.6996 0.8L7.99965 6.5L2.29963 0.8C1.89963 0.4 1.29961 0.4 0.899609 0.8C0.499609 1.2 0.499609 1.8 0.899609 2.2L6.59962 7.9L0.899609 13.6C0.499609 14 0.499609 14.6 0.899609 15C1.09961 15.2 1.39962 15.3 1.59962 15.3C1.89962 15.3 2.09963 15.2 2.29963 15L7.99965 9.3L13.6996 15C13.8996 15.2 14.1996 15.3 14.3996 15.3C14.6996 15.3 14.8996 15.2 15.0996 15C15.4996 14.7 15.4996 14 15.0996 13.6Z"
                        ></path>
                      </svg>
                    </div>
                  </div>
                ) : null}
              </>
            </div>
            <div className="h-full w-[1px] bg-[#f3f5f7]"></div>
            <div
              className={`relative h-[30px] w-[30px] hover:bg-violet-300 ${
                selectedDraw === "fileInput" ? "bg-violet-300" : ""
              } flex items-center justify-center rounded-md`}
              onClick={(e) => {
                setSelectedDraw("fileInput");
                e.stopPropagation();
              }}
              ref={filePopUpRef}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="black"
                width={18}
                height={18}
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
              <>
                {selectedDraw === "fileInput" ? (
                  <div className="absolute left-0 top-full z-10 flex h-24 w-60 translate-y-6 items-center justify-center rounded-lg bg-white shadow-md">
                    <input
                      type="file"
                      accept=".svg"
                      onChange={(e) => handleFileChange(e)}
                      className=""
                      ref={fileInputRef}
                    />
                  </div>
                ) : null}
              </>
            </div>
            <div className="flex h-[30px] w-[30px] items-center justify-center rounded-md hover:bg-violet-300">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
                className="_typeIcon_12syx_29"
                color="black"
              >
                <rect
                  stroke="black"
                  x="1.5"
                  y="1.5"
                  stroke-width="1.2"
                  width="13"
                  height="13"
                  rx="2"
                  fill="none"
                  fill-rule="evenodd"
                ></rect>
              </svg>
            </div>
            <div className="flex h-[30px] w-[30px] items-center justify-center rounded-md hover:bg-violet-300">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
                className="_typeIcon_12syx_29"
                color="black"
              >
                <circle
                  stroke="black"
                  cx="8"
                  cy="8"
                  r="6.5"
                  fill="none"
                  fill-rule="evenodd"
                  stroke-width="1.2"
                ></circle>
              </svg>
            </div>
            <div className="flex h-[30px] w-[30px] items-center justify-center rounded-md text-[18px] font-light hover:bg-violet-300">
              T
            </div>
            <div className="flex h-[30px] w-[30px] items-center justify-center rounded-md hover:bg-violet-300">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.49641 2.64768C9.65292 2.67176 9.79251 2.75949 9.88208 2.89007L14.2237 9.21965C14.4037 9.48202 14.5 9.79272 14.5 10.1109C14.5 10.5261 14.3361 10.9246 14.0439 11.2196L11.2541 14.0362C10.9602 14.333 10.5598 14.5 10.1421 14.5C9.82732 14.5 9.51985 14.4051 9.25985 14.2276L2.8938 9.88327C2.76081 9.79251 2.67142 9.65066 2.64694 9.49153L1.50615 2.07635C1.45478 1.74245 1.74246 1.45476 2.07636 1.50613L9.49641 2.64768Z"
                  stroke="black"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M2.00002 1.9999L6.50002 6.4999"
                  stroke="black"
                  stroke-linecap="round"
                ></path>
                <path d="M12.8691 7.93213L7.8966 12.9093" stroke="black"></path>
                <circle
                  cx="7"
                  cy="7"
                  r="1"
                  transform="rotate(90 7 7)"
                  fill="black"
                ></circle>
              </svg>
            </div>
          </div>
          <div className="z-10 flex  h-[40px] items-center gap-4 rounded-md">
            <div className="flex h-full items-center gap-1 rounded-md bg-white p-1 shadow-md">
              <div className="h-[30px] w-[30px] rounded-md bg-slate-200"></div>
              <div className="h-[30px] w-[30px] rounded-md bg-slate-200"></div>
            </div>
            <div className="z-10 flex h-full w-[40px] items-center justify-center rounded-md bg-pink-300">
              D
            </div>
          </div>
        </div>
        <div className="flex flex-auto justify-between p-[12px]">
          <div className="flex h-full w-[296px] flex-col items-center justify-center rounded-xl bg-white shadow-md">
            Layers
          </div>

          <div
            className={`visible flex  w-[296px] flex-col gap-4 bg-white p-4 font-[Inter] text-[#1a1a1a] shadow-md ${
              selectedPath === null ? "invisible" : ""
            } h-full rounded-xl`}
          >
            <div className="border-b-[1px] border-[#e6e6e6] p-1 pb-3 font-semibold">
              Properties
            </div>
            <div className="flex flex-col gap-4 border-b-[1px] border-[#e6e6e6] p-1 pb-4 text-xs">
              <div className="font-bold">Fill</div>
              <div className="flex w-full flex-col">
                <div className="flex h-[24px] w-full flex-row items-center gap-2">
                  <div
                    className={`h-[16px] w-[16px]`}
                    style={{
                      backgroundColor:
                        svg && selectedPath !== null
                          ? svg[selectedPath]?.fill
                            ? svg[selectedPath]?.fill
                            : "#000000"
                          : ("#000000" as string),
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setColorPicker(true);
                    }}
                  ></div>
                  <div className="leading-1 relative flex flex-row items-center justify-center text-center">
                    <input
                      value={
                        svg && selectedPath !== null
                          ? svg[selectedPath]?.fill
                            ? svg[selectedPath]?.fill
                            : "#000000"
                          : "#000000"
                      }
                      className="flex h-full w-[64px] flex-row justify-center rounded-md border-[1px] border-[#e6e6e6] p-1 text-center text-xs"
                    ></input>
                    {colorPicker && (
                      <div
                        className="absolute left-0 top-0"
                        ref={colorPickerRef}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <HexColorPicker
                          color={color}
                          onChange={(e) => {
                            setColor(e);
                            if (!svg) return;
                            if (!selectedPath) return;
                            const svgSelectedPath = svg[selectedPath];
                            if (svgSelectedPath === undefined) return;
                            svgSelectedPath.fill = e;

                            const ctx = canvasRef.current?.getContext("2d");
                            if (!ctx) return;
                            drawSVG(ctx, svg);
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 border-b-[1px] border-[#e6e6e6] p-1 pb-4 text-xs">
              <div className="font-bold">Dimensions</div>
              <div className="flex w-full flex-col gap-4">
                <div className="flex w-full flex-row">
                  <div className="w-1/2">W</div>
                  <div className="w-1/2">X</div>
                </div>
                <div className="flex w-full flex-row">
                  <div className="w-1/2">X</div>
                  <div className="w-1/2">Y</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="z-10 h-[80px] w-full flex-none p-[20px]">
          <div className="flex justify-center gap-2">
            <ToolBox
              handleToolChange={(tool: Tool) => {
                setTool(tool);
              }}
              tool={tool}
            />
            <div className="flex h-full items-center gap-1 rounded-md bg-white p-1 shadow-md">
              <div className="h-[30px] w-[30px] rounded-md bg-slate-200 hover:bg-violet-300 hover:text-white">
                <svg
                  height="32"
                  viewBox="0 0 32 32"
                  width="32"
                  xmlns="http://www.w3.org/2000/svg"
                  className="scale-x-[-1] transform"
                >
                  <g
                    fill="none"
                    fill-rule="evenodd"
                    transform="translate(10 9)"
                  >
                    <path
                      d="m11 .0781-10.25.078 3.494 3.12c-.289.312-.527.571-.572.63-.156.203-.781 1.125-.969 1.516-.187.39-.562 1.39-.672 2.031-.1.589-.094 1.656-.078 2.109.015.423.16 1.258.297 1.641.219.609.344.938.625 1.375.316.492.593.767 1.031 1.188.391.375 2.188 1.234 2.188 1.234-.282-.359-.813-1.391-.938-1.75-.066-.19-.239-1.111-.281-1.531-.047-.469-.078-1.125-.063-1.594.014-.409.102-.809.204-1.172.109-.391.428-.907.687-1.266.203-.281.448-.572.797-.906.254-.244.551-.503.854-.727l3.615 3.227z"
                      fill="#fff"
                    />
                    <path
                      d="m9.9648 7.2402-.004-6.184-6.161.004 1.798 1.802c-.138.146-.326.345-.437.484-.277.347-.443.537-.61.732-.118.138-.262.317-.377.474-.159.217-.28.43-.361.575-.111.196-.226.46-.367.75-.196.404-.262.746-.319.982-.039.16-.13.571-.166.953-.028.29-.008.624-.008.759 0 .236-.024.52.027.98.047.421.296 1.351.482 1.722.156.313.462.93.462.93s-.17-1.518-.116-2.285c.032-.438.235-1.183.493-1.728.045-.093.053-.21.186-.422.103-.162.24-.386.355-.568.214-.337.654-.875.759-1.015.169-.225.66-.672.938-.917.142-.125.493-.419.793-.668z"
                      fill="#000"
                    />
                  </g>
                </svg>
              </div>
              <div
                className="h-[30px] w-[30px] rounded-md bg-slate-200 hover:bg-violet-300 hover:text-white"
                onClick={() => {
                  setSelectedDraw("file");
                }}
              >
                <svg
                  height="32"
                  viewBox="0 0 32 32"
                  width="32"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g
                    fill="none"
                    fill-rule="evenodd"
                    transform="translate(10 9)"
                  >
                    <path
                      d="m11 .0781-10.25.078 3.494 3.12c-.289.312-.527.571-.572.63-.156.203-.781 1.125-.969 1.516-.187.39-.562 1.39-.672 2.031-.1.589-.094 1.656-.078 2.109.015.423.16 1.258.297 1.641.219.609.344.938.625 1.375.316.492.593.767 1.031 1.188.391.375 2.188 1.234 2.188 1.234-.282-.359-.813-1.391-.938-1.75-.066-.19-.239-1.111-.281-1.531-.047-.469-.078-1.125-.063-1.594.014-.409.102-.809.204-1.172.109-.391.428-.907.687-1.266.203-.281.448-.572.797-.906.254-.244.551-.503.854-.727l3.615 3.227z"
                      fill="#fff"
                    />
                    <path
                      d="m9.9648 7.2402-.004-6.184-6.161.004 1.798 1.802c-.138.146-.326.345-.437.484-.277.347-.443.537-.61.732-.118.138-.262.317-.377.474-.159.217-.28.43-.361.575-.111.196-.226.46-.367.75-.196.404-.262.746-.319.982-.039.16-.13.571-.166.953-.028.29-.008.624-.008.759 0 .236-.024.52.027.98.047.421.296 1.351.482 1.722.156.313.462.93.462.93s-.17-1.518-.116-2.285c.032-.438.235-1.183.493-1.728.045-.093.053-.21.186-.422.103-.162.24-.386.355-.568.214-.337.654-.875.759-1.015.169-.225.66-.672.938-.917.142-.125.493-.419.793-.668z"
                      fill="#000"
                    />
                  </g>
                </svg>
              </div>
            </div>
            <div className="flex h-full items-center gap-1 rounded-md bg-white p-1 shadow-md">
              <div className="flex h-[30px] w-[60px] items-center justify-center rounded-md bg-slate-200 font-[geist] text-xs hover:bg-violet-300 hover:text-white">
                {Math.round(scale.x * 100)}%
              </div>
            </div>
          </div>
        </div>
      </div>
      <canvas
        onMouseDown={onMouseDownWrapper}
        onContextMenu={onRightClickWrapper}
        onMouseUp={onMouseUpWrapper}
        onMouseMove={onMouseMoveWrapper}
        onWheel={handOnWheelMove}
        ref={canvasRef}
        width={600}
        height={600}
        className={` z-2 absolute rounded-lg bg-white ${
          tool === "hand" ? "cursor-grab" : ""
        } ${mouseDown ? "cursor-grabbing" : ""}`}
      ></canvas>
    </div>
  );
}
