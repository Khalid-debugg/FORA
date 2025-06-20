import { useState, useMemo, lazy, Suspense } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useDebounce } from "@/context/useDebounce";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchContent } from "@/lib/react-query/queriesAndMutations/explore";
import { Models } from "appwrite";
import { BsGrid3X3 } from "react-icons/bs";
import { BsPostcard } from "react-icons/bs";
import { TbPlayFootball } from "react-icons/tb";
import { IoPeople } from "react-icons/io5";
import { Helmet } from "react-helmet-async";
import { LoadingSpinner } from "@/App";
import { useUserContext } from "@/context/AuthContext";
const AllTab = lazy(() => import("./components/AllTab"));
const PostsTab = lazy(() => import("./components/PostsTab"));
const GamesTab = lazy(() => import("./components/GamesTab"));
const UsersTab = lazy(() => import("./components/UsersTab"));
const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "all" | "posts" | "games" | "users"
  >("all");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const { user } = useUserContext();
  const {
    data: searchResults,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearchContent(debouncedSearchQuery, activeTab, user.id);

  const { allPosts, allGames, allUsers } = useMemo(() => {
    const posts =
      searchResults?.pages.reduce(
        (acc, page) => [...acc, ...page.posts],
        [] as Models.Document[],
      ) || [];

    const games =
      searchResults?.pages.reduce(
        (acc, page) => [...acc, ...page.games],
        [] as Models.Document[],
      ) || [];

    const users =
      searchResults?.pages.reduce(
        (acc, page) => [...acc, ...page.users],
        [] as Models.Document[],
      ) || [];

    return { allPosts: posts, allGames: games, allUsers: users };
  }, [searchResults]);

  const handleTabChange = (tab: "posts" | "games" | "users") => {
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col gap-2 py-2 px-4 md:w-1/3 md:min-w-1/3 w-full mx-auto">
      <Helmet>
        <title>Explore</title>
      </Helmet>
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            type="search"
            placeholder="Search posts, games, or people..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            className="pl-10 w-full"
          />
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as typeof activeTab)}
      >
        <TabsList className="w-full flex bg-transparent border-b border-gray-200 overflow-x-auto overflow-y-hidden">
          <TabsTrigger
            value="all"
            className="flex flex-1 items-center justify-center gap-2 relative p-4 data-[state=active]:text-primary-500"
          >
            <BsGrid3X3 className="text-primary-500" size={20} />
            All
            <span className="absolute bottom-0 left-0 h-1 bg-primary-500 transition-all duration-500 ease-in-out w-0 data-[state=active]:w-full" />
          </TabsTrigger>

          <TabsTrigger
            value="posts"
            className="flex flex-1 items-center justify-center gap-2 relative p-4 data-[state=active]:text-primary-500"
          >
            <BsPostcard className="text-primary-500" size={20} />
            Posts
            <span className="absolute bottom-0 left-0 h-1 bg-primary-500 transition-all duration-500 ease-in-out w-0 data-[state=active]:w-full" />
          </TabsTrigger>

          <TabsTrigger
            value="games"
            className="flex flex-1 items-center justify-center gap-2 relative p-4 data-[state=active]:text-primary-500"
          >
            <TbPlayFootball className="text-primary-500" size={20} />
            Games
            <span className="absolute bottom-0 left-0 h-1 bg-primary-500 transition-all duration-500 ease-in-out w-0 data-[state=active]:w-full" />
          </TabsTrigger>

          <TabsTrigger
            value="users"
            className="flex flex-1 items-center justify-center gap-2 relative p-4 data-[state=active]:text-primary-500"
          >
            <IoPeople className="text-primary-500" size={20} />
            People
            <span className="absolute bottom-0 left-0 h-1 bg-primary-500 transition-all duration-500 ease-in-out w-0 data-[state=active]:w-full" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Suspense fallback={<LoadingSpinner />}>
            <AllTab
              query={debouncedSearchQuery}
              onTabChange={handleTabChange}
              posts={allPosts}
              games={allGames}
              users={allUsers}
              isLoading={isLoading}
            />
          </Suspense>
        </TabsContent>
        <TabsContent value="posts">
          <Suspense fallback={<LoadingSpinner />}>
            <PostsTab
              query={debouncedSearchQuery}
              posts={allPosts}
              isLoading={isLoading}
              fetchNextPage={fetchNextPage}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
            />
          </Suspense>
        </TabsContent>
        <TabsContent value="games">
          <Suspense fallback={<LoadingSpinner />}>
            <GamesTab
              query={debouncedSearchQuery}
              games={allGames}
              isLoading={isLoading}
              fetchNextPage={fetchNextPage}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
            />
          </Suspense>
        </TabsContent>
        <TabsContent value="users">
          <Suspense fallback={<LoadingSpinner />}>
            <UsersTab
              query={debouncedSearchQuery}
              users={allUsers}
              isLoading={isLoading}
              fetchNextPage={fetchNextPage}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
            />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Explore;
