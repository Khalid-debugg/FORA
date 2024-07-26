import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import IsPostForm from "@/components/forms/PostTypes/IsPostForm";
import IsGameForm from "@/components/forms/PostTypes/IsGameForm";
const CreatePost = () => {
  const navigate = useNavigate();
  const [isGame, setIsGame] = useState(true);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.classList.contains("content-wrapper")) {
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
      <div className="bg-white p-8 rounded-lg w-10/12 max-w-2xl flex flex-col gap-5 max-h-[100vh] overflow-x-auto">
        <div className="flex justify-between">
          <div className="flex justify-between items-center gap-3">
            <Switch onCheckedChange={() => setIsGame((isGame) => !isGame)} />
            <p>{isGame ? "Game" : "Post"}</p>
          </div>
          <button
            className="p-2 rounded-lg hover:bg-gray-100"
            onClick={() => navigate("/")}
          >
            <img
              src="/assets/icons/back.svg"
              alt="back icon"
              className="scale-x-[-1]"
            />
          </button>
        </div>
            {isGame ? (
              <IsGameForm  />
            ) : (
              <IsPostForm post={null} />
            )}

      </div>
    </div>
  );
};

export default CreatePost;
