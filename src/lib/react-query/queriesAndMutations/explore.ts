import { useInfiniteQuery } from "@tanstack/react-query";
import { searchContent } from "@/lib/appwrite/Apis/explore";
import { ISearchResults } from "@/types";

type TabType = "all" | "posts" | "games" | "users";

export function useSearchContent(
  query: string,
  activeTab: TabType = "all",
  userId: string,
) {
  const postsQuery = useInfiniteQuery<ISearchResults>({
    queryKey: ["search-posts", query],
    queryFn: (context) =>
      searchContent(query, context.pageParam as number, "posts", userId),
    getNextPageParam: (lastPage) => {
      return lastPage.posts.length === 10 ? lastPage.posts.length : undefined;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    enabled: !!userId,
  });

  const gamesQuery = useInfiniteQuery<ISearchResults>({
    queryKey: ["search-games", query],
    queryFn: (context) =>
      searchContent(query, context.pageParam as number, "games", userId),
    getNextPageParam: (lastPage) => {
      return lastPage.games.length === 10 ? lastPage.games.length : undefined;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    enabled: !!userId,
  });

  const usersQuery = useInfiniteQuery<ISearchResults>({
    queryKey: ["search-users", query],
    queryFn: (context) =>
      searchContent(query, context.pageParam as number, "users", userId),
    getNextPageParam: (lastPage) => {
      return lastPage.users.length === 10 ? lastPage.users.length : undefined;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    enabled: !!userId,
  });

  const allQuery = useInfiniteQuery<ISearchResults>({
    queryKey: ["search-all", query],
    queryFn: (context) =>
      searchContent(query, context.pageParam as number, "all", userId),
    getNextPageParam: (lastPage) => {
      const hasMore =
        lastPage.posts.length === 10 ||
        lastPage.games.length === 10 ||
        lastPage.users.length === 10;
      return hasMore ? lastPage.posts.length : undefined;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    enabled: !!userId,
  });

  // Return the appropriate query based on the active tab
  switch (activeTab) {
    case "posts":
      return postsQuery;
    case "games":
      return gamesQuery;
    case "users":
      return usersQuery;
    default:
      return allQuery;
  }
}
