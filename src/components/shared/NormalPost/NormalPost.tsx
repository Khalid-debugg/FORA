import { useEffect, useState, Suspense, lazy } from "react";
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
import { FaCommentDots } from "react-icons/fa6";
import { useUserContext } from "@/context/AuthContext";
import { toast } from "../../ui/use-toast";
import UsersList from "../UsersList";
import { Link, useNavigate } from "react-router-dom";
import {
  useLikePost,
  useUnlikePost,
} from "@/lib/react-query/queriesAndMutations/posts";
import { IoMdAdd } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";
import { FaClock } from "react-icons/fa";
import { ImExit } from "react-icons/im";
import { GiSoccerKick } from "react-icons/gi";
import WaitingList from "./WaitingList";
import JoinedList from "./JoinedList";
import { useMediaFiles } from "@/lib/react-query/queriesAndMutations/helper";

const CommentSection = lazy(() => import("./CommentSection/CommentSection"));

const NormalPost = ({
  post,
  isOne,
}: {
  post: ICreatedPost;
  isOne?: boolean;
}) => {
  const { user } = useUserContext();
  const { data: mediaFiles } = useMediaFiles(post?.mediaIds || []);
  const [totalLikes, setTotalLikes] = useState(post?.postLikes?.length);
  const date = new Date(post?.$createdAt);
  const { mutateAsync: createLike, isPending: isLiking } = useLikePost(
    post,
    user?.id,
    post?.creator?.$id,
  );
  const { mutateAsync: deleteLike, isPending: isDisliking } = useUnlikePost(
    post,
    user?.id,
  );
  const navigate = useNavigate();
  const [isCommentClicked, setIsCommentClicked] = useState(isOne || false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    setIsLiked(
      post?.postLikes?.some((likedUser) => likedUser.$id === user?.id),
    );
  }, [post, user]);

  const handleLike = async () => {
    try {
      setIsLiked((prev) => !prev);
      if (isLiked) {
        setTotalLikes((prev) => prev - 1);
        const response = await deleteLike();
        if (response instanceof Error) {
          throw new Error(response.message);
        }
      } else {
        setTotalLikes((prev) => prev + 1);
        const response = await createLike();
        if (response instanceof Error) {
          throw new Error(response.message);
        }
      }
    } catch (error) {
      toast({
        variant: "error",
        title: error.message,
      });
      setIsLiked((prev) => !prev);
      setTotalLikes((prev) =>
        error.message.includes("dislike") ? prev + 1 : prev - 1,
      );
    }
  };

  const renderCarousel = () => {
    if (!mediaFiles || mediaFiles?.length === 0) return null;
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
    <div
      className={`flex flex-col w-full gap-1 divide-y-2 divide-primary-500 overflow-hidden ${!isOne ? " border-2 border-primary-500 rounded-3xl" : ""}`}
    >
      <button
        onClick={() => navigate(`/normal-post/${post?.$id}`)}
        className="flex p-4 justify-between items-center hover:bg-slate-100"
      >
        <div className="flex gap-3 items-center">
          <img
            src={post?.creator?.imageUrl}
            className="rounded-full w-14 h-14 border border-black"
            alt="profile pic"
          />
          <Link
            to={`/profile/${post?.creator?.$id}`}
            className="text-xl font-medium hover:underline"
            onClick={(e) => e.stopPropagation()} // Prevent button click interference
          >
            {post?.creator?.name}
          </Link>
        </div>
      </button>
      <div className="px-4 flex flex-col">
        <div className="p-2">{post?.caption}</div>
        <Carousel
          className={`flex justify-center items-center ${mediaFiles?.length > 0 ? "border" : ""}`}
        >
          <CarouselContent>{renderCarousel()}</CarouselContent>
          {mediaFiles?.length > 1 && <CarouselPrevious />}
          {mediaFiles?.length > 1 && <CarouselNext />}
        </Carousel>
        {totalLikes > 0 && (
          <div className="self-end p-2">
            <UsersList
              listTitle="Likes"
              buttonTitle={`${totalLikes} ${totalLikes === 1 ? "Like" : "Likes"}`}
              listItems={post?.postLikes}
            />
          </div>
        )}
      </div>
      <div className="flex mb-[-0.25rem] divide-x-2 divide-primary-500 justify-between items-center">
        <button
          disabled={isLiking || isDisliking}
          onClick={handleLike}
          className="flex justify-center items-center gap-2 flex-1 py-3 hover:bg-slate-100"
        >
          {isLiked && <BiSolidLike size={25} fill="green" />}
          {!isLiked && <BiLike size={25} fill="green" />}
          <p className="text-center">Like</p>
        </button>
        <button
          disabled={isOne}
          onClick={() => setIsCommentClicked(!isCommentClicked)}
          className="flex justify-center items-center gap-2 flex-1 py-3 hover:bg-slate-100"
        >
          {isCommentClicked ? (
            <FaCommentDots size={25} fill="green" />
          ) : (
            <FaRegCommentDots size={25} fill="green" />
          )}
          <p className="text-center">Comment</p>
        </button>
      </div>
      {isCommentClicked && (
        <Suspense
          fallback={
            <div className="flex justify-center items-center">
              <div className="animate-spin">⚽</div>
            </div>
          }
        >
          <CommentSection post={post} isCommentClicked={isCommentClicked} />
        </Suspense>
      )}
    </div>
  );
};

export default NormalPost;
