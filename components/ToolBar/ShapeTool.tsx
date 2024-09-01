import { Shapes } from "lucide-react";

type ShapeToolProps = {
  onClick: () => void;
  isActive: boolean;
};

export default function ShapeTool({ onClick, isActive }: ShapeToolProps) {
  return (
    <div
      onClick={onClick}
      className={`hover:bg-[#0ca3ff] ${
        isActive ? "bg-[#0ca3ff]" : ""
      }  p-1.5 rounded-md group `}
    >
      <Shapes
        className={`stroke-1 ${
          isActive ? "stroke-white" : ""
        } group-hover:stroke-white`}
        size={20}
      />
    </div>
  );
}
