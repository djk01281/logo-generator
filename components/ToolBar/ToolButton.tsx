type ToolButtonProps = {
  onClick: () => void;
  isActive: boolean;
  Icon: React.ComponentType<{ size: number; className?: string }>;
};

export default function ToolButton({
  onClick,
  isActive,
  Icon,
}: ToolButtonProps) {
  return (
    <div
      onClick={onClick}
      className={`hover:bg-[#0ca3ff] ${
        isActive ? "bg-[#0ca3ff]" : ""
      } p-1.5 rounded-md group cursor-pointer`}
    >
      <Icon
        className={`stroke-1 ${
          isActive ? "stroke-white" : ""
        } group-hover:stroke-white`}
        size={20}
      />
    </div>
  );
}
