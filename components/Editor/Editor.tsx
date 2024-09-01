"use client";
import RenderCanvas from "./RenderCanvas";
import UICanvas from "./UICanvas";

export default function Editor() {
  return (
    <div>
      <>
        <UICanvas />
        <RenderCanvas />
      </>
    </div>
  );
}
