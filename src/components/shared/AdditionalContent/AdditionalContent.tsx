import { useUserContext } from "@/context/AuthContext";
import { useGetUsersYouMayKnow } from "@/lib/react-query/queriesAndMutations/users";
import { useMemo } from "react";
import PeopleYouMayKnow from "./PeopleYouMayKnow";
import { useGetFriends } from "@/lib/react-query/queriesAndMutations/friendship";
import { useGetGamesNearby } from "@/lib/react-query/queriesAndMutations/games";
import GamesNearby from "./GamesNearby";
import HypeCorner from "./HypeCorner";

const AdditionalContent = () => {
  const { user } = useUserContext();
  const { data: friends } = useGetFriends(user.id);
  const {
    data: users,
    isPending: isGettingUsers,
    fetchNextPage: fetchNextUsersPage,
    hasNextPage: hasNextUsersPage,
    isFetchingNextPage: isFetchingNextUsersPage,
  } = useGetUsersYouMayKnow(user, friends);
  const peopleYouMayKnow = useMemo(() => users?.pages.flat() || [], [users]);
  const {
    data: games,
    isPending: isGettingGamesNearby,
    fetchNextPage: fetchNextGamesPage,
    hasNextPage: hasNextGamesPage,
    isFetchingNextPage: isFetchingNextGamesPage,
  } = useGetGamesNearby(user);
  const gamesNearby = useMemo(() => games?.pages.flat() || [], [games]);

  return (
    <div className="fixed right-0 top-0 p-2 w-1/3 max-w-1/3 h-screen hidden md:flex flex-col gap-5">
      <HypeCorner />
      {peopleYouMayKnow.length > 0 && (
        <PeopleYouMayKnow
          peopleYouMayKnow={peopleYouMayKnow}
          isGettingUsers={isGettingUsers}
          fetchNextPage={fetchNextUsersPage}
          hasNextPage={hasNextUsersPage}
          isFetchingNextPage={isFetchingNextUsersPage}
        />
      )}
      {gamesNearby.length > 0 && (
        <GamesNearby
          gamesNearby={gamesNearby}
          isGettingGamesNearby={isGettingGamesNearby}
          fetchNextPage={fetchNextGamesPage}
          hasNextPage={hasNextGamesPage}
          isFetchingNextPage={isFetchingNextGamesPage}
        />
      )}
    </div>
  );
};

export default AdditionalContent;
