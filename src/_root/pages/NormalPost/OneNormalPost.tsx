import { useGetNormalPost } from "@/lib/react-query/queriesAndMutations";
import { useParams } from "react-router-dom";

const OneNormalPost = () => {
  const { id } = useParams();
  const { data: post } = useGetNormalPost(id || "");
  console.log(post);

  return (
    <div className="flex flex-col gap-2 p-2 md:w-1/3 w-full mx-auto items-center">
      OneNormalPost
    </div>
  );
};

export default OneNormalPost;
