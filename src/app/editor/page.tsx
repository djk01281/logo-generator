"use client";
import { useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import React from "react";
import { parsePath } from "path-data-parser";
import { pointsOnBezierCurves } from "points-on-curve";
import type { Point } from "points-on-curve";
import type { Segment } from "path-data-parser/lib/parser";
import { curveToBezier } from "points-on-curve/lib/curve-to-bezier.js";

import simplify from "simplify-js";

export default function EditorPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    //do something
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const svgContent = e.target?.result as string;
        drawSVGOnCanvas(svgContent);
        extractCurvesFromSVG(svgContent);
        // console.log(svgContent);
      };
      reader.readAsText(file);
    }
  };

  const [paths, setPaths] = useState<string[]>([]);
  const [points, setPoints] = useState<number[][]>([]);
  type segment = {
    key: string;
    data: number[];
  };

  const extractCurvesFromSVG = (svgContent: string) => {
    // const pathData = parsePath(svgContent);
    // console.log("Extraced Path Data", pathData);
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, "image/svg+xml");
    const pathElements = doc.getElementsByTagName("path");
    const segments: Segment[][] = [];
    for (const element of pathElements) {
      //   segments.push(parsePath(element.getAttribute("d") ?? ""));
      const segments = parsePath(element.getAttribute("d") ?? "");
      setPaths([...paths, element.getAttribute("d") ?? ""]);
      //   const points = pathToPoints(segments);
      //   const pointsAsObj = pointArrToObj(points);
      //   const simplePointsAsObj = simplify(pointsAsObj, 1);
      //   const simplePointsAsArr = pointObjToArr(simplePointsAsObj);
      //   const bcurve = curveToBezier(simplePointsAsArr, 0.5);
      console.log(getPoints(segments));
      setPoints([...points, ...getPoints(segments)]);
    }
  };

  const getPoints = (segments: Segment[]) => {
    const points: number[][] = [];
    segments.map((segment, i) => {
      if (segment.key === "M") {
        points.push(segment.data);
      } else if (segment.key === "C") {
        if (segment.data.length === 6 && i !== segments.length - 2) {
          points.push([segment.data[4] ?? 0, segment.data[5] ?? 0]);
        }
      }
    });
    return points;
  };

  const pointArrToObj = (pointArr: Point[]) => {
    const pointsAsObj = [];
    for (const p of pointArr) {
      pointsAsObj.push({
        x: p[0],
        y: p[1],
      });
    }
    return pointsAsObj;
  };

  type pointObj = {
    x: number;
    y: number;
  };

  const pointObjToArr = (pointObj: pointObj[]) => {
    const pointsArr = [];
    for (const p of pointObj) {
      pointsArr.push([p.x, p.y] as Point);
    }
    return pointsArr;
  };

  const pathToPoints = (segments: segment[]) => {
    let points: Point[] = [];
    let lastPoint: Point = [0, 0];
    segments.map(({ key, data }) => {
      if (key === "C" && data.length === 6) {
        const curve = [
          lastPoint,
          [data[0], data[1]],
          [data[2], data[3]],
          [data[4], data[5]],
        ] as Point[];
        points = [
          ...points,
          ...pointsOnBezierCurves(curve, 0.2, 0.15),
        ] as Point[];
        lastPoint = curve[curve.length - 1]!;
      }
    });
    return points;
  };

  const drawSVGOnCanvas = (svgContent: string) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas?.width ?? 0, canvas?.height ?? 0);

      const img = new Image();
      img.src = `data:image/svg+xml;base64,${btoa(svgContent)}`;
      img.onload = () => {
        ctx.drawImage(
          img,
          (canvas?.width ?? 0) / 6,
          (canvas?.height ?? 0) / 6,
          ((canvas?.width ?? 0) * 2) / 3,
          ((canvas?.height ?? 0) * 2) / 3,
        );
      };
    }
  };
  return (
    <div className="flex min-h-[80vh] flex-col items-center">
      <h1 className="mb-20 mt-36 text-center font-serif text-5xl font-extrabold tracking-tight text-black ">
        Editory
      </h1>
      <input
        type="file"
        accept=".svg"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="mb-20"
      />
      <svg>
        <g>
          {
            // if(paths.length !== 0){
            paths.map((path, i) => {
              return <path key={i} d={path} fill="none" stroke="black" />;
            })
            // }
          }
        </g>
        <g>
          {points.map((p, i) => {
            return <circle cx={p[0]} cy={p[1]} r="2" fill="red" key={i} />;
          })}
        </g>
      </svg>
    </div>
  );
}
