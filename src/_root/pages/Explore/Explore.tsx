import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useDebounce } from "@/context/useDebounce";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AllTab from "./components/AllTab";
import PostsTab from "./components/PostsTab";
import GamesTab from "./components/GamesTab";
import UsersTab from "./components/UsersTab";
import { useSearchContent } from "@/lib/react-query/queriesAndMutations/explore";
import { Models } from "appwrite";
import { BsGrid3X3 } from "react-icons/bs";
import { BsPostcard } from "react-icons/bs";
import { TbPlayFootball } from "react-icons/tb";
import { IoPeople } from "react-icons/io5";

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "all" | "posts" | "games" | "users"
  >("all");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Fetch results based on active tab
  const {
    data: searchResults,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearchContent(debouncedSearchQuery, activeTab);

  // Memoize the combined results to prevent unnecessary recalculations
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
    <div className="flex flex-col gap-2 py-2 px-4 md:w-1/3 w-full mx-auto">
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
            className="flex flex-1 items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary-500"
          >
            <BsGrid3X3 className="text-primary-500" size={20} />
            All
          </TabsTrigger>
          <TabsTrigger
            value="posts"
            className="flex flex-1 items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary-500"
          >
            <BsPostcard className="text-primary-500" size={20} />
            Posts
          </TabsTrigger>
          <TabsTrigger
            value="games"
            className="flex flex-1 items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary-500"
          >
            <TbPlayFootball className="text-primary-500" size={20} />
            Games
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="flex flex-1 items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary-500"
          >
            <IoPeople className="text-primary-500" size={20} />
            People
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <AllTab
            query={debouncedSearchQuery}
            onTabChange={handleTabChange}
            posts={allPosts}
            games={allGames}
            users={allUsers}
            isLoading={isLoading}
          />
        </TabsContent>
        <TabsContent value="posts">
          <PostsTab
            query={debouncedSearchQuery}
            posts={allPosts}
            isLoading={isLoading}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        </TabsContent>
        <TabsContent value="games">
          <GamesTab
            query={debouncedSearchQuery}
            games={allGames}
            isLoading={isLoading}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        </TabsContent>
        <TabsContent value="users">
          <UsersTab
            query={debouncedSearchQuery}
            users={allUsers}
            isLoading={isLoading}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Explore;
