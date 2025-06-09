import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarImage } from "../ui/avatar";
import { GoHeart } from "react-icons/go";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

const UsersList = ({
  listItems,
  isLoadingLikes,
  isFetchingNextPage,
  hasNextPage,
}: {
  listItems: any;
  isLoadingLikes: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
}) => {
  const allLikes = listItems?.pages?.flat() || [];
  if (!allLikes.length) return;
  if (isLoadingLikes)
    return <p className="text-2xl text-center animate-spin">⚽</p>;
  return (
    <AlertDialog>
      <AlertDialogTrigger className="hover:underline flex gap-1 items-center">
        <div className="text-sm">{allLikes?.length}</div>{" "}
        <GoHeart size={20} fill="green" />
      </AlertDialogTrigger>
      <AlertDialogContent className="z-[100]">
        <AlertDialogHeader>
          <AlertDialogTitle>{"Likes"}</AlertDialogTitle>
          <AlertDialogDescription> </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col gap-2 pr-2 max-h-[80vh] overflow-auto">
          {allLikes?.map((like) => (
            <div
              key={like?.$id}
              className="p-4 border border-primary-500 flex gap-4 items-center rounded-lg"
            >
              <Avatar className="hover:cursor-pointer">
                <AvatarImage
                  className="h-10 w-10 rounded-full outline outline-slate-200"
                  src={like?.userImageUrl}
                />
              </Avatar>
              <Link
                to={`/profile/${like?.userId}`}
                className="text-lg font-medium hover:underline hover:cursor-pointer"
              >
                {like?.userName}
              </Link>
            </div>
          ))}
          {hasNextPage && (
            <Button className="shad_button-Primary hover:shad_button-ghost">
              {isFetchingNextPage ? "Loading more..." : "Load More"}
            </Button>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UsersList;
