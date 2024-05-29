"use client";
import { useSVG } from "~/hooks/usSVG";
import { useHand } from "~/hooks/useHand";
import { useSelect } from "~/hooks/useSelect";
import React, { useState, useRef, useEffect } from "react";
import { parsePath, absolutize, normalize, serialize } from "path-data-parser";
import ToolBox from "./_components/ToolBox";
import Link from "next/link";
import { Just_Another_Hand } from "next/font/google";
import Generate from "./_components/Generate";
import SVGPathCommander from "svg-path-commander";
import { HexColorPicker } from "react-colorful";
import { motion, AnimatePresence } from "framer-motion";

import textPath from "../../helper/textPath";
import { Modak, Leckerli_One, Pacifico } from "next/font/google";
import Guidebox from "./_components/GuideBox";

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

const modak = Modak({
  weight: ["400"],
  subsets: ["devanagari"],
  variable: "--font-modak",
});

const pacifico = Pacifico({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-pacifico",
});

export default function Editor() {
  const [tool, setTool] = useState<Tool>("select");
  const { svg, setSVG, setSelected, moveSelected } = useSVG([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textareaRef = useRef<HTMLInputElement | null>(null);
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
    setSelectMouseDown,
    selectMouseDown,
    onSelectMouseMove,
  } = useSelect(onMove, onHover, onSelect, canvasRef, tool);

  const [panOffset, setPanOffset] = useState<Point>({ x: 0, y: 0 });
  const [scale, setScale] = useState<Point>({ x: 1, y: 1 });

  const [point2Ds, setPoint2Ds] = useState<Path2D[][]>([]);
  const [selectedPaths, setSelectedPaths] = useState<number[]>([]);

  type PointIndex = [number, number];
  const [selectedPoint, setSelectedPoint] = useState<PointIndex[] | null>(null);
  const [selectedDraw, setSelectedDraw] = useState<string | null>("aiInput");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [isRightClicked, setIsRightClicked] = useState<Point | null>(null);
  const [color, setColor] = useState<string>("#000000");
  const [boundingPoints2D, setBoundingPoint2D] = useState<Path2D[] | null>(
    null,
  );
  const [selectedBoundingBoxPoint, setSelectedBoundingBoxPoint] = useState<
    string | null
  >(null);
  const [isEditingText, setIsEditingText] = useState<boolean>(false);
  const [textareaPosition, setTextareaPosition] = useState<Point>({
    x: 0,
    y: 0,
  });

  const [rotatePoint2D, setRotatePoint2D] = useState<Path2D | null>(null);
  const [selectedRotatePoint, setSelectedRotatePoint] =
    useState<boolean>(false);
  const [addPoint, setAddPoint] = useState<Point | null>(null);
  const [selectPoint, setSelectPoint] = useState<Point | null>(null);
  const [addShape, setAddShape] = useState<string | null>(null);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  // console.log(scale);
  const [history, setHistory] = useState<SVG[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const onNewHistory = () => {
    if (!svg) return;
    if (mouseDown) return;
    let newHistory = [...history];
    if (newHistory.length !== 0 && historyIndex !== newHistory.length - 1) {
      newHistory = newHistory.slice(0, historyIndex + 1);
    }
    newHistory.push([...svg]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    console.log("New History", newHistory.length - 1);
  };

  const onReturnHistory = () => {
    if (historyIndex === 0) return;
    console.log("RETURNED", historyIndex - 1);
    setHistoryIndex(historyIndex - 1);
    setSVG([...history[historyIndex - 1]!]);
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    clear();
    drawSVG(ctx, history[historyIndex - 1]!);
  };

  const onForwardHistory = () => {
    if (historyIndex === history.length - 1) return;
    setHistoryIndex(historyIndex + 1);
    setSVG(history[historyIndex + 1]!);
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    drawSVG(ctx, history[historyIndex + 1]!);
  };

  const [forText, setForText] = useState<string>("");
  const [guideIndex, setGuideIndex] = useState<number>(0);

  const dragLayer = useRef<number>(0);
  const dragOverLayer = useRef<number>(0);

  const svgPathToString = (path: AbsoluteSegment[]) => {
    let pathString = "";
    path.forEach((segment) => {
      pathString += segment.key;
      if (segment.key !== "A") {
        segment.data.forEach((point) => {
          pathString += point.x + " " + point.y + " ";
        });
      } else {
        pathString +=
          segment.arcParams.rx +
          " " +
          segment.arcParams.ry +
          " " +
          segment.arcParams.rotation +
          " " +
          segment.arcParams.largeArcFlag +
          " " +
          segment.arcParams.sweepFlag +
          " " +
          segment.arcParams.dx +
          " " +
          segment.arcParams.dy +
          " ";
      }
    });
    return pathString;
  };

  function onPan({ ctx, currentPoint, prevPoint }: Pan) {
    if (!prevPoint) return;
    const dx = currentPoint.x - prevPoint.x;
    const dy = currentPoint.y - prevPoint.y;
    setPanOffset({
      x: panOffset.x + dx,
      y: panOffset.y + dy,
    });

    clear();
    ctx.reset();
    ctx.transform(scale.x, 0, 0, scale.y, panOffset.x + dx, panOffset.y + dy);
    clear();
    if (!svg) return;
    drawSVG(ctx, svg);
    drawSVGPoints(ctx, svg);
    if (selectedPaths.length !== 0) drawBoundingBox(ctx, [...selectedPaths]);
  }

  function onAddSelect(
    ctx: CanvasRenderingContext2D,
    currentPoint: Point,
    type: string,
  ) {
    if (!svg) {
      console.log("svg is null");
      return;
    }
    if (!ctx) {
      console.log("ctx is null");
      return;
    }
    if (!currentPoint) {
      console.log("current point is null");
      return;
    }
    if (tool !== "add") {
      console.log("tool is not add");
      return;
    }
    if (type === null) {
      console.log("type is null");
      return;
    }

    setAddPoint({
      x: currentPoint.x,
      y: currentPoint.y,
    });
    setAddShape(type);
  }

  function onAddMove(
    ctx: CanvasRenderingContext2D,
    e: React.MouseEvent<HTMLCanvasElement>,
  ) {
    if (!ctx) {
      console.log("ctx is null");
      return;
    }
    if (!isMouseDown) {
      return;
    }
    const currentPoint = computePointInCanvas(e)!;
    const calculatedPoint = {
      x: (currentPoint.x - panOffset.x) * (1 / scale.x),
      y: (currentPoint.y - panOffset.y) * (1 / scale.y),
    };
    const calculatedAddPoint = {
      x: (addPoint!.x - panOffset.x) * (1 / scale.x),
      y: (addPoint!.y - panOffset.y) * (1 / scale.y),
    };
    if (!calculatedPoint) {
      console.log("current point is null");
      return;
    }
    if (!addPoint) {
      console.log("add point is null");
      return;
    }
    if (!addShape) {
      console.log("add shape is null");
      return;
    }
    const addWidth = currentPoint.x - addPoint.x;
    const addHeight = currentPoint.y - addPoint.y;
    if (!svg) {
      console.log("svg is null");
      return;
    }

    //fix it so that it only pushes to the svg when mouse is up
    // if (addShape === "rect") {
    //   svg.push({
    //     fill: color,
    //     d: [
    //       {
    //         key: "M",
    //         data: [
    //           { x: addPoint.x, y: addPoint.y },
    //           { x: addPoint.x + addWidth, y: addPoint.y },
    //           { x: addPoint.x + addWidth, y: addPoint.y + addHeight },
    //           { x: addPoint.x, y: addPoint.y + addHeight },
    //           { x: addPoint.x, y: addPoint.y },
    //         ],
    //       },
    //     ],
    //     path2D: null,
    //     xMin: addPoint.x,
    //     xMax: addPoint.x + addWidth,
    //     yMin: addPoint.y,
    //     yMax: addPoint.y + addHeight,
    //     offset: { x: 0, y: 0 },
    //     rotation: 0,
    //   });
    // }

    // const newPath2D = pathToPath2D(svg[svg.length - 1]!);
    // svg[svg.length - 1]!.path2D = newPath2D;

    if (addShape === "rect") {
      ctx.beginPath();
      ctx.rect(
        calculatedAddPoint.x,
        calculatedAddPoint.y,
        calculatedPoint.x - calculatedAddPoint.x,
        calculatedPoint.y - calculatedAddPoint.y,
      );
      ctx.closePath();
    } else if (addShape === "circle") {
      ctx.beginPath();
      ctx.ellipse(
        calculatedAddPoint.x + (calculatedPoint.x - calculatedAddPoint.x) / 2,
        calculatedAddPoint.y + (calculatedPoint.y - calculatedAddPoint.y) / 2,
        Math.abs(calculatedPoint.x - calculatedAddPoint.x) / 2,
        Math.abs(calculatedPoint.y - calculatedAddPoint.y) / 2,
        0,
        0,
        Math.PI * 2,
      );
      ctx.closePath();
    }
    ctx.fillStyle = color;
    ctx.fill();

    drawSVG(ctx, svg);
    setSelectedPaths([svg.length - 1]);
    //Draw Bounding Box won't be able to access the newly set selectedPaths
    drawBoundingBox(ctx, [svg.length - 1]);
  }

  function onAddUp(
    ctx: CanvasRenderingContext2D,
    e: React.MouseEvent<HTMLCanvasElement>,
  ) {
    if (!ctx) {
      console.log("ctx is null");
      return;
    }
    if (!addPoint) {
      console.log("add point is null");
      return;
    }
    if (!addShape) {
      console.log("add shape is null");
      return;
    }
    const currentPoint = computePointInCanvas(e)!;
    const calculatedPoint = {
      x: (currentPoint.x - panOffset.x) * (1 / scale.x),
      y: (currentPoint.y - panOffset.y) * (1 / scale.y),
    };
    const calculatedAddPoint = {
      x: (addPoint.x - panOffset.x) * (1 / scale.x),
      y: (addPoint.y - panOffset.y) * (1 / scale.y),
    };
    if (!calculatedPoint) return;

    const addWidth = calculatedPoint.x - calculatedAddPoint.x;
    const addHeight = calculatedPoint.y - calculatedAddPoint.y;
    if (!svg) {
      console.log("svg is null");
      return;
    }

    if (addShape === "rect") {
      svg.push({
        fill: color,
        tag: "path",
        shape: {
          d: [
            {
              key: "M",
              data: [
                { x: calculatedAddPoint.x, y: calculatedAddPoint.y },
                { x: calculatedAddPoint.x + addWidth, y: calculatedAddPoint.y },
                {
                  x: calculatedAddPoint.x + addWidth,
                  y: calculatedAddPoint.y + addHeight,
                },
                {
                  x: calculatedAddPoint.x,
                  y: calculatedAddPoint.y + addHeight,
                },
                { x: calculatedAddPoint.x, y: calculatedAddPoint.y },
              ],
            },
          ],
          path2D: null,
        },
        xMin: calculatedAddPoint.x,
        xMax: calculatedAddPoint.x + addWidth,
        yMin: calculatedAddPoint.y,
        yMax: calculatedAddPoint.y + addHeight,
        offset: { x: 0, y: 0 },
        rotation: 0,
        stroke: "#000000",
      });
    } else if (addShape === "circle") {
      svg.push({
        fill: color,
        tag: "path",
        shape: {
          d: [
            {
              key: "M",
              data: [
                {
                  x: calculatedAddPoint.x,
                  y: calculatedAddPoint.y + addHeight / 2,
                },
              ],
            },
            {
              key: "A",
              arcParams: {
                rx: addWidth / 2,
                ry: addHeight / 2,
                rotation: 0,
                largeArcFlag: 1,
                sweepFlag: 1,
                dx: calculatedAddPoint.x + addWidth,
                dy: calculatedAddPoint.y + addHeight / 2,
              },
            },
            {
              key: "A",
              arcParams: {
                rx: addWidth / 2,
                ry: addHeight / 2,
                rotation: 0,
                largeArcFlag: 1,
                sweepFlag: 1,
                dx: calculatedAddPoint.x,
                dy: calculatedAddPoint.y + addHeight / 2,
              },
            },
            {
              key: "Z",
              data: [],
            },
          ],

          path2D: null,
        },
        xMin: calculatedAddPoint.x,
        xMax: calculatedAddPoint.x + addWidth,
        yMin: calculatedAddPoint.y,
        yMax: calculatedAddPoint.y + addHeight,
        offset: { x: 0, y: 0 },
        stroke: "#000000",
        rotation: 0,
      });
      //-------------------FIX HERE TO FIX THE TEXT-------------------
    } else if (addShape === "text") {
      ctx.font = "64px pacifico";
      svg.push({
        fill: color,
        tag: "text",
        shape: {
          content: "Text",
          font: "pacifico",
          size: 64,
          d: [
            {
              key: "M",
              data: [{ x: calculatedAddPoint.x, y: calculatedAddPoint.y }],
            },
            {
              key: "C",
              data: [
                { x: calculatedAddPoint.x + 80, y: calculatedAddPoint.y },
                { x: calculatedAddPoint.x + 80, y: calculatedAddPoint.y },
                { x: calculatedAddPoint.x + 160, y: calculatedAddPoint.y },
              ],
            },
          ],
          path2D: null,
        },
        xMin: calculatedAddPoint.x,
        xMax: calculatedAddPoint.x + 160,
        yMin: calculatedAddPoint.y - 48,
        yMax: calculatedAddPoint.y,
        offset: { x: 0, y: 0 },
        stroke: "#000000",
        rotation: 0,
      });
    }
    if (svg[svg.length - 1]!.tag === "path") {
      const newPath2D = pathToPath2D(svg[svg.length - 1]!);
      svg[svg.length - 1]!.shape.path2D = newPath2D;
    } else if (svg[svg.length - 1]!.tag === "text") {
      // const newPath = [...svg[svg.length - 1]!.shape.d];
      // if (newPath[0]?.key !== "A") {
      //   newPath[0]?.data.push({
      //     x: calculatedAddPoint.x + 400,
      //     y: calculatedAddPoint.y + 64,
      //   });
      //   newPath[0]?.data.push({
      //     x: calculatedAddPoint.x + 200,
      //     y: calculatedAddPoint.y + 64,
      //   });
      //   newPath[0]?.data.push({
      //     x: calculatedAddPoint.x + 0,
      //     y: calculatedAddPoint.y + 64,
      //   });
      //   newPath[0]?.data.push({
      //     x: calculatedAddPoint.x + 0,
      //     y: calculatedAddPoint.y + 0,
      //   });
      // }
    }
    svg[svg.length - 1]!.shape.path2D = pathToPath2D(svg[svg.length - 1]!);
    clear();
    drawSVG(ctx, svg);
    drawBoundingBox(ctx, [svg.length - 1]);
    setSelectedPaths([svg.length - 1]);
    setTool("select");
    ////onNewhistory()
  }

  function onZoom({ ctx, scaleX, scaleY }: Zoom) {
    const canvas = ctx.canvas;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const xOffSet = rect.width / 2;
    const yOffSet = rect.height / 2;
    // setPanOffset({
    //   x: panOffset.x * (1 / (scale.x * (1 + scaleX))),
    //   y: panOffset.y * (1 / (scale.y * (1 + scaleY))),
    // });
    setScale({ x: scale.x * (1 + scaleX), y: scale.x * (1 + scaleX) });
    // ctx.translate(xOffSet, yOffSet);
    ctx.reset();
    ctx.transform(scale.x, 0, 0, scale.y, panOffset.x, panOffset.y);
    // ctx.translate(-xOffSet, -yOffSet);

    clear();
    if (!svg) return;
    drawSVG(ctx, svg);
    drawSVGPoints(ctx, svg);
    if (selectedPaths.length !== 0) drawBoundingBox(ctx, [...selectedPaths]);
  }

  function onSelect({ ctx, currentPoint, e }: Select) {
    if (!svg) return;

    if (isEditing) {
      let continueFlag = true;
      if (selectedPaths.length === 1) {
        point2Ds.some((point2D, i) => {
          point2D.some((point, j) => {
            if (ctx.isPointInPath(point, currentPoint.x, currentPoint.y)) {
              setSelectedPoint([[i, j]]);
              console.log("Selected Point", [[i, j]]);
              continueFlag = false;
              return true;
            }
          });
        });
      }

      if (!continueFlag) return;
      else {
        setSelectedPoint(null);
        setIsEditing(false);
      }
    }

    //check if bounding box's point is selected
    if (selectedPaths.length !== 0) {
      let boundingPointSelected = false;
      if (boundingPoints2D !== null) {
        boundingPoints2D.some((boundingPoint2D, i) => {
          if (
            ctx.isPointInPath(boundingPoint2D, currentPoint.x, currentPoint.y)
          ) {
            setSelectedBoundingBoxPoint(
              i === 0
                ? "leftUpper"
                : i === 1
                  ? "rightUpper"
                  : i === 2
                    ? "leftLower"
                    : i === 3
                      ? "rightLower"
                      : null,
            );
            boundingPointSelected = true;
            return true;
          } else {
            return false;
          }
        });
      }
      if (boundingPointSelected) return;
    }

    setSelectedBoundingBoxPoint(null);

    let pathSelected = -1;
    setSelectedRotatePoint(false);
    if (selectedPaths.length !== 0) {
      if (rotatePoint2D !== null) {
        if (ctx.isPointInPath(rotatePoint2D, currentPoint.x, currentPoint.y)) {
          setSelectedRotatePoint(true);
          return;
        }
      }
    }

    //fix so that when a path is selected, you no longer search

    let isAlreadySelected = false;

    const reversedSVG = [...svg].reverse();
    reversedSVG.some((subSVG, i) => {
      // if (subSVG.tag === "text") {
      //   //TODO : Implement Text Selection
      //   return false;
      // }
      const path2D = subSVG.shape.path2D;
      if (path2D === null) return false;
      if (ctx.isPointInPath(path2D, currentPoint.x, currentPoint.y)) {
        pathSelected = svg.length - 1 - i;
        if (selectedPaths.includes(i)) isAlreadySelected = true;
        else setSelectedPaths([svg.length - 1 - i]);
        return true;
      } else {
        return false;
      }
    });

    if (pathSelected === -1) {
      setSelectedPaths([]);
      setSelectedPoint(null);
      setSelectPoint(currentPoint);
    } else {
      const selectedSvg = svg[pathSelected]!;
      if (selectedSvg.shape.path2D !== null) {
        drawOutline(ctx, selectedSvg.shape.path2D);
      }
    }

    // if isEditingText was true, change the text
    if (isEditingText) {
      const selectedPath = selectedPaths[0];
      if (svg[selectedPath!]?.tag !== "text") return;
      const textInput = textareaRef.current;
      if (!textInput) return;

      //@ts-expect-error: tag is text
      svg[selectedPath!]!.shape.content = textInput.value;
      setIsEditingText(false);
      ////onNewhistory()
    }

    clear();
    drawSVG(ctx, svg);
    drawSVGPoints(ctx, svg);
    drawBoundingBox(ctx, [...selectedPaths]);
    setColor(svg[selectedPaths[0]!]?.fill ?? "#000000");
  }

  const drawText = (textTag: SubSVG, ctx: CanvasRenderingContext2D) => {
    if (textTag.tag !== "text") return;

    // const shape = textTag.shape;
    // if (shape.content === null) return;
    // const svgElement = document.getElementById("test");
    // if (!svgElement) {
    //   console.log("NO SVG ELEMENT");
    //   return;
    // }
    // svgElement.innerHTML = "";
    // const id = Math.random().toString();

    // const defElement = document.createElementNS(
    //   "http://www.w3.org/2000/svg",
    //   "defs",
    // );

    // const textElement = document.createElementNS(
    //   "http://www.w3.org/2000/svg",
    //   "text",
    // );
    // const textPathElement = document.createElementNS(
    //   "http://www.w3.org/2000/svg",
    //   "textPath",
    // );
    // const pathElement = document.createElementNS(
    //   "http://www.w3.org/2000/svg",
    //   "path",
    // );
    // pathElement.setAttribute(
    //   "d",
    //   "M10,90 Q90,90 90,45 Q90,10 50,10 Q10,10 10,40 Q10,70 45,70 Q70,70 75,50",
    // );
    // pathElement.setAttribute("id", "sss");
    // textElement.setAttribute("x", "0");
    // textElement.setAttribute("y", "0");
    // textPathElement.setAttribute("href", `#sss`);
    // defElement.appendChild(pathElement);
    // svgElement.appendChild(defElement);
    // textPathElement.setAttribute("startOffset", "50%");

    // textPathElement.textContent = shape.content;
    // console.log(shape.content);
    // setForText(shape.content);
    // textElement.appendChild(textPathElement);
    // svgElement.appendChild(textElement);
    // const svgString = new XMLSerializer().serializeToString(svgElement);
    // const svgBlob = new Blob([svgString], { type: "image/svg+xml" });
    // const url = URL.createObjectURL(svgBlob);
    // const img = new Image();
    // img.src = url;

    // //get center of bezier curve
    // if (shape.d[0] === null) return;
    // if (shape.d[0]?.data === null) return;
    // if (shape.d[0]?.key !== "M") return;
    // const x = shape.d[0].data[0]?.x ?? 0;
    // const y = shape.d[0].data[0]?.y ?? 0;
    // img.onload = () => {
    //   ctx.drawImage(img, x, y);
    // };
    // const measureText = (text: string) => {
    //   ctx.fillStyle = "#000000";
    //   ctx.font = "bold 64px Montserrat";

    //   return ctx.measureText(text).width;
    // };

    const absoluteSegmentsToArraysOfArrays = (segments: AbsoluteSegment[]) => {
      const result: Point[] = [];
      segments.forEach((seg) => {
        if (seg.key === "A") {
          return;
        }
        seg.data.forEach((point) => {
          result.push({
            x: point.x + textTag.offset.x,
            y: point.y + textTag.offset.y,
          });
        });
      });
      return result;
    };

    function draw(letter: string, x: number, y: number) {
      // ctx.translate(x, y);
      if (textTag.tag !== "text") return;
      ctx.fillStyle = textTag.fill;
      ctx.font = `${textTag.shape.size}px ${textTag.shape.font}`;
      ctx.fillText(letter, x, y);
    }

    const coors = absoluteSegmentsToArraysOfArrays(textTag.shape.d);

    textPath(textTag.shape.content, coors, draw);
  };

  const drawSVG = (ctx: CanvasRenderingContext2D, svg: SVG) => {
    if (!svg) return;
    svg.map((subSvg, i) => {
      if (subSvg.tag === "text") {
        const shape = subSvg.shape;

        const path2D = shape.path2D;

        if (!path2D) return;
        ctx.strokeStyle = "#ffffff";
        ctx.stroke(path2D);
        drawText(subSvg, ctx);
      } else {
        const shape = subSvg.shape;
        const path2D = shape.path2D;
        if (!path2D) return;
        ctx.fillStyle = svg[i]?.fill ?? "#000000";
        ctx.fill(path2D);
        ctx.strokeStyle = svg[i]?.stroke ?? "#000000";
        ctx.stroke(path2D);
      }
    });
  };

  const drawBoundingBox = (
    ctx: CanvasRenderingContext2D,
    pathIndexes: number[],
  ) => {
    if (!svg) return;
    if (selectedPaths.length === 0) {
      return;
    }
    // const selectedPathString = svgPathToString(svg[pathSelected]!.d);
    // // const selectedPathBoxString = new SVGPathCommander(
    // //   selectedPathString,
    // // ).getBBox();

    const firstPathIndex = pathIndexes[0];
    if (firstPathIndex === undefined || svg[firstPathIndex] === undefined) {
      return;
    }
    let boundingMaxX =
      svg[firstPathIndex]!.xMax + svg[firstPathIndex]!.offset.x;
    let boundingMinX =
      svg[firstPathIndex]!.xMin + svg[firstPathIndex]!.offset.x;
    let boundingMaxY =
      svg[firstPathIndex]!.yMax + svg[firstPathIndex]!.offset.y;
    let boundingMinY =
      svg[firstPathIndex]!.yMin + svg[firstPathIndex]!.offset.y;

    pathIndexes.map((pathIndex) => {
      boundingMaxX = Math.max(
        boundingMaxX,
        svg[pathIndex]!.xMax + svg[pathIndex]!.offset.x,
      );
      boundingMinX = Math.min(
        boundingMinX,
        svg[pathIndex]!.xMin + svg[pathIndex]!.offset.x,
      );
      boundingMaxY = Math.max(
        boundingMaxY,
        svg[pathIndex]!.yMax + svg[pathIndex]!.offset.y,
      );
      boundingMinY = Math.min(
        boundingMinY,
        svg[pathIndex]!.yMin + svg[pathIndex]!.offset.y,
      );
    });

    ctx.beginPath();
    ctx.rect(
      boundingMinX,
      boundingMinY,
      boundingMaxX - boundingMinX,
      boundingMaxY - boundingMinY,
    );
    ctx.lineWidth = 2 * (1 / scale.x);
    ctx.strokeStyle = "#3eadfd";
    ctx.stroke();
    ctx.closePath();

    const newPoint2Ds: Path2D[] = [];
    const leftUpperPoint2D = new Path2D();
    const rightUpperPoint2D = new Path2D();
    const leftLowerPoint2D = new Path2D();
    const rightLowerPoint2D = new Path2D();
    const rotatePoint2D = new Path2D();

    newPoint2Ds.push(leftUpperPoint2D);
    newPoint2Ds.push(rightUpperPoint2D);
    newPoint2Ds.push(leftLowerPoint2D);
    newPoint2Ds.push(rightLowerPoint2D);

    setBoundingPoint2D(newPoint2Ds);
    setRotatePoint2D(rotatePoint2D);

    ctx.fillStyle = "white";
    ctx.strokeStyle = "#3eadfd";
    ctx.lineWidth = 2 * (1 / scale.x);
    leftUpperPoint2D.arc(
      boundingMinX,
      boundingMinY,
      5 * (1 / scale.x),
      0,
      2 * Math.PI,
    );
    ctx.fill(leftUpperPoint2D);
    ctx.stroke(leftUpperPoint2D);

    rightUpperPoint2D.arc(
      boundingMaxX,
      boundingMinY,
      5 * (1 / scale.x),
      0,
      2 * Math.PI,
    );
    ctx.fill(rightUpperPoint2D);
    ctx.stroke(rightUpperPoint2D);

    leftLowerPoint2D.arc(
      boundingMinX,
      boundingMaxY,
      5 * (1 / scale.x),
      0,
      2 * Math.PI,
    );
    ctx.fill(leftLowerPoint2D);
    ctx.stroke(leftLowerPoint2D);

    rightLowerPoint2D.arc(
      boundingMaxX,
      boundingMaxY,
      5 * (1 / scale.x),
      0,
      2 * Math.PI,
    );

    rotatePoint2D.arc(
      (boundingMinX + boundingMaxX) / 2,
      boundingMinY - 20 * (1 / scale.x),
      5 * (1 / scale.x),
      0,
      2 * Math.PI,
    );

    ctx.fill(rotatePoint2D);
    ctx.stroke(rotatePoint2D);

    ctx.fill(rightLowerPoint2D);
    ctx.stroke(rightLowerPoint2D);

    ctx.closePath();
  };

  const onPathRotate = (
    ctx: CanvasRenderingContext2D,
    path: Path2D,
    dx: number,
    dy: number,
    prevX: number,
    prevY: number,
  ) => {
    if (!svg) return;
    if (selectedPaths.length === 0) return;
    // if (svg[selectedPath]?.tag === "text") {
    //   //TODO : Implement Text Rotation

    //   return;
    // }

    selectedPaths.map((selectedPath) => {
      const originX =
        (svg[selectedPath]!.xMin + svg[selectedPath]!.xMax) / 2 +
        svg[selectedPath]!.offset.x;
      const originY =
        (svg[selectedPath]!.yMin + svg[selectedPath]!.yMax) / 2 +
        svg[selectedPath]!.offset.y;

      // console.log(svg[selectedPath]!.offset.x, svg[selectedPath]!.offset.y);

      //Fix How it only rotates clockwise
      const originVector = { x: prevX - originX, y: prevY - originY };
      const crossToOriginVector = {
        x:
          -originVector.y /
          Math.sqrt(
            originVector.x * originVector.x + originVector.y * originVector.y,
          ),
        y:
          originVector.x /
          Math.sqrt(
            originVector.x * originVector.x + originVector.y * originVector.y,
          ),
      };

      const newVectorLength = Math.sqrt(
        Math.pow(crossToOriginVector.x * dx, 2) +
          Math.pow(crossToOriginVector.y * dy, 2),
      );
      const direction =
        crossToOriginVector.x * dx + crossToOriginVector.y * dy > 0 ? -1 : 1;

      const radian = (newVectorLength * direction * scale.x) / 100;
      if (selectedPath === null) return;
      if (svg === null) return;

      svg[selectedPath]!.rotation = radian;
      const newPath = { ...svg[selectedPath]! };

      if (newPath.shape.d === null) return;

      //figure out if there's an arc in the new Path
      let hasArc = false;
      newPath.shape.d.map((segment) => {
        if ("arcParams" in segment) {
          hasArc = true;
        }
      });
      if (hasArc) {
        return;
      }

      newPath.shape.d.map((segment) => {
        if ("arcParams" in segment) {
          // const points = [];
          // points.push({ x: segment.arcParams.dx, y: segment.arcParams.dy });
          // // points.push({ x: segment.arcParams.rx, y: segment.arcParams.ry });
          // points.map((point) => {
          //   const rotatedPoint = rotatePoint(
          //     point.x,
          //     point.y,
          //     (svg[selectedPath]!.xMin + svg[selectedPath]!.xMax) / 2,
          //     (svg[selectedPath]!.yMin + svg[selectedPath]!.yMax) / 2,
          //     radian,
          //   );
          //   point.x = rotatedPoint.x;
          //   point.y = rotatedPoint.y;
          // });
          segment.arcParams.rotation += radian;
          console.log("Rotating Arc");
        } else {
          segment.data.map((point) => {
            const rotatedPoint = rotatePoint(
              point.x,
              point.y,
              (svg[selectedPath]!.xMin + svg[selectedPath]!.xMax) / 2,
              (svg[selectedPath]!.yMin + svg[selectedPath]!.yMax) / 2,
              radian,
            );
            point.x = rotatedPoint.x;
            point.y = rotatedPoint.y;
          });
        }
      });
      // const rotatedXmaxYmax = rotatePoint(
      //   svg[selectedPath]!.xMax
      // )
      // newPath.xMin = svg[selectedPath]!.xMin;

      const newPath2D = pathToPath2D(newPath);
      svg[selectedPath]!.shape.path2D = newPath2D;
    });
    clear();
    drawSVG(ctx, svg);
    drawBoundingBox(ctx, [...selectedPaths]);
    // //Draw Prev Point on Canvas
    // ctx.beginPath();
    // ctx.arc(prevX, prevY, 100, 0, 2 * Math.PI);
    // ctx.fillStyle = "red";

    // //Draw Origin
    // ctx.arc(originX, originY, 100, 0, 2 * Math.PI);
    // ctx.fillStyle = "blue";

    // ctx.fill();
    // ctx.closePath();
    ////onNewhistory()
  };

  const rotatePoint = (
    x: number,
    y: number,
    originX: number,
    originY: number,
    radian: number,
  ) => {
    const cos = Math.cos(radian);
    const sin = Math.sin(radian);
    const nx = cos * (x - originX) + sin * (y - originY) + originX;
    const ny = cos * (y - originY) - sin * (x - originX) + originY;
    return { x: nx, y: ny };
  };

  const onPathExpand = (
    ctx: CanvasRenderingContext2D,
    path: Path2D,
    dx: number,
    dy: number,
    selectedBoxPoint: string,
  ) => {
    let realDx = dx;
    let realDy = dy;
    if (svg === null) return;
    if (selectedPaths.length === 0) return;
    // if (svg[selectedPath]?.tag === "text") {
    //   //TODO : Implement Text Expansion

    //   return;
    // }

    selectedPaths.map((selectedPath) => {
      const oldWidth = svg[selectedPath]!.xMax - svg[selectedPath]!.xMin;
      const oldHeight = svg[selectedPath]!.yMax - svg[selectedPath]!.yMin;
      if (selectedBoxPoint === "leftUpper") {
        realDx = dx;
        realDy = dy;
        svg[selectedPath]!.xMin += realDx;
        svg[selectedPath]!.yMin += realDy;

        const newWidth = svg[selectedPath]!.xMax - svg[selectedPath]!.xMin;
        const newHeight = svg[selectedPath]!.yMax - svg[selectedPath]!.yMin;

        svg[selectedPath]?.shape.d.map((segment) => {
          if ("arcParams" in segment) {
            //FIXXXXXXXXX

            segment.arcParams.dx =
              (segment.arcParams.dx - svg[selectedPath]!.xMax) *
                (newWidth / oldWidth) +
              svg[selectedPath]!.xMax;
            segment.arcParams.dy =
              (segment.arcParams.dy - svg[selectedPath]!.yMax) *
                (newHeight / oldHeight) +
              svg[selectedPath]!.yMax;
            segment.arcParams.rx = segment.arcParams.rx * (newWidth / oldWidth);
            segment.arcParams.ry =
              segment.arcParams.ry * (newHeight / oldHeight);

            return;
          }
          segment.data.map((point) => {
            point.x =
              (point.x - svg[selectedPath]!.xMax) * (newWidth / oldWidth) +
              svg[selectedPath]!.xMax;
            point.y =
              (point.y - svg[selectedPath]!.yMax) * (newHeight / oldHeight) +
              svg[selectedPath]!.yMax;

            // console.log(point);
          });
        });
      } else if (selectedBoxPoint === "rightUpper") {
        realDx = dx;
        realDy = dy;
        svg[selectedPath]!.xMax += realDx;
        svg[selectedPath]!.yMin += realDy;
        const newWidth = svg[selectedPath]!.xMax - svg[selectedPath]!.xMin;
        const newHeight = svg[selectedPath]!.yMax - svg[selectedPath]!.yMin;
        svg[selectedPath]?.shape.d.map((segment) => {
          if ("arcParams" in segment) {
            //FIXXXXXXXXX

            segment.arcParams.dx =
              (segment.arcParams.dx - svg[selectedPath]!.xMin) *
                (newWidth / oldWidth) +
              svg[selectedPath]!.xMin;
            segment.arcParams.dy =
              (segment.arcParams.dy - svg[selectedPath]!.yMax) *
                (newHeight / oldHeight) +
              svg[selectedPath]!.yMax;
            segment.arcParams.rx = segment.arcParams.rx * (newWidth / oldWidth);
            segment.arcParams.ry =
              segment.arcParams.ry * (newHeight / oldHeight);

            return;
          }
          segment.data.map((point) => {
            point.x =
              (point.x - svg[selectedPath]!.xMin) * (newWidth / oldWidth) +
              svg[selectedPath]!.xMin;
            point.y =
              (point.y - svg[selectedPath]!.yMax) * (newHeight / oldHeight) +
              svg[selectedPath]!.yMax;

            // console.log(point);
          });
        });
      } else if (selectedBoxPoint === "leftLower") {
        realDx = dx;
        realDy = dy;
        svg[selectedPath]!.xMin += realDx;
        svg[selectedPath]!.yMax += realDy;

        const newWidth = svg[selectedPath]!.xMax - svg[selectedPath]!.xMin;
        const newHeight = svg[selectedPath]!.yMax - svg[selectedPath]!.yMin;
        svg[selectedPath]?.shape.d.map((segment) => {
          if ("arcParams" in segment) {
            //FIXXXXXXXXX

            segment.arcParams.dx =
              (segment.arcParams.dx - svg[selectedPath]!.xMax) *
                (newWidth / oldWidth) +
              svg[selectedPath]!.xMax;
            segment.arcParams.dy =
              (segment.arcParams.dy - svg[selectedPath]!.yMin) *
                (newHeight / oldHeight) +
              svg[selectedPath]!.yMin;
            segment.arcParams.rx = segment.arcParams.rx * (newWidth / oldWidth);
            segment.arcParams.ry =
              segment.arcParams.ry * (newHeight / oldHeight);

            return;
          }
          segment.data.map((point) => {
            point.x =
              (point.x - svg[selectedPath]!.xMax) * (newWidth / oldWidth) +
              svg[selectedPath]!.xMax;
            point.y =
              (point.y - svg[selectedPath]!.yMin) * (newHeight / oldHeight) +
              svg[selectedPath]!.yMin;

            // console.log(point);
          });
        });
      } else if (selectedBoxPoint === "rightLower") {
        realDx = dx;
        realDy = dy;
        svg[selectedPath]!.xMax += realDx;
        svg[selectedPath]!.yMax += realDy;
        const newWidth = svg[selectedPath]!.xMax - svg[selectedPath]!.xMin;
        const newHeight = svg[selectedPath]!.yMax - svg[selectedPath]!.yMin;
        svg[selectedPath]?.shape.d.map((segment) => {
          if ("arcParams" in segment) {
            //FIXXXXXXXXX

            segment.arcParams.dx =
              (segment.arcParams.dx - svg[selectedPath]!.xMin) *
                (newWidth / oldWidth) +
              svg[selectedPath]!.xMin;
            segment.arcParams.dy =
              (segment.arcParams.dy - svg[selectedPath]!.yMin) *
                (newHeight / oldHeight) +
              svg[selectedPath]!.yMin;
            segment.arcParams.rx = segment.arcParams.rx * (newWidth / oldWidth);

            return;
          }

          segment.data.map((point) => {
            point.x =
              (point.x - svg[selectedPath]!.xMin) * (newWidth / oldWidth) +
              svg[selectedPath]!.xMin;
            point.y =
              (point.y - svg[selectedPath]!.yMin) * (newHeight / oldHeight) +
              svg[selectedPath]!.yMin;
            // console.log(point);
          });
        });
      }

      // const newPathToBeSerialized: Segment[] = [];
      // svg[selectedPath]!.d.forEach((segment) => {
      //   const newSegment: Segment = { key: segment.key, data: [] };
      //   newSegment.data = absoluteSegmentToSegment(segment).data;
      //   newPathToBeSerialized.push(newSegment);
      // });
      // const newPathString = serialize(newPathToBeSerialized);
      // // const transformedPathString = new SVGPathCommander(newPathString)
      // //   // .transform(transform)
      // //   .toString();
      // const transformedPathString = newPathString;
      // const newPath = parsePath(transformedPathString);
      // const newPathAbsolute: AbsoluteSegment[] = newPath.map((segment) => {
      //   return segmentToAbsoluteSegment(segment);
      // });
      // svg[selectedPath]!.d = newPathAbsolute;

      // const newPath2D = pathToPath2D(svg[selectedPath]!);
      // svg[selectedPath]!.path2D = newPath2D;

      // const newWidth = svg[selectedPath]!.xMax - svg[selectedPath]!.xMin;
      // const newHeight = svg[selectedPath]!.yMax - svg[selectedPath]!.yMin;
      // svg[selectedPath]?.d.map((segment) => {
      //   segment.data.map((point) => {
      //     point.x =
      //       (point.x - svg[selectedPath]!.xMin) * (newWidth / oldWidth) +
      //       svg[selectedPath]!.xMin;
      //     point.y =
      //       (point.y - svg[selectedPath]!.yMin) * (newHeight / oldHeight) +
      //       svg[selectedPath]!.yMin;
      //     // console.log(point);
      //   });
      // });

      const newPath2D = pathToPath2D(svg[selectedPath]!);
      svg[selectedPath]!.shape.path2D = newPath2D;
    });
    clear();
    drawSVG(ctx, svg);
    drawBoundingBox(ctx, [...selectedPaths]);
    ////onNewhistory()
  };

  const onCreateText = (ctx: CanvasRenderingContext2D) => {
    ctx.font = "30px Arial";
    ctx.fillText("Hello World", 10, 50);
  };

  // const absoluteSegmentToSegment = (
  //   absoluteSegment: AbsoluteSegment,
  // ): Segment => {
  //   if("arcParms" in absoluteSegment) return { key: abs, data: [] };
  //   const { key, data } = absoluteSegment;

  //   const segmentData: number[] = [];
  //   data.map((point) => {
  //     segmentData.push(point.x, point.y);
  //   });
  //   return { key: key, data: segmentData };
  // };

  // const segmentToAbsoluteSegment = (segment: Segment): AbsoluteSegment => {
  //   const { key, data } = segment;
  //   const absoluteData: Point[] = [];
  //   for (let i = 0; i < data.length; i += 2) {
  //     absoluteData.push({ x: data[i]!, y: data[i + 1]! });
  //   }
  //   return { key: key, data: absoluteData };
  // };

  //Loop through the SVG, loop through paths, loop through segments, draw points as red dots
  const drawSVGPoints = (ctx: CanvasRenderingContext2D, svg: SVG) => {
    if (!svg) return;
    if (selectedPaths.length !== 1) return;
    if (!isEditing) return;
    const selectedPath = selectedPaths[0];
    if (selectedPath === undefined) return;
    if (svg[selectedPath] === undefined || svg[selectedPath] === null) return;
    const selectedPathPath = svg[selectedPath];
    if (selectedPathPath === null || selectedPathPath === undefined) return;

    drawBezierControlLines(ctx, svg);
    const { d } = selectedPathPath.shape;

    const offset = selectedPathPath.offset;
    const newPoint2Ds: Path2D[][] = [];
    const xOffset = offset.x;
    const yOffset = offset.y;
    d.map((segment) => {
      if ("arcParams" in segment) return;
      const { key, data } = segment;
      const tempPoint2Ds: Path2D[] = [];
      data.map((point) => {
        const point2D = new Path2D();
        tempPoint2Ds.push(point2D);
        point2D.arc(
          point.x + xOffset,
          point.y + yOffset,
          5 * (1 / scale.x),
          0,
          2 * Math.PI,
        );
        ctx.strokeStyle = "#4eb2fd";
        ctx.stroke(point2D);
      });

      newPoint2Ds.push(tempPoint2Ds);
      ctx.fillStyle = "white";

      // if (newPoint2Ds.length - 1 === selectedPoint) {
      //   ctx.fillStyle = "#3eadfd";
      // }
    });
    setPoint2Ds(newPoint2Ds);
  };

  const drawBezierControlLines = (ctx: CanvasRenderingContext2D, svg: SVG) => {
    if (!svg) return;
    if (selectedPaths.length !== 1) return;
    if (!isEditing) return;
    const selectedPath = selectedPaths[0];
    if (selectedPath === undefined) return;
    if (svg[selectedPath] === undefined || svg[selectedPath] === null) return;
    const selectedPathPath = svg[selectedPath];
    if (selectedPathPath === null || selectedPathPath === undefined) return;

    const { d } = selectedPathPath.shape;

    const offset = selectedPathPath.offset;
    const xOffset = offset.x;
    const yOffset = offset.y;

    const dLength = d.length;

    for (let i = 0; i < dLength; i++) {
      if (i === 0) continue;

      const segment = d[i];
      if (!segment) continue;
      if ("arcParams" in segment) continue;
      const { key, data } = segment;
      if (key === "M") continue;
      if (key === "Z") continue;
      if (key === "C") {
        let lastPoint = { x: 0, y: 0 };
        const lastSegment = d[i - 1]!;
        if ("arcParams" in lastSegment) {
          lastPoint = {
            x: lastSegment.arcParams.dx,
            y: lastSegment.arcParams.dy,
          } as Point;
        } else {
          const len = lastSegment.data.length;
          lastPoint = lastSegment.data[len - 1]!;
        }

        const startPoint = lastPoint;
        const endPoint = data[2];
        const startControlPoint = data[0];
        const endControlPoint = data[1];
        ctx.beginPath();
        ctx.moveTo(startPoint.x + xOffset, startPoint.y + yOffset);
        ctx.lineTo(
          startControlPoint!.x + xOffset,
          startControlPoint!.y + yOffset,
        );
        ctx.strokeStyle = "#4eb2fd";
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(endPoint!.x + xOffset, endPoint!.y + yOffset);
        ctx.lineTo(endControlPoint!.x + xOffset, endControlPoint!.y + yOffset);
        ctx.strokeStyle = "#4eb2fd";
        ctx.stroke();
        ctx.closePath();
      }
    }
  };

  const drawOutline = (ctx: CanvasRenderingContext2D, path: Path2D) => {
    ctx.strokeStyle = "#3eadfd";
    ctx.lineWidth = 2 * (1 / scale.x);
    ctx.stroke(path);
  };

  const onPathsMove = (
    ctx: CanvasRenderingContext2D,
    dx: number,
    dy: number,
  ) => {
    if (!svg) return;
    const newSVG = [...svg];
    selectedPaths.map((selectedPath) => {
      const subSVG = newSVG[selectedPath];
      if (subSVG === null || subSVG === undefined) return;
      subSVG.offset.x += dx;
      subSVG.offset.y += dy;
      const newPath2D = pathToPath2D(subSVG);
      subSVG.shape.path2D = newPath2D;
    });

    setSVG(newSVG);
    clear();
    drawSVG(ctx, newSVG);
    drawSVGPoints(ctx, newSVG);
    ////onNewhistory()
  };

  const pathToPath2D = (path: SubSVG): Path2D => {
    const tag = path.tag;
    if (!path.shape.d) return new Path2D();
    const { d } = path.shape;
    const offset = path.offset;
    const dWithOffset = d.map((segment) => {
      if (segment.key !== "A")
        return {
          key: segment.key,
          data: segment.data.map((point) => {
            return { x: point.x + offset.x, y: point.y + offset.y };
          }),
        };
      else
        return {
          key: segment.key,
          arcParams: {
            rx: segment.arcParams.rx,
            ry: segment.arcParams.ry,
            rotation: segment.arcParams.rotation,
            largeArcFlag: segment.arcParams.largeArcFlag,
            sweepFlag: segment.arcParams.sweepFlag,
            dx: segment.arcParams.dx + offset.x,
            dy: segment.arcParams.dy + offset.y,
          },
        };
    });

    if (
      tag === "text" &&
      dWithOffset[0]?.key === "M" &&
      dWithOffset[1]?.key === "C"
    ) {
      // const startPoint = dWithOffset[0]?.data[0];
      // const middlePoint = dWithOffset[1]?.data[0];
      // const endPoint = dWithOffset[2]?.data[0];
      // dWithOffset.push({
      //   key: "L",
      //   data: [{ x: endPoint!.x, y: endPoint!.y - path.shape.size }],
      // });
      // dWithOffset.push({
      //   key: "L",
      //   data: [{ x: middlePoint!.x, y: middlePoint!.y - path.shape.size }],
      // });
      // dWithOffset.push({
      //   key: "L",
      //   data: [{ x: startPoint!.x, y: startPoint!.y - path.shape.size }],
      // });
      // dWithOffset.push({
      //   key: "Z",
      //   data: [],
      // });

      const endPoint = dWithOffset[1]?.data[2];
      const startControlPoint = dWithOffset[1]?.data[0];
      const endControlPoint = dWithOffset[1]?.data[1];
      const startPoint = dWithOffset[0]?.data[0];

      dWithOffset.push({
        key: "L",
        data: [{ x: endPoint!.x, y: endPoint!.y - path.shape.size }],
      });
      dWithOffset.push({
        key: "C",
        data: [
          { x: endControlPoint!.x, y: endControlPoint!.y - path.shape.size },
          {
            x: startControlPoint!.x,
            y: startControlPoint!.y - path.shape.size,
          },
          { x: startPoint!.x, y: startPoint!.y - path.shape.size },
        ],
      });
      dWithOffset.push({
        key: "Z",
        data: [],
      });
    }

    const pathString = svgPathToString(dWithOffset);
    // console.log("PathStirng", pathString);
    const path2D = new Path2D(pathString);
    return path2D;
  };

  const computePointOutsideCanvas = (point: Point) => {
    //ToDo : Take into account the scale
    const ctx = canvasRef.current?.getContext("2d");
    return { x: point.x + panOffset.x, y: point.y + panOffset.y };
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
    setSelectedDraw(null);
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
    ////onNewhistory()
  };

  const stringToSVGandPath2Ds = (svgString: string): { svg: SVG } => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, "image/svg+xml");
    const paths = Array.from(doc.querySelectorAll("path"));
    const svg: SVG = paths.map((path) => {
      const dString = path.getAttribute("d");
      const transform = path.getAttribute("transform");

      const transformObject = {
        translate: [0, 0],
      };

      let path2D = null;
      let xMax = 0;
      let xMin = 0;
      let yMax = 0;
      let yMin = 0;
      let xOffSet = 0;
      let yOffSet = 0;
      const rotation = 0;

      if (transform) {
        //get translate from the transform property
        const match = transform.match("translates*(s*([^,]+)s*,s*([^)]+)s*)");
        if (match !== null && match?.length === 4) {
          const x = parseFloat(match[2]!.slice(1));
          const y = parseFloat(match[3]!);
          xOffSet = x;
          yOffSet = y;
          transformObject.translate = [x, y];
        }
      }

      if (dString) {
        const dStringWithTransform = new SVGPathCommander(dString)
          .transform(transformObject)
          .toString();
        const p = new Path2D(dStringWithTransform);
        path2D = p;

        const bBox = new SVGPathCommander(dString).getBBox();
        xMax = bBox.x2;
        xMin = bBox.x;
        yMax = bBox.y2;
        yMin = bBox.y;
      }

      //right now the path2DsTemp does not take into account the transform property. Fix this.

      const dSegments = normalize(absolutize(parsePath(dString ?? "")));
      const d = dSegments.map((segment) => {
        const key = segment.key;

        if (key === "M") {
          return {
            key: "M",
            data: [
              {
                x: segment.data[0]!,
                y: segment.data[1]!,
              },
            ],
          } as AbsoluteSegment;
        }

        if (key === "L") {
          return {
            key: "L",
            data: [
              {
                x: segment.data[0]!,
                y: segment.data[1]!,
              },
            ],
          } as AbsoluteSegment;
        }
        if (key === "Z") {
          return {
            key: "Z",
            data: [],
          } as AbsoluteSegment;
        }

        if (key === "A") {
          return {
            key: "A",
            arcParams: {
              rx: segment.data[0]!,
              ry: segment.data[1]!,
              rotation: segment.data[2]!,
              largeArcFlag: segment.data[3]!,
              sweepFlag: segment.data[4]!,
              dx: segment.data[5]!,
              dy: segment.data[6]!,
            },
          } as AbsoluteSegment;
        }

        //key is C
        else {
          return {
            key: "C",
            data: [
              {
                x: segment.data[0]!,
                y: segment.data[1]!,
              },
              {
                x: segment.data[2]!,
                y: segment.data[3]!,
              },
              {
                x: segment.data[4]!,
                y: segment.data[5]!,
              },
            ],
          } as AbsoluteSegment;
        }
      });
      const fill = path.getAttribute("fill") ?? "black";
      const shape: Path = {
        d: d,
        path2D: path2D,
      };
      const offset = { x: xOffSet, y: yOffSet };
      const tag = "path";
      const stroke = path.getAttribute("stroke") ?? "black";
      return {
        shape,
        tag,
        fill,
        offset,
        xMin,
        xMax,
        yMin,
        yMax,
        rotation,
        stroke,
      };
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
    if (selectedPaths.length !== 0) drawBoundingBox(ctx, selectedPaths);
    // drawBoundingBox(ctx, selectedPath);
    const newSVG = [...svg];
    newSVG.reverse().some((subSVG, i) => {
      const path2D = subSVG.shape.path2D;
      if (!path2D) {
        console.log("no path 2d");
        return;
      }
      if (ctx.isPointInPath(path2D, currentPoint.x, currentPoint.y)) {
        drawOutline(ctx, path2D);
        return true;
      } else {
        return false;
      }
    });

    //When hovering over points, change color
    if (!isEditing) return;
    point2Ds.some((point2D) => {
      point2D.some((point2D) => {
        if (ctx.isPointInPath(point2D, currentPoint.x, currentPoint.y)) {
          ctx.fillStyle = "#3eadfd";
          ctx.fill(point2D);
          return true;
        } else {
          return false;
        }
      });
    });
  }

  function onPointMove(ctx: CanvasRenderingContext2D, dx: number, dy: number) {
    if (!svg) return;
    if (selectedPaths.length !== 1) return;
    if (selectedPoint === null) return;

    const selectedPath = selectedPaths[0];
    if (selectedPath === undefined) return;

    const svgSelectedPath = svg[selectedPath];
    if (svgSelectedPath === undefined) return;

    const segment = svgSelectedPath.shape.d[selectedPoint[0]![0]];
    if (segment?.key === "A") return;

    // segment?.data.map((point) => {
    //   point.x += dx;
    //   point.y += dy;
    // });
    // Instead of moving all the points in the curve, move the selected point
    const point = segment?.data[selectedPoint[0]![1]];
    if (!point) return;
    point.x += dx;
    point.y += dy;

    type Segment = {
      key: string;
      data: number[];
    };
    const newPath: Segment[] = [];

    svgSelectedPath.shape.d.map((segment) => {
      const data: number[] = [];
      const key = segment.key;
      if (key === "A") return;
      const xOffSet = svgSelectedPath.offset.x;
      const yOffSet = svgSelectedPath.offset.y;
      segment.data.map((point) => {
        data.push(point.x + xOffSet, point.y + yOffSet);
      });

      newPath.push({ key: key, data: data });
    });

    const newPath2D = new Path2D(serialize(newPath));
    svgSelectedPath.shape.path2D = newPath2D;

    clear();
    drawSVG(ctx, svg);
    drawSVGPoints(ctx, svg);

    // const newString = serialize(newPath);
    if (selectedPath === null) return;

    const newBbox = getBBox(svg[selectedPath]!.shape);
    svgSelectedPath.xMax = newBbox.x2;
    svgSelectedPath.xMin = newBbox.x;
    svgSelectedPath.yMax = newBbox.y2;
    svgSelectedPath.yMin = newBbox.y;

    ////onNewhistory()
  }

  type BBox = {
    x: number;
    y: number;
    x2: number;
    y2: number;
  };
  const getBBox = (path: Path | TextContent): BBox => {
    if (!path) return { x: 0, y: 0, x2: 0, y2: 0 };

    //TODO : When segment is 'A'

    if (path.d[0]?.key === "A") return { x: 0, y: 0, x2: 0, y2: 0 };

    let x = path.d[0]?.data[0]?.x ?? 0;
    let y = path.d[0]?.data[0]?.y ?? 0;
    let x2 = path.d[0]?.data[0]?.x ?? 0;
    let y2 = path.d[0]?.data[0]?.y ?? 0;
    path.d.map((segment) => {
      if (segment.key === "A") return;
      segment.data.map((point) => {
        x = Math.min(x, point.x);
        y = Math.min(y, point.y);
        x2 = Math.max(x2, point.x);
        y2 = Math.max(y2, point.y);
      });
    });
    return { x, y, x2, y2 };
  };

  const filePopUpRef = useRef<HTMLDivElement | null>(null);
  const aiPopUpRef = useRef<HTMLDivElement | null>(null);

  // useEffect(() => {

  // }, []);

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

    if (!prevPoint) {
      return;
    }

    //TODO : Change the selectedPaths only when the mouse is released
    if (!isEditing && selectedPaths.length === 0) {
      const calculatedPoint = {
        x: (currentPoint.x - panOffset.x) * (1 / scale.x),
        y: (currentPoint.y - panOffset.y) * (1 / scale.y),
      };
      const calculatedSelectPoint = {
        x: (selectPoint!.x - panOffset.x) * (1 / scale.x),
        y: (selectPoint!.y - panOffset.y) * (1 / scale.y),
      };
      if (!calculatedPoint) {
        console.log("current point is null");
        return;
      }
      if (!selectPoint) {
        console.log("add point is null");
        return;
      }

      if (!svg) {
        console.log("svg is null");
        return;
      }

      ctx.beginPath();
      ctx.rect(
        calculatedSelectPoint.x,
        calculatedSelectPoint.y,
        calculatedPoint.x - calculatedSelectPoint.x,
        calculatedPoint.y - calculatedSelectPoint.y,
      );
      ctx.closePath();
      ctx.fillStyle = "#eaf5ff";
      ctx.fill();

      drawSVG(ctx, svg);

      return;
    }

    if (isEditing && selectedPoint !== null) {
      const dx = (currentPoint.x - prevPoint.x) * (1 / scale.x);
      const dy = (currentPoint.y - prevPoint.y) * (1 / scale.y);
      onPointMove(ctx, dx, dy);
      return;
    }

    if (selectedBoundingBoxPoint !== null) {
      selectedPaths.map((selectedPath) => {
        onPathExpand(
          ctx,
          svg[selectedPath]!.shape.path2D!,
          (currentPoint.x - prevPoint.x) * (1 / scale.x),
          (currentPoint.y - prevPoint.y) * (1 / scale.y),
          selectedBoundingBoxPoint,
        );
      });

      return;
    }

    if (selectedRotatePoint !== false) {
      selectedPaths.map((selectedPath) => {
        onPathRotate(
          ctx,
          svg[selectedPath]!.shape.path2D!,
          (currentPoint.x - prevPoint.x) * (1 / scale.x),
          (currentPoint.y - prevPoint.y) * (1 / scale.y),
          prevPoint.x * (1 / scale.x) - panOffset.x,
          prevPoint.y * (1 / scale.y) - panOffset.y,
        );
      });

      return;
    }

    const dx = (currentPoint.x - prevPoint.x) * (1 / scale.x);
    const dy = (currentPoint.y - prevPoint.y) * (1 / scale.y);

    if (selectedPaths.length > 0) {
      onPathsMove(ctx, dx, dy);
      return;
    }
  }

  const onDeletePaths = () => {
    if (!svg) return;
    const newSVG = svg.filter((_, i) => !selectedPaths.includes(i));
    setSVG(newSVG);
    setSelectedPaths([]);
    setSelectedPoint(null);
    clear();
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    drawSVG(ctx, newSVG);
    drawSVGPoints(ctx, newSVG);
    ////onNewhistory()
  };

  const handleSort = () => {
    if (!svg) return;
    const newSVG = [...svg];
    const temp: SubSVG = newSVG[dragLayer.current ?? 0]!;
    newSVG[dragLayer.current ?? 0] = newSVG[dragOverLayer.current ?? 0]!;
    newSVG[dragOverLayer.current ?? 0] = temp;
    setSVG(newSVG);
    setSelectedPaths([dragOverLayer.current ?? 0]);
    ////onNewhistory()
  };

  // const onDeletePath = () => {
  //   if (selectedPaths.length === 0) return;
  //   if (!svg) return;

  //   const newSVG = [...svg];
  //   // newSVG.splice(selectedPath, 1);
  //   setSVG(newSVG);
  //   setSelectedPaths([]);
  //   setSelectedPoint(null);
  //   clear();

  //   const ctx = canvasRef.current?.getContext("2d");
  //   if (!ctx) return;
  //   drawSVG(ctx, newSVG);
  //   drawSVGPoints(ctx, newSVG);
  // };

  const onMouseDownWrapper = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsMouseDown(true);
    if (tool === "hand") {
      onMouseDown();
    }
    if (tool === "select") {
      onSelectMouseDown(e);
    }
    if (isRightClicked !== null) setIsRightClicked(null);
    if (tool === "add") {
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;
      if (!addShape) return;
      onAddSelect(ctx, computePointInCanvas(e)!, addShape);
    }
    if (tool === "draw") {
      onDrawMouseDown(e);
    }
    if (tool === "draw" && isBending) {
      onBendMouseDown(e);
    }
  };

  const onMouseUpWrapper = (e: React.MouseEvent<HTMLCanvasElement>) => {
    //onNewhistory()

    setIsMouseDown(false);
    onSelectMouseUp();
    handMouseUpHandler();
    setBoundingPoint2D(null);

    if (selectPoint !== null && selectedPaths.length === 0) {
      // calculate if the box contains any paths, set selected paths
      if (!svg) return;
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;
      const currentPoint = computePointInCanvas(e);
      if (!currentPoint) return;
      const calculatedPoint = {
        x: (currentPoint.x - panOffset.x) * (1 / scale.x),
        y: (currentPoint.y - panOffset.y) * (1 / scale.y),
      };
      const calculatedSelectPoint = {
        x: (selectPoint.x - panOffset.x) * (1 / scale.x),
        y: (selectPoint.y - panOffset.y) * (1 / scale.y),
      };
      const newSelectedPaths: number[] = [];
      svg.map(({ xMax, xMin, yMax, yMin, offset }, i) => {
        const biggerSelectX = Math.max(
          calculatedPoint.x,
          calculatedSelectPoint.x,
        );
        const smallerSelectX = Math.min(
          calculatedPoint.x,
          calculatedSelectPoint.x,
        );
        const biggerSelectY = Math.max(
          calculatedPoint.y,
          calculatedSelectPoint.y,
        );
        const smallerSelectY = Math.min(
          calculatedPoint.y,
          calculatedSelectPoint.y,
        );
        if (
          ((yMin + offset.y < smallerSelectY &&
            yMax + offset.y > smallerSelectY) ||
            (yMin + offset.y < biggerSelectY &&
              yMax + offset.y > biggerSelectY) ||
            (yMin + offset.y > smallerSelectY &&
              yMax + offset.y < biggerSelectY)) &&
          ((xMin + offset.x < smallerSelectX &&
            xMax + offset.x > smallerSelectX) ||
            (xMin + offset.x < biggerSelectX &&
              xMax + offset.x > biggerSelectX) ||
            (xMin + offset.x > smallerSelectX &&
              xMax + offset.x < biggerSelectX))
        ) {
          newSelectedPaths.push(i);
        }
      });
      setSelectedPaths(newSelectedPaths);

      //for each path, draw outline
      newSelectedPaths.map((i) => {
        const path2D = svg[i]!.shape.path2D;
        if (!path2D) return;
        drawOutline(ctx, path2D);
      });
      drawBoundingBox(ctx, newSelectedPaths);
      setSelectPoint(null);
    }

    if (tool === "add") {
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;
      onAddUp(ctx, e);
    }
  };

  const onMouseMoveWrapper = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool === "select") {
      onSelectMouseMove(e);
    }
    if (tool === "hand") {
      handMouseMoveHandler(e);
    }
    if (tool === "add") {
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;
      onAddMove(ctx, e);
    }
    if (tool === "draw") {
      onDrawMouseMove(e);
    }
    if (tool === "draw" && isBending) {
      onBendMouseMove(e);
    }
  };
  const [linePath2Ds, setLinePath2Ds] = useState<Path2D[]>([]);

  const [isBending, setIsBending] = useState(false);

  const onBendMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    //check linePath2Ds, if the point is inside a line, turn the line into a curve
    //else do nothing
    if (!svg) return;
    if (svg.length === 0) return;
    if (!isBending && tool !== "draw") return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const currentPoint = computePointInCanvas(e);
    if (!currentPoint) return;
    const offset = { x: panOffset.x, y: panOffset.y };
    const xOffSet = offset.x;
    const yOffSet = offset.y;
    const x = currentPoint.x;
    const y = currentPoint.y;
    let selectedLine = -1;
    console.log(linePath2Ds);
    linePath2Ds.map((linePath2D, i) => {
      if (ctx.isPointInPath(linePath2D, x, y)) {
        selectedLine = i;
      }
    });
    console.log("I IS", selectedLine);
    if (selectedLine === -1) return;
    const path = svg[svg.length - 1]!;
    const d = path.shape.d;
    let segment = d[selectedLine + 1]!;
    if (segment.key === "C") return;
    if (segment.key === "A") return;

    if (d[selectedLine]!.key === "A") return;
    if ("arcParams" in d[selectedLine]!) return;
    const selectedAbsoluteSegment = d[selectedLine]!;
    if (!("data" in selectedAbsoluteSegment)) return;

    const lastPoint = selectedAbsoluteSegment.data[0]!;
    const firstAbsoluteSegment = d[0]!;
    if (!("data" in firstAbsoluteSegment)) return;
    let endPoint = firstAbsoluteSegment.data[0]!;

    const currentAbsoluteSegment = d[selectedLine + 1]!;
    if (
      "data" in currentAbsoluteSegment &&
      currentAbsoluteSegment.key !== "Z"
    ) {
      endPoint = currentAbsoluteSegment.data[0]!;
    }
    const startControlPoint = {
      x: (lastPoint.x + endPoint.x) / 2,
      y: (lastPoint.y + endPoint.y) / 2,
    };
    const endControlPoint = {
      x: (lastPoint.x + endPoint.x) / 2,
      y: (lastPoint.y + endPoint.y) / 2,
    };
    segment = {
      key: "C",
      data: [startControlPoint, endControlPoint, endPoint],
    };
    d[selectedLine + 1] = segment;
    ////onNewhistory()
  };

  const onBendMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isBending) return;
    if (!svg) return;
    if (svg.length === 0) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const currentPoint = computePointInCanvas(e);
    if (!currentPoint) return;
    const path = svg[svg.length - 1]!;

    let selectedLine = -1;
    linePath2Ds.map((linePath2D, i) => {
      if (ctx.isPointInPath(linePath2D, currentPoint.x, currentPoint.y)) {
        selectedLine = i;
      }
    });

    clear();
    drawSVG(ctx, svg);
    drawDrawPoints(ctx, svg[svg.length - 1]!);
    if (selectedLine === -1) return;
    ctx.fillStyle = "#3eadfd";
    ctx.fill(linePath2Ds[selectedLine]!);
  };

  // ------------------- Draw Tool -------------------
  const onDrawMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // If the new path is empty, add a 'M', Else add a 'L'
    if (!isDrawing) return;
    if (!svg) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    if (svg.length === 0) return;
    const path = svg[svg.length - 1];
    if (path === undefined) return;
    let { x, y } = computePointInCanvas(e)!;
    x = (x - panOffset.x) * (1 / scale.x);
    y = (y - panOffset.y) * (1 / scale.y);
    // const offset = { x: panOffset.x, y: panOffset.y };
    // const xOffSet = offset.x;
    // const yOffSet = offset.y;
    const d = path.shape.d;

    if (d.length !== 0 && d[d.length - 1]!.key === "Z") {
      const newPath: AbsoluteSegment[] = [];
      const newPath2D = new Path2D("");
      const newSVG = [...svg];
      const { x, y } = computePointInCanvas(e)!;
      newSVG.push({
        tag: "path",
        shape: { path2D: newPath2D, d: newPath },
        xMax: x,
        xMin: x,
        yMax: y,
        yMin: y,
        rotation: 0,
        offset: { x: 0, y: 0 },
        fill: "white",
        stroke: "black",
      });
      setSVG(newSVG);
      ////onNewhistory()
      setLinePath2Ds([]);
    } else if (d.length === 0) {
      d.push({
        key: "M",
        data: [
          {
            x: x,
            y: y,
          },
        ],
      });
    }
    //make the path2Ds of the Points if it's not the first point
    else {
      const pointPath2Ds = d.map((segment) => {
        if (segment.key === "A") return new Path2D();
        const point = segment.data[0]!;

        const point2D = new Path2D();
        point2D.arc(point.x, point.y, 5, 0, 2 * Math.PI);
        return point2D;
      });

      let selectedEndPoint = -1;
      pointPath2Ds.map((point2D, i) => {
        if (point2D) {
          if (ctx.isPointInPath(point2D, x, y)) {
            selectedEndPoint = i;
          }
        }
      });
      if (selectedEndPoint !== -1) {
        d.push({
          key: "Z",
          data: [],
        });

        //Create a path2D of this new line, and add it to the linePath2Ds
        const newPath2D = new Path2D();
        //move it to the last point

        const startSegment = d[d.length - 2]!;
        if (!("data" in startSegment)) return;
        const startPoint = startSegment.data[0]!;

        const endSegment = d[0]!;
        if (!("data" in endSegment)) return;
        const endPoint = endSegment.data[0]!;

        const thickness = 10;
        const angle = Math.atan2(
          endPoint.y - startPoint.y,
          endPoint.x - startPoint.x,
        );
        const offsetX = (thickness / 2) * Math.sin(angle);
        const offsetY = (thickness / 2) * Math.cos(angle);

        newPath2D.moveTo(startPoint.x - offsetX, startPoint.y + offsetY);
        newPath2D.lineTo(startPoint.x + offsetX, startPoint.y - offsetY);
        newPath2D.lineTo(endPoint.x + offsetX, endPoint.y - offsetY);
        newPath2D.lineTo(endPoint.x - offsetX, endPoint.y + offsetY);
        newPath2D.closePath();
        //Draw a rectangle of width 8

        linePath2Ds.push(newPath2D);
      } else {
        d.push({
          key: "L",
          data: [{ x: x, y: y }],
        });
        //Create a path2D of this new line, and add it to the linePath2Ds
        const newPath2D = new Path2D();
        //move it to the last point

        const startSegment = d[d.length - 2]!;
        if (!("data" in startSegment)) return;
        const startPoint = startSegment.data[0]!;
        const endSegment = d[d.length - 1]!;
        if (!("data" in endSegment)) return;
        const endPoint = endSegment.data[0]!;

        const thickness = 10;
        const angle = Math.atan2(
          endPoint.y - startPoint.y,
          endPoint.x - startPoint.x,
        );
        const offsetX = (thickness / 2) * Math.sin(angle);
        const offsetY = (thickness / 2) * Math.cos(angle);

        newPath2D.moveTo(startPoint.x - offsetX, startPoint.y + offsetY);
        newPath2D.lineTo(startPoint.x + offsetX, startPoint.y - offsetY);
        newPath2D.lineTo(endPoint.x + offsetX, endPoint.y - offsetY);
        newPath2D.lineTo(endPoint.x - offsetX, endPoint.y + offsetY);
        newPath2D.closePath();
        //Draw a rectangle of width 8

        linePath2Ds.push(newPath2D);
      }
    }

    const clickedSegment = path.shape.d[0]!;
    if (!("data" in clickedSegment)) return;
    const clickedData = clickedSegment.data[0]!;
    let newXmin = clickedData.x;
    let newXmax = clickedData.x;
    let newYmin = clickedData.y;
    let newYmax = clickedData.y;

    //calculate new bounding box
    path.shape.d.map((segment) => {
      if (segment.key === "A") return;
      segment.data.map((point) => {
        newXmin = Math.min(newXmin, point.x);
        newXmax = Math.max(newXmax, point.x);
        newYmin = Math.min(newYmin, point.y);
        newYmax = Math.max(newYmax, point.y);
      });
    });

    path.xMin = newXmin;
    path.xMax = newXmax;
    path.yMin = newYmin;
    path.yMax = newYmax;

    const newPath2D = pathToPath2D(path);
    path.shape.path2D = newPath2D;
    if (!ctx) return;

    ctx.lineWidth = 2 * (1 / scale.x);

    clear();
    drawSVG(ctx, svg);
    ////onNewhistory()
  };
  const drawPoint = (ctx: CanvasRenderingContext2D, point: Point) => {
    ctx.beginPath();
    ctx.lineWidth = 2 * (1 / scale.x);
    ctx.arc(point.x, point.y, 5 * (1 / scale.x), 0, 2 * Math.PI);
    ctx.strokeStyle = "#3eadfd";
    ctx.stroke();
  };

  const getDimensionsOfSelectedPaths = () => {
    if (
      !svg ||
      selectedPaths.length === 0 ||
      selectedPaths[0] === undefined ||
      selectedPaths[0] === null ||
      svg[selectedPaths[0]] === undefined
    )
      return {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
      };
    let minX = svg[selectedPaths[0]]!.xMin + svg[selectedPaths[0]]!.offset.x;
    let minY = svg[selectedPaths[0]]!.yMin + svg[selectedPaths[0]]!.offset.y;
    let maxX = svg[selectedPaths[0]]!.xMax + svg[selectedPaths[0]]!.offset.x;
    let maxY = svg[selectedPaths[0]]!.yMax + svg[selectedPaths[0]]!.offset.y;
    selectedPaths.map((selectedPath) => {
      const path = svg[selectedPath];
      if (path === undefined) return;
      minX = Math.min(minX, path.xMin + path.offset.x);
      minY = Math.min(minY, path.yMin + path.offset.y);
      maxX = Math.max(maxX, path.xMax + path.offset.x);
      maxY = Math.max(maxY, path.yMax + path.offset.y);
    });

    return {
      x: minX,
      y: minY,
      w: maxX - minX,
      h: maxY - minY,
    };
  };

  const drawDrawPoints = (ctx: CanvasRenderingContext2D, subSVG: SubSVG) => {
    const offset = subSVG.offset;
    const xOffSet = offset.x;
    const yOffSet = offset.y;
    const d = subSVG.shape.d;
    d.map((segment) => {
      if (segment.key === "A") return;
      segment.data.map((point) => {
        drawPoint(ctx, { x: point.x + xOffSet, y: point.y + yOffSet });
      });
    });
  };

  const onDrawMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // 1. If the new path is not empty, Draw a line from the last point to the current point
    // 2. If the new path is empty, do nothing
    // 3. Draw a circle at the current point

    if (!isDrawing) return;
    if (!svg) return;
    const computedPoint = computePointInCanvas(e);
    if (!computedPoint) return;
    const { x, y } = computedPoint;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    clear();
    drawSVG(ctx, svg);
    drawDrawPoints(ctx, svg[svg.length - 1]!);

    //draw line
    const path = svg[svg.length - 1];
    if (path === undefined) return;
    const offset = { x: panOffset.x, y: panOffset.y };
    const xOffSet = offset.x;
    const yOffSet = offset.y;
    const d = path.shape.d;
    if (d.length === 0) return;
    drawPoint(ctx, {
      x: (x - panOffset.x) * (1 / scale.x),
      y: (y - panOffset.y) * (1 / scale.y),
    });

    //FIX : ERROR
    if (d[d.length - 1]?.key === "A") return;
    const lastAbsoluteSegment = d[d.length - 1]!;
    if ("arcParams" in lastAbsoluteSegment || lastAbsoluteSegment.key === "Z")
      return;
    const lastPoint = lastAbsoluteSegment.data[0]!;

    ctx.lineWidth = 2 * (1 / scale.x);
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(
      (x - panOffset.x) * (1 / scale.x),
      (y - panOffset.y) * (1 / scale.y),
    );
    ctx.strokeStyle = "#3eadfd";
    ctx.stroke();
    ctx.closePath();
    ctx.lineWidth = 2;
  };

  const renderFont = () => {
    if (!svg) return null;
    if (selectedPaths.length !== 1) return null;
    if (selectedPaths[0] === undefined) return null;
    const selectedPath = svg[selectedPaths[0]];
    if (selectedPath === undefined) return null;
    if (selectedPath.tag !== "text") return null;
    return selectedPath.shape.font;
  };

  const renderFontSize = () => {
    if (!svg) return null;
    if (selectedPaths.length !== 1) return null;
    if (selectedPaths[0] === undefined) return null;
    const selectedPath = svg[selectedPaths[0]];
    if (selectedPath === undefined) return null;
    if (selectedPath.tag !== "text") return null;
    return selectedPath.shape.size;
  };

  const [selectedFont, setSelectedFont] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedFont(event.target.value);
    if (!svg) return;
    if (selectedPaths.length !== 1) return;
    if (selectedPaths[0] === undefined) return;
    const selectedPath = svg[selectedPaths[0]];
    if (selectedPath === undefined) return;
    if (selectedPath.tag !== "text") return;
    selectedPath.shape.font = event.target.value;
    const newSVG = [...svg];
    newSVG[selectedPaths[0]] = selectedPath;
    setSVG(newSVG);
    console.log("font is", event.target.value);
  };
  //Also, when the tool is draw, draw the svgPoints of the current path that is being drawn
  // ------------------- Draw Tool -------------------

  useEffect(() => {
    //the textarea hans't been rendered yet so there's no textareaRef.current yet we should put this in a useEffect

    if (selectedPaths.length !== 1) return;
    if (!isEditingText) return;
    if (!textareaRef.current) return;

    const selectedPath = selectedPaths[0];
    if (selectedPath === undefined) return;

    const { x, y } = computePointOutsideCanvas({
      x: svg![selectedPath]!.xMin + svg![selectedPath]!.offset.x,
      y: svg![selectedPath]!.yMin + svg![selectedPath]!.offset.y,
    });

    const width = svg![selectedPath]!.xMax - svg![selectedPath]!.xMin;
    const height = svg![selectedPath]!.yMax - svg![selectedPath]!.yMin;

    textareaRef.current?.style.setProperty("left", x.toString() + "px");
    textareaRef.current?.style.setProperty("top", y.toString() + "px");
    textareaRef.current?.style.setProperty("display", "block");
    textareaRef.current?.style.setProperty("width", width.toString() + "px");
    textareaRef.current?.style.setProperty("height", height.toString() + "px");
    textareaRef.current?.style.setProperty("font-size", "64px");

    setTextareaPosition({ x: x, y: y });
  }, [textareaRef.current]);

  const onSelectRightClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (selectedPaths.length === 0) return;
    setIsRightClicked({ x: e.clientX, y: e.clientY });
  };

  const onRightClickWrapper = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    onSelectRightClick(e);
    onSelectMouseUp();
  };

  const [colorPicker, setColorPicker] = useState<boolean>(false);
  const handleColorChange = (e: string) => {
    setColor(e);
    if (!svg) return;
    // if (selectedPaths.length !== 1) return;
    selectedPaths.map((selectedPath) => {
      const svgSelectedPath = svg[selectedPath];
      if (svgSelectedPath === undefined) return;
      svgSelectedPath.fill = e;
    });

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    drawSVG(ctx, svg);
    ////onNewhistory()
  };

  const [profileIsCredits, setProfileIsCredits] = useState<boolean>(true);

  return (
    <div
      className={`  flex h-screen w-screen items-center justify-center bg-[#F3F4F6] ${modak.variable} ${pacifico.variable}`}
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
            className={`absolute z-20 flex w-32 flex-col gap-2 rounded-md bg-[#1e1e1e] p-2  text-xs font-light text-white shadow-md`}
            style={{
              position: "absolute",
              top: isRightClicked.y,
              left: isRightClicked.x,
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                if (selectedPaths.length !== 1) return;

                //check the selected path to see if it's an Elipse
                let hasCircle = false;
                if (!svg) return;
                if (selectedPaths[0] === undefined) return;
                const selectedPath = svg[selectedPaths[0]];
                if (selectedPath === undefined) return;
                const d = selectedPath.shape.d;
                d.map((segment) => {
                  if (segment.key === "A") hasCircle = true;
                });
                setIsRightClicked(null);
                if (hasCircle) return;

                setIsEditing(true);
              }}
              className="flex flex-row justify-start rounded-md p-1 hover:bg-[#2c2c2c]"
            >
              Edit
            </button>
            {selectedPaths.length === 1 &&
              svg![selectedPaths[0] ?? 0]!.tag === "text" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setIsEditingText(true);

                    setIsRightClicked(null);
                  }}
                  className="flex flex-row justify-start rounded-md p-1 hover:bg-[#2c2c2c]"
                >
                  Edit Text
                </button>
              )}
            {selectedPaths !== null && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onDeletePaths();
                  setIsRightClicked(null);
                }}
                className="flex flex-row justify-start rounded-md p-1 hover:bg-[#2c2c2c]"
              >
                Delete
              </button>
            )}
          </div>
        ) : null}

        <div className="flex h-[80px]  w-full flex-none justify-between p-[20px]">
          <Link
            className={` ${just.className} z-10 flex items-center justify-center rounded-xl bg-red-400 px-2 pt-1 text-center text-[20px] leading-snug text-white`}
            href="/"
          >
            LOGOAI
          </Link>
          <div className="relative z-10 flex h-full flex-row gap-4">
            {guideIndex === 4 && (
              <div className="absolute  top-full translate-y-4">
                <Guidebox
                  isOpened={true}
                  guideIndex={5}
                  guideLength={5}
                  onNext={() => {
                    console.log("next");
                    setGuideIndex(-1);
                    setSelectedDraw(null);
                  }}
                  onSkip={() => {
                    setGuideIndex(-1);
                  }}
                  guideTitle="Add Shapes"
                  guideDescription="By clicking on the shapes and dragging them to the canvas, you can add shapes to your logo"
                ></Guidebox>
              </div>
            )}
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
                      <AnimatePresence>
                        <motion.div initial={{ y: -20 }} animate={{ y: 0 }}>
                          <Generate onSVGComplete={onSVGComplete}></Generate>
                        </motion.div>
                      </AnimatePresence>
                      {guideIndex === 0 && (
                        <div className="absolute right-12 top-0 -translate-x-full">
                          <Guidebox
                            isOpened={true}
                            guideIndex={1}
                            guideLength={5}
                            onNext={() => {
                              console.log("next");
                              setGuideIndex(1);

                              setSelectedDraw("fileInput");
                            }}
                            onSkip={() => {
                              setGuideIndex(-1);
                            }}
                            guideTitle="Generate Logo"
                            guideDescription="You can Generate Logos for your brand by clicking on the Start Button"
                          ></Guidebox>
                        </div>
                      )}
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
                    <AnimatePresence>
                      <motion.div
                        initial={{ y: 4 }}
                        animate={{ y: 24 }}
                        className="absolute left-0 top-full z-10 flex w-60 translate-y-6 items-center justify-center rounded-lg bg-white p-4 shadow-md"
                      >
                        <input
                          type="file"
                          accept=".svg"
                          onChange={(e) => handleFileChange(e)}
                          className="absolute h-full w-60 appearance-none opacity-0"
                          ref={fileInputRef}
                        />
                        <div className="h-full w-full flex-col items-center rounded-md border-2 border-dashed bg-[#f1f5fb] p-2 font-[geist] text-[14px]">
                          <div className="mb-1 flex w-full items-center justify-center">
                            <svg
                              version="1.0"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 48 48"
                              enable-background="new 0 0 48 48"
                              width={36}
                              height={36}
                            >
                              <path
                                fill="#4053f7"
                                d="M40,12H22l-4-4H8c-2.2,0-4,1.8-4,4v8h40v-4C44,13.8,42.2,12,40,12z"
                              />
                              <path
                                fill="#4053f7"
                                d="M40,12H8c-2.2,0-4,1.8-4,4v20c0,2.2,1.8,4,4,4h32c2.2,0,4-1.8,4-4V16C44,13.8,42.2,12,40,12z"
                              />
                            </svg>
                          </div>
                          <div className="mb-2 flex w-full items-center justify-center font-medium">
                            Drag and Drop Files
                          </div>
                          <div className="mb-2.5 flex w-full items-center justify-center text-xs font-medium text-slate-500">
                            OR
                          </div>
                          <div className="flex w-full items-center justify-center">
                            <button className="rounded-md bg-[#4053f7] p-2 text-white">
                              Browse Files
                            </button>
                          </div>
                        </div>
                      </motion.div>
                      {guideIndex === 1 && (
                        <div className="absolute top-full -translate-x-44 translate-y-6">
                          <Guidebox
                            isOpened={true}
                            guideIndex={2}
                            guideLength={5}
                            onNext={() => {
                              console.log("next");
                              setGuideIndex(2);
                              setSelectedDraw(null);
                              // download an svg file from the directory, set it as svg

                              const result =
                                '<svg xmlns="http://www.w3.org/2000/svg" version="1.0" viewBox="512 512 1536 1536" width="600" height="600"><path fill="#FF0080" stroke="#FF0080" stroke-width="10" d="M512 1024v512h1024V512H512zm522-397.4c23.7 4.5 43.2 15.2 60.1 33.2 18.6 19.8 29.5 44.2 31.5 70.4l.7 8.7 8.6-6.4c16.9-12.6 26.8-17.7 41.9-21.6 44.7-11.4 89.1 5.7 116.7 45 20 28.7 25.9 68.2 15.3 104.6-2.6 9.1-11.7 27.6-16.6 34.1l-4 5.1 5.7 1.7c3.1 1 9.2 3.7 13.6 6.1 4.4 2.3 11.4 5.7 15.7 7.4 21.8 9.1 44.7 31 56.2 53.9 14.1 28 16.3 63.5 5.9 94.2-11.5 33.6-39.2 61.5-71.4 71.9-7.5 2.5-21.7 5.1-27.2 5.1h-3.9l4 4.7c12.8 15.4 21.1 33.8 25.8 57.3 2 10.1 1.5 31.8-1 44-9 44.4-40.3 78.4-82.4 89.5-13.4 3.6-35.3 3.8-49.2.6-17.3-4-36.3-14.1-49.6-26.3l-4.1-3.8-.6 9c-1.9 26.6-12.9 51.1-32.1 71.7-32 34.2-81.1 43.8-123.1 23.9-12.6-5.9-20.2-11.6-31.6-23.3-14.3-14.8-23-29.5-28.5-48.3-2.2-7.3-5.3-25.7-5.4-31.4 0-1.4-1.3-.6-5.5 3.2-6.1 5.6-16.4 12.7-24.2 16.6-15.2 7.6-29.3 10.9-47.3 10.9-17.4 0-29-2.6-46.5-10.4-13.1-5.8-29.8-19.9-40.6-34.2-29.7-39.4-31.1-98.3-3.3-139.4 2.6-3.7 5.9-8.2 7.5-9.8 1.6-1.7 2.9-3.4 2.9-3.8s-1.7-.7-3.7-.7c-10 0-29.7-5.1-40.6-10.6-16.3-8.2-35.3-25.2-45.1-40.3-22.3-34.6-25.3-80.8-7.8-117.6 6.5-13.4 11.3-20.4 21.8-31.4 15.1-15.9 31.8-25.8 51.4-30.5 4.1-1 10-2.9 13.1-4.2s6.2-2.4 6.8-2.4c1.5 0 1.4-1.5-.4-3-2.4-2-11.5-16.9-15.1-24.6-7.4-16.2-10.8-32.3-10.8-50.9 0-34.4 11.9-63.2 35.7-86.2 13.6-13.2 25.5-20.5 41.2-25.6 12.4-4 19-5 33-5s20.6 1 33 5c14 4.5 28.5 12.9 39.1 22.5 3 2.8 5.4 4.4 5.4 3.6 0-2.9 2.1-18.5 3.1-23.3 6.9-32.5 27.7-60.9 56.3-77.2 19.8-11.3 47.4-16 69.6-11.7z"/><path fill="#400000" stroke="#400000" stroke-width="10" d="M973.5 850.5c0 35.7.1 50.2.2 32.2.2-18.1.2-47.3 0-65-.1-17.7-.2-3-.2 32.8zm0 345.5c0 35.5.1 50 .2 32.3.2-17.8.2-46.8 0-64.5-.1-17.8-.2-3.3-.2 32.2z"/><g stroke="#000" stroke-width="10"><path d="M996.1 627.5c-22 4.8-40.2 14.6-55.6 30-19.9 19.8-32.1 47-34.2 76.2l-.6 8.2-5.7-5.2c-13.9-12.9-33.2-22.7-52.5-26.8-8.1-1.8-31.3-1.7-40 0-43.2 8.6-77.7 44.4-87.1 90.1-3.7 18-2.6 41.5 2.7 59.3 4 13.4 14 32.5 21.2 40.4 1.1 1.3 1.9 2.5 1.6 2.7-1.2 1.2-13.3 5.6-19.4 7.1-20.7 5.1-38.4 15.4-53.2 30.8-34.3 35.7-42.9 87.9-21.9 133.9 16.4 35.9 52.1 61.8 88.9 64.5 4.8.3 8.7 1 8.7 1.4 0 .5-1.3 2.3-2.9 4.1-12 13.9-21.6 34.3-26.2 56.3-1.7 7.8-1.7 31.9 0 41.5 8.6 50.3 47.6 89.2 95.3 95.1 15.1 1.9 32.7 0 47-5 12.5-4.3 32.6-16.7 39.7-24.5 3.4-3.6 4.1-3.3 4.1 1.6 0 10.6 3.9 27.8 9.1 40.7 17.5 42.9 56.6 70.1 100.8 70.1 12.4 0 19.2-1 30.9-4.7 29-9 54.1-31.4 67.3-60 5.3-11.3 9.6-26.2 10.3-35.8.4-4.4.9-9.5 1.2-11.3l.5-3.2 6.7 5.7c11.7 9.9 22.4 16.2 35.9 21.1 11.6 4.3 20.3 5.7 34.8 5.7 7.2 0 16.1-.6 20-1.4 38.6-7.8 70.4-36.7 83.5-75.9 8.5-25.5 8.1-53.8-1-79.7-4.8-13.5-11.4-25.2-20.1-35.6-2.2-2.6-3.9-5-3.9-5.3s2.4-.6 5.4-.6c22 0 50.3-12.8 68.7-31 51.9-51.6 44.8-140.8-14.5-181.9-6.7-4.6-10.6-6.6-26.6-14-2.5-1.1-7-3.4-10-5.1-4.7-2.5-7.9-3.8-16.8-6.5-.8-.3.1-2.2 2.7-5.6 5.6-7.4 12.5-21 16.1-31.7 10.3-30.8 8-65.3-6.4-93.4-16.1-31.6-43.2-52.7-77.1-60-7.8-1.6-32.4-1.6-39.5.1-20.2 4.7-29.2 9.1-48.7 23.3-10.6 7.8-9.5 8.6-11.1-7.7-2.3-22.8-13.6-47-30.3-64.9-16.1-17.3-35.5-28.2-58.9-33.1-8.9-1.9-30.1-1.9-38.9 0zm31.4 52c25.8 5.4 45.5 28.7 48.1 56.6 1.3 14.9-3.2 31-12.3 43.6l-5.3 7.4v116.4l-6.8 2.8c-16.8 6.7-37.5 22.1-49.7 36.7l-6.8 8.1-2.8-5c-4.6-8.5-11.3-17.3-18.5-24.2-11.4-10.8-20.2-16-35.1-20.6-8.1-2.4-10.2-2.7-26.3-2.7-21.9-.1-30.5 1.8-47.4 10.3l-11.4 5.7-12.9-13.7c-11.6-12.5-13.1-13.8-16.3-13.8-12.4-.3-27.2-7.2-37.5-17.6-12.2-12.2-18.5-27.7-18.5-45.5 0-46.3 44.7-76.4 84.9-57.3 5.4 2.6 9.4 5.5 15.1 11.2 11.5 11.4 17.6 23.9 18.9 38.8l.6 7.2 42.5 44.9 42.5 45 .3-63.9.2-63.9-3.6-4.7c-19.7-25.6-17.3-62.6 5.5-85.4 14.7-14.8 33.1-20.5 52.6-16.4zm152.2 76c9.5 2.8 18.4 12.9 22.7 25.6 8.1 24.4 4.3 64.9-10.5 110.6-9.9 30.8-32.2 80.6-51.2 114.6-6.1 10.8-7.7 14.6-7.7 17.7 0 6.8 2.9 19.2 6.1 25.7 2.4 5.1 3.7 6.5 7.4 8.3 8.1 3.9 17 .5 29.4-11.5l8.3-8.1-.1-11.9c-.3-21.4 3-36.2 12-53.5 7.9-15 17.2-25.3 31.8-35 4.8-3.3 12.4-6.3 21.6-8.8 8.9-2.3 27.3-2.1 34.6.6 14 5 23.9 15 28.1 28.5 2.2 7.3 2.4 21.6.3 30.6-3.2 13.2-12.2 26.8-23.3 35.1-10.6 7.8-29.9 16.1-52.9 22.6-2.3.6-1.4 2.5 4 7.8 6.8 6.8 14.1 9.1 27.4 8.4 14.1-.7 23.1-6 36.6-21.7 11-12.7 11.4-13.1 15.6-13.1 5.6 0 6.9.8 9.1 5.1 2.5 4.8 2.7 16.2.4 23.9-5.7 19.1-27.4 36.6-51.7 41.6-8.4 1.8-27.9 2-36.9.4-14.7-2.6-27.6-9.5-37.3-20.2l-5.9-6.5-9 7.6c-15.2 12.8-24.9 17.9-38 20.1-17.8 3.2-35.7-6.6-45.8-25-1.8-3.3-3.5-6-3.8-6s-2.7 2.7-5.5 6.1c-6.6 7.9-18.5 17.5-26.1 21.1-7.7 3.6-21.1 5.4-29.3 4-14.4-2.6-25.1-9.6-33.6-22.2-7.4-10.9-9.7-18.6-10.3-34.4l-.4-12.8-7.7.6c-15.5 1.3-14.4.8-16.5 8.8-5.8 22.4-25.6 46.5-45.3 54.9-17.2 7.4-41.2 6.5-58.1-2-7.3-3.7-17-11.6-21.4-17.4l-3.2-4.3-6.3 4.7c-13.1 10-26.7 16.6-42.7 20.7-8.9 2.3-12.1 2.7-26.1 2.7-17.6 0-23.8-1.1-35.4-6.5-8.9-4.2-15.5-9.3-21.6-16.7-13.6-16.5-18.5-34.1-16.5-59.3 2-26.2 10.4-46.7 25.9-63.2 16.7-17.8 33.7-25.8 55.2-25.8 11.4 0 18.5 1.8 25.4 6.5 6.2 4.3 9.8 8.7 13.7 17.1 7.8 16.7 2.8 42.8-9.9 51.8-5.8 4-13.4 4.7-19.6 1.7-7.1-3.4-8.3-8.4-5.2-21.6 2.2-9.8 2-14.1-1-17-1.8-1.9-3.5-2.5-6.5-2.5-12.4 0-24.2 14.4-29 35.5-1.9 8-2.2 11.5-1.8 22.7.6 16.8 2.6 22.8 10.3 30.5 6.8 6.8 13.2 8.9 26.5 8.7 14.7-.2 28.1-5.8 44.4-18.6l6.8-5.3.2-17c.4-21.1 2.7-31.2 11.2-48.5 5.1-10.2 6.7-12.4 15.3-21.1 6.1-6.1 12.2-11.1 16.6-13.6 20.7-12 46.6-13.4 66.2-3.8 17.2 8.5 31.8 29.9 35.7 52.3l1.3 7.7 4.9-.3c4.6-.2 20-2.7 23.6-3.8.9-.3 2.8-2.8 4.3-5.7 7.5-14.4 17.6-26.6 30.4-36.7 13.5-10.6 26.2-16.6 42.3-19.8l9.3-1.9 1.7-15.4c6-52.4 23.2-110.9 39.3-133.4 7.5-10.5 17.8-18.6 27.5-21.6 4.2-1.3 14.4-1 19.7.6zm55.5 14.4c6.3 4 15.5 13.7 19.7 20.6 8 13.2 10.9 32.5 7.2 47.9-3.2 13.3-7.1 20.6-16.1 30-7.2 7.5-20 16.3-20 13.8 0-.6 1.1-5.8 2.5-11.6 5.5-23.1 6.9-34.7 6.9-57.1.1-21.7-.8-29.4-4.6-40.4-1-3-1.8-5.6-1.8-5.8 0-.9 2 0 6.2 2.6zm-253.9 323.8c13.2 20.8 36.5 34.6 60.9 36 19.1 1.1 40.1-4.5 52-13.9l3.7-2.9 4.7 3.6c6.2 4.8 12.3 7.8 21.4 10.7 10.4 3.2 28.9 3.2 40.3 0l7.8-2.2 10.2 10.7c5.6 6 12.9 13.6 16.1 17 5.1 5.5 6.4 6.3 9.5 6.3 5.6 0 18 3.8 24.6 7.5 6.4 3.6 16.3 13.2 21.3 20.5 8.2 12.3 12.1 31.7 9.1 46.2-3 15.2-8.2 24.9-18.6 35.4-10.9 10.8-24.7 16.4-40.3 16.4-10.5-.1-15.6-1.2-24.5-5.5-19.2-9.3-31.6-26.6-34.7-48.5l-1.4-9.2-42.4-45-42.5-45-.3 63.8-.2 63.7 3.9 5.1c4.8 6.2 9.3 15 11.7 23.1 2.9 9.5 2.5 26.7-.9 37-11.8 36.2-49.6 53.3-82.4 37.3-9.3-4.5-22.5-17.7-26.9-26.8-4.7-9.7-6.5-16.5-7.1-27-.9-15.8 3.5-30.4 12.8-42.7l3.9-5.2-.2-63.8-.3-63.8-42.5 44.9-42.5 44.9-.6 6.8c-1.5 15.8-8 29.1-19.5 39.8-11.5 10.8-24.7 16.1-39.9 16.1-9.4 0-17.3-1.8-26.4-6.2-8.8-4.2-21.3-16.7-25.9-25.9-12.9-25.7-8.3-56.8 11.3-76.4 10.2-10.2 21.3-15.6 35.4-17.3l5.7-.7 16.9-17.8c14.1-14.9 17.2-17.7 18.9-17.2 14.8 4.9 20.3 5.8 35.1 5.8 13.1 0 16.3-.3 24.9-2.6 18.9-5.1 35.1-14.9 48.3-29.2 3.7-4.1 6.9-7.4 7-7.5.2 0 1.3 1.7 2.6 3.7z"/><path d="M1161.6 792.7c-10.7 11.5-21.8 72.6-26.9 148.3-.8 10.7-1.3 19.6-1.2 19.7.3.5 14.5-33.6 18.8-45.2 16-43.1 23.7-83 20.8-107.5-2-16.4-5.8-21.4-11.5-15.3zm-81.7 175c-23.7 11.7-41.2 47.7-37 76 1.5 10 4.6 15.5 10.1 17.7 10.9 4.4 21.2-1.3 34.3-18.7l4.3-5.9-1.5-9.6c-.9-6.5-1.4-18.5-1.5-36.4-.1-14.8-.4-26.8-.7-26.8-.4 0-4 1.7-8 3.7zm171.3-1.5c-11.4 5.5-20.4 23.4-21.9 43.5l-.6 8.2 4.9-1.3c14-3.8 28.3-12 34.5-19.9 4-5 6.9-12.8 6.9-18.1-.1-4.8-3.5-11.3-6.9-13-4.2-2.2-11.7-1.9-16.9.6zm-352.7 3.2c-14.6 6.9-23.5 28.1-22.2 53.1.7 13.7 3.3 22.6 8.6 29.3 6.8 8.5 15.9 11.2 26.4 7.6 9.1-3.1 17.7-14.6 21.3-28.3l1.4-5.8-7-7.1c-11.4-11.4-16.2-23.7-16.2-41.5V967h-3.7c-2 0-5.8 1.1-8.6 2.4z"/></g><path fill="#FF8000" stroke="#FF8000" stroke-width="10" d="M1004 680.1c-6.2 1.2-19.5 7.9-25.5 13-6.2 5.1-10.7 11.2-15.1 20.4-4.7 9.8-6.5 17.5-6.5 28 0 4.9.7 11.7 1.6 15 2.1 7.9 7.3 18.8 11.9 24.8l3.6 4.7-.2 65-.3 65-43-45.5-43-45.5-1.1-7.9c-3.5-24.3-16.9-42.7-37.1-51.1-19.2-8-38.9-5.3-56.4 7.7-8 6-15.4 15.7-19.7 25.8-3.4 8.3-5.5 20.9-4.8 28.9 1.5 15.7 10.2 33.7 20.9 43.1 9.3 8.1 24 14.5 33.6 14.5h4.6l12.9 13.8 12.9 13.9 10.6-5.4c6.2-3.1 14.8-6.4 20.6-8 8.8-2.3 12-2.6 26-2.7 17.2 0 23.7 1 36.9 6.1 14.9 5.6 33.2 21.8 42.6 37.7 2.5 4.1 4.8 7.6 5.1 7.6s2.8-2.8 5.5-6.2c10.7-13.3 32-29.4 48.4-36.5l9-3.8V785.9l4.6-6.5c18.8-26.3 15.9-60.8-6.8-83.6-7.3-7.4-18.9-13.7-28.6-15.7-6.1-1.3-16.7-1.3-23.2 0zm228.6 96.5c3.6 13.5 4.9 30.7 3.5 48.2-1.2 16.1-3.9 33.6-7.4 47.9l-2.3 9.2 6-3.2c22.9-12.2 35.4-43 28.6-70.2-1.2-5-3.1-10.8-4.2-13-5.3-10.5-14.1-20.2-23-25.5l-3.5-2zM972 1098.3c-12.4 13.4-27.5 22.8-45.5 28.3-8.5 2.7-10.1 2.8-28 2.8s-19.5-.2-27.9-2.7l-8.9-2.8-2.2 2.1c-1.3 1.2-9 9.3-17.1 18.1l-14.9 15.9h-4.6c-9.6 0-24.3 6.4-33.6 14.5-7.3 6.4-13.7 16.5-17.4 27.5-7.6 22.7-2.3 46.9 14.1 64.3 6.8 7.2 14 11.9 23.9 15.3 5.8 2 9.1 2.5 17.5 2.5 15 0 25.3-3.8 37.1-13.5 12-9.8 19.2-23.6 21.9-41.6l1.1-7.8 43-45.5 43-45.6.3 65.1.2 65.1-3.9 5.1c-4.9 6.3-9.5 16-11.7 24.6-2.6 10.2-1.6 26.1 2.4 36.7 9 24.2 27.9 38.7 52.2 40 17 1 31-4.6 43.6-17.1 22.2-22.1 24.5-58.3 5.3-83.8l-3.9-5.2v-130.1l5.4 5.5c3 3 22.5 23.6 43.4 45.8l37.9 40.2.7 6.9c2.2 24.4 17.7 44.2 41.2 52.7 8.7 3.2 25.2 3.4 33.8.4 19.5-6.7 33.8-21.2 39.9-40.5 3.2-10.4 3.1-28-.3-39-3-10-12.1-24-19.1-29.5-9.2-7.3-23.4-13-32.5-13-3.8 0-4.6-.6-11.4-7.8-4.1-4.2-11.5-11.9-16.4-17l-9-9.3-5.9 1.6c-22.4 6.3-47.4 2.1-64-10.8l-3.7-2.9-3.3 2.5c-17.3 13.1-49 17.8-71.7 10.6-17.2-5.5-30.2-15.6-43-33.6-1.5-2-1.6-1.9-8 5z"/><path fill="#0080FF" stroke="#0080FF" stroke-width="10" d="M1164.2 755.1c-16.5 2.1-32.8 18.9-43.2 44.5-11.8 28.7-22.3 71.3-26.5 106.6-2.7 22.3-1.5 20-10.5 21.3-13.4 1.9-30.2 9.6-43.2 19.8-12.7 10-22.1 21-29.7 34.9-4.2 7.6-4.2 7.7-9.4 8.7-11.5 2.3-17.3 3.1-21.3 3.1-4.2 0-4.3-.1-5-3.8-2.5-15-6.2-24.5-13.3-35-6.4-9.5-14.6-16.8-23.6-21.2-10.4-5-17.8-6.4-31.2-5.8-19.4.9-34.5 7.8-49.4 22.7-18.4 18.4-26.9 41.4-26.9 72.5v14.5l-7.7 6.1c-12.9 10-28.6 17.1-41.3 18.5-7 .8-18.7-1.6-24.5-5-6.2-3.6-11.1-9.8-13.7-17.4-2-5.8-2.3-8.4-2.2-21.6.1-13.3.4-16 2.8-24 3.3-10.9 7.2-17.9 13.3-23.9 5.4-5.4 11.8-8.1 16.9-7.3 7.8 1.3 9.7 6.6 6.9 18.6-1 4.2-1.9 9.7-1.9 12.3-.1 4.1.4 5.2 3.1 8 2.8 2.8 4 3.3 9.6 3.6 5 .3 7.2 0 10.5-1.7 9.2-4.7 15.2-17.9 15.2-33.7 0-27.5-19.4-44.6-47.5-41.8-28.2 2.7-53.4 22.6-66.5 52.5-10.2 23-11.7 54.9-3.7 74.7 10.2 25.3 29.6 39.8 57.6 43.2 24.3 3 56.1-6.2 77.8-22.5 4-3 7.6-5.5 8.1-5.5s1.5 1.2 2.3 2.6c2.1 3.9 12.2 12.9 19.2 17 22.4 13.2 52.7 11.9 72.7-3.1 16.9-12.6 28.8-30.5 34-51.1l1-4.2 6.8-.6c3.7-.4 9.1-.9 12-1.2l5.2-.6v11c0 13.9 1.2 19.6 6.1 29.9 6.9 14.6 20.1 25.3 34.7 28.4 6.7 1.4 19.5.6 26.6-1.6 9.6-2.9 20.2-11.1 31.2-23.8l5.8-6.7 3.5 6.7c5.2 9.8 15.9 20.4 23.6 23.3 19.5 7.3 41.6-.3 65.4-22.6l3.4-3.1 8.1 8.2c9.2 9.3 17.6 14.2 30.5 17.7 9.9 2.8 33 3 43.3.5 18.1-4.4 31.4-13 42.6-27.4 5.9-7.7 8.4-15 8.6-25.3.1-9.4-1.6-13.9-6.1-15.9-5.4-2.5-8.6-.6-16.7 9.4-7.6 9.5-18.8 19.2-25.6 22.4-4.9 2.2-6.8 2.5-17 2.6-12.9 0-17.4-1.4-24.4-7.5-3.4-3-7.2-8.7-6.4-9.5.2-.2 3.9-1.3 8.3-2.5 44.5-11.9 67-32.2 70.6-63.7 1.8-15.8-2.3-29.1-12.1-39-9.6-9.8-22.2-14-39.2-13-30.9 1.9-58 23.7-70.5 56.8-4.4 11.8-6.3 23.5-6.3 39.9v13.6l-8.4 8.2c-9.6 9.4-16.5 13.2-24 13.2-6 0-10.4-2.5-13.3-7.7-2.9-5.1-6-16.7-6.8-25.1l-.7-6.7 8.2-14.5c9.4-16.7 19-35.5 25.6-50.2 2.5-5.7 5.5-12.3 6.6-14.8 9.7-21.4 21-53.7 26.3-75.4 5.6-23.2 7-33.9 6.9-54.1-.1-19.9-1.8-29.3-7-38.4-3.5-6-10-12.8-14.6-15.2-4.7-2.4-13-3.6-19.6-2.8zm4.7 36c3.6 3.9 4.6 10.3 4.6 29.9 0 20.6-1.3 30.3-7 52.5-4.4 16.9-13.8 44.3-21.5 62.5-3.4 8-7.3 17.4-8.8 21-3.5 8.5-3.8 6.7-2.3-16 5.8-87.8 19.1-150.7 32.3-151.9.4-.1 1.6.8 2.7 2zm-77.9 237.1 1.3 8.7-5.2 7c-2.9 3.9-7.7 9.3-10.7 12.1-11.9 10.8-25.8 10-31.6-1.8-3.4-6.9-3.8-25.2-.9-37.4 5.8-24.4 21.1-44.3 39.7-51.6l4.9-2 .6 28.2c.3 15.4 1.2 32 1.9 36.8zm177-63.4c5 2.5 7.4 7.2 7.4 14.7 0 14.8-13.7 28.6-35.6 35.9-10.4 3.5-11.8 3.4-11.8-.7.1-12.1 4.9-28.9 10.8-37.7 8.1-11.8 20-16.9 29.2-12.2zm-356.6 9.5c-1.3 16.9 5.4 33.9 18 45.4 5 4.6 5.2 4.9 4.5 8.8-2.1 12.1-9.5 24.2-17.7 29.2-5.6 3.3-13.1 4.9-18.1 3.8-8.7-1.9-17.7-12-20.4-23.1-8.9-35.2 6.6-71.8 30.6-72.3l3.7-.1z"/></svg>';
                              const converted = stringToSVGandPath2Ds(result);
                              setSVG(converted.svg);
                              setSelectedPaths([0]);
                              setTool("select");

                              const svg = converted.svg;

                              const ctx = canvasRef.current?.getContext("2d");
                              if (!ctx) return;

                              clear();
                              // ctx.translate(-600, -600);
                              // setPanOffset({ x: -600, y: -600 });
                              drawSVG(ctx, svg);
                              drawSVGPoints(ctx, svg);
                              setSelectedDraw(null);
                            }}
                            onSkip={() => {
                              setGuideIndex(-1);
                            }}
                            guideTitle="File Input"
                            guideDescription="Or you can start with existing SVG Files"
                          ></Guidebox>
                        </div>
                      )}
                    </AnimatePresence>
                  ) : null}
                </>
              </div>
              <div
                className={`flex h-[30px] w-[30px] ${tool == "add" && addShape == "rect" ? "bg-violet-300" : ""} items-center justify-center rounded-md hover:bg-violet-300`}
                onClick={(e) => {
                  setTool("add");
                  setAddShape("rect");
                }}
              >
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
              <div
                className={`flex h-[30px] w-[30px] ${tool == "add" && addShape == "circle" ? "bg-violet-300" : ""} items-center justify-center rounded-md hover:bg-violet-300`}
                onClick={(e) => {
                  setTool("add");
                  setAddShape("circle");
                }}
              >
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
              <div
                className={`flex h-[30px] w-[30px] items-center ${tool == "add" && addShape == "text" ? "bg-violet-300" : ""} justify-center rounded-md text-[18px] font-light hover:bg-violet-300`}
                onClick={(e) => {
                  setTool("add");
                  setAddShape("text");
                }}
              >
                T
              </div>
              <div
                onClick={(e) => {
                  setTool("draw");

                  setIsDrawing(true);
                  //add a new empty path to the svg
                  if (!svg) return;
                  const newPath: AbsoluteSegment[] = [];
                  const newPath2D = new Path2D("");
                  const newSVG = [...svg];
                  const { x, y } = computePointInCanvas(e)!;
                  newSVG.push({
                    tag: "path",
                    shape: { path2D: newPath2D, d: newPath },
                    xMax: x,
                    xMin: x,
                    yMax: y,
                    yMin: y,
                    rotation: 0,
                    offset: { x: 0, y: 0 },
                    fill: "white",
                    stroke: "black",
                  });
                  setSVG(newSVG);
                  setLinePath2Ds([]);
                }}
                className={`flex h-[30px] w-[30px] ${tool == "draw" ? "bg-violet-300" : ""} items-center justify-center rounded-md hover:bg-violet-300`}
              >
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
                  <path
                    d="M12.8691 7.93213L7.8966 12.9093"
                    stroke="black"
                  ></path>
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
            {tool === "draw" ? (
              <div className="z-10 flex flex-row items-center justify-center gap-2 rounded-md bg-white p-[6px] shadow-md">
                <div
                  onClick={() => {
                    setIsDrawing(true);
                    setIsBending(false);
                  }}
                  className={` ${isDrawing == true ? "bg-[#0b99ff]" : ""} flex h-[30px] w-[30px] items-center justify-center rounded-md hover:bg-[#0b99ff]  `}
                >
                  <svg
                    className="svg "
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
                    <path
                      d="M12.8691 7.93213L7.8966 12.9093"
                      stroke="black"
                    ></path>
                    <circle
                      cx="7"
                      cy="7"
                      r="1"
                      transform="rotate(90 7 7)"
                      fill="black"
                    ></circle>
                  </svg>
                </div>
                <div
                  onClick={() => {
                    setIsBending(true);
                    setIsDrawing(false);
                  }}
                  className={`${isBending ? "bg-[#0b99ff]" : ""} flex h-[30px] w-[30px] items-center justify-center rounded-md hover:bg-[#0b99ff]`}
                >
                  <svg
                    className="svg   "
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                  >
                    <path
                      fill="#000"
                      fill-opacity="1"
                      fill-rule="evenodd"
                      stroke="none"
                      d="M14.5 6C15.88 6 17 4.88 17 3.5 17 2.12 15.88 1 14.5 1c-1.21 0-2.218.859-2.45 2h-.55C6.806 3 3 6.806 3 11.5v.55c-1.141.232-2 1.24-2 2.45C1 15.88 2.12 17 3.5 17 4.88 17 6 15.88 6 14.5c0-1.21-.859-2.218-2-2.45v-.55C4 7.358 7.358 4 11.5 4h.55c.232 1.141 1.24 2 2.45 2zM16 3.5c0 .828-.672 1.5-1.5 1.5-.828 0-1.5-.672-1.5-1.5 0-.828.672-1.5 1.5-1.5.828 0 1.5.672 1.5 1.5zm-11 11c0 .828-.672 1.5-1.5 1.5-.828 0-1.5-.672-1.5-1.5 0-.828.672-1.5 1.5-1.5.828 0 1.5.672 1.5 1.5z"
                    ></path>
                  </svg>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setTool("select");
                  }}
                  className="flex h-[30px] items-center justify-center rounded-md bg-[#18181b] p-2 text-xs text-white"
                >
                  Done
                </button>
              </div>
            ) : null}
          </div>
          <div className="z-10 flex  h-[40px] items-center gap-4 rounded-md">
            <div className="flex h-full items-center gap-1 rounded-md bg-white p-1 shadow-md">
              <div className="flex h-[30px] w-[30px] items-center justify-center rounded-md bg-white hover:bg-slate-200">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g transform="matrix(0.96403766,0,0,0.96419055,0.02351096,-0.45900725)">
                    <path
                      className="strokeDefault"
                      d="M 9.80036,18.0706 H 8.19992 c -0.53907,0 -0.99777,-0.4051 -1.06139,-0.9442 L 6.96777,15.7871 C 6.62626,15.6766 6.29813,15.5393 5.98675,15.382 l -1.06808,0.8303 c -0.43192,0.3349 -1.0413,0.298 -1.4163,-0.0904 l -1.125,-1.125 C 1.99233,14.6253 1.9555,14.0159 2.29032,13.584 L 3.11733,12.5126 C 2.95661,12.2012 2.81934,11.873 2.71219,11.5315 L 1.36956,11.3608 C 0.833845,11.2972 0.428711,10.8384 0.428711,10.2994 V 8.69894 c 0,-0.53906 0.405134,-0.99777 0.944199,-1.06138 L 2.71219,7.4668 C 2.82268,7.12528 2.95996,6.79715 3.11733,6.48577 L 2.29032,5.41769 C 1.9555,4.98577 1.99233,4.37639 2.38072,3.99805 l 1.125,-1.125 C 3.87737,2.488 4.48675,2.45117 4.91867,2.78599 L 5.98675,3.61635 C 6.29813,3.45564 6.62626,3.32171 6.96777,3.21122 L 7.13853,1.86858 C 7.20215,1.33287 7.66085,0.927734 8.19992,0.927734 h 1.60044 c 0.53904,0 0.99774,0.405136 1.06134,0.944196 l 0.1708,1.33929 c 0.3415,0.11049 0.6696,0.24776 0.981,0.40513 L 13.0816,2.78599 C 13.5135,2.45117 14.1229,2.488 14.4979,2.8764 l 1.125,1.12499 c 0.3851,0.37166 0.4219,0.98103 0.0871,1.41295 l -0.827,1.07143 c 0.1607,0.31138 0.2979,0.63951 0.4051,0.98103 l 1.3426,0.17076 c 0.5357,0.06361 0.9409,0.52232 0.9409,1.06138 v 1.60046 c 0,0.539 -0.4052,0.9978 -0.9442,1.0614 l -1.3393,0.1707 c -0.1105,0.3415 -0.2478,0.6697 -0.4051,0.9811 l 0.8303,1.068 c 0.3348,0.432 0.298,1.0413 -0.0904,1.4163 l -1.125,1.125 c -0.3716,0.3851 -0.981,0.4219 -1.4129,0.0871 l -1.0715,-0.827 c -0.3114,0.1607 -0.6395,0.298 -0.981,0.4051 l -0.1708,1.3426 c -0.0636,0.5358 -0.5223,0.9409 -1.06134,0.9409 z M 5.94992,14.5985 c 0.06026,0 0.12053,0.0134 0.1741,0.0435 0.39509,0.221 0.82032,0.3985 1.26563,0.5257 0.13727,0.0402 0.23772,0.1574 0.25446,0.298 l 0.2009,1.5703 c 0.02008,0.1808 0.17745,0.3181 0.35156,0.3181 h 1.60044 c 0.17746,0 0.33149,-0.1373 0.35159,-0.3148 l 0.2009,-1.5736 c 0.0167,-0.1406 0.1172,-0.2578 0.2544,-0.298 0.4487,-0.1272 0.8739,-0.3047 1.2657,-0.5257 0.1238,-0.0703 0.2812,-0.0569 0.3917,0.0302 l 1.2489,0.9709 c 0.144,0.1105 0.3449,0.1038 0.4687,-0.0234 l 1.1317,-1.1317 c 0.1306,-0.1272 0.1407,-0.3281 0.0268,-0.4721 l -0.971,-1.2489 c -0.087,-0.1138 -0.1004,-0.2678 -0.0301,-0.3917 0.221,-0.3951 0.3984,-0.8203 0.5257,-1.2656 0.0401,-0.1373 0.1573,-0.2378 0.298,-0.2545 l 1.5703,-0.2009 c 0.1808,-0.0234 0.3181,-0.1775 0.3181,-0.3549 V 8.69894 c 0,-0.17746 -0.1373,-0.33147 -0.3148,-0.35156 L 14.96,8.14648 C 14.8193,8.12974 14.7021,8.0293 14.662,7.89202 14.5347,7.44336 14.3573,7.01814 14.1363,6.62639 14.066,6.50251 14.0794,6.34514 14.1664,6.23465 l 0.971,-1.24888 C 15.2479,4.8418 15.2412,4.6409 15.114,4.51702 L 13.9823,3.38532 C 13.8584,3.25474 13.6542,3.2447 13.5102,3.35854 L 12.2613,4.32952 C 12.1475,4.41657 11.9934,4.42997 11.8662,4.35965 11.4745,4.13867 11.0492,3.96456 10.6006,3.83398 10.4633,3.79381 10.3629,3.67662 10.3461,3.53599 L 10.1452,1.96568 C 10.1218,1.78488 9.96777,1.6476 9.79032,1.6476 H 8.18987 c -0.17745,0 -0.33147,0.13728 -0.35156,0.31473 L 7.63742,3.53599 C 7.62068,3.67662 7.52023,3.79381 7.38295,3.83398 6.93429,3.96122 6.50907,4.13867 6.11733,4.35965 5.99344,4.42997 5.83608,4.41657 5.72224,4.32952 L 4.47335,3.35854 C 4.32938,3.24805 4.12849,3.25474 4.0046,3.38198 L 2.88295,4.51032 C 2.75237,4.63756 2.74233,4.83845 2.85617,4.98242 L 3.82715,6.23131 C 3.9142,6.34514 3.92759,6.49916 3.85728,6.62305 3.6363,7.01814 3.45884,7.44336 3.33161,7.88867 3.29143,8.02595 3.17425,8.12639 3.03362,8.14314 L 1.46331,8.34403 C 1.28251,8.36412 1.14523,8.52148 1.14523,8.69559 V 10.296 c 0,0.1775 0.13728,0.3315 0.31473,0.3516 l 1.57366,0.2009 c 0.14063,0.0167 0.25781,0.1172 0.29799,0.2545 0.12723,0.4486 0.30469,0.8738 0.52567,1.2656 0.07031,0.1239 0.05692,0.2812 -0.03013,0.3917 l -0.97098,1.2489 c -0.11049,0.144 -0.1038,0.3449 0.02343,0.4688 l 1.1317,1.1317 c 0.12388,0.1305 0.32478,0.1406 0.4721,0.0267 l 1.24888,-0.9709 c 0.06362,-0.0402 0.14063,-0.067 0.21764,-0.067 z"
                      stroke-width="0.8"
                      stroke="#222429"
                    ></path>
                    <path
                      className="strokeDefault strokeActive"
                      d="m 9.00014,13.0717 c -1.96875,0 -3.57254,-1.6038 -3.57254,-3.57254 0,-1.96875 1.60379,-3.57255 3.57254,-3.57255 1.96876,0 3.57256,1.6038 3.57256,3.57255 0,1.96874 -1.6038,3.57254 -3.57256,3.57254 z m 0,-6.42857 c -1.57701,0 -2.85603,1.28237 -2.85603,2.85603 0,1.57364 1.28237,2.85604 2.85603,2.85604 1.57366,0 2.85606,-1.2824 2.85606,-2.85604 0,-1.57366 -1.279,-2.85603 -2.85606,-2.85603 z"
                      stroke-width="0.8"
                      stroke="#222429"
                    ></path>
                  </g>
                </svg>
              </div>
              <div className="flex h-[30px] w-[30px] items-center justify-center rounded-md bg-white hover:bg-slate-200 ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.8"
                  stroke="#222429"
                  width={20}
                  height={20}
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
              </div>
            </div>
            <button
              onClick={(e) => {
                if (selectedDraw === "profile") {
                  setSelectedDraw(null);
                } else {
                  setSelectedDraw("profile");
                  setProfileIsCredits(true);
                }
                e.preventDefault();
                e.stopPropagation();
              }}
              className="relative z-20 flex h-full  w-[40px] items-center justify-center rounded-md bg-pink-300 font-[geist]"
            >
              D
              {selectedDraw === "profile" && (
                <div className="absolute right-0 top-[48px] z-50 flex w-64 flex-col gap-2 rounded-md bg-white p-2 shadow-md">
                  <div className="flex flex-row gap-2 text-sm">
                    <button
                      onClick={(e) => {
                        setProfileIsCredits(true);
                        e.stopPropagation();
                        e.preventDefault();
                      }}
                      className={`flex w-1/2 items-center justify-center rounded-md ${profileIsCredits ? "bg-[#18181b] p-1.5 text-[#fafafa] hover:bg-[#2f2f31]" : "hover:bg-slate-100"} `}
                    >
                      Credits
                    </button>
                    <button
                      onClick={(e) => {
                        setProfileIsCredits(false);
                        e.stopPropagation();
                        e.preventDefault();
                      }}
                      className={`flex w-1/2 items-center justify-center rounded-md p-1.5  ${!profileIsCredits ? "bg-[#18181b] p-1.5 text-[#fafafa] hover:bg-[#2f2f31]" : "hover:bg-slate-100"}`}
                    >
                      Workspaces
                    </button>
                  </div>
                  {profileIsCredits ? (
                    <div className="flex flex-col gap-3 rounded-md bg-[#fafafa] p-4">
                      <div className="flex  items-center justify-center text-sm ">
                        Current Credits : <span className="font-bold">128</span>
                      </div>
                      <div className="flex items-center justify-center">
                        <button className="inline-block items-center justify-center rounded-md bg-[#18181b] p-1.5 text-sm text-[#fafafa] hover:bg-[#2f2f31]">
                          Buy Credits
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>Workspaces</div>
                  )}
                </div>
              )}
            </button>
          </div>
        </div>
        <div className="flex flex-auto justify-between p-[12px]">
          <AnimatePresence>
            {svg !== null && svg.length !== 0 && (
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                className="z-10 flex h-[590px]  w-[296px] flex-col  gap-4 rounded-xl bg-white p-4 font-[Inter] text-[#1a1a1a] shadow-md"
              >
                <div className="border-b-[1px] border-[#e6e6e6] p-1 pb-3 font-semibold">
                  Layers
                </div>
                <div className="flex h-full flex-col gap-2 overflow-y-auto">
                  {svg?.map((subSVG, i) => {
                    return (
                      <div
                        draggable
                        onClick={() => setSelectedPaths([i])}
                        onDragStart={() => {
                          dragLayer.current = i;
                          setSelectedPaths([i]);
                        }}
                        onDragEnter={() => (dragOverLayer.current = i)}
                        onDragEnd={handleSort}
                        onDragOver={(e) => {
                          e.preventDefault();
                        }}
                        key={i}
                        className={`flex ${selectedPaths.includes(i) ? "bg-[#e5f4ff]" : ""}  flex-row items-center gap-1 gap-2 rounded-sm border-[1px] border-dashed border-[#e6e6e6] p-1.5`}
                      >
                        <span>
                          {subSVG?.tag === "text" ? (
                            <svg
                              className="svg"
                              xmlns="http://www.w3.org/2000/svg"
                              width="10"
                              height="10"
                              viewBox="0 0 10 10"
                            >
                              <path
                                fill="#000"
                                fill-opacity="1"
                                fill-rule="nonzero"
                                stroke="none"
                                d="M0 0h10v3H9V1H5.5v8H7v1H3V9h1.5V1H1v2H0V0z"
                              ></path>
                            </svg>
                          ) : (
                            <svg
                              className="svg"
                              xmlns="http://www.w3.org/2000/svg"
                              width="10"
                              height="10"
                              viewBox={`${subSVG?.xMin} ${subSVG?.yMin} ${subSVG?.xMax - subSVG?.xMin} ${subSVG?.yMax - subSVG?.yMin}`}
                            >
                              <path
                                fill={subSVG?.fill}
                                fill-opacity="1"
                                fill-rule="nonzero"
                                stroke={subSVG?.stroke}
                                stroke-width="24"
                                d={svgPathToString(subSVG?.shape.d)}
                              ></path>
                            </svg>
                          )}
                        </span>
                        <span className="inline-block flex h-full items-center justify-center align-text-bottom text-[11px]">
                          {subSVG?.tag === "text"
                            ? subSVG?.shape.content
                            : "Vector " + i.toString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {/* <svg id="test" width="100" height="100" viewBox="0 0 100 100" />
            <div>{forText}</div> */}
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {selectedPaths.length !== 0 && (
              <motion.div
                initial={{ x: 300 }}
                animate={{ x: 0 }}
                exit={{ x: 300 }}
                className={` z-10 flex   h-[590px]   w-[296px] flex-col gap-4 rounded-xl bg-white p-4  font-[Inter] text-[#1a1a1a] shadow-md`}
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
                            svg && selectedPaths.length !== 0
                              ? svg[selectedPaths[0] ?? 0]?.fill
                                ? svg[selectedPaths[0] ?? 0]?.fill
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
                            svg && selectedPaths.length !== 0
                              ? svg[selectedPaths[0] ?? 0]?.fill
                                ? svg[selectedPaths[0] ?? 0]?.fill
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
                              onChange={handleColorChange}
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
                      <div className="flex w-1/2 flex-row gap-3">
                        <div>W</div>
                        <div>{getDimensionsOfSelectedPaths().w}</div>
                      </div>
                      <div className="flex w-1/2 flex-row gap-3">
                        <div>X</div>
                        <div>{getDimensionsOfSelectedPaths().x}</div>
                      </div>
                    </div>
                    <div className="flex w-full flex-row">
                      <div className="flex w-1/2 flex-row gap-3">
                        <div>H</div>
                        <div>{getDimensionsOfSelectedPaths().h}</div>
                      </div>
                      <div className="flex w-1/2 flex-row gap-3">
                        <div>Y</div>
                        <div>{getDimensionsOfSelectedPaths().y}</div>
                      </div>
                    </div>
                  </div>
                </div>
                {svg &&
                  selectedPaths.length === 1 &&
                  selectedPaths[0] !== undefined &&
                  svg[selectedPaths[0]]?.tag === "text" &&
                  svg[selectedPaths[0]]!.shape &&
                  "font" in svg[selectedPaths[0]]!.shape && (
                    <div className="flex flex-col gap-4 border-b-[1px] border-[#e6e6e6] p-1 pb-4 text-xs">
                      <div className="font-bold">Fonts</div>
                      <div className="flex w-full flex-col gap-4">
                        <div className="flex w-full flex-row">
                          <div className="flex w-1/2 flex-row gap-3"></div>
                        </div>
                        <div className="flex w-full flex-row">
                          <div className="flex w-1/2 flex-row gap-3">
                            <div>
                              <label htmlFor="fontSelector">Font</label>
                              <select
                                id="fontSelector"
                                value={selectedFont}
                                onChange={handleChange}
                              >
                                <option value="roboto">roboto</option>
                                <option value="pacifico">pacifico</option>
                                <option value="modak">modak</option>
                              </select>
                            </div>
                          </div>
                          <div className="flex w-1/2 flex-row gap-3">
                            <div>Size</div>
                            <div>{renderFontSize()}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="z-10 h-[80px] w-full flex-none p-[20px]">
          <div className="relative flex justify-center gap-2">
            <ToolBox
              handleToolChange={(tool: Tool) => {
                setTool(tool);
              }}
              tool={tool}
            />
            {guideIndex === 2 && (
              <div className="absolute bottom-full -translate-y-4">
                <Guidebox
                  isOpened={true}
                  guideIndex={3}
                  guideLength={5}
                  onNext={() => {
                    console.log("next");
                    setGuideIndex(3);
                    setIsEditing(true);
                    setTool("select");
                    setSelectedDraw(null);
                  }}
                  onSkip={() => {
                    setGuideIndex(-1);
                  }}
                  guideTitle="Pan / Select"
                  guideDescription="You can Select the Hand Tool to Pan the Canvas or Select the Select Tool to Select the Drawings"
                ></Guidebox>
              </div>
            )}
            <div className="flex h-full items-center gap-1 rounded-md bg-white p-1 shadow-md">
              <div
                onClick={() => {
                  console.log(historyIndex);
                  onReturnHistory();
                  console.log("RETURN");
                }}
                className="flex h-[30px] w-[30px] items-center justify-center rounded-md bg-white hover:bg-slate-200  hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.8"
                  stroke="
                #222429"
                  className=""
                  height={18}
                  width={18}
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
                  />
                </svg>
              </div>
              <div className="h-[28px] w-[1px] bg-[#f3f5f7]"></div>
              <div
                className="flex h-[30px] w-[30px] items-center justify-center rounded-md bg-slate-200 bg-white hover:bg-slate-200"
                onClick={() => {
                  onForwardHistory();
                  console.log("FORWARD");
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.8"
                  stroke="
                #222429"
                  className=""
                  height={18}
                  width={18}
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3"
                  />
                </svg>
              </div>
            </div>
            <div className="flex h-full items-center gap-1 rounded-md bg-white p-1 shadow-md">
              <div className="flex h-[30px] w-[60px] items-center justify-center rounded-md bg-slate-200 bg-white font-[geist] text-xs hover:bg-slate-200">
                {Math.round(scale.x * 100)}%
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute h-[600px] w-[600px]">
        <canvas
          onMouseDown={onMouseDownWrapper}
          onContextMenu={onRightClickWrapper}
          onMouseUp={onMouseUpWrapper}
          onMouseMove={onMouseMoveWrapper}
          onWheel={handOnWheelMove}
          ref={canvasRef}
          width={600}
          height={600}
          className={` ${modak.className} ${pacifico.className} z-2 absolute inset-0 m-auto rounded-lg bg-white ${
            tool === "hand" ? "cursor-grab" : ""
          } ${mouseDown ? "cursor-grabbing" : ""}`}
        ></canvas>
        {isEditingText && (
          <input
            ref={textareaRef}
            className={`font-pacifico absolute   hidden resize-none border-2 border-[#18a0fb] font-bold ring-0 ring-offset-0`}
          ></input>
        )}
        {guideIndex === 3 && (
          <div className="absolute left-full translate-x-4">
            <Guidebox
              isOpened={true}
              guideIndex={4}
              guideLength={5}
              onNext={() => {
                console.log("next");
                setGuideIndex(4);
                setIsEditing(false);
                setSelectedDraw(null);
                setAddShape("rect");
                setTool("add");
              }}
              onSkip={() => {
                setGuideIndex(-1);
              }}
              guideTitle="Edit"
              guideDescription="You can also Right-Click on the path to Edit or Delete it"
            ></Guidebox>
          </div>
        )}
      </div>
    </div>
  );
}
