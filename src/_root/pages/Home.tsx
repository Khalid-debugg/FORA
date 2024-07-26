import GamePost from "@/components/ui/GamePost";
import NormalPost from "@/components/ui/NormalPost";
import { useGetRecentPosts } from "@/lib/react-query/queriesAndMutations";
import { Outlet } from "react-router-dom";

const Home = () => {
  const { data: posts, isPending: isPostsPending } = useGetRecentPosts();
  console.log(posts);

  return (
    <>
      <div className="flex flex-col gap-2 p-2 md:w-1/3 w-full mx-auto">
        {isPostsPending && <div className=" animate-spin ">⚽</div>}
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
