import AITool from "./AITool";
import ModeTool from "./ModeTool";
import PenTool from "./PenTool";
import ShapeTool from "./ShapeTool";
import SideWrapper from "./SideWrapper";
import TextTool from "./TextTool";

type ToolBarProps = {
  side: side;
};
export default function ToolBar({ side }: ToolBarProps) {
  return (
    <SideWrapper side={side}>
      <div className="bg-white rounded-lg border-[1px] border-gray-500 p-3 flex flex-row gap-3">
        <ModeTool />
        <AITool />
        <ShapeTool />
        <PenTool />
        <TextTool />
      </div>
    </SideWrapper>
  );
}
