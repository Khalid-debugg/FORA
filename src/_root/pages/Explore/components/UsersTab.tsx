import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Models } from "appwrite";
import { useNavigate } from "react-router-dom";

interface UsersTabProps {
  query: string;
  users: Models.Document[];
  isLoading: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
}

const UsersTab = ({
  query,
  users,
  isLoading,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: UsersTabProps) => {
  const observerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-[80%]" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {query ? "No people found" : "No people available"}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <Card
          key={user.$id}
          onClick={() => navigate(`/profile/${user.$id}`)}
          className="cursor-pointer hover:bg-accent/50 transition-colors"
        >
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar>
              <AvatarImage src={user.imageUrl} />
              <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{user.bio}</p>
          </CardContent>
        </Card>
      ))}
      <div ref={observerRef} className="h-4">
        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
        {!hasNextPage && users.length > 0 && (
          <div className="text-center py-4 text-muted-foreground">
            No more people to show
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersTab;
