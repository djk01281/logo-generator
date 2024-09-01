import { Type } from "lucide-react";

type TextToolProps = {
  onClick: () => void;
  isActive: boolean;
};

export default function TextTool({ onClick, isActive }: TextToolProps) {
  return (
    <div
      onClick={onClick}
      className={`hover:bg-[#0ca3ff] ${
        isActive ? "bg-[#0ca3ff]" : ""
      }  p-1.5 rounded-md group `}
    >
      <Type
        className={`stroke-1 ${
          isActive ? "stroke-white" : ""
        } group-hover:stroke-white`}
        size={20}
      />
    </div>
  );
}
