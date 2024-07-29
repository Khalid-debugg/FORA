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

const NormalPost = ({ post }: { post: ICreatedPost }) => {
  const [mediaFiles, setMediaFiles] = useState<
    { mimeType: string; ref: string }[]
  >([]);
  const date = new Date(post.$createdAt);

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
        {media.mimeType === "image/jpeg" && (
          <img
            className="max-h-[500px] object-cover w-full min-h-[25rem]"
            src={media.ref}
            alt={`photo ${i}`}
          />
        )}
        {media.mimeType === "video/mp4" && (
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
        )}
        {media.mimeType !== "video/mp4" && media.mimeType !== "image/jpeg" && (
          <p className="text-red-500 p-10 flex justify-center items-center font-bold">
            Media type is not supported
          </p>
        )}
      </CarouselItem>
    ));
  };

  return (
    <div className="flex flex-col w-full p-4 rounded-3xl gap-1 border-2 border-primary-500">
      <div className="flex py-1 justify-between items-center">
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
      <div className="h-[0.125rem] bg-black mx-2"></div>
      <div className="p-2">{post.caption}</div>
      <div className="p-2">
        <Carousel
          className={`flex justify-center items-center px-8 ${mediaFiles.length > 0 ? "border" : ""}`}
        >
          <CarouselContent>{renderCarousel()}</CarouselContent>
          {mediaFiles.length > 1 && <CarouselPrevious className="" />}
          {mediaFiles.length > 1 && <CarouselNext />}
        </Carousel>
      </div>
    </div>
  );
};

export default NormalPost;
