import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createUserAccount,
  createLoginSession,
  getCurrentUser,
  deleteSession,
  createPost,
} from "../appwrite/api";
import { INewPost, INewUser, IRegisteredUser } from "@/types";

export const useCreateNewAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
  });
};
export const useCreateNewSession = () => {
  return useMutation({
    mutationFn: (user: IRegisteredUser) => createLoginSession(user),
  });
};
export const useDeleteSession = () => {
  return useMutation({
    mutationFn: () => deleteSession(),
  });
};
export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: ["User"],
    queryFn: () => getCurrentUser(),
  });
};
export const useGetCities = () => {
  return useQuery({
    queryKey: ["Cities"],
    queryFn: async () => {
      try {
        const response = await fetch(
          "https://atfawry.fawrystaging.com/ECommerceWeb/api/lookups/govs",
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const jsonData = await response.json();
        return jsonData;
      } catch (error) {
        console.log(error);
      }
    },
  });
};
interface CreatePostVariables {
  post: INewPost;
  postType: string;
}

export const useCreatePost = () => {
  return useMutation({
    mutationFn: ({post, postType}: CreatePostVariables ) => createPost(post, postType),
  });
};
