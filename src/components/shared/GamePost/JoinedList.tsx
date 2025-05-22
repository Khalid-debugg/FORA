import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { AiFillQuestionCircle } from "react-icons/ai";
import { useUserContext } from "@/context/AuthContext";

const JoinedList = ({ joinedPlayers, isLoadingJoined, post, isOne }) => {
  const { user } = useUserContext();
  const restPlayers = post?.playersNumber - joinedPlayers?.length;
  const restPlayerPlaceholders = Array.from({ length: restPlayers });

  return (
    <div
      className={`relative gap-4 w-1/2 overflow-hidden ${user.id === post?.creator?.$id && !isOne ? "rounded-bl-[0.5rem]" : ""}`}
    >
      <img
        className={`object-cover h-full w-full scale-y-[1.15] scale-x-[1.25] `}
        src="../../assets/images/football-pitch.svg"
        alt=""
      />
      {!isLoadingJoined && (
        <div className="flex flex-wrap justify-center gap-8 px-3 py-8 items-center overflow-auto absolute top-0 left-0 z-20 w-full h-full">
          {joinedPlayers &&
            joinedPlayers?.map((player, i) => (
              <HoverCard key={i}>
                <HoverCardTrigger className="flex items-center h-12 w-12 justify-center outline outline-slate-300 bg-white rounded-full">
                  <Avatar className="h-12 w-12 hover:cursor-pointer">
                    <AvatarImage src={player.imageUrl} />
                    <AvatarFallback>{player.name[0]}</AvatarFallback>
                  </Avatar>
                </HoverCardTrigger>
                <HoverCardContent className="border border-primary-500 bg-white">
                  <div className="underline font-bold flex gap-2 items-center">
                    <img
                      src={player.imageUrl}
                      alt="profile pic"
                      className="w-10 h-10 rounded-full"
                    />
                    <Link to={`/profile/${player.$id}`}>{player.name}</Link>
                  </div>
                  <p>{player.bio}</p>
                </HoverCardContent>
              </HoverCard>
            ))}

          {restPlayerPlaceholders.map((_, i) => (
            <div
              key={i}
              className="h-12 w-12 flex justify-center items-center outline outline-slate-300 bg-white rounded-full"
            >
              <AiFillQuestionCircle fill="green" size={50} className="" />
            </div>
          ))}
        </div>
      )}
      {isLoadingJoined && (
        <div className="flex items-center justify-center absolute inset-0">
          <div className="animate-spin text-[5rem]">⚽</div>
        </div>
      )}
    </div>
  );
};

export default JoinedList;
