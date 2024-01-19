import { forwardRef } from "react";
import Image from "next/image";

type historyCardProps = {
  url: string;
};

export const HistoryCard = forwardRef<HTMLImageElement, historyCardProps>(
  ({ url }, ref) => {
    return (
      <div className="rounded border-[1px] border-[#eaeaea] p-4">
        <Image
          placeholder="blur"
          src={url}
          ref={ref}
          alt="history image"
          width={326}
          height={326}
          blurDataURL="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBAB  bWyZJf74GZgAAAABJRU5ErkJggg=="
          // lazyBoundary=""
        ></Image>
      </div>
    );
  },
);
HistoryCard.displayName = "History";
