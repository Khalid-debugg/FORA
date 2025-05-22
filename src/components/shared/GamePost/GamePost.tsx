"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Users, Plus, LogOut } from "lucide-react";
import JoinedList from "./JoinedList";
import WaitingList from "./WaitingList";
import { useToast } from "@/components/ui/use-toast";
import {
  useGetJoinedGame,
  useGetWaitingGame,
  useJoinGame,
  useLeaveGame,
} from "@/lib/react-query/queriesAndMutations/games";
import { useUserContext } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const GamePost = ({ post, isOne }) => {
  const { user } = useUserContext();
  const { toast } = useToast();
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
  const [isJoined, setIsJoined] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    if (waitingGame && joinedGame && user) {
      setIsJoined(
        joinedGame?.joinedPlayers?.some((player) => player.$id === user?.id),
      );
      setIsWaiting(
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
        title: "Success",
        description: "Joined the waiting list successfully!",
      });
      setIsWaiting(true);
    } catch (error) {
      toast({
        variant: `${error.message.split(" ")[0] === "Already" ? "warning" : "destructive"}`,
        title: "Error",
        description: error.message,
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
        title: "Success",
        description: "Left successfully!",
      });
      setIsWaiting(false);
      setIsJoined(false);
    } catch (error) {
      toast({
        variant: `${error.message.split(" ")[0] === "Already" ? "warning" : "destructive"}`,
        title: "Error",
        description: error.message,
      });
    }
  };
  const playersNeeded = Math.max(
    0,
    (post?.playersNumber || 0) - (joinedGame?.joinedPlayers?.length || 0),
  );
  return (
    <Card
      className={`w-full overflow-hidden relative ${isOne ? "border-0 shadow-none rounded-none" : "border-green-500"}`}
    >
      {new Date(post?.date.replace(" | ", "T")) < new Date() && showOverlay && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg text-center">
            <h3 className="text-xl font-bold mb-4">Game Ended 🏃‍♂️</h3>
            <button
              onClick={() => setShowOverlay(false)}
              className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
            >
              Show Anyway
            </button>
          </div>
        </div>
      )}
      <CardHeader className="p-4">
        <div className="flex items-center gap-3 ">
          <Avatar className="h-12 w-12 border-2 border-green-500">
            <AvatarImage
              src={
                post?.creator?.imageUrl || "/placeholder.svg?height=48&width=48"
              }
              alt={post?.creator?.name}
            />
            <AvatarFallback>{post?.creator?.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 ">
            <div className="flex items-center justify-between">
              <div>
                <Link
                  to={`/profile/${post?.creator?.$id}`}
                  className="font-semibold leading-none hover:underline"
                >
                  {post?.creator?.name}
                </Link>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>
                    @
                    {post?.creator?.username ||
                      post?.creator?.name?.toLowerCase().replace(/\s/g, "")}
                  </span>
                </div>
              </div>
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
              >
                {playersNeeded > 0
                  ? `${playersNeeded} spots left`
                  : "Full Game"}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {post?.caption && (
          <div className="px-4 pb-3">
            <p className="text-gray-700 whitespace-pre-wrap">{post?.caption}</p>
          </div>
        )}
        <div
          onClick={() => navigate(`/game-post/${post?.$id}`)}
          className="px-4 pb-3 space-y-2 text-sm border-t pt-3 hover:cursor-pointer hover:bg-slate-50"
        >
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-green-600" />
            <span className="text-gray-700">{post?.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-green-600" />
            <span className="text-gray-700">{post?.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-green-600" />
            <span className="text-gray-700">
              {joinedGame?.joinedPlayers?.length || 0} of{" "}
              {post?.playersNumber || 0} players joined
            </span>
          </div>
        </div>

        <div className="flex border-y">
          <JoinedList
            joinedPlayers={joinedGame?.joinedPlayers}
            isLoadingJoined={isLoadingJoined}
            post={post}
            isOne={isOne}
          />

          <WaitingList
            waitingGame={waitingGame}
            joinedGame={joinedGame}
            isLoadingWaiting={isLoadingWaiting}
            post={post}
          />
        </div>
      </CardContent>

      <CardFooter className="p-0">
        {user?.id !== post?.creator?.$id && !isWaiting && !isJoined ? (
          <Button
            disabled={isJoining}
            onClick={handleJoin}
            className="w-full rounded-none h-12 border-t border-green-200 text-green-600 hover:bg-slate-50 gap-2"
          >
            <Plus className="h-5 w-5" />
            Join Game
            {isJoining && <div className="animate-spin ml-2">⚽</div>}
          </Button>
        ) : user?.id !== post?.creator?.$id && isWaiting && !isJoined ? (
          <Button
            disabled={isLeaving}
            onClick={handleLeave}
            variant="outline"
            className="w-full rounded-none h-12 border-t border-green-200 text-red-600 hover:bg-slate-50 gap-2"
          >
            <LogOut className="h-5 w-5" />
            Leave Game
            {isLeaving && <div className="animate-spin ml-2">⚽</div>}
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
};

export default GamePost;
