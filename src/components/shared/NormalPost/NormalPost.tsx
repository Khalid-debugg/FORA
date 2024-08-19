import { useEffect, useState } from "react";
import { ICreatedPost } from "@/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { BsCalendar2DateFill } from "react-icons/bs";
import { appwriteConfig, storage } from "@/lib/appwrite/config";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/audio.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  DefaultVideoLayout,
  defaultLayoutIcons,
} from "@vidstack/react/player/layouts/default";
import { BiLike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";
import { FaRegCommentDots } from "react-icons/fa";
import { useUserContext } from "@/context/AuthContext";
import { toast } from "../../ui/use-toast";
import CommentSection from "./CommentSection/CommentSection";

const NormalPost = ({ post }: { post: ICreatedPost }) => {
  const { user } = useUserContext();
  const [mediaFiles, setMediaFiles] = useState<
    { mimeType: string; ref: string }[]
  >([]);
  const date = new Date(post.$createdAt);
  const [isCommentClicked, setIsCommentClicked] = useState(false);
  const [isLiked, setIsLiked] = useState(
    post.likes.some((likedUser) => likedUser.$id === user?.id) || false,
  );

  const handleLike = async () => {
    try {
      if (isLiked) {
        await deleteLike();
      } else {
        await createLike();
      }
      setIsLiked(!isLiked);
    } catch (error) {
      toast({
        variant: "error",
        title: error.message,
      });
    }
  };

  useEffect(() => {
    const fetchMediaFiles = async () => {
      const fetchedMediaFiles = await Promise.all(
        post.mediaIds.map(async (id) => {
          const file = await storage.getFile(appwriteConfig.storageID, id);
          const fileView = storage.getFileView(appwriteConfig.storageID, id);
          return { mimeType: file.mimeType, ref: fileView.href };
        }),
      );
      setMediaFiles(fetchedMediaFiles);
    };

    fetchMediaFiles();
  }, [post.mediaIds]);

  const formatDate = () => {
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  const renderCarousel = () => {
    if (mediaFiles.length === 0) return null;
    return mediaFiles.map((media, i) => (
      <CarouselItem key={i}>
        {media.mimeType.startsWith("image/") ? (
          <img
            className="max-h-[500px] object-cover w-full min-h-[25rem]"
            src={media.ref}
            alt={`photo ${i}`}
          />
        ) : media.mimeType.startsWith("video/") ? (
          <MediaPlayer
            src={media.ref}
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
          <p className="text-red-500 p-10 flex justify-center items-center font-bold">
            Media type is not supported
          </p>
        )}
      </CarouselItem>
    ));
  };

  return (
    <div className="flex flex-col w-full rounded-3xl gap-1 border-2 border-primary-500 divide-y-2 divide-primary-500 overflow-hidden">
      <div className="flex p-4 justify-between items-center">
        <div className="flex gap-3 items-center">
          <img
            src={post.creator.imageURL}
            className="rounded-full w-14 h-14 border border-black"
            alt="profile pic"
          />
          <p className="text-xl font-medium">{post.creator.username}</p>
        </div>
        <div className="flex items-center gap-2">
          <BsCalendar2DateFill fill="green" size={20} />
          <p>{formatDate()}</p>
        </div>
      </div>
      <div className="px-4">
        <div className="p-2">{post.caption}</div>
        <Carousel
          className={`flex justify-center items-center ${mediaFiles.length > 0 ? "border" : ""}`}
        >
          <CarouselContent>{renderCarousel()}</CarouselContent>
          {mediaFiles.length > 1 && <CarouselPrevious className="" />}
          {mediaFiles.length > 1 && <CarouselNext />}
        </Carousel>
      </div>
      <div className="flex mb-[-0.25rem] divide-x-2 divide-primary-500 justify-between items-center">
        <button
          onClick={handleLike}
          className="flex justify-center items-center gap-2 flex-1 py-3 hover:bg-slate-100"
        >
          {isLiked && <BiSolidLike size={25} fill="green" />}
          {!isLiked && <BiLike size={25} fill="green" />}
          <p className="text-center">Like</p>
        </button>
        <button
          onClick={() => setIsCommentClicked(!isCommentClicked)}
          className="flex justify-center items-center gap-2 flex-1 py-3 hover:bg-slate-100"
        >
          <FaRegCommentDots size={25} fill="green" />
          <p className="text-center">Comment</p>
        </button>
      </div>
      <CommentSection post={post} isCommentClicked={isCommentClicked} />
    </div>
  );
};

export default NormalPost;
