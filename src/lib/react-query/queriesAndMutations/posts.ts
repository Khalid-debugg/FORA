import { queryClient } from "@/main";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../queryKeys";
import {
  createPost,
  deleteNormalPost,
  editNormalPost,
  getLikes,
  getNormalPost,
  getRecentLikedPosts,
  getRecentPosts,
  getRecentPostsAndGames,
  likePost,
  unlikePost,
} from "@/lib/appwrite/Apis/posts";
import { ICreatedPost, INewPost } from "@/types";

export const useCreatePost = () => {
  return useMutation({
    mutationFn: (post: INewPost) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.RecentPostsAndGames],
      });
    },
  });
};
export const useGetRecentPostsAndGames = (friends: any[], userId: string) => {
  return useInfiniteQuery({
    queryKey: [QueryKeys.RecentPostsAndGames],
    queryFn: ({ pageParam = 0 }) =>
      getRecentPostsAndGames(pageParam, friends, userId),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 10 ? allPages.length : undefined,
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!friends && !!userId,
  });
};

export const useGetRecentPosts = (userId: string) => {
  return useInfiniteQuery({
    queryKey: [QueryKeys.RecentPosts],
    queryFn: ({ pageParam = 0 }) => getRecentPosts(pageParam, userId),
    getNextPageParam: (lastPage, allPages) =>
      lastPage?.length === 10 ? allPages.length : undefined,
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
export const useGetRecentLikedPosts = (userId: string) => {
  return useInfiniteQuery({
    queryKey: [QueryKeys.RecentLikedPosts],
    queryFn: ({ pageParam = 0 }) => getRecentLikedPosts(pageParam, userId),
    getNextPageParam: (lastPage, allPages) =>
      lastPage?.length === 10 ? allPages.length : undefined,
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
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
export const useLikePost = (post: ICreatedPost) => {
  return useMutation({
    mutationFn: ({ sender, post }: { sender: any; post: ICreatedPost }) =>
      likePost(sender, post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.Likes + post.$id],
      });
    },
  });
};
export const useUnlikePost = (post: ICreatedPost) => {
  return useMutation({
    mutationFn: ({ sender, post }: { sender: any; post: ICreatedPost }) =>
      unlikePost(sender, post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.Likes + post.$id],
      });
    },
  });
};
export const useGetLikes = (documentId: string) => {
  return useInfiniteQuery({
    queryKey: [QueryKeys.Likes + documentId],
    queryFn: ({ pageParam = 0 }) => getLikes(pageParam, documentId),
    getNextPageParam: (lastPage, allPages) =>
      lastPage?.length === 10 ? allPages.length : undefined,
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
