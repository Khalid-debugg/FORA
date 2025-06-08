import GamePost from "@/components/shared/GamePost/GamePost";
import Spinner from "@/components/ui/loadingSpinner";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetRecentGames } from "@/lib/react-query/queriesAndMutations/games";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Games = () => {
  const { id } = useParams();
  const {
    data: games,
    isPending,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useGetRecentGames(id || "");

  const [allGames, setAllGames] = useState([]);

  useEffect(() => {
    if (games) {
      setAllGames(games?.pages.flat());
    }
  }, [games]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="w-full">
      {isPending ? (
        <div className="flex w-full h-full items-center justify-center">
          <div className="flex flex-col space-y-3 w-full">
            <Skeleton className="h-[125px] w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {allGames.map((game) => (
            <GamePost key={game?.$id} post={game} isOne={false} />
          ))}
        </div>
      )}
      {isFetchingNextPage && (
        <div className="flex w-full items-center justify-center p-4">
          <div className="animate-spin text-[3rem]">⚽</div>
        </div>
      )}
      {!hasNextPage && allGames.length > 0 && !isFetchingNextPage && (
        <div className="text-center text-gray-500 p-4">No more Games</div>
      )}
      {!isPending && allGames.length === 0 && !isFetchingNextPage && (
        <div className="text-center text-gray-500 p-4">No Games available</div>
      )}
    </div>
  );
};
export default Games;
