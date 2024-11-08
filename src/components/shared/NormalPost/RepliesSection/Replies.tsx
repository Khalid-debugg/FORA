import { appwriteConfig, storage } from "@/lib/appwrite/config";
import { useGetReplies } from "@/lib/react-query/queriesAndMutations";
import { useEffect, useState } from "react";
import Reply from "./Reply";
const Replies = ({ comment, replyRef }) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetReplies(comment?.$id);
  const [pages, setPages] = useState([]);
  const [visiblePageCount, setVisiblePageCount] = useState(1);
  const [mimeTypes, setMimeTypes] = useState([]);

  useEffect(() => {
    if (data) {
      setPages(data.pages);
      setVisiblePageCount(data.pages.length);
    }
  }, [data]);

  useEffect(() => {
    const fetchMediaFiles = async () => {
      const allReplies = pages.slice(0, visiblePageCount).flat();
      const mediaIds = allReplies.map((reply) => reply?.mediaId);

      if (mediaIds.length > 0) {
        const fetchedMediaFiles = await Promise.all(
          mediaIds.map(async (id, index) => {
            if (!id) return null;
            const file = await storage.getFile(appwriteConfig.storageID, id);
            return { mimeType: file.mimeType, index };
          }),
        );
        setMimeTypes(fetchedMediaFiles.filter((file) => file));
      }
    };

    fetchMediaFiles();
  }, [pages, visiblePageCount]);

  const allReplies = pages.slice(0, visiblePageCount).flat();
  console.log(allReplies);

  const handleViewLess = () => {
    setVisiblePageCount((prev) => Math.max(prev - 1, 1));
  };

  const handleViewMore = async () => {
    if (visiblePageCount < pages.length) {
      setVisiblePageCount((prev) => prev + 1);
    } else if (hasNextPage && !isFetchingNextPage) {
      await fetchNextPage();
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        {allReplies.map((reply, idx) => (
          <Reply
            replyRef={replyRef}
            key={reply?.$id || idx}
            reply={reply}
            mimeType={mimeTypes[idx]}
          />
        ))}
      </div>
      <div className="flex justify-between p-2">
        {allReplies.length > 0 && (
          <p>
            {allReplies.length} out of{" "}
            {comment?.replies?.length >= allReplies.length
              ? comment?.replies?.length
              : allReplies.length}{" "}
            reply(ies)
          </p>
        )}
        <div className="flex gap-2">
          {hasNextPage || visiblePageCount < pages.length ? (
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

export default Replies;
