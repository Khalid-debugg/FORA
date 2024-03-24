import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createUserAccount,
  createLoginSession,
  getCurrentUser,
} from "../appwrite/api";
import { INewUser, IRegisteredUser } from "@/types";

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
export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: ["User"],
    queryFn: () => getCurrentUser(),
  });
};
