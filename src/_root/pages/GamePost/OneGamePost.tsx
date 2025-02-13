import GamePost from "@/components/shared/GamePost/GamePost";
import {
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { SlOptions } from "react-icons/sl";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import EditGamePost from "./EditGamePost";
import { useUserContext } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";
import {
  useDeleteGamePost,
  useGetGame,
} from "@/lib/react-query/queriesAndMutations/games";

const OneGamePost = () => {
  const { user } = useUserContext();
  const { id } = useParams();
  const { data: post, isPending } = useGetGame(id);
  const { mutateAsync: deleteGame } = useDeleteGamePost();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = async () => {
    const response = await deleteGame(id);
    if (!response) {
      toast({
        variant: "error",
        title: "Uh oh! Something went wrong.",
        description: "Please try again.",
      });
    } else {
      toast({
        variant: "default",
        title: "Your Game is deleted successfully!",
      });
      navigate("/");
    }
  };

  return (
    <>
      {isPending ? (
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 md:w-1/3 w-full mx-auto items-center">
          <div className="flex items-center justify-between p-4 w-full gap-4 shadow-md">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="hover:bg-gray-100 p-4 rounded-md"
              >
                <FaArrowLeft size={25} color="green" />
              </button>
              <h1 className="text-xl">Game</h1>
            </div>
            <AlertDialog>
              {user.id === post?.creator.$id && (
                <DropdownMenu label={<SlOptions size={25} color="green" />}>
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    Edit
                  </DropdownMenuItem>
                  <AlertDialogTrigger>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </AlertDialogTrigger>
                </DropdownMenu>
              )}
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your game from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          {isEditing ? (
            <EditGamePost post={post} setIsEditing={setIsEditing} />
          ) : (
            <GamePost post={post} isOne />
          )}
        </div>
      )}
    </>
  );
};

export default OneGamePost;
