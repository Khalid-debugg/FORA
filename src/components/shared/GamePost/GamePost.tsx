import { useUserContext } from "@/context/AuthContext";
import { IoMdAdd } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";
import { FaClock } from "react-icons/fa";
import { ImExit } from "react-icons/im";
import { GiSoccerKick } from "react-icons/gi";
import {
  useGetJoinedPlayers,
  useGetWaitingPlayers,
  useJoinGame,
  useLeaveGame,
} from "@/lib/react-query/queriesAndMutations";
import { toast } from "../../ui/use-toast";
import { useEffect, useState } from "react";
import WaitingList from "./WaitingList";
import JoinedList from "./JoinedList";
import { useNavigate } from "react-router-dom";

const GamePost = ({ post, isOne }) => {
  const { user } = useUserContext();
  const {
    data: waitingPlayers,
    refetch: refetchWaiting,
    isPending: isLoadingWaiting,
  } = useGetWaitingPlayers(post?.$id);
  const { data: joinedPlayers, isPending: isLoadingJoined } =
    useGetJoinedPlayers(post?.$id);
  const { mutateAsync: joinGame, isPending: isJoining } = useJoinGame(
    post?.$id,
  );
  const { mutateAsync: leaveGame, isPending: isLeaving } = useLeaveGame(
    post?.$id,
  );

  const [isJoined, setisJoined] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (waitingPlayers) {
      setisJoined(waitingPlayers.some((player) => player.$id === user?.id));
    }
  }, [waitingPlayers, user]);
  const handleJoin = async () => {
    try {
      const res = await joinGame({
        userId: user.id,
        postId: post?.$id,
        playersNumber: post?.playersNumber,
      });
      if (res instanceof Error) throw new Error(res.message);
      toast({
        variant: "default",
        title: "Joined the waiting list successfully!",
      });
      await refetchWaiting();
      setisJoined(true);
    } catch (error) {
      toast({
        variant: `${error.message.split(" ")[0] === "Already" ? "warning" : "error"}`,
        title: error.message,
      });
    }
  };
  const handleLeave = async () => {
    try {
      const res = await leaveGame({
        userId: user.id,
        postId: post?.$id,
      });
      if (res instanceof Error) throw new Error(res.message);
      toast({
        variant: "default",
        title: "Left successfully!",
      });
      await refetchWaiting();
      setisJoined(false);
    } catch (error) {
      toast({
        variant: `${error.message.split(" ")[0] === "Already" ? "warning" : "error"}`,
        title: error.message,
      });
    }
  };

  return (
    <div
      className={`flex flex-col border-primary-500 w-full divide-y-2 divide-primary-500 min-h-[30rem] overflow-hidden ${!isOne ? "rounded-3xl border-2 " : "border-b-2"}`}
    >
      <button
        onClick={() => navigate(`/game-post/${post?.$id}`)}
        className="flex p-4 justify-between items-center hover:bg-slate-100"
      >
        <div className="flex gap-3 items-center">
          <img
            src={post?.creator.imageURL}
            className="rounded-full w-14 h-14 border border-black"
            alt="profile pic"
          />
          <p className="text-xl font-medium">{post?.creator.username}</p>
        </div>
        <div className="flex flex-col w-1/2">
          <div className="flex items-center gap-2">
            <FaLocationDot fill="green" size={20} />
            <p>{post?.location}</p>
          </div>
          <div className="flex items-center gap-2">
            <FaClock fill="green" size={20} />
            <p>{post?.date}</p>
          </div>
          <div className="flex items-center gap-2">
            <GiSoccerKick fill="green" size={20} />
            <p>Players needed: </p>
            <p>{post?.playersNumber}</p>
          </div>
        </div>
      </button>
      <div className="flex flex-1">
        <JoinedList
          joinedPlayers={joinedPlayers}
          isLoadingJoined={isLoadingJoined}
          post={post}
        />

        <div className="w-1/2 flex flex-col max-h-[27rem] ">
          <p className="text-center text-lg font-semibold py-2 border-b-2 border-black">
            Waiting room 🪑&nbsp;
            {waitingPlayers &&
              waitingPlayers.length > 0 &&
              waitingPlayers.length + " player(s)"}
          </p>
          <WaitingList
            waitingPlayers={waitingPlayers}
            isLoadingWaiting={isLoadingWaiting}
          />
        </div>
      </div>
      {user.id !== post?.creator.$id && !isJoined && (
        <button
          disabled={isJoining}
          onClick={handleJoin}
          className={`rounded-bl-3xl rounded-br-3xl hover:bg-slate-100 flex gap-1 justify-center items-center px-2 py-4 ${isOne ? "" : ""}`}
        >
          <IoMdAdd size={25} fill="green" />
          <p className="font-semibold">Join</p>
          {isJoining && <div className=" animate-spin">⚽</div>}
        </button>
      )}
      {user.id !== post?.creator.$id && isJoined && (
        <button
          disabled={isLeaving}
          onClick={handleLeave}
          className={` rounded-bl-3xl rounded-br-3xl hover:bg-slate-100 flex gap-1 justify-center items-center px-2 py-4 ${isOne ? "border-b-2 border-primary-500" : ""}`}
        >
          <ImExit size={25} fill="red" />
          <p className="font-semibold">Leave</p>
          {isLeaving && <div className=" animate-spin">⚽</div>}
        </button>
      )}
    </div>
  );
};

export default GamePost;
