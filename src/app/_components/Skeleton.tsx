type skeletonProps = {
  className: string;
};

export const Skeleton = ({ className }: skeletonProps) => {
  return (
    <div className={`rouned-md animate-pulse bg-black ${className}`}>
      Loading
    </div>
  );
};
