import { Sparkles } from "lucide-react";

type AIToolProps = {
  onClick: () => void;
  isActive: boolean;
};

export default function AITool({ onClick, isActive }: AIToolProps) {
  return (
    <div
      onClick={onClick}
      className={`hover:bg-[#0ca3ff] ${
        isActive ? "bg-[#0ca3ff]" : ""
      }  p-1.5 rounded-md group `}
    >
      <Sparkles
        className={`stroke-1 ${
          isActive ? "stroke-white" : ""
        } group-hover:stroke-white`}
        size={20}
      />
    </div>
  );
}
