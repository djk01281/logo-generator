"use client";

import { useSVG } from "~/hooks/usSVG";
import { useHand } from "~/hooks/useHand";
import { useSelect } from "~/hooks/useSelect";
import { useState, useRef } from "react";
import { parsePath, absolutize, normalize, serialize } from "path-data-parser";
import ToolBox from "./_components/ToolBox";
import Link from "next/link";
import { Just_Another_Hand } from "next/font/google";
import Generate from "~/app/generate/page";

const just = Just_Another_Hand({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-just_another_hand",
});

interface PageProps {}

export default function Editor() {
  const [tool, setTool] = useState<Tool>("select");
  const { svg, setSVG, setSelected, moveSelected } = useSVG(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { onMouseDown, mouseDown } = useHand(onPan, onZoom, canvasRef, tool);
  const { onSelectMouseDown, onSelectMouseUp, onSelectMouseMove } = useSelect(
    onMove,
    onHover,
    onSelect,
    canvasRef,
    tool,
  );

  const [panOffset, setPanOffset] = useState<Point>({ x: 0, y: 0 });
  const [scale, setScale] = useState<Point>({ x: 1, y: 1 });
  const [path2Ds, setPath2Ds] = useState<Path2D[]>([]);
  const [point2Ds, setPoint2Ds] = useState<Path2D[]>([]);
  const [selectedPath, setSelectedPath] = useState<number | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
  const [selectedDraw, setSelectedDraw] = useState<string | null>(null);

  function onPan({ ctx, currentPoint, prevPoint }: Pan) {
    if (!prevPoint) return;
    const dx = currentPoint.x - prevPoint.x;
    const dy = currentPoint.y - prevPoint.y;
    setPanOffset({ x: panOffset.x + dx, y: panOffset.y + dy });

    clear();
    ctx.translate(dx, dy);
    clear();
    if (!svg) return;
    drawSVG(ctx, svg, path2Ds);
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
    setScale({ x: scaleX, y: scaleY });
    ctx.translate(xOffSet, yOffSet);
    ctx.scale(scaleX, scaleY);
    ctx.translate(-xOffSet, -yOffSet);

    clear();
    if (!svg) return;
    drawSVG(ctx, svg, path2Ds);
    drawSVGPoints(ctx, svg);
  }

  function onSelect({ ctx, currentPoint }: Select) {
    if (!svg) return;
    if (!path2Ds) return;

    let continueFlag = true;
    if (selectedPath !== null) {
      point2Ds.forEach((point2D, i) => {
        if (ctx.isPointInPath(point2D, currentPoint.x, currentPoint.y)) {
          setSelectedPoint(i);
          console.log("Selected point", i);
          continueFlag = false;
        }
      });
    }

    if (!continueFlag) return;

    setSelectedPath(null);
    setSelectedPoint(null);
    path2Ds.forEach((path2D, i) => {
      if (ctx.isPointInPath(path2D, currentPoint.x, currentPoint.y)) {
        console.log("Selected path", i);
        setSelectedPath((prev) => i);
      }
    });
    clear();
    drawSVG(ctx, svg, path2Ds);
    drawSVGPoints(ctx, svg);
  }

  const drawSVG = (
    ctx: CanvasRenderingContext2D,
    svg: SVG,
    path2Ds: Path2D[],
  ) => {
    if (!svg) return;
    path2Ds.map((path, i) => {
      ctx.fillStyle = svg[i].fill;
      ctx.fill(path);
    });
  };

  //Loop through the SVG, loop through paths, loop through segments, draw points as red dots
  const drawSVGPoints = (ctx: CanvasRenderingContext2D, svg: SVG) => {
    if (!svg) return;
    if (selectedPath === null) return;
    const { d, fill } = svg[selectedPath];
    const newPoint2Ds: Path2D[] = [];
    ctx.fillStyle = fill;
    d.map((segment) => {
      const { key, data } = segment;
      const endPoint = data[data.length - 1];
      if (!endPoint) return;

      const point2D = new Path2D();

      newPoint2Ds.push(point2D);
      ctx.fillStyle = "blue";

      if (newPoint2Ds.length - 1 === selectedPoint) {
        ctx.fillStyle = "orange";
      }
      point2D.rect(endPoint.x - 2, endPoint.y - 2, 4, 4);
      ctx.fill(point2D);
    });
    setPoint2Ds(newPoint2Ds);
  };

  const drawOutline = (ctx: CanvasRenderingContext2D, path: Path2D) => {
    ctx.strokeStyle = "blue";
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

    const newSVG = [...svg];

    newSVG[selectedPath].d.map((segment) => {
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
    newSVG[selectedPath].d.map((segment) => {
      const data: number[] = [];
      const key = segment.key;
      segment.data.map((point) => {
        data.push(point.x, point.y);
      });

      newPath.push({ key: key, data: data });
    });

    const serialized = serialize(newPath);
    console.log(serialized);
    const newPath2D = new Path2D(serialized);
    setSVG(newSVG);
    const newPath2Ds = [...path2Ds];
    newPath2Ds[selectedPath] = newPath2D;
    setPath2Ds(newPath2Ds);
    clear();
    drawSVG(ctx, newSVG, newPath2Ds);
    drawSVGPoints(ctx, newSVG);
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
      setPath2Ds(converted.path2Ds);

      const svg = converted.svg;
      const path2Ds = converted.path2Ds;

      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;

      clear();
      drawSVG(ctx, svg, path2Ds);
      drawSVGPoints(ctx, svg);
    };
    reader.readAsText(file);
  };

  const onSVGComplete = (svgString: string) => {
    const converted = stringToSVGandPath2Ds(svgString);
    setSVG(converted.svg);
    setPath2Ds(converted.path2Ds);

    const svg = converted.svg;
    const path2Ds = converted.path2Ds;

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    clear();
    drawSVG(ctx, svg, path2Ds);
    drawSVGPoints(ctx, svg);

    setSelectedDraw(null);
  };

  const stringToSVGandPath2Ds = (
    svgString: string,
  ): { svg: SVG; path2Ds: Path2D[] } => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, "image/svg+xml");
    const paths = Array.from(doc.querySelectorAll("path"));
    const path2DsTemp: Path2D[] = [];
    const svg: SVG = paths.map((path) => {
      const dString = path.getAttribute("d");

      if (dString) {
        const p = new Path2D(dString);
        path2DsTemp.push(p);
      }

      const dSegments = normalize(absolutize(parsePath(dString || "")));
      const d = dSegments.map((segment) => {
        const key = segment.key;

        if (key === "M" || key === "L") {
          return {
            key: key,
            data: [{ x: segment.data[0], y: segment.data[1] }],
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
              { x: segment.data[0], y: segment.data[1] },
              { x: segment.data[2], y: segment.data[3] },
              { x: segment.data[4], y: segment.data[5] },
            ],
          };
        }
      });
      const fill = path.getAttribute("fill") || "black";
      return { d, fill };
    });

    return { svg: svg, path2Ds: path2DsTemp };
  };

  function onHover({ ctx, currentPoint }: Hover) {
    if (!svg) return;
    if (!currentPoint) return;

    clear();
    drawSVG(ctx, svg, path2Ds);
    drawSVGPoints(ctx, svg);
    path2Ds.forEach((path2D, i) => {
      if (ctx.isPointInPath(path2D, currentPoint.x, currentPoint.y)) {
        drawOutline(ctx, path2D);
      }
    });

    point2Ds.forEach((point2D) => {
      if (ctx.isPointInPath(point2D, currentPoint.x, currentPoint.y)) {
        ctx.fillStyle = "red";
        ctx.fill(point2D);
      }
    });
  }

  function onPointMove(ctx: CanvasRenderingContext2D, dx: number, dy: number) {
    if (!svg) return;
    if (selectedPath === null) return;
    if (selectedPoint === null) return;

    const path2D = path2Ds[selectedPath];

    const segment = svg[selectedPath].d[selectedPoint];
    const data = [...segment.data];
    data.forEach((point) => {
      point.x += dx;
      point.y += dy;
    });

    type Segment = {
      key: string;
      data: number[];
    };

    const newSegment: Segment = { key: segment.key, data: [] };
    data.forEach((point) => {
      newSegment.data.push(point.x, point.y);
    });

    const newSegments: Segment[] = [];

    svg[selectedPath].d.forEach((segment, i) => {
      if (i === selectedPoint) {
        newSegments.push(newSegment);
      } else {
        const seg: number[] = [];
        segment.data.forEach((point) => {
          seg.push(point.x, point.y);
        });
        newSegments.push({ key: segment.key, data: seg });
      }
    });

    const serialized = serialize(newSegments);
    const newPath2D = new Path2D(serialized);
    const newPath2Ds = [...path2Ds];
    newPath2Ds[selectedPath] = newPath2D;
    setPath2Ds(newPath2Ds);

    clear();
    drawSVG(ctx, svg, newPath2Ds);
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

  console.log(selectedDraw);
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
      console.log("No prevPoint");
      return;
    }

    if (selectedPoint !== null) {
      const dx = currentPoint.x - prevPoint.x;
      const dy = currentPoint.y - prevPoint.y;
      onPointMove(ctx, dx, dy);
      return;
    }

    console.log("Moving");
    const dx = currentPoint.x - prevPoint.x;
    const dy = currentPoint.y - prevPoint.y;
    const path = path2Ds[selectedPath];
    onPathMove(ctx, path, dx, dy);
  }

  const onMouseDownWrapper = (e: React.MouseEvent<HTMLCanvasElement>) => {
    onMouseDown();
    onSelectMouseDown(e);
  };

  const onMouseUpWrapper = (e: React.MouseEvent<HTMLCanvasElement>) => {
    onSelectMouseUp();
  };

  const onMouseMoveWrapper = (e: React.MouseEvent<HTMLCanvasElement>) => {
    onSelectMouseMove(e);
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#F3F4F6]">
      <div className="flex h-full w-full flex-col">
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
              onClick={() => {
                setSelectedDraw("aiInput");
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
              onClick={() => {
                setSelectedDraw("fileInput");
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
            className={`visible  w-[296px] bg-white shadow-md ${
              selectedPath === null ? "invisible" : ""
            } h-full rounded-xl`}
          ></div>
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
        onMouseUp={onMouseUpWrapper}
        onMouseMove={onMouseMoveWrapper}
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
