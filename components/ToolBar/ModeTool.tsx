import { MousePointer2 } from "lucide-react";

type ModeToolProps = {
  onClick: () => void;
  isActive: boolean;
};

// TODO: Lighter background color for hover
export default function ModeTool({ onClick, isActive }: ModeToolProps) {
  return (
    <div
      onClick={onClick}
      className={`hover:bg-[#0ca3ff] ${
        isActive ? "bg-[#0ca3ff]" : ""
      }  p-1.5 rounded-md group `}
    >
      <MousePointer2
        className={`stroke-1 ${
          isActive ? "stroke-white" : ""
        } group-hover:stroke-white`}
        size={20}
      />
    </div>
  );
}
