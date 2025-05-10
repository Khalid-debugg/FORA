import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { IoPeopleSharp } from "react-icons/io5";
import { Button } from "@/components/ui/button";

const PeopleYouMayKnow = ({
  peopleYouMayKnow,
  isGettingUsers,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-lg border-2 divide-y-2 divide-primary-500 border-primary-500">
      <div className="p-2 flex gap-3 items-center">
        <IoPeopleSharp size={30} color="#30cc42" />
        <h2 className="font-bold">People You May Know</h2>
      </div>

      <div className="p-2 flex flex-col gap-2">
        {isGettingUsers && <p className="text-center animate-spin">⚽</p>}
        {!isGettingUsers &&
          peopleYouMayKnow.map((user) => (
            <div
              key={user.username}
              className="p-4 border border-slate-200 flex gap-4 items-center rounded-lg justify-between"
            >
              <div className="flex gap-2 items-center">
                <Avatar className="hover:cursor-pointer">
                  <AvatarImage
                    className="h-10 w-10 rounded-full outline outline-slate-200"
                    src={user.imageUrl}
                  />
                </Avatar>
                <p className="text-lg font-medium">{user.name}</p>
              </div>
              <Button
                className="shad-button_primary hover:shad-button_ghost"
                onClick={() => {
                  navigate(`/profile/${user.$id}`);
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

export default PeopleYouMayKnow;
