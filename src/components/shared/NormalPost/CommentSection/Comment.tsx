import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useEffect, useState } from "react";
import { BiSolidLike } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import RepliesSection from "../RepliesSection/RepliesSection";
import {
  useLikeComment,
  useUnlikeComment,
} from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
const Comment = ({ comment, mimeType }) => {
  const { user } = useUserContext();
  console.log(user.id, comment);

  const [isRepliesClicked, setIsRepliesClicked] = useState(false);
  const { mutateAsync: createLike, isPending: isLiking } = useLikeComment(
    comment,
    user.id,
  );
  const { mutateAsync: deleteLike, isPending: isDisliking } = useUnlikeComment(
    comment,
    user.id,
  );
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
  useEffect(() => {
    if (
      comment?.commentLikes?.some((likedUser) => likedUser.$id === user?.id)
    ) {
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
        </div>
        {comment?.likes?.length > 0 && (
          <div className="flex gap-1">
            <p className="text-sm"> {comment?.likes?.length}</p>
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
        {!isLiked && (
          <button
            disabled={isDisliking || isLiking}
            className="text-sm"
            onClick={handleLikeComment}
          >
            Like
          </button>
        )}
        {isLiked && (
          <button
            disabled={isDisliking || isLiking}
            className="text-sm"
            onClick={handleUnlikeComment}
          >
            Unlike
          </button>
        )}
      </div>
      {comment?.replies?.length > 0 && (
        <button
          onClick={() => setIsRepliesClicked((prev) => !prev)}
          className="flex items-center gap-1 self-center"
        >
          View
          <span>{comment?.replies?.length === 1 ? " reply" : " replies"}</span>
          {!isRepliesClicked && <IoIosArrowDown size={20} />}
          {isRepliesClicked && <IoIosArrowUp size={20} />}
        </button>
      )}

      <RepliesSection comment={comment} isRepliesClicked={isRepliesClicked} />
    </div>
  );
};

export default Comment;
