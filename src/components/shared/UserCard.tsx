import { Models } from "appwrite";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin } from "lucide-react";
import { Badge } from "../ui/badge";

interface UserCardProps {
  user: Models.Document;
}

const UserCard = ({ user }: UserCardProps) => {
  const navigate = useNavigate();
  const formatLocation = (user: any) => {
    const parts = [];
    if (user.city) parts.push(user.city);
    if (user.governorate) parts.push(user.governorate);
    if (user.location && !parts.includes(user.location))
      parts.push(user.location);
    return parts.join(", ");
  };
  return (
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
  );
};

export default UserCard;
