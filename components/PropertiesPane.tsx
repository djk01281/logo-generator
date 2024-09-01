import SideWrapper from "./Wrapper/SideWrapper";

type PropertiesPaneProps = {
  side: side;
};

export default function PropertiesPane({ side }: PropertiesPaneProps) {
  return <SideWrapper side={side}>PropertiesPane</SideWrapper>;
}
