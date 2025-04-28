import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { IoCheckmarkCircle } from "react-icons/io5";
import { FaCircleXmark } from "react-icons/fa6";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useUserContext } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";
import {
  useRejectPlayer,
  useAcceptPlayer,
} from "@/lib/react-query/queriesAndMutations/games";

const WaitingList = ({ waitingGame, joinedGame, isLoadingWaiting, post }) => {
  const [maxVisiblePlayers, setMaxVisiblePlayers] = useState(0);
  const { mutateAsync: handleReject } = useRejectPlayer(post?.$id);
  const { mutateAsync: handleAccept } = useAcceptPlayer(post?.$id);
  const waitingRoomRef = useRef();
  const { user } = useUserContext();
  const rejectPlayer = async (player) => {
    const res = await handleReject({
      waitingGameId: waitingGame.$id,
      userId: player.$id,
      waitingPlayers: waitingGame.waitingPlayers,
    });
    if (res instanceof Error) {
      toast({
        title: "Error",
        description: `${res.message}`,
      });
    } else {
      toast({
        title: "Success",
        description: `${player.username} has been removed from the waiting list`,
      });
    }
  };
  const acceptPlayer = async (player) => {
    const res = await handleAccept({
      game: post,
      joinedGame: joinedGame,
      waitingGame: waitingGame,
      userId: player.$id,
    });
    if (res instanceof Error) {
      toast({
        title: "Error",
        description: `${res.message}`,
      });
    } else {
      toast({
        title: "Success",
        description: `${player.username} has been added to the game`,
      });
    }
  };
  useEffect(() => {
    if (waitingRoomRef.current && waitingGame?.waitingPlayers) {
      const containerWidth = waitingRoomRef.current.offsetWidth;
      const containerHeight = waitingRoomRef.current.offsetHeight;
      const playerSize = 48;
      const margin = 8;

      const playersPerRow = Math.floor(containerWidth / (playerSize + margin));
      const rows = Math.floor(containerHeight / (playerSize + margin));

      const maxPlayers = playersPerRow * rows;
      setMaxVisiblePlayers(maxPlayers);
    }
  }, [waitingGame]);

  return (
    <div
      className="flex flex-wrap gap-7 h-full justify-center items-center overflow-auto max-h-[25rem]"
      ref={waitingRoomRef}
    >
      {!isLoadingWaiting && (
        <>
          {waitingGame &&
            waitingGame?.waitingPlayers
              ?.slice(0, maxVisiblePlayers)
              .map((player, i) => (
                <HoverCard key={i}>
                  <HoverCardTrigger className="flex relative items-center h-12 w-12 justify-center bg-white rounded-full">
                    <Avatar className="h-12 w-12 hover:cursor-pointer">
                      <AvatarImage src={player.imageUrl} />
                      <AvatarFallback>{player.name[0]}</AvatarFallback>
                    </Avatar>
                    {user?.id === post.creator.$id && (
                      <>
                        <AlertDialog>
                          <AlertDialogTrigger className="absolute top-[-0.7rem] left-[-0.75rem] rounded-full">
                            <FaCircleXmark color="red" size={22} />
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action will remove {player.name} from the
                                waiting list
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => rejectPlayer(player)}
                              >
                                Confirm
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        <AlertDialog>
                          <AlertDialogTrigger className="absolute top-[-0.8rem] right-[-0.75rem] rounded-full">
                            <IoCheckmarkCircle color="green" size={25} />
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action will add {player.username} to your
                                game
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => acceptPlayer(player)}
                              >
                                Confirm
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}
                  </HoverCardTrigger>
                  <HoverCardContent className="border border-primary-500 bg-white absolute top-0 left-0">
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
          {waitingGame &&
            waitingGame?.waitingPlayers?.length > maxVisiblePlayers && (
              <div className="h-12 w-12 flex justify-center items-center text-white bg-primary-500 rounded-full">
                <button onClick={() => /* logic to show the rest */ null}>
                  +{waitingGame?.waitingPlayers?.length - maxVisiblePlayers}
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
