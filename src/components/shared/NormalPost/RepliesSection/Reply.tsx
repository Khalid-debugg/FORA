import { useUserContext } from "@/context/AuthContext";
import {
  useLikeReply,
  useUnlikeReply,
} from "@/lib/react-query/queriesAndMutations";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useEffect, useState } from "react";
import { BiSolidLike } from "react-icons/bi";

const Reply = ({ reply, mimeType, replyRef }) => {
  const { user } = useUserContext();
  const { mutate: likeReply } = useLikeReply(reply, user?.id);
  const { mutate: unikeReply } = useUnlikeReply(reply, user?.id);
  const [isLiked, setIsLiked] = useState(false);
  console.log(reply);

  const handleLike = () => {
    const res = likeReply();
    if (res instanceof Error) return;
    setIsLiked(true);
  };
  const handleUnlike = () => {
    const res = unikeReply();
    if (res instanceof Error) return;
    setIsLiked(false);
  };
  useEffect(() => {
    if (reply?.replyLikes?.some((likedUser) => likedUser.$id === user?.id)) {
      setIsLiked(true);
    }
  }, [reply, user]);
  return (
    <div className="flex flex-col">
      <div key={reply?.$id} className="flex gap-4 items-center">
        <Avatar className="hover:cursor-pointer self-start">
          <AvatarImage
            className="h-12 w-12 rounded-full outline outline-slate-200"
            src={reply?.creator?.imageUrl}
          />
          <AvatarFallback>{reply?.creator?.username}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="bg-slate-100 flex-1 p-2 rounded-lg">
            <p>{reply?.content}</p>
            {reply?.mediaUrl && mimeType?.mimeType?.includes("image") ? (
              <img
                src={reply?.mediaUrl}
                alt="comment"
                className="w-32 h-32 object-cover rounded-lg"
              />
            ) : reply?.mediaUrl && mimeType?.mimeType?.includes("video") ? (
              <video
                src={reply?.mediaUrl}
                controls
                className="w-32 h-32 object-cover rounded-lg"
              ></video>
            ) : null}
          </div>
        </div>
        {reply?.likes?.length > 0 && (
          <div className="flex gap-1">
            <p className="text-sm"> {reply?.likes?.length}</p>
            <BiSolidLike fill="green" size={20} />
          </div>
        )}
      </div>
      <div className="flex gap-8 pl-16">
        <button
          className="text-sm"
          onClick={() => {
            replyRef.current.scrollIntoView({ behavior: "smooth" });
            replyRef.current.children[0].focus();
            replyRef.current.children[0].value =
              "@" + reply?.creator?.username + " ";
          }}
        >
          Reply
        </button>

        {!isLiked ? (
          <button className="text-sm" onClick={handleLike}>
            Like
          </button>
        ) : (
          <button className="text-sm" onClick={handleUnlike}>
            Unlike
          </button>
        )}
      </div>
    </div>
  );
};

export default Reply;
