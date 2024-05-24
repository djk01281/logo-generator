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
import { motion, AnimatePresence } from "framer-motion";
import { set } from "zod";
import { transform } from "next/dist/build/swc";

import { Segment } from "path-data-parser/lib/parser";
import { ListBucketInventoryConfigurationsOutputFilterSensitiveLog } from "@aws-sdk/client-s3";
import { on } from "events";
import path from "path";
import textPath from "../../helper/textPath";
import { text } from "stream/consumers";

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
    setMouseDown,
    onSelectMouseMove,
  } = useSelect(onMove, onHover, onSelect, canvasRef, tool);

  const [panOffset, setPanOffset] = useState<Point>({ x: 0, y: 0 });
  const [scale, setScale] = useState<Point>({ x: 1, y: 1 });

  const [point2Ds, setPoint2Ds] = useState<Path2D[][]>([]);
  const [selectedPaths, setSelectedPaths] = useState<number[]>([]);

  type PointIndex = [number, number];
  const [selectedPoint, setSelectedPoint] = useState<PointIndex[] | null>(null);
  const [selectedDraw, setSelectedDraw] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
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

  const [forText, setForText] = useState<string>("");

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
          segment.data.rx +
          " " +
          segment.data.ry +
          " " +
          segment.data.rotation +
          " " +
          segment.data.largeArcFlag +
          " " +
          segment.data.sweepFlag +
          " " +
          segment.data.dx +
          " " +
          segment.data.dy +
          " ";
      }
    });
    return pathString;
  };

  function onPan({ ctx, currentPoint, prevPoint }: Pan) {
    if (!prevPoint) return;
    const dx = (currentPoint.x - prevPoint.x) * (1 / scale.x);
    const dy = (currentPoint.y - prevPoint.y) * (1 / scale.y);
    setPanOffset({ x: panOffset.x + dx, y: panOffset.y + dy });

    clear();
    ctx.translate(dx, dy);
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
      x: currentPoint.x * (1 / scale.x) - panOffset.x,
      y: currentPoint.y * (1 / scale.y) - panOffset.y,
    };
    const calculatedAddPoint = {
      x: addPoint!.x * (1 / scale.x) - panOffset.x,
      y: addPoint!.y * (1 / scale.y) - panOffset.y,
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
      x: currentPoint.x * (1 / scale.x) - panOffset.x,
      y: currentPoint.y * (1 / scale.y) - panOffset.y,
    };
    const calculatedAddPoint = {
      x: addPoint.x * (1 / scale.x) - panOffset.x,
      y: addPoint.y * (1 / scale.y) - panOffset.y,
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
              data: {
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
              data: {
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
        rotation: 0,
      });
    } else if (addShape === "text") {
      ctx.font = "64px montserrat";
      svg.push({
        fill: color,
        tag: "text",
        shape: {
          content: "Text",
          font: "montserrat",
          size: 64,
          d: [
            {
              key: "M",
              data: [{ x: calculatedAddPoint.x, y: calculatedAddPoint.y }],
            },
            {
              key: "C",
              data: [
                { x: calculatedAddPoint.x + 200, y: calculatedAddPoint.y },
                { x: calculatedAddPoint.x + 200, y: calculatedAddPoint.y },
                { x: calculatedAddPoint.x + 400, y: calculatedAddPoint.y },
              ],
            },
          ],
          path2D: null,
        },
        xMin: calculatedAddPoint.x,
        xMax: calculatedAddPoint.x + 400,
        yMin: calculatedAddPoint.y - 64,
        yMax: calculatedAddPoint.y,
        offset: { x: 0, y: 0 },
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
    ctx.scale(1 + scaleX, 1 + scaleY);
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

    svg.some((subSVG, i) => {
      // if (subSVG.tag === "text") {
      //   //TODO : Implement Text Selection
      //   return false;
      // }
      const path2D = subSVG.shape.path2D;
      if (path2D === null) return false;
      if (ctx.isPointInPath(path2D, currentPoint.x, currentPoint.y)) {
        pathSelected = i;
        if (selectedPaths.includes(i)) isAlreadySelected = true;
        else setSelectedPaths([i]);
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
      ctx.fillStyle = "#000000";
      ctx.font = "bold 64px Montserrat";
      ctx.fillText(letter, x, y);
    }

    const coors = absoluteSegmentsToArraysOfArrays(textTag.shape.d);

    textPath(textTag.shape.content, coors, draw);
  };

  const drawSVG = (ctx: CanvasRenderingContext2D, svg: SVG) => {
    if (!svg) return;
    svg.map((subSvg, i) => {
      if (subSvg.tag === "text") {
        drawText(subSvg, ctx);
        const shape = subSvg.shape;
        const path2D = shape.path2D;
        if (!path2D) return;
        ctx.strokeStyle = "#000000";
        ctx.stroke(path2D);
      } else {
        const shape = subSvg.shape;
        const path2D = shape.path2D;
        if (!path2D) return;
        ctx.fillStyle = svg[i]?.fill ?? "#000000";
        ctx.fill(path2D);
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

      newPath.shape.d.map((segment) => {
        if (
          segment.key === "A" ||
          (typeof segment.data === "object" && !Array.isArray(segment.data))
        )
          return;
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
          if (segment.key === "A") return;
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
          if (segment.key === "A") return;
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
          if (segment.key === "A") return;
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
          if (segment.key === "A") return;

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
  };

  const onCreateText = (ctx: CanvasRenderingContext2D) => {
    ctx.font = "30px Arial";
    ctx.fillText("Hello World", 10, 50);
  };

  const absoluteSegmentToSegment = (
    absoluteSegment: AbsoluteSegment,
  ): Segment => {
    const { key, data } = absoluteSegment;
    if (key === "A") return { key: key, data: [] };
    const segmentData: number[] = [];
    data.map((point) => {
      segmentData.push(point.x, point.y);
    });
    return { key: key, data: segmentData };
  };

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
      const { key, data } = segment;
      if (key === "A") return;
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
      const { key, data } = segment;
      if (key === "A") continue;
      if (key === "M") continue;
      if (key === "Z") continue;
      if (key === "C") {
        let lastPoint = { x: 0, y: 0 };
        if (d[i - 1]!.key === "A") {
          lastPoint = {
            // @ts-expect-error: Unreachable code error
            x: d[i - 1]!.data.dx as number,
            // @ts-expect-error: Unreachable code error
            y: d[i - 1]!.data.dy as number,
          } as Point;
        } else {
          // @ts-expect-error: Unreachable code error
          lastPoint = d[i - 1].data[d[i - 1].data.length - 1] as Point;
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
          data: {
            rx: segment.data.rx,
            ry: segment.data.ry,
            rotation: segment.data.rotation,
            largeArcFlag: segment.data.largeArcFlag,
            sweepFlag: segment.data.sweepFlag,
            dx: segment.data.dx + offset.x,
            dy: segment.data.dy + offset.y,
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
            data: {
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
      return { shape, tag, fill, offset, xMin, xMax, yMin, yMax, rotation };
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
        x: currentPoint.x * (1 / scale.x) - panOffset.x,
        y: currentPoint.y * (1 / scale.y) - panOffset.y,
      };
      const calculatedSelectPoint = {
        x: selectPoint!.x * (1 / scale.x) - panOffset.x,
        y: selectPoint!.y * (1 / scale.y) - panOffset.y,
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
  };

  const onMouseUpWrapper = (e: React.MouseEvent<HTMLCanvasElement>) => {
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
        x: currentPoint.x * (1 / scale.x) - panOffset.x,
        y: currentPoint.y * (1 / scale.y) - panOffset.y,
      };
      const calculatedSelectPoint = {
        x: selectPoint.x * (1 / scale.x) - panOffset.x,
        y: selectPoint.y * (1 / scale.y) - panOffset.y,
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
  };

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
  };

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
                setIsEditing(true);
                setIsRightClicked(null);
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
                  </AnimatePresence>
                ) : null}
              </>
            </div>
            <div
              className="flex h-[30px] w-[30px] items-center justify-center rounded-md hover:bg-violet-300"
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
              className="flex h-[30px] w-[30px] items-center justify-center rounded-md hover:bg-violet-300"
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
              className="flex h-[30px] w-[30px] items-center justify-center rounded-md text-[18px] font-light hover:bg-violet-300"
              onClick={(e) => {
                setTool("add");
                setAddShape("text");
              }}
            >
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
            <div className="z-10 flex h-full w-[40px] items-center justify-center rounded-md bg-pink-300">
              D
            </div>
          </div>
        </div>
        <div className="flex flex-auto justify-between p-[12px]">
          <div className="flex h-full w-[296px] flex-col items-center justify-center rounded-xl bg-white shadow-md">
            Layers
            <svg id="test" width="100" height="100" viewBox="0 0 100 100" />
            <div>{forText}</div>
          </div>
          <AnimatePresence>
            {selectedPaths.length !== 0 && (
              <motion.div
                initial={{ x: 300 }}
                animate={{ x: 0 }}
                exit={{ x: 300 }}
                className={` z-10 flex  h-full  w-[296px] flex-col gap-4 rounded-xl bg-white p-4  font-[Inter] text-[#1a1a1a] shadow-md`}
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
                      <div className="w-1/2">W</div>
                      <div className="w-1/2">X</div>
                    </div>
                    <div className="flex w-full flex-row">
                      <div className="w-1/2">X</div>
                      <div className="w-1/2">Y</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
              <div className="flex h-[30px] w-[30px] items-center justify-center rounded-md bg-white hover:bg-slate-200  hover:text-white">
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
                  setSelectedDraw("file");
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
      <div className="absolute h-full w-full">
        <canvas
          onMouseDown={onMouseDownWrapper}
          onContextMenu={onRightClickWrapper}
          onMouseUp={onMouseUpWrapper}
          onMouseMove={onMouseMoveWrapper}
          onWheel={handOnWheelMove}
          ref={canvasRef}
          width={600}
          height={600}
          className={` z-2 absolute inset-0 m-auto rounded-lg bg-white ${
            tool === "hand" ? "cursor-grab" : ""
          } ${mouseDown ? "cursor-grabbing" : ""}`}
        ></canvas>
        {isEditingText && (
          <input
            ref={textareaRef}
            className={`font-montserrat absolute   hidden resize-none border-2 border-[#18a0fb] font-bold ring-0 ring-offset-0`}
          ></input>
        )}
      </div>
    </div>
  );
}
