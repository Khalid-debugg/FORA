import { queryClient } from "@/main";
import { INewComment, INewReply } from "@/types";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { QueryKeys } from "../queryKeys";
import {
  createReply,
  deleteReply,
  editReply,
  getReplies,
} from "@/lib/appwrite/Apis/replies";
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
  return useInfiniteQuery<{ documents: Comment[] }>({
    queryKey: [QueryKeys.Replies + commentId],
    queryFn: ({ pageParam = 0 }) => getReplies(commentId, pageParam),
    getNextPageParam: (lastPage, allPages) =>
      lastPage?.documents.length === 5 ? allPages.length : undefined,
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
export const useEditReply = (commentId) => {
  return useMutation({
    mutationFn: ({
      id,
      content,
      file,
      mediaUrl,
      mediaId,
    }: {
      id: string;
      content: string;
      file: File | null;
      mediaUrl: string;
      mediaId: string;
    }) => editReply(id, content, file, mediaUrl, mediaId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.Replies + commentId],
      });
    },
  });
};
export const useDeleteReply = (commentId) => {
  return useMutation({
    mutationFn: (id: string) => deleteReply(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.Replies + commentId],
      });
    },
  });
};
