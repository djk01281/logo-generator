type FixedWrapperProps = {
  children: React.ReactNode;
};

export default function FixedWrapper({ children }: FixedWrapperProps) {
  return <div className="fixed top-4 left-4 right-4 bottom-4">{children}</div>;
}
