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
      queryClient.setQueryData(["isFriend", userId, friendId], null);
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
export const useAddFriend = () => {
  return useMutation({
    mutationFn: ({ user, friendId }: { user: any; friendId: string }) =>
      addFriend(user, friendId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.UsersYouMayKnow],
      });
    },
  });
};
