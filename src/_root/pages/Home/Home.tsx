import GamePost from "@/components/shared/GamePost/GamePost";
import NormalPost from "@/components/shared/NormalPost/NormalPost";
import { Outlet, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { useGetRecentPostsAndGames } from "@/lib/react-query/queriesAndMutations/posts";
import { useGetFriends } from "@/lib/react-query/queriesAndMutations/friendship";
import { useUserContext } from "@/context/AuthContext";
import { LoadingSpinner } from "@/App";
import { Helmet } from "react-helmet-async";
import Spinner from "@/components/ui/loadingSpinner";
const CreatePost = lazy(() => import("./CreatePost"));
const VideoHover = lazy(() => import("@/components/ui/video-hover"));
const Home = () => {
  const { user } = useUserContext();
  const { data: friends } = useGetFriends(user?.id);
  const {
    data: posts,
    isPending,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useGetRecentPostsAndGames(friends, user?.id);
  const navigate = useNavigate();
  const [postType, setPostType] = useState("post");
  const [allPosts, setAllPosts] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const handlePostCreated = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <div className="flex flex-col gap-2 p-2 md:w-1/3 w-full mx-auto items-center">
        {!isPending && (
          <div className="flex w-full h-[10rem] justify-center gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger
                onClick={() => {
                  setPostType("game");
                  setIsDialogOpen(true);
                }}
                asChild
              >
                <button className="relative overflow-hidden w-full rounded-lg shadow-md flex items-center justify-center border-2 border-primary-500 group">
                  <Suspense fallback={<LoadingSpinner />}>
                    <VideoHover src="../../assets/videos/Game.mp4" />
                  </Suspense>
                  <div
                    className="absolute top-0 left-0 z-10 h-full w-full flex items-center justify-center font-bold text-xl text-primary-500 transition-transform duration-500 ease-in-out group-hover:-translate-x-full"
                    style={{
                      backgroundImage: `repeating-linear-gradient(
         45deg,
         white,
         white 10px,
         #30cc42 10px,
         #30cc42 20px
       )`,
                    }}
                  >
                    <span className="p-6 rounded-lg bg-white text-[1.75rem] border border-primary-500">
                      Create Game
                    </span>
                  </div>
                </button>
              </DialogTrigger>
              <DialogTrigger
                onClick={() => {
                  setPostType("post");
                  setIsDialogOpen(true);
                }}
                asChild
              >
                <button className="relative overflow-hidden w-full rounded-lg shadow-md flex items-center justify-center border-2 border-primary-500 group">
                  <Suspense fallback={<LoadingSpinner />}>
                    <VideoHover src="../../assets/videos/Post.mp4" />
                  </Suspense>
                  <div
                    className="absolute top-0 left-0 z-10 h-full w-full flex items-center justify-center font-bold text-xl text-primary-500 transition-transform duration-500 ease-in-out group-hover:translate-x-full"
                    style={{
                      backgroundImage: `repeating-linear-gradient(
         135deg,
         #30cc42,
         #30cc42 10px,
         white 10px,
         white 20px
       )`,
                    }}
                  >
                    <span className="p-6 rounded-lg bg-white text-[1.75rem] border border-primary-500">
                      Create Post
                    </span>
                  </div>
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[1024px]">
                <Suspense
                  fallback={
                    <div className="flex justify-center items-center flex-1">
                      <Spinner />
                    </div>
                  }
                >
                  <CreatePost
                    type={postType}
                    setType={setPostType}
                    onPostCreated={handlePostCreated}
                  />
                </Suspense>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {isPending && (
          <div className="flex w-full h-screen items-center justify-center">
            <Spinner />
          </div>
        )}

        {allPosts.map((doc, i) =>
          doc.hasOwnProperty("playersNumber") ? (
            <GamePost key={doc.$id} post={doc} isOne={false} />
          ) : (
            <NormalPost key={doc.$id} post={doc} />
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
          <>
            <h2 className="pt-32 text-xl font-bold">No posts Available ?</h2>
            <h2 className="text-lg"> Explore new friends</h2>
            <button
              onClick={() => navigate("/explore")}
              className="shad-button_primary hover:shad-button_ghost p-2 rounded-lg"
            >
              Explore
            </button>
          </>
        )}
      </div>
      <Outlet />
    </>
  );
};

export default Home;
