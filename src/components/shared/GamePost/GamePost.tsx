import { useUserContext } from "@/context/AuthContext";
import { IoMdAdd } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";
import { FaClock } from "react-icons/fa";
import { ImExit } from "react-icons/im";
import { GiSoccerKick } from "react-icons/gi";
import { toast } from "../../ui/use-toast";
import { useEffect, useState } from "react";
import WaitingList from "./WaitingList";
import JoinedList from "./JoinedList";
import { Link, useNavigate } from "react-router-dom";
import {
  useGetJoinedGame,
  useGetWaitingGame,
  useJoinGame,
  useLeaveGame,
} from "@/lib/react-query/queriesAndMutations/games";

const GamePost = ({ post, isOne }) => {
  const { user } = useUserContext();
  const { data: waitingGame, isPending: isLoadingWaiting } = useGetWaitingGame(
    post?.$id,
  );
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
  const [showOverlay, setShowOverlay] = useState(true);

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
        game: post,
        waitingGame: waitingGame,
        user: user,
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

  const playersNeeded = Math.max(
    0,
    (post?.playersNumber || 0) - (joinedGame?.joinedPlayers?.length || 0),
  );

  return (
    <div
      className={`flex flex-col border-primary-500 w-full divide-y-2 divide-primary-500 min-h-[30rem] overflow-hidden relative ${!isOne ? "rounded-3xl border-2 " : "border-b-2"}`}
    >
      {playersNeeded === 0 &&
        showOverlay &&
        user?.id !== post?.creator?.$id && (
          <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg text-center">
              <h3 className="text-xl font-bold mb-4">Game is Full! 🏃‍♂️</h3>
              <button
                onClick={() => setShowOverlay(false)}
                className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
              >
                Show Anyway
              </button>
            </div>
          </div>
        )}
      <div
        onClick={() => navigate(`/game-post/${post?.$id}`)}
        className="flex p-4 justify-between items-center hover:bg-slate-100 cursor-pointer"
      >
        <div className="flex gap-3 items-center">
          <img
            src={post?.creator?.imageUrl}
            className="rounded-full w-14 h-14 border border-black"
            alt="profile pic"
          />
          <Link
            to={`/profile/${post?.creator?.$id}`}
            className="hover:underline z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xl font-medium">{post?.creator?.name}</p>
          </Link>
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
            <p>{playersNeeded}</p>
          </div>
        </div>
      </div>

      {post?.caption && (
        <div className="p-4">
          <p className="text-gray-700 whitespace-pre-wrap">{post?.caption}</p>
        </div>
      )}

      <div className="flex flex-1">
        <JoinedList
          joinedPlayers={joinedGame?.joinedPlayers}
          isLoadingJoined={isLoadingJoined}
          post={post}
          isOne={isOne}
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
            joinedGame={joinedGame}
            isLoadingWaiting={isLoadingWaiting}
          />
        </div>
      </div>
      {user.id !== post?.creator?.$id && !isWaiting && !isJoined && (
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
      {user.id !== post?.creator?.$id && isWaiting && (
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
