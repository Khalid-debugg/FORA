import { appwriteConfig, storage } from "@/lib/appwrite/config";
import { useEffect, useState } from "react";
import Comment from "./Comment";
import { useGetComments } from "@/lib/react-query/queriesAndMutations/comments";
const Comments = ({ post }) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetComments(post?.$id);
  const [visiblePageCount, setVisiblePageCount] = useState(1);
  const [mimeTypes, setMimeTypes] = useState([]);
  const [allComments, setAllComments] = useState(
    data?.pages.slice(0, visiblePageCount).flat(),
  );
  useEffect(() => {
    if (data) setAllComments(data?.pages.slice(0, visiblePageCount).flat());
  }, [data, visiblePageCount]);
  useEffect(() => {
    const fetchMediaFiles = async () => {
      const mediaIds = allComments?.map((comment) => comment?.mediaId);
      if (mediaIds?.length > 0) {
        const fetchedMediaFiles = await Promise.all(
          mediaIds.map(async (id, index) => {
            if (!id) return null;
            const file = await storage.getFile(
              appwriteConfig.mediaBucketID,
              id,
            );
            return { mimeType: file.mimeType, index };
          }),
        );
        setMimeTypes(fetchedMediaFiles.filter((file) => file));
      }
    };

    fetchMediaFiles();
  }, [allComments]);

  const handleViewLess = () => {
    setVisiblePageCount((prev) => Math.max(prev - 1, 1));
  };

  const handleViewMore = async () => {
    if (visiblePageCount < data?.pages.length && !hasNextPage) {
      setVisiblePageCount((prev) => prev + 1);
    } else if (hasNextPage && !isFetchingNextPage) {
      await fetchNextPage();
      setVisiblePageCount((prev) => prev + 1);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        {allComments?.map((comment, idx) => (
          <Comment
            postId={post?.$id}
            key={comment?.$id}
            comment={comment}
            mimeType={mimeTypes[idx]}
          />
        ))}
      </div>
      <div className="flex justify-between p-2">
        {allComments?.length > 0 && (
          <p>
            {allComments.length} out of {post?.comments?.length + " "}
            comment(s)
          </p>
        )}
        <div className="flex gap-2">
          {hasNextPage || visiblePageCount < data?.pages.length ? (
            <button
              className=" flex items-center gap-1"
              onClick={handleViewMore}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? (
                <div className="animate-spin">⚽</div>
              ) : (
                <p className="hover:underline">View more</p>
              )}
            </button>
          ) : null}
          {visiblePageCount > 1 && (
            <button className="hover:underline" onClick={handleViewLess}>
              View less
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Comments;
