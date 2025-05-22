import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useEffect, useState, Suspense, lazy } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useUserContext } from "@/context/AuthContext";
import {
  useDeleteComment,
  useEditComment,
  useLikeComment,
  useUnlikeComment,
} from "@/lib/react-query/queriesAndMutations/comments";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { SlOptions } from "react-icons/sl";
import { appwriteConfig, storage } from "@/lib/appwrite/config";
import { Input } from "@/components/ui/input";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import { IoCamera } from "react-icons/io5";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import UsersList from "../../UsersList";
const RepliesSection = lazy(() => import("../RepliesSection/RepliesSection"));
const Comment = ({ comment, mimeType, postId }) => {
  const { user } = useUserContext();
  const [isRepliesClicked, setIsRepliesClicked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { mutateAsync: createLike, isPending: isLiking } =
    useLikeComment(postId);
  const { mutateAsync: deleteLike, isPending: isDisliking } =
    useUnlikeComment(postId);
  const { mutateAsync: editComment } = useEditComment(postId);
  const { mutateAsync: deleteComment } = useDeleteComment(postId);
  const [content, setContent] = useState(comment?.content);
  const [mediaId, setMediaId] = useState(comment?.mediaId);
  const [mediaUrl, setMediaUrl] = useState(comment?.mediaUrl);
  const [fileType, setFileType] = useState(mimeType);
  const [newFile, setNewFile] = useState(null);
  const [newMediaUrl, setNewMediaUrl] = useState("");
  const [newFileType, setNewFileType] = useState("");
  const [isLiked, setIsLiked] = useState(
    comment?.commentLikes?.some((likedUser) => likedUser.$id === user?.id),
  );

  useEffect(() => {
    const fetchMediaType = async () => {
      const response = await storage.getFile(
        appwriteConfig.mediaBucketID,
        comment?.mediaId,
      );
      setMediaUrl(comment?.mediaUrl);
      setFileType(response.mimeType);
    };
    if (comment?.mediaId) {
      fetchMediaType();
    }
  }, [comment, user]);

  const handleSave = async () => {
    const res = await editComment({
      id: comment.$id,
      content: content,
      file: newFile,
      mediaUrl: mediaUrl,
      mediaId: mediaId,
    });
    if (res instanceof Error) return;
    setIsEditing(false);
  };
  const handleLikeComment = async () => {
    const response = await createLike({ comment, user });
    if (response instanceof Error) return;
    setIsLiked(true);
  };

  const handleUnlikeComment = async () => {
    const response = await deleteLike({ comment, user });
    if (response instanceof Error) return;
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
    <div className="flex flex-col">
      <div key={comment?.$id} className="flex gap-4 items-center">
        <div className="flex-1">
          {isEditing ? (
            <div className="flex gap-2 items-center">
              <Avatar className="hover:cursor-pointer self-start w-1/6 max-w-12">
                <AvatarImage
                  className="h-12 w-12 rounded-full outline outline-slate-200"
                  src={comment?.creator?.imageUrl}
                />
                <AvatarFallback>{comment?.creator?.username}</AvatarFallback>
              </Avatar>
              <div className="w-2/3 self-start">
                <Input
                  type="text"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                {mediaUrl && !newFile && (
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
              <div key={comment?.$id} className="flex gap-4 items-center">
                <Avatar className="hover:cursor-pointer self-start">
                  <AvatarImage
                    className="h-12 w-12 rounded-full outline outline-slate-200"
                    src={comment?.creator?.imageUrl}
                  />
                  <AvatarFallback>{comment?.creator?.username}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col flex-1">
                  <div className=" bg-slate-100 flex-1 p-2 rounded-lg">
                    <p>{comment?.content}</p>
                    {comment?.mediaUrl &&
                    mimeType?.mimeType?.includes("image") ? (
                      <img
                        src={comment?.mediaUrl}
                        alt="comment"
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    ) : comment?.mediaUrl &&
                      mimeType?.mimeType?.includes("video") ? (
                      <video
                        src={comment?.mediaUrl}
                        controls
                        className="w-32 h-32 object-cover rounded-lg"
                      ></video>
                    ) : null}
                  </div>
                  <div className=" flex justify-between">
                    <div className="flex gap-4 items-center">
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
                    </div>
                    {comment?.commentLikes?.length > 0 && (
                      <div className="flex gap-2 items-center">
                        <UsersList
                          listTitle="Likes"
                          listItems={comment?.commentLikes}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="self-start">
          {user?.id === comment?.creator?.$id && (
            <DropdownMenu label={<SlOptions size={20} color="green" />}>
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => await deleteComment(comment.$id)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenu>
          )}
        </div>
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
      {isRepliesClicked && (
        <Suspense fallback={<div className="animate-spin text-center">⚽</div>}>
          <RepliesSection
            comment={comment}
            isRepliesClicked={isRepliesClicked}
          />
        </Suspense>
      )}
    </div>
  );
};

export default Comment;
