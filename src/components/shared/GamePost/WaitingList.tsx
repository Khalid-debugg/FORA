import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

const WaitingList = ({ waitingPlayers, isLoadingWaiting }) => {
  const [maxVisiblePlayers, setMaxVisiblePlayers] = useState(0);
  const waitingRoomRef = useRef();

  useEffect(() => {
    if (waitingRoomRef.current && waitingPlayers) {
      const containerWidth = waitingRoomRef.current.offsetWidth;
      const containerHeight = waitingRoomRef.current.offsetHeight;
      const playerSize = 48;
      const margin = 8;

      const playersPerRow = Math.floor(containerWidth / (playerSize + margin));
      const rows = Math.floor(containerHeight / (playerSize + margin));

      const maxPlayers = playersPerRow * rows;
      setMaxVisiblePlayers(maxPlayers);
    }
  }, [waitingPlayers]);

  return (
    <div
      className="flex flex-wrap h-full justify-center items-center overflow-auto max-h-[25rem]"
      ref={waitingRoomRef}
    >
      {!isLoadingWaiting && (
        <>
          {waitingPlayers &&
            waitingPlayers.slice(0, maxVisiblePlayers).map((player, i) => (
              <HoverCard key={i}>
                <HoverCardTrigger className="flex items-center h-12 w-12 justify-center bg-white rounded-full">
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
                    <Link to={`/profile/${player.$id}`}>{player.username}</Link>
                  </div>
                  <p>{player.bio}</p>
                </HoverCardContent>
              </HoverCard>
            ))}
          {waitingPlayers && waitingPlayers.length > maxVisiblePlayers && (
            <div className="h-12 w-12 flex justify-center items-center text-white bg-primary-500 rounded-full">
              <button onClick={() => /* logic to show the rest */ null}>
                +{waitingPlayers.length - maxVisiblePlayers}
              </button>
            </div>
          )}
        </>
      )}
      {isLoadingWaiting && (
        <div className="text-center animate-spin text-[5rem] my-auto">⚽</div>
      )}
    </div>
  );
};

export default WaitingList;
