import { useMutation } from "@tanstack/react-query";
import {
  addFriend,
  changeCoverImage,
  changeProfilePicture,
  updateProfile,
} from "@/lib/appwrite/Apis/Profile";
import { queryClient } from "@/main";

export const useChangeProfilePicture = () => {
  return useMutation({
    mutationFn: ({ file, userId }: { file: File; userId: string }) =>
      changeProfilePicture(file, userId),
  });
};
export const useChangeCoverImage = () => {
  return useMutation({
    mutationFn: ({ file, userId }: { file: File; userId: string }) =>
      changeCoverImage(file, userId),
  });
};
export const useUpdateProfile = (userId) => {
  return useMutation({
    mutationFn: (formData) => updateProfile(formData, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },
  });
};
export const useAddFriend = () => {
  return useMutation({
    mutationFn: ({ userId, friendId }: { userId: string; friendId: string }) =>
      addFriend(userId, friendId),
  });
};
