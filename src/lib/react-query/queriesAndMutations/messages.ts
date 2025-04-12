import { hasNewMessages } from "@/lib/appwrite/Apis/messages";
import { useQuery } from "@tanstack/react-query";

export const useHasNewMessages = (userId: string) => {
  return useQuery({
    queryKey: ["hasNewMessages", userId],
    queryFn: () => hasNewMessages(userId),
    enabled: !!userId,
  });
};
