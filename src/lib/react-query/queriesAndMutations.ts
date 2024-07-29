import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import {
  createUserAccount,
  createLoginSession,
  getCurrentUser,
  deleteSession,
  getRecentPosts,
  createGame,
  createPost,
} from "../appwrite/api";
import { INewGame, INewPost, INewUser, IRegisteredUser } from "@/types";
import { QueryKeys } from "./queryKeys";
const queryClient = new QueryClient();
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
    queryKey: [QueryKeys.Users],
    queryFn: () => getCurrentUser(),
  });
};
export const useGetCities = () => {
  return useQuery({
    queryKey: [QueryKeys.Cities],
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

export const useCreateGame = () => {
  return useMutation({
    mutationFn: (post: INewGame) => createGame(post),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.RecentPosts] });
    },
  });
};
export const useCreatePost = () => {
  return useMutation({
    mutationFn: (post: INewPost) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.RecentPosts] });
    },
  });
};
export const useGetRecentPosts = () => {
  return useQuery({
    queryKey: [QueryKeys.RecentPosts],
    queryFn: () => getRecentPosts(),
  });
};
