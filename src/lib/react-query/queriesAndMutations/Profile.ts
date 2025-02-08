import { useMutation } from "@tanstack/react-query";
import {
  changeCoverImage,
  changeProfilePicture,
} from "@/lib/appwrite/Apis/Profile";

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
