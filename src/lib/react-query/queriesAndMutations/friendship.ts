import {
  checkIsFriend,
  unFriend,
  addFriend,
} from "@/lib/appwrite/Apis/friendship";
import { queryClient } from "@/main";
import { useMutation, useQuery } from "@tanstack/react-query";

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
      queryClient.setQueryData(["isFriend", userId, friendId], null);
    },
  });
};
export const useAddFriend = (userId: string, friendId: string) => {
  return useMutation({
    mutationFn: () => addFriend(userId, friendId),
  });
};
