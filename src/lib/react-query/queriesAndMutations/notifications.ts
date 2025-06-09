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
  checkIsFriendRequestReceived,
} from "@/lib/appwrite/Apis/notifications";
import { INotification } from "@/types";

export const useGetNotifications = (userId: string) => {
  return useQuery({
    queryKey: [QueryKeys.Notifications],
    queryFn: () => getNotifications(userId),
    enabled: !!userId,
  });
};
export const useAddFriendRequest = (user: any, friend: any) => {
  return useMutation({
    mutationFn: () => sendFriendRequest(user, friend),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["isFriendRequestSent", user.id, friend.$id],
      });
    },
  });
};
export const useRemoveFriendRequest = (user: any, friend: any) => {
  return useMutation({
    mutationFn: () => removeFriendRequest(user, friend),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["isFriendRequestSent", user.id, friend.$id],
      });
    },
  });
};
export const useCheckIsFriendRequestSent = (
  user: any,
  friend: any,
  options?: any,
) => {
  return useQuery({
    queryKey: ["isFriendRequestSent", user?.id, friend?.$id],
    queryFn: () => checkIsFriendRequestSent(user, friend),
    enabled: !!user && !!friend,
    ...options,
  });
};
export const useCheckIsFriendRequestReceived = (
  user: any,
  friend: any,
  options?: any,
) => {
  return useQuery({
    queryKey: ["isFriendRequestReceived", user?.id, friend?.$id],
    queryFn: () => checkIsFriendRequestReceived(user, friend),
    enabled: !!user && !!friend,
    ...options,
  });
};

export const useDeleteNotification = () => {
  return useMutation({
    mutationFn: ({
      type,
      senderId,
      senderName,
      senderImageUrl,
      receiverId,
      postId,
      gameId,
      message,
    }: {
      type: INotification["type"];
      senderId: string;
      senderName: string;
      senderImageUrl: string;
      receiverId: string;
      postId?: string;
      gameId?: string;
      message: string;
    }) =>
      deleteNotification({
        type,
        senderId,
        senderName,
        senderImageUrl,
        receiverId,
        postId,
        gameId,
        message,
      }),
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
