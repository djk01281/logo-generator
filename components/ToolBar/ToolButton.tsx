type ToolButtonProps = {
  onClick: () => void;
  isActive: boolean;
  children: React.ReactNode;
};

export default function ToolButton({
  onClick,
  isActive,
  children,
}: ToolButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-1.5 rounded-md cursor-pointer transition-colors
        ${
          isActive ? "bg-[#0ca3ff] text-white" : "hover:bg-[#eaeaea] text-black"
        }`}
    >
      {children}
    </button>
  );
}
