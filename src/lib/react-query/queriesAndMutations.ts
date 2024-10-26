import {
  QueryClient,
  useInfiniteQuery,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import {
  createUserAccount,
  createLoginSession,
  getCurrentUser,
  deleteSession,
  getRecentPosts,
  createGame,
  createPost,
  joinGame,
  getWaitingPlayers,
  leaveGame,
  getJoinedPlayers,
  createComment,
  getComments,
  createReply,
  getReplies,
  likeComment,
  unlikeComment,
  likePost,
  unlikePost,
  getNormalPost,
  getGame,
  editNormalPost,
  deleteNormalPost,
  getJoinedListAndGame,
  editGamePost,
  deleteGame,
} from "../appwrite/api";
import {
  ICreatedPost,
  INewComment,
  INewGame,
  INewPost,
  INewReply,
  INewUser,
  IRegisteredUser,
} from "@/types";
import { QueryKeys } from "./queryKeys";
const queryClient = new QueryClient();
export const useCreateNewAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
  });
};
export const useCreateNewSession = () => {
  return useMutation({
    mutationFn: (user: IRegisteredUser) => createLoginSession(user),
  });
};
export const useDeleteSession = () => {
  return useMutation({
    mutationFn: () => deleteSession(),
  });
};
export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: [QueryKeys.Users],
    queryFn: () => getCurrentUser(),
  });
};
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

export const useCreateGame = () => {
  return useMutation({
    mutationFn: (post: INewGame) => createGame(post),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.RecentPosts] });
    },
  });
};
export const useCreatePost = () => {
  return useMutation({
    mutationFn: (post: INewPost) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.RecentPosts] });
    },
  });
};
export const useGetRecentPosts = () => {
  return useQuery({
    queryKey: [QueryKeys.RecentPosts],
    queryFn: () => getRecentPosts(),
  });
};
export const useGetNormalPost = (postId: string) => {
  return useQuery({
    queryKey: [postId],
    queryFn: () => getNormalPost(postId),
  });
};
export const useDeleteNormalPost = () => {
  return useMutation({
    mutationFn: (id: string) => deleteNormalPost(id),
  });
};
export const useDeleteGamePost = () => {
  return useMutation({
    mutationFn: (id: string) => deleteGame(id),
  });
};
export const useEditNormalPost = () => {
  return useMutation({
    mutationFn: ({
      id,
      caption,
      fileOrFiles,
      mediaUrls,
      mediaIds,
    }: {
      id: string;
      caption: string;
      fileOrFiles: File | File[];
      mediaUrls: string[];
      mediaIds: string[];
    }) => editNormalPost(id, caption, fileOrFiles, mediaUrls, mediaIds),
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
export const useCreateComment = (postId: string) => {
  return useMutation({
    mutationFn: (comment: INewComment) => createComment(comment),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.Comments + postId],
      });
    },
  });
};
export const useGetComments = (postId: string) => {
  return useInfiniteQuery<Comment[]>({
    queryKey: [QueryKeys.Comments + postId],
    queryFn: ({ pageParam = 0 }) => getComments(postId, pageParam),
    getNextPageParam: (lastPage, allPages) =>
      lastPage?.length === 5 ? allPages.length : undefined,
  });
};
export const useCreateReply = (commentId: string) => {
  return useMutation({
    mutationFn: (reply: INewReply) => createReply(reply),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.Replies + commentId],
      });
    },
  });
};
export const useGetReplies = (commentId: string) => {
  return useInfiniteQuery<Comment[]>({
    queryKey: [QueryKeys.Replies + commentId],
    queryFn: ({ pageParam = 0 }) => getReplies(commentId, pageParam),
    getNextPageParam: (lastPage, allPages) =>
      lastPage?.length === 5 ? allPages.length : undefined,
  });
};
export const useLikePost = (post: ICreatedPost, userId: string) => {
  return useMutation({
    mutationFn: () => likePost(post, userId),
  });
};
export const useUnlikePost = (post: ICreatedPost, userId: string) => {
  return useMutation({
    mutationFn: () => unlikePost(post, userId),
  });
};
export const useLikeComment = (comment: INewComment, userId: string) => {
  return useMutation({
    mutationFn: () => likeComment(comment, userId),
  });
};
export const useUnlikeComment = (comment: INewComment, userId: string) => {
  return useMutation({
    mutationFn: () => unlikeComment(comment, userId),
  });
};
export const useJoinGame = (gameId: string) => {
  return useMutation({
    mutationFn: ({
      userId,
      postId,
      playersNumber,
    }: {
      userId: string;
      postId: string;
      playersNumber: number;
    }) => joinGame({ userId, postId, playersNumber }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`${gameId + QueryKeys.WaitingPlayers}`],
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
        queryKey: [`${gameId + QueryKeys.WaitingPlayers}`],
      });
    },
  });
};
export const useGetWaitingPlayers = (gameId: string) => {
  return useQuery({
    queryKey: [`${gameId + QueryKeys.WaitingPlayers}`],
    queryFn: async () => await getWaitingPlayers(gameId),
  });
};
export const useGetJoinedPlayers = (gameId: string) => {
  return useQuery({
    queryKey: [`${gameId + QueryKeys.JoinedPlayers}`],
    queryFn: async () => await getJoinedPlayers(gameId),
  });
};
export const useGetJoinedListAndGame = (gameId: string) => {
  return useQuery({
    queryKey: [
      `${gameId + QueryKeys.JoinedPlayers + QueryKeys.WaitingPlayers}`,
    ],
    queryFn: async () => await getJoinedListAndGame(gameId),
  });
};
