import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { Check, Clock, X } from "lucide-react";
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
import {
  useRejectPlayer,
  useAcceptPlayer,
} from "@/lib/react-query/queriesAndMutations/games";
import { useUserContext } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const WaitingList = ({ waitingGame, joinedGame, isLoadingWaiting, post }) => {
  const { user } = useUserContext();
  const { mutateAsync: handleReject } = useRejectPlayer(post?.$id);
  const { mutateAsync: handleAccept } = useAcceptPlayer(post?.$id);
  const navigate = useNavigate();
  return (
    <div className="w-1/2">
      <div className="p-2 bg-slate-100 text-center font-medium border-b">
        Waiting Room 🪑
        {waitingGame?.waitingPlayers?.length > 0 &&
          `(${waitingGame.waitingPlayers.length})`}
      </div>
      <div className="h-64 overflow-auto p-4">
        {isLoadingWaiting ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin text-[3rem]">⚽</div>
          </div>
        ) : waitingGame?.waitingPlayers?.length > 0 ? (
          <div className="flex flex-wrap gap-4 justify-center">
            {waitingGame.waitingPlayers.map((player, i) => (
              <HoverCard key={i}>
                <HoverCardTrigger className="relative">
                  <Avatar className="h-12 w-12 border-2 border-amber-200 hover:border-amber-400 transition-all">
                    <AvatarImage
                      src={
                        player.imageUrl || "/placeholder.svg?height=48&width=48"
                      }
                      alt={player.name}
                    />
                    <AvatarFallback>{player.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>

                  {user?.id === post?.creator?.$id && (
                    <div className="absolute -top-2 -right-2 flex gap-3">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="icon"
                            className="h-6 w-6 rounded-full p-0 bg-red-500"
                          >
                            <X className="h-3 w-3" color="white" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Reject Player</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove {player.name} from
                              the waiting list?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleReject(player)}
                            >
                              Confirm
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="icon"
                            variant="default"
                            className="h-6 w-6 rounded-full p-0 text-white bg-green-600 hover:bg-green-700"
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-slate-100">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Accept Player</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to add {player.name} to your
                              game?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                handleAccept({
                                  game: post,
                                  joinedGame,
                                  waitingGame,
                                  user: player,
                                })
                              }
                            >
                              Confirm
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </HoverCardTrigger>
                <HoverCardContent className="border border-amber-500">
                  <div className="flex gap-2 items-center">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={
                          player.imageUrl ||
                          "/placeholder.svg?height=40&width=40"
                        }
                        alt={player.name}
                      />
                      <AvatarFallback>{player.name?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <Link
                        to={`/profile/${player.$id}`}
                        className="font-bold hover:underline hover:cursor-pointer"
                      >
                        {player.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {player.bio || ""}
                      </p>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Clock className="h-12 w-12 mb-2 opacity-50" />
            <p>No players waiting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaitingList;
