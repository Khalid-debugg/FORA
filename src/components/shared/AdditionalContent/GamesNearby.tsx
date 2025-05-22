import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TbSoccerField } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

const GamesNearby = ({
  gamesNearby,
  isGettingGamesNearby,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}) => {
  const navigate = useNavigate();
  return (
    <div className="rounded-lg border divide-y divide-primary-500 border-primary-500">
      <div className="p-2 flex gap-3 items-center">
        <TbSoccerField size={30} color="#30cc42" />
        <h2 className="font-bold">Games Nearby</h2>
      </div>

      <div className="p-2 flex flex-col gap-2">
        {isGettingGamesNearby && <p className="text-center animate-spin">⚽</p>}
        {!isGettingGamesNearby &&
          gamesNearby.map((game) => (
            <div
              key={game.$id}
              className="p-4 border border-slate-200 flex gap-4 items-center rounded-lg justify-between"
            >
              <div className="flex gap-2 items-center">
                <Avatar className="hover:cursor-pointer">
                  <AvatarImage
                    className="h-10 w-10 rounded-full outline outline-slate-200"
                    src={game.creator?.imageUrl}
                  />
                </Avatar>
                <div>
                  <p className="text-lg font-bold">{game.caption}</p>
                  <p className="text-sm text-slate-600">{game.location}</p>
                </div>
              </div>
              <Button
                className="shad-button_primary hover:shad-button_ghost"
                onClick={() => {
                  navigate(`/game-post/${game.$id}`);
                }}
                variant="outline"
                size="sm"
              >
                View
              </Button>
            </div>
          ))}

        {hasNextPage && (
          <Button
            className="mt-4 self-center"
            onClick={fetchNextPage}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? "Loading..." : "Show More"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default GamesNearby;
