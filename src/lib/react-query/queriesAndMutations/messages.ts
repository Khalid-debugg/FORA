import { getMessages, hasNewMessages } from "@/lib/appwrite/Apis/messages";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../queryKeys";

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
