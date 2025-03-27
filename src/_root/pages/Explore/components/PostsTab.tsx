import { useEffect, useRef } from "react";
import { Models } from "appwrite";
import NormalPost from "@/components/shared/NormalPost/NormalPost";

interface PostsTabProps {
  query: string;
  posts: Models.Document[];
  isLoading: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
}

const PostsTab = ({
  query,
  posts,
  isLoading,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: PostsTabProps) => {
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-[200px] bg-gray-200 animate-pulse rounded" />
              <div className="h-4 w-[150px] bg-gray-200 animate-pulse rounded" />
            </div>
            <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
            <div className="h-4 w-[80%] bg-gray-200 animate-pulse rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {query ? "No posts found" : "No posts available"}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <NormalPost key={post.$id} post={post} />
      ))}
      <div ref={observerRef}>
        {hasNextPage && isFetchingNextPage && (
          <div className="animate-spin text-center text-3xl">⚽</div>
        )}
        {!hasNextPage && posts.length > 0 && (
          <div className="text-center text-slate-500 py-4 text-muted-foreground">
            No more posts to show
          </div>
        )}
      </div>
    </div>
  );
};

export default PostsTab;
