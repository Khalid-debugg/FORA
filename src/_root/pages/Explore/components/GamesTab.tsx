import { useEffect, useRef } from "react";
import { Models } from "appwrite";
import GamePost from "@/components/shared/GamePost/GamePost";

interface GamesTabProps {
  query: string;
  games: Models.Document[];
  isLoading: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
}

const GamesTab = ({
  query,
  games,
  isLoading,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: GamesTabProps) => {
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-[200px] bg-gray-200 animate-pulse rounded" />
              <div className="h-4 w-[150px] bg-gray-200 animate-pulse rounded" />
            </div>
            <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
            <div className="h-4 w-[80%] bg-gray-200 animate-pulse rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {query ? "No games found" : "No games available"}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {games.map((game) => (
        <GamePost key={game.$id} post={game} isOne={false} />
      ))}
      <div ref={observerRef}>
        {hasNextPage && isFetchingNextPage && (
          <div className="animate-spin text-center text-3xl">⚽</div>
        )}
        {!hasNextPage && games.length > 0 && (
          <div className="text-center text-slate-500 py-4 text-muted-foreground">
            No more games to show
          </div>
        )}
      </div>
    </div>
  );
};

export default GamesTab;
