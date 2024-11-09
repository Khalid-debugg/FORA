import {
  createLoginSession,
  createUserAccount,
  deleteSession,
  getCurrentUser,
} from "@/lib/appwrite/Apis/users";
import { INewUser, IRegisteredUser } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
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
