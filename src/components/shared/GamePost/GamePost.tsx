import { useUserContext } from "@/context/AuthContext";
import { IoMdAdd } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";
import { FaClock } from "react-icons/fa";
import { ImExit } from "react-icons/im";
import { GiSoccerKick } from "react-icons/gi";
import {
  useGetWaitingGame,
  useGetJoinedGame,
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
    data: waitingGame,
    refetch: refetchWaiting,
    isPending: isLoadingWaiting,
  } = useGetWaitingGame(post?.$id);
  const { data: joinedGame, isPending: isLoadingJoined } = useGetJoinedGame(
    post?.$id,
  );
  const { mutateAsync: joinGame, isPending: isJoining } = useJoinGame(
    post?.$id,
  );
  const { mutateAsync: leaveGame, isPending: isLeaving } = useLeaveGame(
    post?.$id,
  );

  const [isJoined, setisJoined] = useState(false);
  const [isWaiting, setisWaiting] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (waitingGame) {
      setisJoined(
        joinedGame?.joinedPlayers?.some((player) => player.$id === user?.id),
      );
      setisWaiting(
        waitingGame?.waitingPlayers?.some((player) => player.$id === user?.id),
      );
    }
  }, [waitingGame, joinedGame, user]);

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
            <p className="truncate overflow-hidden whitespace-nowrap text-ellipsis hover:whitespace-normal hover:overflow-visible hover:bg-gray-100 hover:p-2 hover:z-10">
              {post?.location}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <FaClock fill="green" size={20} />
            <p>{post?.date}</p>
          </div>
          <div className="flex items-center gap-2">
            <GiSoccerKick fill="green" size={20} />
            <p>Players needed: </p>
            <p>{post?.playersNumber - joinedGame?.joinedPlayers?.length}</p>
          </div>
        </div>
      </button>
      <div className="flex flex-1">
        <JoinedList
          joinedPlayers={joinedGame?.joinedPlayers}
          isLoadingJoined={isLoadingJoined}
          post={post}
        />

        <div className="w-1/2 flex flex-col max-h-[27rem] ">
          <p className="text-center text-lg font-semibold py-2 border-b-2 border-black">
            Waiting room 🪑&nbsp;
            {waitingGame &&
              waitingGame?.waitingPlayers?.length > 0 &&
              waitingGame?.waitingPlayers?.length + " player(s)"}
          </p>
          <WaitingList
            post={post}
            waitingGame={waitingGame}
            isLoadingWaiting={isLoadingWaiting}
          />
        </div>
      </div>
      {user.id !== post?.creator.$id && !isWaiting && !isJoined && (
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
      {user.id !== post?.creator.$id && isWaiting && (
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
