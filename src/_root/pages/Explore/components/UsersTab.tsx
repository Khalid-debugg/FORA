import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "lucide-react";
import UserCard from "@/components/shared/UserCard";
interface UsersTabProps {
  query: string;
  users: any[];
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
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card
            key={i}
            className="group relative overflow-hidden border-0 bg-gradient-to-r from-background to-muted/20 shadow-sm"
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-background">
                    <Skeleton className="h-full w-full rounded-full" />
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-[180px]" />
                    <Skeleton className="h-4 w-[120px]" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[85%]" />
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-6 rounded-full bg-muted/50 p-6">
          <User className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-xl font-semibold">
          {query ? "No people found" : "No people yet"}
        </h3>
        <p className="text-muted-foreground max-w-sm">
          {query
            ? `We couldn't find anyone matching "${query}". Try a different search term.`
            : "Start exploring to discover amazing people in the community."}
        </p>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {users.map((user, index) => (
        <UserCard key={index} user={user} />
      ))}

      <div ref={observerRef} className="h-4">
        {isFetchingNextPage && (
          <div className="flex justify-center py-8">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-muted border-t-primary"></div>
              <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
            </div>
          </div>
        )}
        {!hasNextPage && users.length > 0 && (
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 text-muted-foreground text-sm">
              <div className="w-2 h-2 bg-current rounded-full opacity-50"></div>
              <span>You've reached the end</span>
              <div className="w-2 h-2 bg-current rounded-full opacity-50"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersTab;
