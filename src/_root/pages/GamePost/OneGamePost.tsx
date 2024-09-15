import GamePost from "@/components/shared/GamePost/GamePost";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetGame } from "@/lib/react-query/queriesAndMutations";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";

const OneGamePost = () => {
  const { id } = useParams();
  const { data: post, isPending } = useGetGame(id || "");
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-2 md:w-1/3 w-full mx-auto items-center">
      <div className="flex items-center justify-start p-4 w-full gap-4 shadow-md">
        <button
          onClick={() => navigate(-1)}
          className="hover:bg-gray-100 p-4 rounded-md"
        >
          <FaArrowLeft size={25} color="green" />
        </button>
        <h1 className="text-xl">Game</h1>
      </div>
      {!isPending && post && <GamePost post={post} isOne />}
      {isPending && (
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      )}{" "}
    </div>
  );
};

export default OneGamePost;
