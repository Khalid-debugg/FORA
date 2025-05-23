import {
  createLoginSession,
  createLoginSessionWithRecovery,
  createRecovery,
  createUserAccount,
  deleteSession,
  getCurrentUser,
  getUser,
  getUsersYouMayKnow,
  updateRecovery,
} from "@/lib/appwrite/Apis/users";
import { INewUser, IRegisteredUser } from "@/types";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../queryKeys";

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
export const useCreateNewSessionWithRecovery = () => {
  return useMutation({
    mutationFn: ({ userId, secret }: { userId: string; secret: string }) =>
      createLoginSessionWithRecovery(userId, secret),
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
export const useGetUser = (id: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => getUser(id),
  });
};
export const useGetUsersYouMayKnow = (user: any, friends: any[]) => {
  return useInfiniteQuery({
    queryKey: [QueryKeys.UsersYouMayKnow],
    queryFn: ({ pageParam = 0 }) =>
      getUsersYouMayKnow(pageParam, user, friends),
    getNextPageParam: (lastPage, allPages) =>
      lastPage?.length === 5 ? allPages.length : undefined,
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!user.id && !!friends,
  });
};
export const useCreateRecovery = () => {
  return useMutation({
    mutationFn: (email: string) => createRecovery(email),
  });
};
export const useUpdateRecovery = () => {
  return useMutation({
    mutationFn: ({
      userId,
      secret,
      newPassword,
    }: {
      userId: string;
      secret: string;
      newPassword: string;
    }) => updateRecovery(userId, secret, newPassword),
  });
};
