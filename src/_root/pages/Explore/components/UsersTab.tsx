import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { User, MapPin } from "lucide-react";
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

  const formatLocation = (user: any) => {
    const parts = [];
    if (user.city) parts.push(user.city);
    if (user.governorate) parts.push(user.governorate);
    if (user.location && !parts.includes(user.location))
      parts.push(user.location);
    return parts.join(", ");
  };

  return (
    <div className="space-y-6">
      {users.map((user, index) => (
        <Card
          key={user.$id}
          onClick={() => navigate(`/profile/${user.$id}`)}
          className="group relative overflow-hidden border-0 bg-gradient-to-r from-background to-muted/20 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:-translate-y-1"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <CardContent className="relative p-6">
            <div className="flex items-start gap-4">
              <div className="relative group">
                <Avatar className="h-16 w-16 ring-2 ring-background shadow-lg group-hover:ring-primary/20 transition-all duration-300">
                  <AvatarImage src={user.imageUrl} className="object-cover" />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white font-semibold text-lg">
                    {user.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 rounded-full border-2 border-background shadow-sm" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg leading-tight mb-1 group-hover:text-primary transition-colors duration-200">
                      {user.name || "Unknown User"}
                    </h3>
                    <p className="text-muted-foreground font-medium">
                      @{user.username}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {user.favPosition && (
                      <Badge
                        variant="secondary"
                        className="bg-blue-50 text-blue-700 border-blue-200"
                      >
                        {user.favPosition}
                      </Badge>
                    )}
                    {user.tags &&
                      user.tags.length > 0 &&
                      user.tags.slice(0, 2).map((tag, tagIndex) => (
                        <Badge
                          key={tagIndex}
                          variant="secondary"
                          className="bg-primary/10 text-primary border-primary/20"
                        >
                          {tag}
                        </Badge>
                      ))}
                  </div>
                </div>
                {user.bio && (
                  <p className="text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                    {user.bio}
                  </p>
                )}
                <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                  {formatLocation(user) && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{formatLocation(user)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
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
