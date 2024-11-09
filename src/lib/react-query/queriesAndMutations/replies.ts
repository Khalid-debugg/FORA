import { queryClient } from "@/main";
import { INewComment, INewReply } from "@/types";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryKeys } from "../queryKeys";
import { createReply, getReplies } from "@/lib/appwrite/Apis/replies";
import { likeReply, unlikeReply } from "@/lib/appwrite/Apis/posts";

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
export const useLikeReply = (reply: INewComment, userId: string) => {
  return useMutation({
    mutationFn: () => likeReply(reply, userId),
  });
};
export const useUnlikeReply = (reply: INewComment, userId: string) => {
  return useMutation({
    mutationFn: () => unlikeReply(reply, userId),
  });
};
