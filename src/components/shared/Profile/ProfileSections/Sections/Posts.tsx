import NormalPost from "@/components/shared/NormalPost/NormalPost";
import Spinner from "@/components/ui/loadingSpinner";
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
          <Spinner />
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
          <Spinner />
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
