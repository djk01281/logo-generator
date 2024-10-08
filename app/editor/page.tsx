import Editor from "@/components/Editor/Editor";
import FixedWrapper from "@/components/Wrapper/FixedWrapper";
import LayersPane from "@/components/LayersPane";
import PropertiesPane from "@/components/PropertiesPane";
import ToolBar from "@/components/ToolBar/ToolBar";

export default function EditorPage() {
  return (
    <main className="w-full min-h-100vh">
      <Editor />
      <FixedWrapper>
        <ToolBar side="bottom" />
        <LayersPane side="left" />
        <PropertiesPane side="right" />
      </FixedWrapper>
    </main>
  );
}
