import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../queryKeys";
import { INewGame } from "@/types";
import {
  acceptPlayer,
  createGame,
  deleteGame,
  editGamePost,
  getGame,
  getGamesNearby,
  getJoinedGame,
  getRecentGames,
  getWaitingGame,
  inviteFriends,
  joinGame,
  leaveGame,
  rejectPlayer,
} from "@/lib/appwrite/Apis/games";
import { queryClient } from "@/main";

export const useGetCities = () => {
  return useQuery({
    queryKey: [QueryKeys.Cities],
    queryFn: async () => {
      try {
        const response = await fetch(
          "https://atfawry.fawrystaging.com/ECommerceWeb/api/lookups/govs",
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const jsonData = await response.json();
        return jsonData;
      } catch (error) {
        console.log(error);
      }
    },
  });
};
export const useGetRecentGames = (userId: string) => {
  return useInfiniteQuery({
    queryKey: [QueryKeys.RecentGames],
    queryFn: ({ pageParam = 0 }) => getRecentGames(pageParam, userId),
    getNextPageParam: (lastPage, allPages) =>
      lastPage?.length === 10 ? allPages.length : undefined,
  });
};
export const useCreateGame = () => {
  return useMutation({
    mutationFn: (post: INewGame) => createGame(post),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.RecentPosts] });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.RecentPostsAndGames],
      });
    },
  });
};
export const useDeleteGamePost = () => {
  return useMutation({
    mutationFn: (id: string) => deleteGame(id),
  });
};
export const useEditGamePost = () => {
  return useMutation({
    mutationFn: ({
      emptySpots,
      newJoinedPlayers,
      gameId,
      joinedGameID,
      newLocation,
      newDate,
    }: {
      emptySpots: number;
      newJoinedPlayers: string[];
      gameId: string;
      joinedGameID: string;
      newLocation: string;
      newDate: string;
    }) =>
      editGamePost(
        emptySpots,
        newJoinedPlayers,
        gameId,
        joinedGameID,
        newLocation,
        newDate,
      ),
  });
};
export const useGetGame = (postId: string) => {
  return useQuery({
    queryKey: [postId],
    queryFn: () => getGame(postId),
  });
};
export const useJoinGame = (gameId: string) => {
  return useMutation({
    mutationFn: ({
      game,
      waitingGame,
      user,
    }: {
      game: any;
      waitingGame: any;
      user: any;
    }) => joinGame({ game, waitingGame, user }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`${gameId + QueryKeys.WaitingGame}`],
      });
    },
  });
};
export const useLeaveGame = (gameId: string) => {
  return useMutation({
    mutationFn: ({ userId, postId }: { userId: string; postId: string }) =>
      leaveGame({ userId, postId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`${gameId + QueryKeys.WaitingGame}`],
      });
    },
  });
};
export const useGetWaitingGame = (gameId: string) => {
  return useQuery({
    queryKey: [`${gameId + QueryKeys.WaitingGame}`],
    queryFn: async () => await getWaitingGame(gameId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });
};
export const useGetJoinedGame = (gameId: string) => {
  return useQuery({
    queryKey: [`${gameId + QueryKeys.JoinedGame}`],
    queryFn: async () => await getJoinedGame(gameId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });
};
export const useRejectPlayer = (gameId: string) => {
  return useMutation({
    mutationFn: ({ user, waitingGame }: { user: any; waitingGame: any }) =>
      rejectPlayer({ user, waitingGame }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`${gameId + QueryKeys.WaitingGame}`],
      });
      queryClient.invalidateQueries({
        queryKey: [`${gameId + QueryKeys.JoinedGame}`],
      });
    },
  });
};
export const useAcceptPlayer = (gameId: string) => {
  return useMutation({
    mutationFn: ({
      game,
      joinedGame,
      waitingGame,
      user,
    }: {
      game: any;
      joinedGame: any;
      waitingGame: any;
      user: any;
    }) => acceptPlayer({ game, joinedGame, waitingGame, user }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`${gameId + QueryKeys.WaitingGame}`],
      });
      queryClient.invalidateQueries({
        queryKey: [`${gameId + QueryKeys.JoinedGame}`],
      });
    },
  });
};
export const useGetGamesNearby = (user) => {
  return useInfiniteQuery({
    queryKey: [QueryKeys.GamesNearby],
    queryFn: ({ pageParam = 0 }) => getGamesNearby(pageParam, user),
    getNextPageParam: (lastPage, allPages) =>
      lastPage?.length === 5 ? allPages.length : undefined,
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!user.id,
  });
};
export const useInviteFriends = (gameId: string) => {
  return useMutation({
    mutationFn: ({ friends, user }: { friends: any[]; user: any }) =>
      inviteFriends({ gameId, friends, user }),
  });
};
