import { useEffect, useState } from "react";
import { BsCalendar2DateFill } from "react-icons/bs";
import { appwriteConfig, storage } from "@/lib/appwrite/config";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import { useEditNormalPost } from "@/lib/react-query/queriesAndMutations";
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

const EditNormalPost = ({ post, setIsEditing }) => {
  const { mutateAsync: editPost, isPending } = useEditNormalPost();
  const [caption, setCaption] = useState("");
  const [mediaTypes, setMediaTypes] = useState<string[]>([]);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [mediaIds, setMediaIds] = useState<string[]>([]);
  const [newMediaUrls, setNewMediaUrls] = useState<string[]>([]);
  const [newMediaTypes, setNewMediaTypes] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const formatDate = () => {
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };
  const date = new Date(post?.$createdAt);
  useEffect(() => {
    const fetchMediaTypes = async () => {
      if (post?.mediaIds) {
        const types = await Promise.all(
          post.mediaIds.map(async (mediaId: string) => {
            const response = await storage.getFile(
              appwriteConfig.mediaBucketID,
              mediaId,
            );
            return response.mimeType;
          }),
        );
        setMediaTypes(types);
        setMediaIds(post.mediaIds);
        setMediaUrls(post.media);
        setCaption(post.caption);
      }
    };
    if (post) {
      fetchMediaTypes();
    }
  }, [post]);
  const handleSaveChanges = async () => {
    const response = await editPost({
      id: post?.$id || "",
      caption,
      fileOrFiles: newFiles,
      mediaUrls,
      mediaIds,
    });
    if (response) {
      setIsEditing(false);
    }
  };
  const handleAddMedia = (fileList) => {
    for (const file of fileList) {
      setNewFiles((newFiles) => [...newFiles, file]);
      const fileUrl = URL.createObjectURL(file);
      setNewMediaUrls((newMediaUrls) => [...newMediaUrls, fileUrl]);
      setNewMediaTypes((newMediaTypes) => [...newMediaTypes, file.type]);
    }
    console.log(newMediaTypes);
  };
  const handleDeleteMedia = (index, isNew) => {
    if (!isNew) {
      setMediaUrls((mediaUrls) => mediaUrls.filter((_, i) => i !== index));
      setMediaIds((mediaIds) => mediaIds.filter((_, i) => i !== index));
      setMediaTypes((mediaTypes) => mediaTypes.filter((_, i) => i !== index));
    } else {
      setNewMediaUrls((newMediaUrls) =>
        newMediaUrls.filter((_, i) => i !== index),
      );
      setNewMediaTypes((newMediaTypes) =>
        newMediaTypes.filter((_, i) => i !== index),
      );
    }
  };

  return (
    <div>
      {isPending ? (
        <div className="animate-spin text-[5rem]">⚽</div>
      ) : (
        <div className="flex flex-col p-4 gap-4 w-full">
          <button className="flex p-2 justify-between items-center w-full">
            <div className="flex gap-3 items-center">
              <img
                src={post?.creator.imageURL}
                className="rounded-full w-14 h-14 border border-black"
                alt="profile pic"
              />
              <p className="text-xl font-medium">{post?.creator.username}</p>
            </div>
            <div className="flex items-center gap-2">
              <BsCalendar2DateFill fill="green" size={20} />
              <p>{formatDate()}</p>
            </div>
          </button>
          <div>
            <label htmlFor="caption" className="block p-2">
              Caption
            </label>
            <textarea
              id="caption"
              className="w-3/4 p-2 border self-start"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>
          <div className="overflow-hidden">
            <label htmlFor="" className="block p-2">
              Media
            </label>
            <div className="flex flex-wrap gap-2">
              <Carousel className={`flex justify-center items-center `}>
                <CarouselContent>
                  {mediaUrls.map((url, index) => (
                    <CarouselItem key={index} className="relative">
                      {mediaTypes[index]?.includes("video") ? (
                        <video className="object-cover w-full h-full" controls>
                          <source src={url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img
                          src={url}
                          alt="media preview"
                          className="object-cover w-full h-full"
                        />
                      )}
                      <button
                        onClick={() => {
                          handleDeleteMedia(index, false);
                          console.log(mediaUrls, mediaIds, mediaTypes);
                        }}
                        className="absolute top-0 w-6 h-6 right-0 text-red-500 font-bold bg-white rounded-full"
                      >
                        X
                      </button>
                    </CarouselItem>
                  ))}
                  {newMediaUrls.map((url, index) => (
                    <CarouselItem key={index} className="relative">
                      {newMediaTypes[index]?.includes("video") ? (
                        <MediaPlayer
                          src={url}
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
                          src={url}
                          alt="media preview"
                          className="object-cover w-full h-full"
                        />
                      )}
                      <button
                        onClick={() => handleDeleteMedia(index, true)}
                        className="absolute top-0 w-6 h-6 right-0 text-red-500 font-bold bg-white rounded-full"
                      >
                        X
                      </button>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {newMediaUrls.length > 0 || mediaUrls.length > 0 ? (
                  <>
                    <CarouselPrevious />
                    <CarouselNext />
                  </>
                ) : null}
              </Carousel>
            </div>
          </div>
          <label
            htmlFor="file-input"
            className="bg-primary-500 p-2 rounded w-1/2 text-center text-white hover:cursor-pointer hover:shadow-md"
          >
            Add Media
          </label>
          <input
            id="file-input"
            type="file"
            multiple
            onChange={(e) => handleAddMedia(e.target.files)}
            className="mb-2 hidden"
          />
          <div className="flex justify-between">
            <AlertDialog>
              <AlertDialogTrigger className="bg-primary-500 p-2 rounded w-1/3 text-center text-white hover:cursor-pointer hover:shadow-md">
                Save Changes
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone, this will edit your post with
                    the new modifications.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleSaveChanges}
                    className="border-2 border-primary-500 rounded-md h-10"
                  >
                    Save changes
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <button
              onClick={() => setIsEditing(false)}
              className="border border-primary-500 p-2 rounded w-1/3 hover:shadow-md"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditNormalPost;
