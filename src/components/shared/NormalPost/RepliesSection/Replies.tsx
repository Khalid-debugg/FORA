import { lazy, Suspense, useEffect, useState } from "react";
import { useGetReplies } from "@/lib/react-query/queriesAndMutations/replies";
import { appwriteConfig, storage } from "@/lib/appwrite/config";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
const Reply = lazy(
  () => import("@/components/shared/NormalPost/RepliesSection/Reply"),
);
const Replies = ({ comment, replyRef }) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetReplies(comment?.$id);
  const [visiblePageCount, setVisiblePageCount] = useState(1);
  const [allReplies, setAllReplies] = useState(
    data?.pages
      .slice(0, visiblePageCount)
      .flatMap((page) => page.documents || []),
  );
  const [mimeTypes, setMimeTypes] = useState([]);
  const [isRepliesClicked, setIsRepliesClicked] = useState(false);
  const [totalReplies, setTotalReplies] = useState(data?.pages[0]?.total);
  useEffect(() => {
    if (data) {
      setAllReplies(
        data?.pages
          .slice(0, visiblePageCount)
          .flatMap((page) => page.documents || []),
      );
      setTotalReplies(data.pages[0]?.total);
    }
  }, [data, visiblePageCount]);

  useEffect(() => {
    const fetchMediaFiles = async () => {
      const mediaIds = allReplies?.map((reply) => reply?.mediaId);
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
  }, [allReplies]);

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
    <div className="flex flex-col">
      {totalReplies > 0 && (
        <button
          onClick={() => setIsRepliesClicked((prev) => !prev)}
          className="flex items-center gap-1 self-center mb-2"
        >
          View
          <span>{totalReplies === 1 ? " reply" : " replies"}</span>
          {!isRepliesClicked ? (
            <IoIosArrowDown size={20} />
          ) : (
            <IoIosArrowUp size={20} />
          )}
        </button>
      )}

      {isRepliesClicked && (
        <>
          <div className="flex flex-col gap-4">
            {allReplies?.map((reply, idx) => (
              <Suspense
                fallback={<div className="animate-spin text-center">⚽</div>}
                key={reply?.$id}
              >
                <Reply
                  replyRef={replyRef}
                  key={reply?.$id}
                  reply={reply}
                  comment={comment}
                  mimeType={mimeTypes[idx]?.mimeType}
                />
              </Suspense>
            ))}
          </div>
          <div className="flex justify-between p-2">
            {allReplies && totalReplies > 0 && (
              <p>
                {allReplies?.length} out of {totalReplies}
                {" Reply(ies)"}
              </p>
            )}
            <div className="flex gap-2">
              {hasNextPage || visiblePageCount < data?.pages.length ? (
                <button
                  className="flex items-center gap-1"
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
      )}
    </div>
  );
};

export default Replies;
