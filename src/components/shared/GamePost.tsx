import { useUserContext } from "@/context/AuthContext";
import { IoMdAdd } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";
import { FaClock } from "react-icons/fa";
import { ImExit } from "react-icons/im";
import {
  useGetWaitingPlayers,
  useJoinGame,
  useLeaveGame,
} from "@/lib/react-query/queriesAndMutations";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "../ui/use-toast";
import { Link } from "react-router-dom";
import { useState } from "react";

const GamePost = ({ post }) => {
  const { user } = useUserContext();
  const { data: waitingPlayers } = useGetWaitingPlayers(post.$id);
  const { mutateAsync: joinGame, isPending: isJoining } = useJoinGame(post.$id);
  const { mutateAsync: leaveGame, isPending: isLeaving } = useLeaveGame(
    post.$id,
  );
  const isJoined =
    user && waitingPlayers?.some((player) => player.$id === user.id);

  const handleJoin = async () => {
    try {
      const res = await joinGame({
        userId: user.id,
        postId: post.$id,
      });
      if (res instanceof Error) throw new Error(res.message);
      toast({
        variant: "default",
        title: "Joined the waiting list successfully!",
      });
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
        postId: post.$id,
      });
      if (res instanceof Error) throw new Error(res.message);
      toast({
        variant: "default",
        title: "Left successfully!",
      });
    } catch (error) {
      toast({
        variant: `${error.message.split(" ")[0] === "Already" ? "warning" : "error"}`,
        title: error.message,
      });
    }
  };

  return (
    <div className="flex flex-col border-2 border-primary-500 w-full rounded-3xl divide-y-2 divide-primary-500 min-h-[30rem]">
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
            <FaClock fill="green" size={20} />
            <p>{post.date}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-1">
        <div className="relative overflow-hidden w-1/2">
          <img
            className="object-cover h-full scale-y-[1.15] scale-x-[1.25]"
            src="./assets/images/football-pitch.svg"
            alt=""
          />
          {post.playersNumber}
        </div>
        <div className="w-1/2 flex flex-col max-h-[27rem]">
          <p className="text-center text-lg font-semibold py-2 border-b-2 border-black">
            Waiting room 🪑&nbsp;
            {waitingPlayers &&
              waitingPlayers.length > 0 &&
              waitingPlayers.length + " player(s)"}
          </p>
          <div className="flex flex-wrap h-full justify-center items-center overflow-auto max-h-[25rem]">
            {waitingPlayers &&
              waitingPlayers.map((player, i) => (
                <HoverCard key={i}>
                  <HoverCardTrigger className="flex items-center">
                    <Avatar className="h-12 w-12 hover:cursor-pointer">
                      <AvatarImage src={player.imageURL} />
                      <AvatarFallback>{player.username[0]}</AvatarFallback>
                    </Avatar>
                  </HoverCardTrigger>
                  <HoverCardContent className="border border-primary-500 bg-white absolute top-0 left-0">
                    <div className="underline font-bold flex gap-2 items-center">
                      <img
                        src={player.imageURL}
                        alt="profile pic"
                        className="w-10 h-10 rounded-full"
                      />
                      <Link to={`/profile/${player.$id}`}>
                        {player.username}
                      </Link>
                    </div>
                    <p>{player.bio}</p>
                  </HoverCardContent>
                </HoverCard>
              ))}
          </div>
        </div>
      </div>
      {user.id !== post.creator.$id && !isJoined && (
        <button
          disabled={isJoining}
          onClick={handleJoin}
          className=" rounded-bl-3xl rounded-br-3xl hover:bg-slate-100 flex gap-1 justify-center items-center px-2 py-4"
        >
          <IoMdAdd size={25} fill="green" />
          <p className="font-semibold">Join</p>
          {isJoining && <div className=" animate-spin">⚽</div>}
        </button>
      )}
      {user.id !== post.creator.$id && isJoined && (
        <button
          disabled={isLeaving}
          onClick={handleLeave}
          className=" rounded-bl-3xl rounded-br-3xl hover:bg-slate-100 flex gap-1 justify-center items-center px-2 py-4"
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
