import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import NormalPost from "@/components/shared/NormalPost/NormalPost";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { SlOptions } from "react-icons/sl";
import EditNormalPost from "./EditNormalPost";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import {
  useDeleteNormalPost,
  useGetNormalPost,
} from "@/lib/react-query/queriesAndMutations/posts";
import { Helmet } from "react-helmet-async";
const OneNormalPost = () => {
  const { user } = useUserContext();
  const { id } = useParams();
  const { data: post, isPending } = useGetNormalPost(id);
  const { mutateAsync: deletePost } = useDeleteNormalPost();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const handleDelete = async () => {
    const response = await deletePost(id);
    if (!response) {
      toast({
        variant: "error",
        title: "Uh oh! Something went wrong.",
        description: "Please try again.",
      });
    } else {
      toast({
        variant: "default",
        title: "Your post is deleted successfully!",
      });
      navigate("/");
    }
  };
  return (
    <div className="flex flex-col gap-2 md:w-1/3 w-full mx-auto items-center">
      <Helmet>
        <title>Post</title>
      </Helmet>
      <div className="flex items-center justify-between p-4 w-full gap-4 shadow-md">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="hover:bg-gray-100 p-4 rounded-md"
          >
            <FaArrowLeft size={25} color="green" />
          </button>
          <h1 className="text-xl">Post</h1>
        </div>
        <AlertDialog>
          {user.id === post?.creator.$id && (
            <DropdownMenu label={<SlOptions size={25} color="green" />}>
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                Edit
              </DropdownMenuItem>
              <AlertDialogTrigger>
                <DropdownMenuItem onClick={undefined}>Delete</DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenu>
          )}
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                post from our servers.
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

      {!isPending && post && (
        <>
          {isEditing ? (
            <EditNormalPost post={post} setIsEditing={setIsEditing} />
          ) : (
            <NormalPost post={post} isOne />
          )}
        </>
      )}
      {isPending && (
        <div className="flex w-full h-full items-center justify-center">
          <div className="animate-spin text-[5rem]">⚽</div>
        </div>
      )}
      {!post && !isPending && (
        <div className="text-xl h-full mt-10">No post found ❎</div>
      )}
    </div>
  );
};

export default OneNormalPost;
