import SideWrapper from "./Wrapper/SideWrapper";

type LayersPaneProps = {
  side: side;
};

export default function LayersPane({ side }: LayersPaneProps) {
  return <SideWrapper side={side}>LayersPane</SideWrapper>;
}
