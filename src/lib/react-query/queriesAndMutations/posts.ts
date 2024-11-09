import { queryClient } from "@/main";
import { useMutation, useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../queryKeys";
import {
  createPost,
  deleteNormalPost,
  editNormalPost,
  getNormalPost,
  getRecentPosts,
  likePost,
  unlikePost,
} from "@/lib/appwrite/Apis/posts";
import { ICreatedPost, INewPost } from "@/types";

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
