import {
  checkIsFriend,
  unFriend,
  addFriend,
  getFriends,
} from "@/lib/appwrite/Apis/friendship";
import { queryClient } from "@/main";
import { useMutation, useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../queryKeys";

export const useCheckIsFriend = (userId: string, friendId: string) => {
  return useQuery({
    queryKey: ["isFriend", userId, friendId],
    queryFn: () => checkIsFriend(userId, friendId),
    enabled: !!userId && !!friendId,
  });
};
export const useUnfriend = (userId: string, friendId: string) => {
  return useMutation({
    mutationFn: (friendShipId: string) => unFriend(friendShipId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["isFriend", userId, friendId],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.UsersYouMayKnow],
      });
    },
  });
};
export const useGetFriends = (userId: string) => {
  return useQuery({
    queryKey: ["friends", userId],
    queryFn: () => getFriends(userId),
    enabled: !!userId,
  });
};
export const useAddFriend = (user: any, friend: any) => {
  return useMutation({
    mutationFn: () => addFriend(user, friend),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.UsersYouMayKnow],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.Notifications],
      });
      queryClient.invalidateQueries({
        queryKey: ["isFriendRequestReceived", user?.id, friend?.$id],
      });
      queryClient.invalidateQueries({
        queryKey: ["isFriend", friend?.$id, user?.id],
      });
    },
  });
};
