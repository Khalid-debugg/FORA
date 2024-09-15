import React, { useState, useEffect } from "react";
import {
  useGetNormalPost,
  // useEditPost,
} from "@/lib/react-query/queriesAndMutations";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import NormalPost from "@/components/shared/NormalPost/NormalPost";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { AiOutlineMenuFold } from "react-icons/ai";
import { BsCalendar2DateFill } from "react-icons/bs";
import { appwriteConfig, storage } from "@/lib/appwrite/config";

const OneNormalPost = () => {
  const { id } = useParams();
  const { data: post, isPending } = useGetNormalPost(id || "");
  // const { mutateAsync: editPost } = useEditPost();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [caption, setCaption] = useState(post?.caption || "");
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaIds, setMediaIds] = useState(post?.mediaIds || []);
  const [filePreviews, setFilePreviews] = useState(post?.media || []);

  const handleSaveChanges = async () => {
    // Convert media files to URLs for the API call
    // await editPost({ id: post.$id, caption, mediaUrls: mediaFiles });
    setIsEditing(false);
  };

  const handleDeleteMedia = (fileUrl) => {
    setFilePreviews(filePreviews.filter((url) => url !== fileUrl));
    // Also filter out the file from mediaFiles if it was added during this session
    const filteredFiles = mediaFiles.filter(
      (file) => URL.createObjectURL(file) !== fileUrl,
    );
    setMediaFiles(filteredFiles);
  };

  const handleAddMedia = (event) => {
    const files = Array.from(event.target.files);
    const newFileUrls = files.map((file) => URL.createObjectURL(file));
    setMediaFiles((prevFiles) => [...prevFiles, ...files]);
    setFilePreviews((prevPreviews) => [...prevPreviews, ...newFileUrls]);
  };

  const formatDate = () => {
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  const date = new Date(post?.$createdAt);

  const isVideo = async (id) => {
    const file = await storage.getFile(appwriteConfig.mediaBucketID, id);
    console.log(file);

    if (!file) return false;
    return file.mimeType.includes("video");
  };

  return (
    <div className="flex flex-col gap-2 md:w-1/3 w-full mx-auto items-center">
      <div className="flex items-center justify-between p-4 w-full gap-4 shadow-md">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="hover:bg-gray-100 p-4 rounded-md"
          >
            <FaArrowLeft size={25} color="green" />
          </button>
          <h1 className="text-xl">Post</h1>
        </div>
        <DropdownMenu label={<AiOutlineMenuFold size={25} color="green" />}>
          <DropdownMenuItem onClick={() => setIsEditing(true)}>
            Edit
          </DropdownMenuItem>
        </DropdownMenu>
      </div>

      {!isPending && post && (
        <>
          {isEditing ? (
            <div className="flex flex-col p-4 gap-4 w-full">
              <button className="flex p-2 justify-between items-center w-full">
                <div className="flex gap-3 items-center">
                  <img
                    src={post?.creator.imageURL}
                    className="rounded-full w-14 h-14 border border-black"
                    alt="profile pic"
                  />
                  <p className="text-xl font-medium">
                    {post?.creator.username}
                  </p>
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
              <div>
                <label htmlFor="" className="block p-2">
                  Media
                </label>
                <div className="flex flex-wrap gap-2">
                  {filePreviews.map((preview, index) => (
                    <div key={index} className="relative w-48 h-48">
                      {isVideo(mediaIds[index]) ? (
                        <video className="object-cover w-full h-full" controls>
                          <source src={preview} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img
                          src={preview}
                          alt="media preview"
                          className="object-cover w-full h-full"
                        />
                      )}
                      <button
                        onClick={() => handleDeleteMedia(preview)}
                        className="absolute top-0 w-6 h-6 right-0 text-red-500 bg-white rounded-full"
                      >
                        X
                      </button>
                    </div>
                  ))}
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
                onChange={handleAddMedia}
                className="mb-2 hidden"
              />
              <div className="flex justify-between">
                <button
                  onClick={handleSaveChanges}
                  className="bg-primary-500 p-2 rounded w-1/3 text-white hover:shadow-md"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="border border-primary-500 p-2 rounded w-1/3 hover:shadow-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <NormalPost post={post} isOne />
          )}
        </>
      )}
    </div>
  );
};

export default OneNormalPost;
