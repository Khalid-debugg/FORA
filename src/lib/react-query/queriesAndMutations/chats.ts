import { editChat, getChats } from "@/lib/appwrite/Apis/chats";
import { QueryKeys } from "@/lib/react-query/queryKeys";
import { queryClient } from "@/main";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";

export const useGetChats = (userId: string) => {
  return useInfiniteQuery({
    queryKey: [QueryKeys.Chats + userId],
    queryFn: ({ pageParam = 0 }) => getChats(userId, pageParam),
    getNextPageParam: (lastPage, allPages) =>
      lastPage?.length === 10 ? allPages.length : undefined,
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!userId,
  });
};
export const useEditChat = (chatId: string, userId: string) => {
  return useMutation({
    mutationFn: ({ newChat }) => editChat({ chatId, newChat }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.Chats + userId],
      });
    },
  });
};
