import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import IsPostForm from "@/components/forms/PostTypes/IsPostForm";
import IsGameForm from "@/components/forms/PostTypes/IsGameForm";

const CreatePost = ({
  type = "post",
  setType,
  onPostCreated,
}: {
  type: string;
  setType: any;
  onPostCreated?: () => void;
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if ((event.target as HTMLElement).classList.contains("content-wrapper")) {
        navigate("/");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navigate]);

  return (
    <div className=" bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center border-none z-20 content-wrapper">
      <div className=" bg-white mt-20 md:mt-0 p-8 rounded-lg w-full max-w-2xl flex flex-col gap-5 max-h-[100vh] overflow-x-auto">
        <div className="flex justify-between">
          <div className="flex justify-between items-center gap-3">
            <Switch
              onCheckedChange={() =>
                type === "game" ? setType("post") : setType("game")
              }
            />
            <p>{type === "game" ? "Game" : "Post"}</p>
          </div>
        </div>
        {type === "game" ? (
          <IsGameForm onPostCreated={onPostCreated} />
        ) : (
          <IsPostForm post={null} onPostCreated={onPostCreated} />
        )}
      </div>
    </div>
  );
};

export default CreatePost;
