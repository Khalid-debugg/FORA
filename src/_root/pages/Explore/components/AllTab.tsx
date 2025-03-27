import { useNavigate } from "react-router-dom";
import { Models } from "appwrite";
import UserCard from "@/components/shared/UserCard";
import NormalPost from "@/components/shared/NormalPost/NormalPost";
import GamePost from "@/components/shared/GamePost/GamePost";

interface AllTabProps {
  query: string;
  onTabChange: (tab: "posts" | "games" | "users") => void;
  posts: Models.Document[];
  games: Models.Document[];
  users: Models.Document[];
  isLoading: boolean;
}

const AllTab = ({
  query,
  onTabChange,
  posts,
  games,
  users,
  isLoading,
}: AllTabProps) => {
  const navigate = useNavigate();

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

  if (posts.length === 0 && games.length === 0 && users.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {query ? "No results found" : "No content available"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Posts</h2>
            <button
              onClick={() => onTabChange("posts")}
              className="text-sm text-primary hover:underline"
            >
              View all
            </button>
          </div>
          <div className="space-y-4">
            {posts.slice(0, 3).map((post) => (
              <NormalPost key={post.$id} post={post} />
            ))}
          </div>
        </div>
      )}

      {games.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Games</h2>
            <button
              onClick={() => onTabChange("games")}
              className="text-sm text-primary hover:underline"
            >
              View all
            </button>
          </div>
          <div className="space-y-4">
            {games.slice(0, 3).map((game) => (
              <GamePost key={game.$id} post={game} isOne={false} />
            ))}
          </div>
        </div>
      )}

      {users.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">People</h2>
            <button
              onClick={() => onTabChange("users")}
              className="text-sm text-primary hover:underline"
            >
              View all
            </button>
          </div>
          <div className="space-y-4">
            {users.slice(0, 3).map((user) => (
              <div
                key={user.$id}
                onClick={() => navigate(`/profile/${user.$id}`)}
                className="cursor-pointer"
              >
                <UserCard user={user} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AllTab;
