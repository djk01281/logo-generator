import SideWrapper from "./SideWrapper";

type PropertiesPaneProps = {
  side: side;
};

export default function PropertiesPane({ side }: PropertiesPaneProps) {
  return <SideWrapper side={side}>PropertiesPane</SideWrapper>;
}
