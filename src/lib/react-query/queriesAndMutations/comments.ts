import { createComment, getComments } from "@/lib/appwrite/Apis/comments";
import { queryClient } from "@/main";
import { INewComment } from "@/types";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryKeys } from "../queryKeys";
import { likeComment, unlikeComment } from "@/lib/appwrite/Apis/comments";

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
