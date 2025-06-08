import NormalPost from "@/components/shared/NormalPost/NormalPost";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetRecentPosts } from "@/lib/react-query/queriesAndMutations/posts";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";

const Posts = () => {
  const { id } = useParams();
  const {
    data: posts,
    isPending,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useGetRecentPosts(id || "");

  const [allPosts, setAllPosts] = useState([]);

  useEffect(() => {
    if (posts) {
      setAllPosts(posts?.pages.flat());
    }
  }, [posts]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="w-full">
      {isPending ? (
        <div className="flex w-full h-full items-center justify-center">
          <div className="flex flex-col space-y-3 w-full">
            <Skeleton className="h-[125px] w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {allPosts.map((post) => (
            <NormalPost key={post?.$id} post={post} isOne={false} />
          ))}
        </div>
      )}
      {isFetchingNextPage && (
        <div className="flex w-full items-center justify-center p-4">
          <div className="animate-spin">⚽</div>
        </div>
      )}
      {!hasNextPage && allPosts.length > 0 && !isFetchingNextPage && (
        <div className="text-center text-gray-500 p-4">No more posts</div>
      )}
      {!isPending && allPosts.length === 0 && !isFetchingNextPage && (
        <div className="text-center text-gray-500 p-4">No posts available</div>
      )}
    </div>
  );
};

export default Posts;
