import { useMutation, useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../queryKeys";
import { queryClient } from "@/main";
import {
  checkIsFriendRequestSent,
  getNotifications,
  removeFriendRequest,
  sendFriendRequest,
} from "@/lib/appwrite/Apis/notifications";

export const useGetNotifications = (userId: string) => {
  return useQuery({
    queryKey: [QueryKeys.Notifications],
    queryFn: () => getNotifications(userId),
  });
};

export const useAddFriendRequest = (
  userId: string,
  userName: string,
  friendId: string,
) => {
  return useMutation({
    mutationFn: () => sendFriendRequest(userId, userName, friendId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["isFriendRequestSent", userId, friendId],
      });
    },
  });
};
export const useRemoveFriendRequest = (userId: string, friendId: string) => {
  return useMutation({
    mutationFn: () => removeFriendRequest(userId, friendId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["isFriendRequestSent", userId, friendId],
      });
    },
  });
};
export const useCheckIsFriendRequestSent = (
  userId: string,
  friendId: string,
) => {
  return useQuery({
    queryKey: ["isFriendRequestSent", userId, friendId],
    queryFn: () => checkIsFriendRequestSent(userId, friendId),
    enabled: !!userId && !!friendId,
  });
};
