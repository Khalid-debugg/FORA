import GamePost from "@/components/ui/GamePost";
import NormalPost from "@/components/shared/NormalPost";
import { useGetRecentPosts } from "@/lib/react-query/queriesAndMutations";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const { data: posts, isPending: isPostsPending } = useGetRecentPosts();
  const navigate = useNavigate();
  return (
    <>
      <div className="flex flex-col gap-2 p-2 md:w-1/3 w-full mx-auto justify-center items-center">
        <div className="flex w-full h-[10rem] justify-center gap-2">
          <button
            className="border-2 border-primary-500 w-full rounded-xl flex justify-center items-center hover:bg-gray-100"
            onClick={() => navigate("/create-post/normal")}
          >
            create post
          </button>
          <button
            className="border-2 border-primary-500 w-full rounded-xl flex justify-center items-center hover:bg-gray-100"
            onClick={() => navigate("/create-post/game")}
          >
            create game
          </button>
        </div>
        {isPostsPending && <div className="animate-spin text-[5rem]">⚽</div>}
        {posts &&
          posts.documents.map((doc, i) => {
            return doc.isGame ? (
              <GamePost key={i} post={doc} />
            ) : (
              <NormalPost key={i} post={doc} />
            );
          })}
      </div>
      <Outlet />
    </>
  );
};

export default Home;
