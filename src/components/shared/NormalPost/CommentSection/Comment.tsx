import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useEffect, useState } from "react";
import { BiSolidLike } from "react-icons/bi";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import RepliesSection from "../RepliesSection/RepliesSection";
import { useUserContext } from "@/context/AuthContext";
import {
  useLikeComment,
  useUnlikeComment,
  // useEditComment,
  // useDeleteComment,
} from "@/lib/react-query/queriesAndMutations/comments";

const Comment = ({ comment, mimeType }) => {
  const { user } = useUserContext();

  const [isRepliesClicked, setIsRepliesClicked] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState(comment?.content || "");

  const { mutateAsync: createLike, isPending: isLiking } = useLikeComment(
    comment,
    user.id,
  );
  const { mutateAsync: deleteLike, isPending: isDisliking } = useUnlikeComment(
    comment,
    user.id,
  );
  // const { mutateAsync: editComment } = useEditComment(comment);
  // const { mutateAsync: deleteComment } = useDeleteComment(comment);

  const [isLiked, setIsLiked] = useState(false);

  const handleLikeComment = async () => {
    const response = await createLike();
    if (response instanceof Error) return;
    setIsLiked(true);
  };

  const handleUnlikeComment = async () => {
    const response = await deleteLike();
    if (response instanceof Error) return;
    setIsLiked(false);
  };

  // const handleEditComment = async () => {
  //   const response = await editComment({ content: editedContent });
  //   if (response instanceof Error) return;
  //   setIsEditMode(false);
  // };

  // const handleDeleteComment = async () => {
  //   const response = await deleteComment();
  //   if (response instanceof Error) return;
  //   // Optionally, you can handle removing the comment from the UI here.
  // };

  useEffect(() => {
    if (comment?.likes?.some((likedUser) => likedUser.$id === user?.id)) {
      setIsLiked(true);
    }
  }, [comment, user]);

  return (
    <div className="flex flex-col">
      <div key={comment?.$id} className="flex gap-4 items-center">
        <Avatar className="hover:cursor-pointer self-start">
          <AvatarImage
            className="h-12 w-12 rounded-full outline outline-slate-200"
            src={comment?.creator?.imageUrl}
          />
          <AvatarFallback>{comment?.creator?.username}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          {isEditMode ? (
            <div className="flex flex-col gap-2">
              <textarea
                className="w-full p-2 border rounded-lg"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
              />
              <div className="flex gap-2">
                {/* <button
                  className="text-sm bg-green-500 text-white px-2 py-1 rounded-lg"
                  onClick={handleEditComment}
                >
                  Save
                </button> */}
                <button
                  className="text-sm bg-red-500 text-white px-2 py-1 rounded-lg"
                  onClick={() => setIsEditMode(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-100 flex-1 p-2 rounded-lg">
              <p>{comment?.content}</p>
              {comment?.mediaUrl && mimeType?.mimeType?.includes("image") ? (
                <img
                  src={comment?.mediaUrl}
                  alt="comment"
                  className="w-32 h-32 object-cover rounded-lg"
                />
              ) : comment?.mediaUrl && mimeType?.mimeType?.includes("video") ? (
                <video
                  src={comment?.mediaUrl}
                  controls
                  className="w-32 h-32 object-cover rounded-lg"
                ></video>
              ) : null}
            </div>
          )}
        </div>
        {comment?.likes?.length > 0 && (
          <div className="flex gap-1">
            <p className="text-sm">{comment?.likes?.length}</p>
            <BiSolidLike fill="green" size={20} />
          </div>
        )}
      </div>
      <div className="flex gap-8 pl-16">
        <button
          className="text-sm"
          onClick={() => setIsRepliesClicked((prev) => !prev)}
        >
          Reply
        </button>
        {!isLiked ? (
          <button
            disabled={isDisliking || isLiking}
            className="text-sm"
            onClick={handleLikeComment}
          >
            Like
          </button>
        ) : (
          <button
            disabled={isDisliking || isLiking}
            className="text-sm"
            onClick={handleUnlikeComment}
          >
            Unlike
          </button>
        )}
        {user?.id === comment?.creator?.$id && (
          <>
            <button
              className="text-sm text-blue-500"
              onClick={() => setIsEditMode(true)}
            >
              Edit
            </button>
            {/* <button
              className="text-sm text-red-500"
              onClick={handleDeleteComment}
            >
              Delete
            </button> */}
          </>
        )}
      </div>
      {comment?.replies?.length > 0 && (
        <button
          onClick={() => setIsRepliesClicked((prev) => !prev)}
          className="flex items-center gap-1 self-center"
        >
          View
          <span>{comment?.replies?.length === 1 ? " reply" : " replies"}</span>
          {!isRepliesClicked ? (
            <IoIosArrowDown size={20} />
          ) : (
            <IoIosArrowUp size={20} />
          )}
        </button>
      )}
      <RepliesSection comment={comment} isRepliesClicked={isRepliesClicked} />
    </div>
  );
};

export default Comment;
