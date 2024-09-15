import { useNavigate } from "react-router-dom";

const BottomNav = () => {
  const navigate = useNavigate();
  return (
    <nav className="border-t-2 bg-white border-primary-500 flex items-center justify-center w-full md:hidden divide-x fixed bottom-0 z-50">
      <button className="flex-1 p-5">
        <img
          src="/assets/icons/mygames.svg"
          alt="profile picture"
          className="h-10 hover:bg-gray-300  mx-auto"
        />
      </button>
      <button className="flex-1 p-5">
        <img
          src="/assets/icons/chat.svg"
          alt="Messages icon"
          className="h-10 mx-auto"
        />
      </button>
      <button
        className="flex-1 p-5"
        onClick={() => navigate("/create-post/normal")}
      >
        <img
          src="/assets/icons/add-post.svg"
          alt="Add post icon"
          className="mx-auto"
        />
      </button>
      <button className="flex-1 p-5">
        <img
          src="/assets/icons/search.svg"
          alt="Search icon"
          className="h-10 mx-auto"
        />
      </button>
    </nav>
  );
};

export default BottomNav;
