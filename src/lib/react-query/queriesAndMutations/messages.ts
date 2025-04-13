import {
  createMessage,
  getMessages,
  hasNewMessages,
} from "@/lib/appwrite/Apis/messages";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../queryKeys";
import { queryClient } from "@/main";

export const useHasNewMessages = (userId: string) => {
  return useQuery({
    queryKey: ["hasNewMessages", userId],
    queryFn: () => hasNewMessages(userId),
    enabled: !!userId,
  });
};
export const useGetMessages = (chatId: string) => {
  return useInfiniteQuery({
    queryKey: [QueryKeys.Messages + chatId],
    queryFn: ({ pageParam = 0 }) => getMessages(chatId, pageParam),
    getNextPageParam: (lastPage, allPages) =>
      lastPage?.length === 20 ? allPages.length : undefined,
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!chatId,
  });
};
export const useCreateMessage = (chatId: string) => {
  return useMutation({
    mutationFn: ({ message, userId }) =>
      createMessage({ chatId, message, userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.Messages + chatId],
      });
    },
  });
};
