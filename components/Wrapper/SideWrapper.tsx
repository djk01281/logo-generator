const sideStyle = {
  left: "left-0",
  right: "right-0 ",
  top: "top-0 left-1/2 -translate-x-1/2",
  bottom: "bottom-0 left-1/2 -translate-x-1/2",
};

type SideWrapperProps = {
  side: side;
  children: React.ReactNode;
};

export default function SideWrapper({ side, children }: SideWrapperProps) {
  return (
    <div
      className={`absolute
    ${sideStyle[side]}
    `}
    >
      {children}
    </div>
  );
}
