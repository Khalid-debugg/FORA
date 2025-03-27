import { Models } from "appwrite";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserCardProps {
  user: Models.Document;
}

const UserCard = ({ user }: UserCardProps) => {
  const getInitial = (name: string | null | undefined) => {
    if (!name) return "?";
    return name[0].toUpperCase();
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.imageUrl} />
            <AvatarFallback>{getInitial(user.name)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">
              <Link
                to={`/profile/${user.$id}`}
                className="hover:text-primary transition-colors"
              >
                {user.name || "Unknown User"}
              </Link>
            </CardTitle>
            <p className="text-sm text-gray-500">{user.bio || "No bio"}</p>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default UserCard;
