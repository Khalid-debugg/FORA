import { useUserContext } from "@/context/AuthContext";
import { IoMdAdd } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";
import { BsCalendar2DateFill } from "react-icons/bs";

const GamePost = ({ post }) => {
  const { user } = useUserContext();

  return (
    <div className="flex flex-col border-2 border-primary-500  w-full rounded-3xl divide-y-2 divide-primary-500">
      <div className="flex p-4 justify-between items-center">
        <div className="flex gap-3 items-center">
          <img
            src={post.creator.imageURL}
            className="rounded-full w-14 h-14 border border-black"
            alt="profile pic"
          />
          <p className="text-xl font-medium">{post.creator.username}</p>
        </div>
        <div className="w-1/2">
          <div className="flex items-center gap-2">
            <FaLocationDot fill="green" size={20} />
            <p>{post.location}</p>
          </div>
          <div className="flex items-center gap-2">
            <BsCalendar2DateFill fill="green" size={20} />
            <p>{post.date}</p>
          </div>
        </div>
      </div>
      <div className="flex ">
        <div className="w-1/2 overflow-hidden rounded-bl-3xl">
          <img
            className=" object-cover scale-y-[1.15] scale-x-[1.25]"
            src="./assets/images/football-pitch.svg"
            alt=""
          />
        </div>
        <div className="w-1/2 flex flex-col max-h-[27rem]">
          <p className="text-center text-lg font-semibold py-2 border-b-2 border-black">
            Waiting room
          </p>
          <div className="flex flex-wrap justify-center h-full items-center">
            <button className="bg-slate-100 rounded-full hover:bg-slate-300 flex justify-center items-center p-2">
              <IoMdAdd size={30} />
            </button>
          </div>
          <div className="flex flex-col items-center">
            <button className="bg-slate-100 rounded-full hover:bg-slate-300 flex justify-center items-center p-2">
              <IoMdAdd size={30} />
            </button>
            <p>Join</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePost;
