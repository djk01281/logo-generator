"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { api } from "../../../trpc/react";
import { HistoryCard } from "./HistoryCards";
import { useSession } from "next-auth/react";

export const History = () => {
  type historyWithURL = {
    id: number;
    prompt: string;
    authorId: string;
    imageKey: string;
    userId: string | null;
    imageURL: string | null;
  }[];
  const [history, setHistory] = useState<historyWithURL>([]);
  const { data: session } = useSession();
  // const lastRef = useRef<HTMLImageElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    api.history.view.useInfiniteQuery(
      {
        id: session?.user.id ?? "",
        limit: 4,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );
  const observer = useRef<IntersectionObserver | null>(null);
  const lastRef = useCallback(
    (node: HTMLImageElement) => {
      if (isFetchingNextPage) return;
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((nodes) => {
        if (nodes[0]?.isIntersecting && hasNextPage) {
          console.log("near the last post");
          void fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage],
  );

  useEffect(() => {
    const historyArray = data?.pages.flatMap((page) => page.history);
    if (historyArray && historyArray.length !== 0) {
      setHistory([...historyArray]);
    }
  }, [data]);

  return (
    <div className="mt-48 flex w-full items-center">
      <div className="grid w-full grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-10 lg:gap-x-8">
        {history.map((element, i) =>
          i === history.length - 1 ? (
            <HistoryCard
              ref={lastRef}
              key={i}
              url={element.imageURL ?? ""}
            ></HistoryCard>
          ) : (
            <HistoryCard key={i} url={element.imageURL ?? ""}></HistoryCard>
          ),
        )}
      </div>
    </div>
  );
};
