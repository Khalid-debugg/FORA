import { useMutation, useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../queryKeys";
import { queryClient } from "@/main";
import {
  checkIsFriendRequestSent,
  getNotifications,
  removeFriendRequest,
  sendFriendRequest,
  deleteNotification,
  hasNewNotifications,
  markAllNotificationsAsRead,
} from "@/lib/appwrite/Apis/notifications";

export const useGetNotifications = (
  userId: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [QueryKeys.Notifications],
    queryFn: () => getNotifications(userId),
    enabled: options?.enabled ?? true,
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

export const useDeleteNotification = (notificationId: string) => {
  return useMutation({
    mutationFn: () => deleteNotification(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.Notifications],
      });
    },
  });
};
export const useHasNewNotifications = (userId: string) => {
  return useQuery({
    queryKey: ["hasNewNotifications", userId],
    queryFn: () => hasNewNotifications(userId),
    enabled: !!userId,
  });
};

export const useMarkAllNotificationsAsRead = () => {
  return useMutation({
    mutationFn: (userId: string) => markAllNotificationsAsRead(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["hasNewNotifications"],
      });
    },
  });
};
