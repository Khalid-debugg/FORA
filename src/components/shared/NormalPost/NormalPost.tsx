import { useEffect, useState, Suspense, lazy } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/audio.css";
import "@vidstack/react/player/styles/default/layouts/video.css";

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
import { useMediaFiles } from "@/lib/react-query/queriesAndMutations/helper";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { GoHeartFill, GoHeart } from "react-icons/go";

const CommentSection = lazy(() => import("./CommentSection/CommentSection"));

const NormalPost = ({ post, isOne }) => {
  const { user } = useUserContext();
  const { data: mediaFiles } = useMediaFiles(post?.mediaIds || []);
  const [totalLikes, setTotalLikes] = useState(post?.postLikes?.length);
  const { mutateAsync: createLike, isPending: isLiking } = useLikePost();
  const { mutateAsync: deleteLike, isPending: isDisliking } = useUnlikePost(
    post,
    user?.id,
  );
  const navigate = useNavigate();
  const [isCommentClicked, setIsCommentClicked] = useState(isOne || false);
  const [isLiked, setIsLiked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsLiked(
      post?.postLikes?.some((likedUser) => likedUser.$id === user?.id),
    );
  }, [post, user]);

  const handleLike = async () => {
    try {
      setIsAnimating(true);
      setIsLiked((prev) => !prev);

      if (isLiked) {
        setTotalLikes((prev) => prev - 1);
        const response = await deleteLike({ sender: user, post });
        if (response instanceof Error) {
          throw new Error(response.message);
        }
      } else {
        setTotalLikes((prev) => prev + 1);
        const response = await createLike({ sender: user, post });
        if (response instanceof Error) {
          throw new Error(response.message);
        }
      }

      setTimeout(() => setIsAnimating(false), 300);
    } catch (error) {
      toast({
        variant: "error",
        title: error.message,
      });
      setIsLiked((prev) => !prev);
      setTotalLikes((prev) =>
        error.message.includes("dislike") ? prev + 1 : prev - 1,
      );
      setIsAnimating(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  const renderCarousel = () => {
    if (!mediaFiles || mediaFiles?.length === 0) return null;

    return mediaFiles.map((media, i) => (
      <CarouselItem key={i}>
        {media.mimeType.startsWith("image/") ? (
          <img
            className="max-h-[500px] object-cover w-full min-h-[25rem] rounded-md"
            src={media.ref || "/placeholder.svg"}
            alt={`photo ${i}`}
          />
        ) : media.mimeType.startsWith("video/") ? (
          <div className="relative rounded-md overflow-hidden">
            <video
              className="max-h-[500px] w-full min-h-[25rem] object-cover"
              src={media.ref}
              controls
              playsInline
              crossOrigin="anonymous"
            />
          </div>
        ) : (
          <div className="bg-red-50 text-red-500 p-10 flex justify-center items-center font-bold rounded-md">
            Media type is not supported
          </div>
        )}
      </CarouselItem>
    ));
  };

  return (
    <Card
      className={`w-full overflow-hidden ${isOne ? "border-0 shadow-none rounded-none" : "border-green-500 rounded-3xl"}`}
    >
      <CardHeader className="p-4 cursor-pointer">
        <div className="flex items-center gap-3">
          <Avatar className="h-14 w-14 border-2 border-green-500">
            <AvatarImage
              src={
                post?.creator?.imageUrl || "/placeholder.svg?height=56&width=56"
              }
              alt={post?.creator?.name}
            />
            <AvatarFallback>{post?.creator?.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <Link
                  to={`/profile/${post?.creator?.$id}`}
                  className="font-semibold leading-none hover:underline"
                >
                  {post?.creator?.name}
                </Link>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 text-green-600" />
                  <span className="text-xs text-slate-600">
                    {formatDate(post?.$createdAt)}
                  </span>
                </div>
              </div>
              <Badge className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200">
                Post
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {post?.caption && (
          <div
            className="px-4 border-t hover:bg-slate-50 hover:cursor-pointer"
            onClick={() => navigate(`/normal-post/${post.$id}`)}
          >
            <p className="text-gray-700 whitespace-pre-wrap p-2">
              {post?.caption}
            </p>
          </div>
        )}

        {mediaFiles && mediaFiles.length > 0 && (
          <div className="px-4 pb-4">
            <Carousel
              className={`w-full ${mediaFiles.length > 0 ? "border rounded-md" : ""}`}
            >
              <CarouselContent>{renderCarousel()}</CarouselContent>
              {mediaFiles.length > 1 && <CarouselPrevious />}
              {mediaFiles.length > 1 && <CarouselNext />}
            </Carousel>
          </div>
        )}

        {totalLikes > 0 && (
          <div className="px-4 pb-3 flex items-center justify-end">
            <UsersList listTitle="Likes" listItems={post?.postLikes} />
          </div>
        )}
      </CardContent>

      <CardFooter className="p-0 flex flex-col">
        <div className="grid grid-cols-2 border-t border-primary-500 divide-x divide-primary-500 w-full">
          <div className="relative">
            <Button
              variant="ghost"
              className={cn(
                "rounded-none h-12 w-full flex items-center justify-center gap-2",
                isAnimating && "animate-like-button",
              )}
              onClick={handleLike}
              disabled={isLiking || isDisliking}
            >
              <div className="flex justify-center items-center gap-2">
                {isLiked ? (
                  <GoHeartFill
                    size={25}
                    fill="green"
                    className={cn(isAnimating && "scale-125")}
                  />
                ) : (
                  <GoHeart size={25} fill="green" />
                )}
                <p className="text-center">Like</p>
              </div>
              {(isLiking || isDisliking) && (
                <div className="animate-spin ml-2">⚽</div>
              )}
            </Button>
          </div>

          <Button
            variant="ghost"
            className="rounded-none h-12 flex items-center justify-center gap-2"
            onClick={() => !isOne && setIsCommentClicked(!isCommentClicked)}
            disabled={isOne}
          >
            <div className="flex justify-center items-center gap-2">
              {isCommentClicked ? (
                <FaCommentDots size={25} fill="green" />
              ) : (
                <FaRegCommentDots size={25} fill="green" />
              )}
              <p className="text-center">Comment</p>
            </div>
          </Button>
        </div>

        {isCommentClicked && (
          <div className="w-full border-t">
            <Suspense
              fallback={
                <div className="flex justify-center items-center p-6">
                  <div className="animate-spin text-[2rem]">⚽</div>
                </div>
              }
            >
              <CommentSection post={post} isCommentClicked={isCommentClicked} />
            </Suspense>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default NormalPost;
