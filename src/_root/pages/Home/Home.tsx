import GamePost from "@/components/shared/GamePost/GamePost";
import NormalPost from "@/components/shared/NormalPost/NormalPost";
import { Outlet } from "react-router-dom";
import VideoHover from "@/components/ui/video-hover";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CreatePost from "./CreatePost";
import { useState, useEffect, useCallback } from "react";
import { useGetRecentPostsAndGames } from "@/lib/react-query/queriesAndMutations/posts";

const Home = () => {
  const {
    data: posts,
    isPending,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useGetRecentPostsAndGames();

  const [postType, setPostType] = useState("post");
  const [allPosts, setAllPosts] = useState([]);

  useEffect(() => {
    if (posts) {
      setAllPosts(posts.pages.flat());
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
    <>
      <div className="flex flex-col gap-2 p-2 md:w-1/3 w-full mx-auto items-center">
        {!isPending && (
          <div className="flex w-full h-[10rem] justify-center gap-2">
            <Dialog>
              <DialogTrigger onClick={() => setPostType("game")} asChild>
                <button className="relative overflow-hidden w-full rounded-lg shadow-md flex items-center justify-center border-2 border-primary-500 group">
                  <VideoHover src="../../assets/videos/Game.mp4" />
                  <div className="absolute top-0 left-0 z-10 bg-white w-3/4 h-full ml-20 group-hover:ml-96 text-[2.2vw] font-bold text-wrap text-primary-500 transition-all duration-500 ease-in-out">
                    Create Game
                  </div>
                </button>
              </DialogTrigger>
              <DialogTrigger onClick={() => setPostType("post")} asChild>
                <button className="relative overflow-hidden w-full rounded-lg shadow-md flex items-center justify-center border-2 border-primary-500 group">
                  <VideoHover src="../../assets/videos/Post.mp4" />
                  <div className="absolute top-0 left-0 z-10 bg-white w-3/4 h-full ml-20 group-hover:ml-96 text-[2.2vw] font-bold text-wrap text-primary-500 transition-all duration-500 ease-in-out">
                    Create Post
                  </div>
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[1024px]">
                <CreatePost type={postType} setType={setPostType} />
              </DialogContent>
            </Dialog>
          </div>
        )}

        {isPending && (
          <div className="flex w-full h-full items-center justify-center">
            <div className="animate-spin text-[5rem]">⚽</div>
          </div>
        )}

        {allPosts.map((doc, i) =>
          doc.hasOwnProperty("playersNumber") ? (
            <GamePost key={i} post={doc} isOne={false} />
          ) : (
            <NormalPost key={i} post={doc} />
          ),
        )}

        {isFetchingNextPage && (
          <div className="flex w-full items-center justify-center p-4">
            <div className="animate-spin text-[3rem]">⚽</div>
          </div>
        )}

        {!hasNextPage && allPosts.length > 0 && !isFetchingNextPage && (
          <div className="text-center text-gray-500 p-4">No more posts</div>
        )}

        {!isPending && allPosts.length === 0 && !isFetchingNextPage && (
          <div className="py-32">No posts Available ❎</div>
        )}
      </div>
      <Outlet />
    </>
  );
};

export default Home;
