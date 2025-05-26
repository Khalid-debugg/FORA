import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useUserContext } from "@/context/AuthContext";
import {
  useDeleteReply,
  useEditReply,
  useLikeReply,
  useUnlikeReply,
} from "@/lib/react-query/queriesAndMutations/replies";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useEffect, useState } from "react";
import { SlOptions } from "react-icons/sl";
import { Input } from "@/components/ui/input";
import { IoCamera } from "react-icons/io5";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import UsersList from "../../UsersList";
import { useGetLikes } from "@/lib/react-query/queriesAndMutations/posts";
const Reply = ({ reply, mimeType, replyRef, comment }) => {
  const { user } = useUserContext();
  const { mutateAsync: likeReply } = useLikeReply(reply);
  const { mutateAsync: unLikeReply } = useUnlikeReply(reply);
  const { mutateAsync: editReply } = useEditReply(comment.$id);
  const { mutateAsync: deleteReply } = useDeleteReply(comment.$id);
  const {
    data: likes,
    isPending: isLoadingLikes,
    hasNextPage,
    isFetchingNextPage,
  } = useGetLikes(reply.$id);
  const [isLiked, setIsLiked] = useState(
    likes?.pages.flat().some((like) => like.userId === user?.id),
  );
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(reply?.content);
  const [mediaId, setMediaId] = useState(reply?.mediaId);
  const [mediaUrl, setMediaUrl] = useState(reply?.mediaUrl);
  const [fileType, setFileType] = useState(mimeType);
  const [newFile, setNewFile] = useState(null);
  const [newMediaUrl, setNewMediaUrl] = useState("");
  const [newFileType, setNewFileType] = useState("");
  useEffect(() => {
    if (likes) {
      setIsLiked(likes?.pages.flat().some((like) => like.userId === user?.id));
    }
  }, [likes, user?.id]);
  const handleSave = async () => {
    const res = await editReply({
      id: reply.$id,
      content: content,
      file: newFile,
      mediaUrl: mediaUrl,
      mediaId: mediaId,
    });
    if (res instanceof Error) return;
    setIsEditing(false);
  };
  const handleLike = async () => {
    const res = await likeReply({ sender: user, reply, comment });
    if (res instanceof Error) return;
    setIsLiked(true);
  };
  const handleUnlike = async () => {
    const res = await unLikeReply({ sender: user, reply, comment });
    if (res instanceof Error) return;
    setIsLiked(false);
  };
  const handleDeleteMedia = (isNew) => {
    if (isNew) {
      setNewFile(null);
      setNewMediaUrl(null);
      setNewFileType(null);
      return;
    }
    setMediaUrl(null);
    setMediaId(null);
    setFileType(null);
  };

  return (
    <>
      {isEditing ? (
        <div className="flex gap-2 items-center">
          <Avatar className="hover:cursor-pointer self-start w-1/6 max-w-12">
            <AvatarImage
              className="h-12 w-12 rounded-full outline outline-slate-200"
              src={reply?.creator?.imageUrl}
            />
            <AvatarFallback>{reply?.creator?.username}</AvatarFallback>
          </Avatar>
          <div className="w-2/3 self-start">
            <Input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            {mediaUrl && (
              <div className="relative">
                {fileType?.includes("video") ? (
                  <video className="object-cover w-full h-full" controls>
                    <source src={mediaUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={mediaUrl}
                    alt="media preview"
                    className="object-cover w-full h-full"
                  />
                )}
                <button
                  onClick={() => {
                    handleDeleteMedia(false);
                  }}
                  className="absolute top-0 w-6 h-6 right-0 text-red-500 font-bold bg-white rounded-full"
                >
                  X
                </button>
              </div>
            )}
            {newFile && (
              <div className="relative">
                {newFileType?.includes("video") ? (
                  <MediaPlayer
                    className="w-full h-full"
                    src={newMediaUrl}
                    viewType="video"
                    streamType="on-demand"
                    logLevel="warn"
                    crossOrigin
                    playsInline
                  >
                    <MediaProvider></MediaProvider>
                    <DefaultVideoLayout icons={defaultLayoutIcons} />
                  </MediaPlayer>
                ) : (
                  <img
                    src={newMediaUrl}
                    alt="media preview"
                    className="object-cover w-full h-full"
                  />
                )}
                <button
                  onClick={() => handleDeleteMedia(true)}
                  className="absolute top-0 w-6 h-6 right-0 text-red-500 font-bold bg-white rounded-full"
                >
                  X
                </button>
              </div>
            )}
          </div>
          <div className="self-start">
            <input
              type="file"
              id={`file-input`}
              accept="image/*,video/*"
              className="hidden"
              onChange={() => {
                setNewFile(event.target.files[0]);
                setNewMediaUrl(URL.createObjectURL(event.target.files[0]));
                setNewFileType(event.target.files[0].type);
              }}
              onClick={(e) => (e.target.value = null)}
            />
            <label htmlFor={`file-input`} className="cursor-pointer ">
              <IoCamera
                size={40}
                className="text-gray-600 p-2 rounded-2xl font-semibold shad-button_primary hover:shad-button_ghost transition-[background] 0.5s ease-in-out"
              />
            </label>
          </div>
          <div className="w-1/6 flex flex-col gap-2 self-start">
            <button
              onClick={() => setIsEditing(false)}
              className="border border-slate-100 w-full rounded-md p-2"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="shad-button_primary hover:shad-button_ghost transition-[background] 0.5s ease-in-out rounded-md p-2"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
          <div key={reply?.$id} className="flex gap-4 items-center">
            <Avatar className="hover:cursor-pointer self-start">
              <AvatarImage
                className="h-12 w-12 rounded-full outline outline-slate-200"
                src={reply?.creator?.imageUrl}
              />
              <AvatarFallback>{reply?.creator?.username}</AvatarFallback>
            </Avatar>
            <div className="flex flex-1">
              <div className=" bg-slate-100 flex-1 p-2 rounded-lg">
                <p>{reply?.content}</p>
                {reply?.mediaUrl && mimeType?.mimeType?.includes("image") ? (
                  <img
                    src={reply?.mediaUrl}
                    alt="comment"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                ) : reply?.mediaUrl && mimeType?.includes("video") ? (
                  <video
                    src={reply?.mediaUrl}
                    controls
                    className="w-32 h-32 object-cover rounded-lg"
                  ></video>
                ) : null}
              </div>
              {user?.id === reply?.creator?.$id && (
                <DropdownMenu label={<SlOptions size={20} color="green" />}>
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={async () => await deleteReply(reply.$id)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenu>
              )}
            </div>
          </div>
          <div className="px-16 flex justify-between">
            <div className="flex gap-4 items-center">
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
            {likes && (
              <div className="flex gap-2 items-center">
                <UsersList
                  listItems={likes}
                  isLoadingLikes={isLoadingLikes}
                  hasNextPage={hasNextPage}
                  isFetchingNextPage={isFetchingNextPage}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Reply;
